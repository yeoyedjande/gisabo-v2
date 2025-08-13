import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://f3463d8a-3952-431c-97a1-a4d3cfd05c57-00-3sgbjbr0bblqq.riker.replit.dev';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('authToken');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  }

  // Auth endpoints
  async login(username: string, password: string) {
    const response = await this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  }

  async getUser() {
    const response = await this.makeRequest('/api/auth/me');
    return response.json();
  }

  // Transfer endpoints
  async getTransfers() {
    const response = await this.makeRequest('/api/transfers');
    return response.json();
  }

  async createTransfer(transferData: any) {
    const response = await this.makeRequest('/api/transfers', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
    return response.json();
  }

  async getTransfer(id: number) {
    const response = await this.makeRequest(`/api/transfers/${id}`);
    return response.json();
  }

  // Orders endpoints
  async getOrders() {
    const response = await this.makeRequest('/api/orders');
    return response.json();
  }

  async createOrder(orderData: any) {
    const response = await this.makeRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.json();
  }

  // Products endpoints
  async getProducts() {
    const response = await this.makeRequest('/api/products');
    return response.json();
  }

  async getProductsByCategory(categoryId: number) {
    const response = await this.makeRequest(`/api/products?category=${categoryId}`);
    return response.json();
  }

  // Categories endpoints
  async getCategories() {
    const response = await this.makeRequest('/api/categories');
    return response.json();
  }

  // Services endpoints
  async getServices() {
    const response = await this.makeRequest('/api/services');
    return response.json();
  }

  // Exchange rates endpoints
  async getExchangeRates() {
    const response = await this.makeRequest('/api/exchange-rates?from=CAD&to=XOF');
    return response.json();
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string) {
    const response = await this.makeRequest(`/api/exchange-rates?from=${fromCurrency}&to=${toCurrency}`);
    return response.json();
  }

  // Payment endpoints
  async createPayment(paymentData: any) {
    const response = await this.makeRequest('/api/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;