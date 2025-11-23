// Module 7: Inventory Management - Type Definitions
// Abdullah Dental Care Management System

export type StockStatus = 'in_stock' | 'low' | 'critical' | 'out_of_stock';
export type ItemCategory = 
  | 'Consumables'
  | 'Instruments'
  | 'Materials'
  | 'Medications'
  | 'Disposables'
  | 'Equipment'
  | 'Office Supplies';

export type PurchaseStatus = 'pending' | 'ordered' | 'received' | 'cancelled';
export type Unit = 'pieces' | 'boxes' | 'bottles' | 'tubes' | 'grams' | 'ml' | 'sets' | 'packs';

export interface InventoryItem {
  id: string;
  code: string; // INV-001, INV-002
  name: string;
  category: ItemCategory;
  unit: Unit;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  costPerUnit: number;
  sellingPrice?: number;
  supplier: string;
  expiryDate?: string; // ISO date
  lastRestocked: string; // ISO date
  location?: string; // Cabinet A, Drawer 3
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out' | 'adjustment' | 'expired' | 'damaged';
  quantity: number;
  remainingStock: number;
  cost?: number;
  reason?: string;
  reference?: string; // Invoice number, PO number
  performedBy: string;
  date: string; // ISO date
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // PO-2024-001
  supplier: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  orderDate: string; // ISO date
  expectedDelivery?: string; // ISO date
  receivedDate?: string; // ISO date
  status: PurchaseStatus;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  categories: ItemCategory[];
  rating: number; // 1-5
  totalOrders: number;
  paymentTerms?: string;
  notes?: string;
  isActive: boolean;
}

export interface StockAlert {
  id: string;
  itemId: string;
  itemName: string;
  alertType: 'low_stock' | 'critical_stock' | 'out_of_stock' | 'expiring_soon' | 'expired';
  currentStock: number;
  requiredAction: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolved: boolean;
}

export interface UsagePattern {
  itemId: string;
  itemName: string;
  avgDailyUsage: number;
  avgWeeklyUsage: number;
  avgMonthlyUsage: number;
  daysUntilEmpty: number;
  suggestedReorderDate: string;
  lastCalculated: string;
}
