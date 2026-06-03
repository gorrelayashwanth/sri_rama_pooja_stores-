import nodemailer from "nodemailer";

// Creates SMTP Transporter if credentials exist in env
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return null;
};

interface EmailPayload {
  email: string;
  orderNumber: string;
  payableAmount: number;
  items: any[];
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  deliveryAddress: string;
  phone: string;
  orderId: string;
  latitude?: number | null;
  longitude?: number | null;
}

export const sendConfirmationEmail = async (payload: EmailPayload) => {
  const {
    email,
    orderNumber,
    payableAmount,
    items,
    shippingFee,
    discountAmount,
    totalAmount,
    deliveryAddress,
    phone,
    orderId,
    latitude,
    longitude
  } = payload;

  const trackingLink = `https://sri-rama-pooja-stores.vercel.app/order-tracking/${orderId}`;
  
  // Directions link based on captured GPS coords
  const mapsLink = latitude && longitude 
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deliveryAddress)}`;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product?.name || "Sacred Item"} ${item.selectedTier ? `(${item.selectedTier})` : ""}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join("");

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #2d4a2d; padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: normal;">Sri Rama Pooja Store</h1>
        <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #86efac;">Order Confirmed</p>
      </div>
      <div style="padding: 30px; color: #333333;">
        <h2 style="font-size: 20px; margin-top: 0;">Thank You for Your Order!</h2>
        <p>Your order has been received and is being prepared with divine care. Below is your order summary:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f7f9f7;">
              <th style="padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666;">Item</th>
              <th style="padding: 10px; text-align: center; font-size: 12px; text-transform: uppercase; color: #666;">Qty</th>
              <th style="padding: 10px; text-align: right; font-size: 12px; text-transform: uppercase; color: #666;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-left: auto; width: 250px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; color: #666;">
            <span>Subtotal:</span>
            <span>₹${totalAmount}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; color: #666;">
            <span>Shipping:</span>
            <span>₹${shippingFee}</span>
          </div>
          ${discountAmount > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; color: #e11d48; font-weight: bold;">
            <span>Discount:</span>
            <span>-₹${discountAmount}</span>
          </div>
          ` : ""}
          <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 18px; font-weight: bold; border-t: 2px solid #2d4a2d; color: #2d4a2d; margin-top: 10px;">
            <span>Total Paid:</span>
            <span>₹${payableAmount}</span>
          </div>
        </div>

        <div style="background-color: #fcf9f5; border-radius: 12px; padding: 20px; border: 1px solid #f3ebe1; margin-bottom: 30px;">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #9a3412;">Delivery Details</h3>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Address:</strong> ${deliveryAddress}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Tracking ID:</strong> <span style="font-family: monospace; background-color: #e0e0e0; padding: 2px 6px; border-radius: 4px;">${orderId}</span></p>
        </div>

        <div style="text-align: center;">
          <a href="${trackingLink}" style="display: inline-block; background-color: #2d4a2d; color: white; padding: 15px 30px; border-radius: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(45,74,45,0.2);">Track Your Order</a>
          <br/><br/>
          <a href="${mapsLink}" style="color: #9a3412; font-size: 12px; font-weight: bold; text-decoration: none;">View Delivery Directions Map &rarr;</a>
        </div>
      </div>
      <div style="background-color: #f7f9f7; padding: 20px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee;">
        &copy; ${new Date().getFullYear()} Sri Rama Pooja Store. All Rights Reserved.
      </div>
    </div>
  `;

  const transporter = getTransporter();
  if (transporter) {
    try {
      const fromEmail = process.env.EMAIL_FROM || '"Sri Rama Pooja Store" <noreply@sriramapooja.com>';
      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: `🕉️ Order Confirmed: ${orderNumber} - Sri Rama Pooja Store`,
        html: emailHtml
      });
      console.log(`✉️ Confirmation email sent successfully to: ${email}`);
    } catch (err) {
      console.error("❌ Failed to send confirmation email via SMTP:", err);
    }
  } else {
    // Falls back to logging mock email structure to console
    console.log(`
=========================================
📧 MOCK EMAIL NOTIFICATION (SMTP NOT SET)
To: ${email}
Subject: 🕉️ Order Confirmed: ${orderNumber}
-----------------------------------------
Order ID: ${orderId}
Payable Total: ₹${payableAmount}
Delivery Address: ${deliveryAddress}
Tracking URL: ${trackingLink}
Google Maps: ${mapsLink}
=========================================
    `);
  }
};
