import { DuplicateCheck, ValidationResult, Invoice, Product, ScanResult } from '../types';

const API_BASE_URL = 'http://localhost:3000'; // Update with your backend URL

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async checkDuplicates(imageBase64: string): Promise<DuplicateCheck> {
    // Placeholder - will be implemented when backend is ready
    return {
      isDuplicate: false,
      similarInvoices: [],
      confidence: 0,
    };
  }

  async validateInvoice(data: {
    vendor: string;
    date: string;
    total: number;
  }): Promise<ValidationResult> {
    // Placeholder - will be implemented when backend is ready
    return { isValid: true };
  }

  async saveInvoice(data: {
    vendor: string;
    date: string;
    total: number;
    imageBase64: string;
    duplicateOfId?: string;
  }): Promise<Invoice> {
    // Placeholder - will be implemented when backend is ready
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      vendor: data.vendor,
      date: data.date,
      total: data.total,
      imageUrl: 'placeholder.jpg',
      duplicateOfId: data.duplicateOfId,
      createdAt: new Date().toISOString(),
    };
    return newInvoice;
  }

  async getInventory(search?: string): Promise<Product[]> {
    // Placeholder - will be implemented when backend is ready
    return [];
  }

  async getRecentInvoices(): Promise<Invoice[]> {
    // Placeholder - will be implemented when backend is ready
    return [];
  }
}

export const apiService = new ApiService();

