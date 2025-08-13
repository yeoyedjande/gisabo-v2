export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  categoryId: number;
  imageUrl?: string;
  inStock: boolean;
}

export interface Transfer {
  id: number;
  userId: number;
  amount: string;
  currency: string;
  recipientName: string;
  recipientPhone: string;
  destinationCountry: string;
  destinationCurrency: string;
  exchangeRate: string;
  fees: string;
  receivedAmount: string;
  deliveryMethod: string;
  status: string;
  createdAt: string;
}

export interface Order {
  id: number;
  userId: number;
  total: string;
  currency: string;
  status: string;
  shippingAddress: any;
  squarePaymentId?: string;
  createdAt: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  product?: Product;
}

export interface ExchangeRate {
  rate: number;
  from: string;
  to: string;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
