// Module 5: Billing & Revenue Management - Type Definitions
// Abdullah Dental Care Management System

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'easypaisa' | 'jazzcash' | 'mixed';
export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'overdue';
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled';
export type ExpenseCategory = 'supplies' | 'equipment' | 'rent' | 'utilities' | 'salary' | 'marketing' | 'maintenance' | 'other';

export interface PaymentPlan {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  installments: Installment[];
  nextDueDate?: string;
}

export interface Installment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  method?: PaymentMethod;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // Auto-generated: ADC-2024-0001
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string; // ISO date
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  discountReason?: string;
  tax: number; // Usually 0 for dental in Pakistan
  total: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  paymentPlan?: PaymentPlan;
  payments: Payment[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  issuedAt?: string;
  paidAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

export interface InvoiceItem {
  id: string;
  treatmentId: string;
  treatmentCode: string;
  treatmentName: string;
  toothNumbers?: number[]; // FDI notation
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  notes?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  methods?: { method: PaymentMethod; amount: number }[]; // For mixed payments
  date: string;
  receivedBy: string;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  vendor?: string;
  paymentMethod: PaymentMethod;
  receiptNumber?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface DailyRevenue {
  date: string;
  totalInvoices: number;
  totalRevenue: number;
  cashReceived: number;
  cardReceived: number;
  digitalReceived: number;
  totalExpenses: number;
  netProfit: number;
  patientsSeen: number;
  newPatients: number;
  appointmentsCompleted: number;
  treatmentsCompleted: number;
}

export interface RevenueMetrics {
  period: 'today' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number; // Percentage
  invoicesIssued: number;
  invoicesPaid: number;
  pendingAmount: number;
  overdueAmount: number;
  averageInvoiceValue: number;
  topTreatments: {
    treatmentName: string;
    count: number;
    revenue: number;
  }[];
  paymentMethodBreakdown: {
    cash: number;
    card: number;
    digital: number;
  };
}

export interface NaveedPerformance {
  period: 'week' | 'month';
  appointmentsBooked: number;
  patientsAdded: number;
  revenueGenerated: number;
  gapsFilled: number; // Smart Gap Filler conversions
  whatsappConversions: number;
  averageResponseTime: number; // minutes
  score: number; // 0-100
  level: 'Rookie' | 'Professional' | 'Expert' | 'Master' | 'Legend';
  badges: string[];
}

export interface FinancialSummary {
  today: DailyRevenue;
  thisWeek: RevenueMetrics;
  thisMonth: RevenueMetrics;
  thisYear: RevenueMetrics;
  pendingPayments: Invoice[];
  overduePayments: Invoice[];
  upcomingInstallments: Installment[];
  naveedPerformance: NaveedPerformance;
}
