// Module 7: Inventory Management - Database Utilities
// Abdullah Dental Care Management System

import Dexie, { Table } from 'dexie';
import type {
  InventoryItem,
  StockTransaction,
  PurchaseOrder,
  Supplier,
  StockAlert,
  StockStatus
} from '../types/inventory';

export class InventoryDatabase extends Dexie {
  items!: Table<InventoryItem>;
  transactions!: Table<StockTransaction>;
  orders!: Table<PurchaseOrder>;
  suppliers!: Table<Supplier>;
  alerts!: Table<StockAlert>;

  constructor() {
    super('AbdullahDentalInventory');
    
    this.version(1).stores({
      items: 'id, code, name, category, currentStock, minStock, expiryDate, supplier',
      transactions: 'id, itemId, type, date, performedBy',
      orders: 'id, poNumber, supplier, orderDate, status',
      suppliers: 'id, name, isActive',
      alerts: 'id, itemId, alertType, priority, resolved, createdAt'
    });
  }
}

export const inventoryDb = new InventoryDatabase();

// Initialize with default data
export const initializeInventoryData = async () => {
  const itemCount = await inventoryDb.items.count();
  
  if (itemCount === 0) {
    await inventoryDb.suppliers.bulkAdd([
      {
        id: 'SUP-001',
        name: 'Peshawar Dental Supplies',
        contactPerson: 'Hamza Khan',
        phone: '091-5271234',
        email: 'sales@peshawarden tal.pk',
        address: 'Saddar Road, Peshawar',
        categories: ['Consumables', 'Materials', 'Disposables'],
        rating: 4.5,
        totalOrders: 0,
        paymentTerms: '30 days credit',
        isActive: true
      },
      {
        id: 'SUP-002',
        name: 'Medical Traders Pakistan',
        contactPerson: 'Salman Ahmad',
        phone: '092-5123456',
        email: 'info@medtraders.pk',
        address: 'University Road, Peshawar',
        categories: ['Medications', 'Instruments', 'Equipment'],
        rating: 4.0,
        totalOrders: 0,
        paymentTerms: 'Cash on delivery',
        isActive: true
      },
      {
        id: 'SUP-003',
        name: 'Hayatabad Medical Store',
        contactPerson: 'Naveed Ullah',
        phone: '091-9217890',
        email: 'hayatabadmedical@gmail.com',
        address: 'Phase 4, Hayatabad, Peshawar',
        categories: ['Medications', 'Disposables', 'Office Supplies'],
        rating: 4.2,
        totalOrders: 0,
        paymentTerms: 'Immediate payment',
        isActive: true
      }
    ]);

    await inventoryDb.items.bulkAdd([
      // Consumables
      {
        id: 'INV-001',
        code: 'CONS-001',
        name: 'Dental Gloves (Latex)',
        category: 'Disposables',
        unit: 'boxes',
        currentStock: 15,
        minStock: 10,
        maxStock: 50,
        reorderLevel: 12,
        costPerUnit: 800,
        supplier: 'Peshawar Dental Supplies',
        lastRestocked: new Date().toISOString(),
        location: 'Storage Room - Shelf A',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-002',
        code: 'CONS-002',
        name: 'Dental Masks (3-ply)',
        category: 'Disposables',
        unit: 'boxes',
        currentStock: 8,
        minStock: 10,
        maxStock: 40,
        reorderLevel: 12,
        costPerUnit: 600,
        supplier: 'Peshawar Dental Supplies',
        lastRestocked: new Date().toISOString(),
        location: 'Storage Room - Shelf A',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-003',
        code: 'CONS-003',
        name: 'Cotton Rolls',
        category: 'Consumables',
        unit: 'packs',
        currentStock: 25,
        minStock: 15,
        maxStock: 60,
        reorderLevel: 18,
        costPerUnit: 150,
        supplier: 'Peshawar Dental Supplies',
        lastRestocked: new Date().toISOString(),
        location: 'Cabinet B - Drawer 2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-004',
        code: 'CONS-004',
        name: 'Gauze Pieces',
        category: 'Consumables',
        unit: 'packs',
        currentStock: 30,
        minStock: 20,
        maxStock: 70,
        reorderLevel: 25,
        costPerUnit: 200,
        supplier: 'Peshawar Dental Supplies',
        lastRestocked: new Date().toISOString(),
        location: 'Cabinet B - Drawer 2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Materials
      {
        id: 'INV-005',
        code: 'MAT-001',
        name: 'Composite Filling Material',
        category: 'Materials',
        unit: 'tubes',
        currentStock: 12,
        minStock: 8,
        maxStock: 30,
        reorderLevel: 10,
        costPerUnit: 3500,
        supplier: 'Medical Traders Pakistan',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastRestocked: new Date().toISOString(),
        location: 'Refrigerator - Materials Section',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-006',
        code: 'MAT-002',
        name: 'GIC (Glass Ionomer Cement)',
        category: 'Materials',
        unit: 'bottles',
        currentStock: 6,
        minStock: 5,
        maxStock: 20,
        reorderLevel: 6,
        costPerUnit: 2800,
        supplier: 'Medical Traders Pakistan',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastRestocked: new Date().toISOString(),
        location: 'Refrigerator - Materials Section',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-007',
        code: 'MAT-003',
        name: 'Dental Cement',
        category: 'Materials',
        unit: 'bottles',
        currentStock: 10,
        minStock: 6,
        maxStock: 25,
        reorderLevel: 8,
        costPerUnit: 1500,
        supplier: 'Peshawar Dental Supplies',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastRestocked: new Date().toISOString(),
        location: 'Cabinet C - Shelf 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-008',
        code: 'MAT-004',
        name: 'Impression Material (Alginate)',
        category: 'Materials',
        unit: 'packs',
        currentStock: 8,
        minStock: 5,
        maxStock: 20,
        reorderLevel: 6,
        costPerUnit: 4000,
        supplier: 'Medical Traders Pakistan',
        lastRestocked: new Date().toISOString(),
        location: 'Cabinet C - Shelf 2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Medications
      {
        id: 'INV-009',
        code: 'MED-001',
        name: 'Lidocaine 2% (Local Anesthetic)',
        category: 'Medications',
        unit: 'bottles',
        currentStock: 4,
        minStock: 5,
        maxStock: 15,
        reorderLevel: 6,
        costPerUnit: 450,
        supplier: 'Hayatabad Medical Store',
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        lastRestocked: new Date().toISOString(),
        location: 'Refrigerator - Medications',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-010',
        code: 'MED-002',
        name: 'Augmentin 625mg (Antibiotic)',
        category: 'Medications',
        unit: 'boxes',
        currentStock: 6,
        minStock: 8,
        maxStock: 25,
        reorderLevel: 10,
        costPerUnit: 350,
        supplier: 'Hayatabad Medical Store',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastRestocked: new Date().toISOString(),
        location: 'Medicine Cabinet',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-011',
        code: 'MED-003',
        name: 'Ibuprofen 400mg (Painkiller)',
        category: 'Medications',
        unit: 'boxes',
        currentStock: 10,
        minStock: 12,
        maxStock: 40,
        reorderLevel: 15,
        costPerUnit: 180,
        supplier: 'Hayatabad Medical Store',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastRestocked: new Date().toISOString(),
        location: 'Medicine Cabinet',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Instruments
      {
        id: 'INV-012',
        code: 'INST-001',
        name: 'Dental Explorer',
        category: 'Instruments',
        unit: 'pieces',
        currentStock: 8,
        minStock: 5,
        maxStock: 15,
        reorderLevel: 6,
        costPerUnit: 1200,
        supplier: 'Medical Traders Pakistan',
        lastRestocked: new Date().toISOString(),
        location: 'Sterilization Unit',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-013',
        code: 'INST-002',
        name: 'Dental Mirrors',
        category: 'Instruments',
        unit: 'pieces',
        currentStock: 12,
        minStock: 10,
        maxStock: 25,
        reorderLevel: 12,
        costPerUnit: 800,
        supplier: 'Medical Traders Pakistan',
        lastRestocked: new Date().toISOString(),
        location: 'Sterilization Unit',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-014',
        code: 'INST-003',
        name: 'Extraction Forceps Set',
        category: 'Instruments',
        unit: 'sets',
        currentStock: 3,
        minStock: 2,
        maxStock: 6,
        reorderLevel: 3,
        costPerUnit: 15000,
        supplier: 'Medical Traders Pakistan',
        lastRestocked: new Date().toISOString(),
        location: 'Surgery Cabinet',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Disposables
      {
        id: 'INV-015',
        code: 'DISP-001',
        name: 'Disposable Syringes (2ml)',
        category: 'Disposables',
        unit: 'boxes',
        currentStock: 5,
        minStock: 8,
        maxStock: 30,
        reorderLevel: 10,
        costPerUnit: 450,
        supplier: 'Peshawar Dental Supplies',
        lastRestocked: new Date().toISOString(),
        location: 'Storage Room - Shelf B',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-016',
        code: 'DISP-002',
        name: 'Suction Tips',
        category: 'Disposables',
        unit: 'packs',
        currentStock: 18,
        minStock: 15,
        maxStock: 50,
        reorderLevel: 18,
        costPerUnit: 350,
        supplier: 'Peshawar Dental Supplies',
        lastRestocked: new Date().toISOString(),
        location: 'Cabinet A - Drawer 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-017',
        code: 'DISP-003',
        name: 'Bib Holders (Patient)',
        category: 'Disposables',
        unit: 'packs',
        currentStock: 22,
        minStock: 20,
        maxStock: 60,
        reorderLevel: 25,
        costPerUnit: 180,
        supplier: 'Peshawar Dental Supplies',
        lastRestocked: new Date().toISOString(),
        location: 'Reception Desk',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Office Supplies
      {
        id: 'INV-018',
        code: 'OFF-001',
        name: 'Prescription Pads',
        category: 'Office Supplies',
        unit: 'packs',
        currentStock: 3,
        minStock: 5,
        maxStock: 15,
        reorderLevel: 6,
        costPerUnit: 500,
        supplier: 'Hayatabad Medical Store',
        lastRestocked: new Date().toISOString(),
        location: 'Consultation Room - Desk',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-019',
        code: 'OFF-002',
        name: 'Patient Files/Folders',
        category: 'Office Supplies',
        unit: 'packs',
        currentStock: 8,
        minStock: 10,
        maxStock: 30,
        reorderLevel: 12,
        costPerUnit: 300,
        supplier: 'Hayatabad Medical Store',
        lastRestocked: new Date().toISOString(),
        location: 'Reception Desk',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'INV-020',
        code: 'OFF-003',
        name: 'Printer Paper (A4)',
        category: 'Office Supplies',
        unit: 'packs',
        currentStock: 2,
        minStock: 5,
        maxStock: 20,
        reorderLevel: 6,
        costPerUnit: 700,
        supplier: 'Hayatabad Medical Store',
        lastRestocked: new Date().toISOString(),
        location: 'Office Storage',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    console.log('Inventory database initialized with default data');
  }
};

// Helper Functions
export const getStockStatus = (item: InventoryItem): StockStatus => {
  if (item.currentStock <= 0) return 'out_of_stock';
  if (item.currentStock < item.minStock) return 'critical';
  if (item.currentStock < item.reorderLevel) return 'low';
  return 'in_stock';
};

export const generateStockAlerts = async (): Promise<StockAlert[]> => {
  const items = await inventoryDb.items.toArray();
  const alerts: StockAlert[] = [];
  const now = new Date().toISOString();

  for (const item of items) {
    const status = getStockStatus(item);
    
    if (status === 'out_of_stock') {
      alerts.push({
        id: `ALERT-${item.id}-${Date.now()}`,
        itemId: item.id,
        itemName: item.name,
        alertType: 'out_of_stock',
        currentStock: item.currentStock,
        requiredAction: `URGENT: Order ${item.maxStock - item.currentStock} ${item.unit} immediately`,
        priority: 'high',
        createdAt: now,
        resolved: false
      });
    } else if (status === 'critical') {
      alerts.push({
        id: `ALERT-${item.id}-${Date.now()}`,
        itemId: item.id,
        itemName: item.name,
        alertType: 'critical_stock',
        currentStock: item.currentStock,
        requiredAction: `Order ${item.maxStock - item.currentStock} ${item.unit} within 2 days`,
        priority: 'high',
        createdAt: now,
        resolved: false
      });
    } else if (status === 'low') {
      alerts.push({
        id: `ALERT-${item.id}-${Date.now()}`,
        itemId: item.id,
        itemName: item.name,
        alertType: 'low_stock',
        currentStock: item.currentStock,
        requiredAction: `Order ${item.maxStock - item.currentStock} ${item.unit} this week`,
        priority: 'medium',
        createdAt: now,
        resolved: false
      });
    }

    // Check expiry dates
    if (item.expiryDate) {
      const expiryTime = new Date(item.expiryDate).getTime();
      const currentTime = Date.now();
      const daysUntilExpiry = Math.floor((expiryTime - currentTime) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        alerts.push({
          id: `ALERT-EXP-${item.id}-${Date.now()}`,
          itemId: item.id,
          itemName: item.name,
          alertType: 'expired',
          currentStock: item.currentStock,
          requiredAction: `Remove ${item.currentStock} ${item.unit} - EXPIRED`,
          priority: 'high',
          createdAt: now,
          resolved: false
        });
      } else if (daysUntilExpiry <= 30) {
        alerts.push({
          id: `ALERT-EXP-${item.id}-${Date.now()}`,
          itemId: item.id,
          itemName: item.name,
          alertType: 'expiring_soon',
          currentStock: item.currentStock,
          requiredAction: `Expires in ${daysUntilExpiry} days - Use first`,
          priority: 'medium',
          createdAt: now,
          resolved: false
        });
      }
    }
  }

  return alerts;
};

export const generateNextPONumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const orders = await inventoryDb.orders
    .where('poNumber')
    .startsWith(`PO-${year}-`)
    .toArray();
  
  const nextNumber = orders.length + 1;
  return `PO-${year}-${String(nextNumber).padStart(3, '0')}`;
};

export const recordStockTransaction = async (
  itemId: string,
  type: 'in' | 'out' | 'adjustment' | 'expired' | 'damaged',
  quantity: number,
  reason?: string,
  performedBy: string = 'Naveed'
): Promise<void> => {
  const item = await inventoryDb.items.get(itemId);
  if (!item) throw new Error('Item not found');

  const newStock = type === 'in' 
    ? item.currentStock + quantity 
    : item.currentStock - quantity;

  const transaction: StockTransaction = {
    id: `TXN-${Date.now()}`,
    itemId: item.id,
    itemName: item.name,
    type,
    quantity,
    remainingStock: newStock,
    cost: type === 'in' ? quantity * item.costPerUnit : undefined,
    reason,
    performedBy,
    date: new Date().toISOString(),
    notes: undefined
  };

  await inventoryDb.transactions.add(transaction);
  await inventoryDb.items.update(itemId, {
    currentStock: newStock,
    lastRestocked: type === 'in' ? new Date().toISOString() : item.lastRestocked,
    updatedAt: new Date().toISOString()
  });
};
