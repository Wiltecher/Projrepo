import { Product, Invoice } from '../types';

// Demo data for testing the app without backend
export const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Office Chair',
    sku: 'CHAIR-001',
    qty: 15,
    lowStockThreshold: 5,
  },
  {
    id: '2',
    name: 'Desk Lamp',
    sku: 'LAMP-002',
    qty: 3,
    lowStockThreshold: 10,
  },
  {
    id: '3',
    name: 'Notebook Set',
    sku: 'NOTE-003',
    qty: 25,
    lowStockThreshold: 15,
  },
  {
    id: '4',
    name: 'Pen Set',
    sku: 'PEN-004',
    qty: 8,
    lowStockThreshold: 20,
  },
  {
    id: '5',
    name: 'Monitor Stand',
    sku: 'STAND-005',
    qty: 12,
    lowStockThreshold: 8,
  },
];

export const demoInvoices: Invoice[] = [
  {
    id: '1',
    vendor: 'Office Supplies Co.',
    date: '2024-01-15',
    total: 125.50,
    imageUrl: 'demo-image-1.jpg',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    vendor: 'Tech Solutions Inc.',
    date: '2024-01-14',
    total: 89.99,
    imageUrl: 'demo-image-2.jpg',
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    vendor: 'Office Supplies Co.',
    date: '2024-01-13',
    total: 45.75,
    imageUrl: 'demo-image-3.jpg',
    duplicateOfId: '1',
    createdAt: '2024-01-13T09:15:00Z',
  },
];

export const getDemoProducts = (search?: string): Product[] => {
  if (!search) return demoProducts;
  
  return demoProducts.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  );
};

export const getDemoInvoices = (): Invoice[] => {
  return demoInvoices.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

