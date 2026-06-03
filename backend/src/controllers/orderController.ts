import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const generateOrderNumber = () =>
  `SRP-${Date.now().toString(36).toUpperCase().slice(-8)}`;

/** Parse checkout address string: "line1, city - pincode" */
function parseCheckoutAddress(addressStr: string) {
  const parts = addressStr.split(',').map((s) => s.trim());
  const line1 = parts[0] || addressStr;
  let city = 'Vijayawada';
  let pincode = '520001';
  if (parts.length >= 2) {
    const last = parts[parts.length - 1];
    const match = last.match(/^(.+?)\s*-\s*(\d{6})$/);
    if (match) {
      city = match[1].trim();
      pincode = match[2];
    } else {
      city = last;
    }
  }
  return { line1, city, pincode };
}

/** Haversine formula to compute distance in km between two sets of coordinates */
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Please log in to place an order' });
    }

    const { items, address, phone, paymentMethod = 'COD', couponCode, latitude, longitude } = req.body;

    if (!items?.length) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }
    if (!address?.trim()) {
      return res.status(400).json({ success: false, message: 'Delivery address is required' });
    }
    if (!phone?.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { line1, city, pincode } = parseCheckoutAddress(String(address));

    // Fetch delivery settings for bounds check and rates
    let settings = await prisma.setting.findUnique({
      where: { id: 'singleton' }
    });
    if (!settings) {
      settings = await prisma.setting.create({
        data: { id: 'singleton' }
      });
    }

    const storeLat = settings.storeLatitude ?? 16.5186;
    const storeLng = settings.storeLongitude ?? 80.6200;
    const deliveryRadiusKm = settings.deliveryRadiusKm ?? 15;
    const deliveryRatePerKm = settings.deliveryRatePerKm ?? 10;

    // Geofencing Check
    let calculatedDistance = 0;
    let locationRestricted = false;

    if (latitude != null && longitude != null) {
      const latVal = Number(latitude);
      const lngVal = Number(longitude);
      if (!isNaN(latVal) && !isNaN(lngVal)) {
        calculatedDistance = getDistanceKm(storeLat, storeLng, latVal, lngVal);
        if (calculatedDistance > deliveryRadiusKm) {
          locationRestricted = true;
        }
      }
    } else {
      // Fallback check on text address city and pincode
      const cityLower = city.toLowerCase();
      const isVijayawada = cityLower.includes("vijayawada") || cityLower.includes("wada");
      const isVijayawadaPincode = pincode.startsWith("520") || pincode.startsWith("521");
      if (!isVijayawada && !isVijayawadaPincode) {
        locationRestricted = true;
      }
    }

    if (locationRestricted) {
      return res.status(400).json({
        success: false,
        message: "Delivery is currently available only in and around Vijayawada."
      });
    }

    const deliveryAddress = await prisma.address.create({
      data: {
        userId,
        fullName: user.name,
        phone: String(phone),
        line1,
        city,
        state: 'Andhra Pradesh',
        pincode,
      },
    });

    let subtotal = 0;
    const orderItemsData: { productId: string; quantity: number; price: number; total: number; selectedTier: string | null }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found` });
      }
      if (!product.isAvailable) {
        return res.status(400).json({ success: false, message: `${product.name} is currently unavailable` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units of ${product.name} available`,
        });
      }

      const unitPrice =
        item.price != null && item.price > 0
          ? Number(item.price)
          : product.salePrice && product.salePrice > 0
            ? product.salePrice
            : product.price;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: unitPrice,
        total: lineTotal,
        selectedTier: item.selectedTier || null
      });
    }

    // Auto Delivery Fare Calculation
    let shippingFee = 0;
    if (latitude != null && longitude != null && calculatedDistance > 0) {
      shippingFee = Math.round(calculatedDistance * deliveryRatePerKm);
      if (subtotal > 1000) {
        shippingFee = 0;
      } else {
        shippingFee = Math.max(30, shippingFee);
      }
    } else {
      shippingFee = subtotal > 1000 ? 0 : 99;
    }

    let discountAmount = 0;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: String(couponCode).toUpperCase() },
      });
      if (coupon && coupon.isActive && new Date() >= coupon.startDate && new Date() <= coupon.endDate) {
        if (subtotal >= coupon.minOrderValue) {
          if (coupon.type === 'PERCENTAGE') {
            discountAmount = (subtotal * coupon.value) / 100;
            if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          } else {
            discountAmount = coupon.value;
          }
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    const payableAmount = Math.max(0, subtotal + shippingFee - discountAmount);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId: deliveryAddress.id,
          totalAmount: subtotal,
          discountAmount,
          shippingFee,
          payableAmount,
          paymentMethod: paymentMethod === 'COD' ? 'COD' : 'COD',
          paymentStatus: 'PENDING',
          status: 'PLACED',
          latitude: latitude != null ? Number(latitude) : null,
          longitude: longitude != null ? Number(longitude) : null,
          items: {
            create: orderItemsData.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
              selectedTier: item.selectedTier
            }))
          },
        },
        include: {
          items: { include: { product: { select: { name: true } } } },
          address: true,
        },
      });

      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    // Emit live Socket.io order alert
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order', order);
    }

    // Trigger SMS and Email confirmations in background
    const trackingUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order.id}/track`;
    const smsMessage = `Sri Rama Pooja Store: Order #${order.orderNumber} placed! Total: ₹${order.payableAmount}. Tracking ID: ${order.orderNumber}. Est. Delivery: 45-60 min. Track: ${trackingUrl}`;

    import('../services/notificationService').then((module) => {
      module.sendSMS(String(phone), smsMessage);

      const orderItemsHtml = order.items.map((item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name} ${item.selectedTier ? `(${item.selectedTier})` : ''}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
        </tr>
      `).join('');

      const emailSubject = `Order Confirmation - Sri Rama Pooja Store (#${order.orderNumber})`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px; color: #333;">
          <h2 style="color: #2d4a2d; text-align: center;">Sri Rama Pooja Store</h2>
          <p style="text-align: center; color: #666; font-style: italic;">Pure Devotion, Delivered to Your Door</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p>Dear ${user.name},</p>
          <p>Thank you for your order! Your order has been placed successfully. Here is your order summary:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #fcfaf7;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-top: 20px;">
            <p>Subtotal: <strong>₹${order.totalAmount}</strong></p>
            <p>Discount: <strong>-₹${order.discountAmount}</strong></p>
            <p>Delivery Charge: <strong>₹${order.shippingFee}</strong></p>
            <h3 style="color: #2d4a2d; font-size: 20px; margin: 10px 0;">Total Payable: ₹${order.payableAmount}</h3>
          </div>
          
          <div style="background-color: #f4f7f4; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2ede2;">
            <p style="margin: 0; font-weight: bold; color: #2d4a2d;">Delivery Address:</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              ${order.address.fullName}<br>
              ${order.address.line1}, ${order.address.city} - ${order.address.pincode}<br>
              Phone: ${order.address.phone}
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${trackingUrl}" style="background-color: #2d4a2d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Track Your Order</a>
          </div>

          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
             <p>Sri Rama Pooja Store, Door No. 23, 11-116, Nageswara Rao Pantulu Rd, Satyaranayana Puram, Vijayawada, AP 520011</p>
             <p>Support: 092992 07650 | Email: sriramapoojastore@gmail.com</p>
          </div>
        </div>
      `;
      module.sendEmail(user.email, emailSubject, emailHtml);
    }).catch(err => console.error("Failed to run notification tasks:", err));

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: { select: { name: true, slug: true, images: true } } } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== 'All Orders') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: String(search), mode: 'insensitive' } },
        { awbNumber: { contains: String(search), mode: 'insensitive' } },
        { user: { name: { contains: String(search), mode: 'insensitive' } } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, phone: true, email: true } },
          address: true,
          items: {
            include: {
              product: { select: { name: true } }
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Order id is required' });
    }
    const { status, awbNumber } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { 
        status,
        awbNumber: awbNumber || undefined
      },
      include: {
        user: { select: { name: true } }
      }
    });

    // Notify connected clients of order status update
    const io = req.app.get('io');
    if (io) {
      io.emit('order_status_updated', { id: order.id, status: order.status });
    }

    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Order id is required' });
    }
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, phone: true, email: true } },
        address: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getRecentPlacedOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { since } = req.query;
    const where: any = { status: 'PLACED' };
    if (since) {
      const parsedSince = new Date(String(since));
      if (!isNaN(parsedSince.getTime())) {
        where.createdAt = { gt: parsedSince };
      }
    }
    const orders = await prisma.order.findMany({
      where,
      select: { id: true, orderNumber: true, createdAt: true, totalAmount: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};
