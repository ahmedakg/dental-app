// Module 8: Expense Tracking - Type Definitions
// Abdullah Dental Care Management System

export type ExpenseCategory = 
  | 'Supplies'
  | 'Equipment'
  | 'Rent'
  | 'Utilities'
  | 'Salary'
  | 'Marketing'
  | 'Maintenance'
  | 'Lab Fees'
  | 'Transportation'
  | 'Professional Fees'
  | 'Miscellaneous';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'easypaisa' | 'jazzcash' | 'cheque';
export type ExpenseStatus = 'paid' | 'pending' | 'overdue';
export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Expense {
  id: string;
  expenseNumber: string; // EXP-2024-0001
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string; // ISO date
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  vendor?: string;
  invoiceNumber?: string;
  receiptUrl?: string;
  notes?: string;
  isRecurring: boolean;
  recurrence?: RecurrenceDetails;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface RecurrenceDetails {
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string;
  nextDueDate: string;
  lastProcessed?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: ExpenseCategory;
  phone?: string;
  email?: string;
  address?: string;
  bankDetails?: string;
  notes?: string;
  totalPaid: number;
  activeFrom: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  byCategory: Record<ExpenseCategory, number>;
  byMonth: Record<string, number>;
  byVendor: Record<string, number>;
  pendingAmount: number;
  thisMonth: number;
  lastMonth: number;
  percentageChange: number;
}

export interface BudgetLimit {
  id: string;
  category: ExpenseCategory;
  monthlyLimit: number;
  currentSpend: number;
  alertThreshold: number; // percentage (e.g., 80 means alert at 80%)
  month: string; // YYYY-MM
}