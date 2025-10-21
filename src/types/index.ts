export interface Product {
  id: string;
  name: string;
  sku: string;
  qty: number;
  lowStockThreshold?: number;
}

export interface Invoice {
  id: string;
  vendor: string;
  date: string;
  total: number;
  imageUrl: string;
  duplicateOfId?: string;
  createdAt: string;
}

export interface InvoiceLine {
  id: string;
  invoiceId: string;
  productId: string;
  qty: number;
  price: number;
  product?: Product;
}

export interface DuplicateCheck {
  isDuplicate: boolean;
  similarInvoices: Invoice[];
  confidence: number;
}

export interface ValidationResult {
  isValid: boolean;
  question?: string;
}

export interface ScanResult {
  imageBase64: string;
  duplicateCheck: DuplicateCheck;
  extractedData?: {
    vendor: string;
    date: string;
    total: number;
  };
}

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Review: { scanResult: ScanResult };
  Inventory: undefined;
};

