// Types partagés pour l'application mobile GISABO

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export interface Transfer {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  recipientName: string;
  recipientPhone: string;
  destinationCountry: string;
  destinationCurrency: string;
  exchangeRate: number;
  fees: number;
  receivedAmount: number;
  deliveryMethod: string;
  status: string;
  squarePaymentId?: string;
  createdAt: string;
  bankName?: string;
  accountNumber?: string;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  currency: string;
  status: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    note?: string;
  };
  squarePaymentId?: string;
  createdAt: string;
}

export interface Product {
  id: number;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  price: number;
  currency: string;
  categoryId: number;
  imageUrl?: string;
  inStock: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export interface ExchangeRate {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: number;
  nameFr: string;
  nameEn: string;
  shortDescriptionFr: string;
  shortDescriptionEn: string;
  fullDescriptionFr: string;
  fullDescriptionEn: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface Country {
  code: string;
  name: string;
  currency: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  type: 'transfer' | 'order';
  referenceId: number;
}