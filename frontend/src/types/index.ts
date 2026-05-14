export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
}

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: {
    products: number;
  };
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  discount?: number;
  sku: string;
  stock: number;
  isAvailable: boolean;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}