// Module 5: Sample Data for Testing
// Abdullah Dental Care Management System

import type { Invoice, Expense, NaveedPerformance } from '../types/billing';

/**
 * Sample Invoices
 */
export const sampleInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2025-0001',
    patientId: 'pat-001',
    patientName: 'Ali Khan',
    patientPhone: '0300-1234567',
    date: '2025-01-15T10:00:00Z',
    dueDate: '2025-02-15T00:00:00Z',
    status: 'paid',
    items: [
      {
        id: 'item-001',
        description: 'Tooth Extraction #36',
        toothNumbers: [36],
        quantity: 1,
        unitPrice: 5000,
        total: 5000
      },
      {
        id: 'item-002',
        description: 'Consultation',
        quantity: 1,
        unitPrice: 1000,
        total: 1000
      }
    ],
    subtotal: 6000,
    discount: 500,
    discountType: 'fixed',
    tax: 0,
    total: 5500,
    payments: [
      {
        id: 'pay-001',
        amount: 5500,
        method: 'cash',
        date: '2025-01-15T10:30:00Z',
        receivedBy: 'naveed'
      }
    ],
    amountPaid: 5500,
    amountDue: 0,
    createdAt: '2025-01-15T10:00:00Z',
    createdBy: 'naveed',
    issuedAt: '2025-01-15T10:00:00Z',
    paidAt: '2025-01-15T10:30:00Z',
    notes: 'Patient was cooperative. Follow-up in 1 week.'
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2025-0002',
    patientId: 'pat-002',
    patientName: 'Fatima Bibi',
    patientPhone: '0321-9876543',
    date: '2025-01-18T14:00:00Z',
    dueDate: '2025-02-18T00:00:00Z',
    status: 'issued',
    items: [
      {
        id: 'item-003',
        description: 'Root Canal Treatment #21',
        toothNumbers: [21],
        quantity: 1,
        unitPrice: 15000,
        total: 15000
      }
    ],
    subtotal: 15000,
    discount: 0,
    discountType: 'fixed',
    tax: 0,
    total: 15000,
    payments: [
      {
        id: 'pay-002',
        amount: 7500,
        method: 'card',
        date: '2025-01-18T14:30:00Z',
        receivedBy: 'naveed'
      }
    ],
    amountPaid: 7500,
    amountDue: 7500,
    createdAt: '2025-01-18T14:00:00Z',
    createdBy: 'naveed',
    issuedAt: '2025-01-18T14:00:00Z',
    notes: 'Patient will pay remaining in 2 weeks.',
    internalNotes: 'VIP patient - family friend'
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2025-0003',
    patientId: 'pat-003',
    patientName: 'Hassan Malik',
    patientPhone: '0333-5555555',
    date: '2025-01-10T16:00:00Z',
    dueDate: '2025-01-25T00:00:00Z',
    status: 'issued',
    items: [
      {
        id: 'item-004',
        description: 'Dental Cleaning & Scaling',
        quantity: 1,
        unitPrice: 3000,
        total: 3000
      },
      {
        id: 'item-005',
        description: 'Fluoride Treatment',
        quantity: 1,
        unitPrice: 1500,
        total: 1500
      }
    ],
    subtotal: 4500,
    discount: 10,
    discountType: 'percentage',
    tax: 0,
    total: 4050,
    payments: [],
    amountPaid: 0,
    amountDue: 4050,
    createdAt: '2025-01-10T16:00:00Z',
    createdBy: 'naveed',
    issuedAt: '2025-01-10T16:00:00Z',
    notes: 'Patient will pay next visit.',
    internalNotes: 'Needs reminder call'
  }
];

/**
 * Sample Expenses
 */
export const sampleExpenses: Expense[] = [
  {
    id: 'exp-001',
    date: '2025-01-05',
    category: 'supplies',
    description: 'Composite filling materials (bulk order)',
    amount: 45000,
    vendor: 'Dental Supplies Co.',
    notes: '3 month supply',
    recordedBy: 'dr-ahmed',
    createdAt: '2025-01-05T09:00:00Z'
  },
  {
    id: 'exp-002',
    date: '2025-01-10',
    category: 'utilities',
    description: 'Electricity bill - December 2024',
    amount: 8500,
    vendor: 'PESCO',
    recordedBy: 'naveed',
    createdAt: '2025-01-10T11:00:00Z'
  },
  {
    id: 'exp-003',
    date: '2025-01-12',
    category: 'equipment',
    description: 'LED curing light',
    amount: 35000,
    vendor: 'DentEquip Pakistan',
    notes: '2 year warranty',
    recordedBy: 'dr-ahmed',
    createdAt: '2025-01-12T15:00:00Z'
  },
  {
    id: 'exp-004',
    date: '2025-01-15',
    category: 'lab-fees',
    description: 'Crown fabrication - 3 units',
    amount: 18000,
    vendor: 'Peshawar Dental Lab',
    recordedBy: 'dr-ahmed',
    createdAt: '2025-01-15T17:00:00Z'
  },
  {
    id: 'exp-005',
    date: '2025-01-01',
    category: 'salaries',
    description: 'Naveed salary - January 2025',
    amount: 40000,
    notes: 'Includes performance bonus',
    recordedBy: 'dr-ahmed',
    createdAt: '2025-01-01T10:00:00Z'
  },
  {
    id: 'exp-006',
    date: '2025-01-03',
    category: 'rent',
    description: 'Clinic rent - January 2025',
    amount: 50000,
    vendor: 'Landlord: Mr. Khalid',
    recordedBy: 'dr-ahmed',
    createdAt: '2025-01-03T12:00:00Z'
  },
  {
    id: 'exp-007',
    date: '2025-01-08',
    category: 'marketing',
    description: 'Facebook ads - January campaign',
    amount: 5000,
    notes: 'Targeting Hayatabad area',
    recordedBy: 'naveed',
    createdAt: '2025-01-08T14:00:00Z'
  },
  {
    id: 'exp-008',
    date: '2025-01-14',
    category: 'maintenance',
    description: 'Dental chair servicing',
    amount: 7500,
    vendor: 'TechCare Services',
    recordedBy: 'dr-ahmed',
    createdAt: '2025-01-14T16:00:00Z'
  }
];

/**
 * Sample Naveed Performance Data
 */
export const sampleNaveedPerformance: NaveedPerformance = {
  period: {
    start: '2025-01-01T00:00:00Z',
    end: '2025-01-31T23:59:59Z'
  },
  
  // Patient Acquisition
  newPatientsAdded: 15,
  appointmentsBooked: 48,
  appointmentsFilled: 12,  // from gap filler
  
  // Collections
  paymentsCollected: 145000,
  collectionRate: 89.2,  // percentage
  
  // Efficiency
  averageCheckoutTime: 8.5,  // minutes
  invoiceAccuracy: 97.3,  // percentage
  
  // Revenue Impact
  revenueGenerated: 162500,
  discountsGiven: 8200,
  
  // Gamification
  totalPoints: 4250,
  level: 8,
  rank: 'Pro'
};

/**
 * Helper: Get invoices for specific period
 */
export function getInvoicesForPeriod(
  invoices: Invoice[],
  startDate: string,
  endDate: string
): Invoice[] {
  return invoices.filter(inv => {
    const invDate = new Date(inv.date);
    return invDate >= new Date(startDate) && invDate <= new Date(endDate);
  });
}

/**
 * Helper: Get expenses for specific month
 */
export function getExpensesForMonth(
  expenses: Expense[],
  year: number,
  month: number  // 1-12
): Expense[] {
  return expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getFullYear() === year && 
           expDate.getMonth() === month - 1;
  });
}

/**
 * Helper: Generate random invoice for testing
 */
export function generateRandomInvoice(
  patientName: string,
  patientPhone: string
): Invoice {
  const id = `inv-${Date.now()}`;
  const invoiceNumber = `INV-2025-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
  const treatments = [
    { name: 'Tooth Extraction', price: 5000 },
    { name: 'Root Canal Treatment', price: 15000 },
    { name: 'Dental Filling', price: 3000 },
    { name: 'Teeth Whitening', price: 12000 },
    { name: 'Crown Placement', price: 18000 },
    { name: 'Dental Cleaning', price: 3000 },
    { name: 'Consultation', price: 1000 }
  ];
  
  const selectedTreatment = treatments[Math.floor(Math.random() * treatments.length)];
  
  const subtotal = selectedTreatment.price;
  const hasDiscount = Math.random() > 0.7;
  const discount = hasDiscount ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal - discount;
  
  const hasPayment = Math.random() > 0.3;
  const paymentAmount = hasPayment ? (Math.random() > 0.5 ? total : Math.floor(total / 2)) : 0;
  
  return {
    id,
    invoiceNumber,
    patientId: `pat-${Date.now()}`,
    patientName,
    patientPhone,
    date: new Date().toISOString(),
    status: paymentAmount >= total ? 'paid' : 'issued',
    items: [
      {
        id: `item-${Date.now()}`,
        description: selectedTreatment.name,
        quantity: 1,
        unitPrice: selectedTreatment.price,
        total: selectedTreatment.price
      }
    ],
    subtotal,
    discount,
    discountType: 'fixed',
    tax: 0,
    total,
    payments: hasPayment ? [
      {
        id: `pay-${Date.now()}`,
        amount: paymentAmount,
        method: ['cash', 'card', 'jazzcash'][Math.floor(Math.random() * 3)] as any,
        date: new Date().toISOString(),
        receivedBy: 'naveed'
      }
    ] : [],
    amountPaid: paymentAmount,
    amountDue: total - paymentAmount,
    createdAt: new Date().toISOString(),
    createdBy: 'naveed',
    issuedAt: new Date().toISOString()
  };
}
