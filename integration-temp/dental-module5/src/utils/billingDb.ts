// Module 5: Billing Database Layer
// Abdullah Dental Care Management System

import Dexie, { Table } from 'dexie';
import type { Invoice, Payment, Expense, DailyRevenue } from '../types/billing';

export class BillingDatabase extends Dexie {
  invoices!: Table<Invoice>;
  payments!: Table<Payment>;
  expenses!: Table<Expense>;
  dailyRevenue!: Table<DailyRevenue>;

  constructor() {
    super('AbdullahDentalBilling');
    
    this.version(1).stores({
      invoices: 'id, invoiceNumber, patientId, date, status, paymentStatus, createdAt, total, remainingAmount',
      payments: 'id, invoiceId, date, receivedBy, createdAt',
      expenses: 'id, date, category, createdBy, createdAt',
      dailyRevenue: 'date'
    });
  }
}

export const billingDb = new BillingDatabase();

// Invoice Number Generator
export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const timestamp = now.getTime().toString().slice(-6);
  return `ADC-${year}-${timestamp}`;
}

// CRUD Operations for Invoices
export async function createInvoice(invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>): Promise<Invoice> {
  const newInvoice: Invoice = {
    ...invoice,
    id: crypto.randomUUID(),
    invoiceNumber: generateInvoiceNumber(),
    createdAt: new Date().toISOString()
  };
  
  await billingDb.invoices.add(newInvoice);
  await updateDailyRevenue(newInvoice.date);
  return newInvoice;
}

export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<void> {
  await billingDb.invoices.update(id, updates);
  const invoice = await billingDb.invoices.get(id);
  if (invoice) {
    await updateDailyRevenue(invoice.date);
  }
}

export async function getInvoice(id: string): Promise<Invoice | undefined> {
  return await billingDb.invoices.get(id);
}

export async function getInvoicesByPatient(patientId: string): Promise<Invoice[]> {
  return await billingDb.invoices
    .where('patientId')
    .equals(patientId)
    .reverse()
    .sortBy('createdAt');
}

export async function getPendingInvoices(): Promise<Invoice[]> {
  return await billingDb.invoices
    .where('paymentStatus')
    .anyOf(['pending', 'partial', 'overdue'])
    .reverse()
    .sortBy('date');
}

export async function getOverdueInvoices(): Promise<Invoice[]> {
  return await billingDb.invoices
    .where('paymentStatus')
    .equals('overdue')
    .reverse()
    .sortBy('date');
}

export async function getInvoicesByDateRange(startDate: string, endDate: string): Promise<Invoice[]> {
  return await billingDb.invoices
    .where('date')
    .between(startDate, endDate, true, true)
    .reverse()
    .sortBy('date');
}

// Payment Operations
export async function addPayment(payment: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> {
  const newPayment: Payment = {
    ...payment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  
  await billingDb.payments.add(newPayment);
  
  // Update invoice
  const invoice = await billingDb.invoices.get(payment.invoiceId);
  if (invoice) {
    const newPaidAmount = invoice.paidAmount + payment.amount;
    const newRemainingAmount = invoice.total - newPaidAmount;
    
    let newPaymentStatus: Invoice['paymentStatus'];
    if (newRemainingAmount <= 0) {
      newPaymentStatus = 'paid';
    } else if (newPaidAmount > 0) {
      newPaymentStatus = 'partial';
    } else {
      newPaymentStatus = 'pending';
    }
    
    await billingDb.invoices.update(payment.invoiceId, {
      paidAmount: newPaidAmount,
      remainingAmount: newRemainingAmount,
      paymentStatus: newPaymentStatus,
      payments: [...invoice.payments, newPayment],
      paidAt: newPaymentStatus === 'paid' ? new Date().toISOString() : invoice.paidAt
    });
    
    await updateDailyRevenue(payment.date);
  }
  
  return newPayment;
}

export async function getPaymentsByInvoice(invoiceId: string): Promise<Payment[]> {
  return await billingDb.payments
    .where('invoiceId')
    .equals(invoiceId)
    .reverse()
    .sortBy('date');
}

export async function getPaymentsByDateRange(startDate: string, endDate: string): Promise<Payment[]> {
  return await billingDb.payments
    .where('date')
    .between(startDate, endDate, true, true)
    .reverse()
    .sortBy('date');
}

// Expense Operations
export async function createExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
  const newExpense: Expense = {
    ...expense,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  
  await billingDb.expenses.add(newExpense);
  await updateDailyRevenue(expense.date);
  return newExpense;
}

export async function updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
  await billingDb.expenses.update(id, updates);
  const expense = await billingDb.expenses.get(id);
  if (expense) {
    await updateDailyRevenue(expense.date);
  }
}

export async function deleteExpense(id: string): Promise<void> {
  const expense = await billingDb.expenses.get(id);
  await billingDb.expenses.delete(id);
  if (expense) {
    await updateDailyRevenue(expense.date);
  }
}

export async function getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
  return await billingDb.expenses
    .where('date')
    .between(startDate, endDate, true, true)
    .reverse()
    .sortBy('date');
}

export async function getExpensesByCategory(category: Expense['category']): Promise<Expense[]> {
  return await billingDb.expenses
    .where('category')
    .equals(category)
    .reverse()
    .sortBy('date');
}

// Daily Revenue Calculation
export async function updateDailyRevenue(date: string): Promise<void> {
  const dateOnly = date.split('T')[0];
  const startOfDay = `${dateOnly}T00:00:00`;
  const endOfDay = `${dateOnly}T23:59:59`;
  
  const invoices = await getInvoicesByDateRange(startOfDay, endOfDay);
  const payments = await getPaymentsByDateRange(startOfDay, endOfDay);
  const expenses = await getExpensesByDateRange(startOfDay, endOfDay);
  
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const cashReceived = payments
    .filter(p => p.method === 'cash' || (p.methods && p.methods.some(m => m.method === 'cash')))
    .reduce((sum, p) => {
      if (p.methods) {
        return sum + (p.methods.find(m => m.method === 'cash')?.amount || 0);
      }
      return sum + p.amount;
    }, 0);
  
  const cardReceived = payments
    .filter(p => p.method === 'card' || (p.methods && p.methods.some(m => m.method === 'card')))
    .reduce((sum, p) => {
      if (p.methods) {
        return sum + (p.methods.find(m => m.method === 'card')?.amount || 0);
      }
      return sum + p.amount;
    }, 0);
  
  const digitalReceived = payments
    .filter(p => ['easypaisa', 'jazzcash', 'bank_transfer'].includes(p.method) || 
                 (p.methods && p.methods.some(m => ['easypaisa', 'jazzcash', 'bank_transfer'].includes(m.method))))
    .reduce((sum, p) => {
      if (p.methods) {
        return sum + p.methods
          .filter(m => ['easypaisa', 'jazzcash', 'bank_transfer'].includes(m.method))
          .reduce((s, m) => s + m.amount, 0);
      }
      return sum + p.amount;
    }, 0);
  
  const dailyRevenue: DailyRevenue = {
    date: dateOnly,
    totalInvoices: invoices.length,
    totalRevenue,
    cashReceived,
    cardReceived,
    digitalReceived,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    patientsSeen: new Set(invoices.map(i => i.patientId)).size,
    newPatients: 0, // Will be calculated from patient module
    appointmentsCompleted: 0, // Will be calculated from appointment module
    treatmentsCompleted: invoices.reduce((sum, i) => sum + i.items.length, 0)
  };
  
  await billingDb.dailyRevenue.put(dailyRevenue);
}

export async function getDailyRevenue(date: string): Promise<DailyRevenue | undefined> {
  const dateOnly = date.split('T')[0];
  return await billingDb.dailyRevenue.get(dateOnly);
}

// Overdue Invoice Checker (run daily)
export async function updateOverdueInvoices(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  const pendingInvoices = await billingDb.invoices
    .where('paymentStatus')
    .anyOf(['pending', 'partial'])
    .toArray();
  
  for (const invoice of pendingInvoices) {
    if (invoice.paymentPlan && invoice.paymentPlan.nextDueDate) {
      if (invoice.paymentPlan.nextDueDate < today) {
        await billingDb.invoices.update(invoice.id, {
          paymentStatus: 'overdue'
        });
      }
    } else {
      // No payment plan, check if 30 days past invoice date
      const invoiceDate = new Date(invoice.date);
      const daysOld = Math.floor((new Date().getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysOld > 30) {
        await billingDb.invoices.update(invoice.id, {
          paymentStatus: 'overdue'
        });
      }
    }
  }
}

// Initialize - Check for overdue invoices on startup
updateOverdueInvoices();
