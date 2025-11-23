// Module 8: Expense Database
// Abdullah Dental Care Management System

import Dexie, { Table } from 'dexie';
import type { Expense, Vendor, BudgetLimit } from '../types/expense';

export class ExpenseDatabase extends Dexie {
  expenses!: Table<Expense>;
  vendors!: Table<Vendor>;
  budgets!: Table<BudgetLimit>;

  constructor() {
    super('AbdullahDentalExpenses');
    
    this.version(1).stores({
      expenses: 'id, expenseNumber, category, date, vendor, status, isRecurring, amount',
      vendors: 'id, name, category',
      budgets: 'id, category, month'
    });
  }
}

export const expenseDb = new ExpenseDatabase();

// Expense Functions
export async function addExpense(expense: Omit<Expense, 'id' | 'expenseNumber' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expenseNumber = await generateExpenseNumber();
  
  const newExpense: Expense = {
    ...expense,
    id,
    expenseNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await expenseDb.expenses.add(newExpense);
  
  // Update vendor total if vendor exists
  if (expense.vendor && expense.status === 'paid') {
    await updateVendorTotal(expense.vendor, expense.amount);
  }
  
  return id;
}

export async function updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
  const expense = await expenseDb.expenses.get(id);
  if (!expense) throw new Error('Expense not found');
  
  // If payment status changed to paid, update vendor total
  if (updates.status === 'paid' && expense.status !== 'paid' && expense.vendor) {
    await updateVendorTotal(expense.vendor, expense.amount);
  }
  
  await expenseDb.expenses.update(id, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteExpense(id: string): Promise<void> {
  const expense = await expenseDb.expenses.get(id);
  if (expense && expense.vendor && expense.status === 'paid') {
    await updateVendorTotal(expense.vendor, -expense.amount);
  }
  await expenseDb.expenses.delete(id);
}

export async function getExpenses(filters?: {
  category?: string;
  startDate?: string;
  endDate?: string;
  vendor?: string;
  status?: string;
}): Promise<Expense[]> {
  let query = expenseDb.expenses.toCollection();
  
  if (filters) {
    if (filters.category) {
      query = expenseDb.expenses.where('category').equals(filters.category);
    }
    if (filters.vendor) {
      query = expenseDb.expenses.where('vendor').equals(filters.vendor);
    }
    if (filters.status) {
      query = expenseDb.expenses.where('status').equals(filters.status);
    }
  }
  
  let expenses = await query.toArray();
  
  if (filters?.startDate) {
    expenses = expenses.filter(e => e.date >= filters.startDate!);
  }
  if (filters?.endDate) {
    expenses = expenses.filter(e => e.date <= filters.endDate!);
  }
  
  return expenses.sort((a, b) => b.date.localeCompare(a.date));
}

async function generateExpenseNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const expenses = await expenseDb.expenses
    .where('expenseNumber')
    .startsWith(`EXP-${year}`)
    .toArray();
  
  const nextNumber = expenses.length + 1;
  return `EXP-${year}-${String(nextNumber).padStart(4, '0')}`;
}

// Vendor Functions
export async function addVendor(vendor: Omit<Vendor, 'id' | 'totalPaid'>): Promise<string> {
  const id = `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newVendor: Vendor = {
    ...vendor,
    id,
    totalPaid: 0
  };
  
  await expenseDb.vendors.add(newVendor);
  return id;
}

export async function getVendors(): Promise<Vendor[]> {
  return expenseDb.vendors.toArray();
}

export async function updateVendorTotal(vendorName: string, amount: number): Promise<void> {
  const vendor = await expenseDb.vendors.where('name').equals(vendorName).first();
  if (vendor) {
    await expenseDb.vendors.update(vendor.id, {
      totalPaid: vendor.totalPaid + amount
    });
  }
}

// Budget Functions
export async function setBudget(budget: Omit<BudgetLimit, 'id' | 'currentSpend'>): Promise<string> {
  const existing = await expenseDb.budgets
    .where(['category', 'month'])
    .equals([budget.category, budget.month])
    .first();
  
  if (existing) {
    await expenseDb.budgets.update(existing.id, {
      monthlyLimit: budget.monthlyLimit,
      alertThreshold: budget.alertThreshold
    });
    return existing.id;
  }
  
  const id = `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newBudget: BudgetLimit = {
    ...budget,
    id,
    currentSpend: 0
  };
  
  await expenseDb.budgets.add(newBudget);
  return id;
}

export async function getBudgets(month: string): Promise<BudgetLimit[]> {
  return expenseDb.budgets.where('month').equals(month).toArray();
}

export async function updateBudgetSpend(category: string, month: string): Promise<void> {
  const expenses = await getExpenses({
    category,
    startDate: `${month}-01`,
    endDate: `${month}-31`,
    status: 'paid'
  });
  
  const totalSpend = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const budget = await expenseDb.budgets
    .where(['category', 'month'])
    .equals([category, month])
    .first();
  
  if (budget) {
    await expenseDb.budgets.update(budget.id, { currentSpend: totalSpend });
  }
}

// Analytics
export async function getExpenseSummary(startDate?: string, endDate?: string): Promise<any> {
  const expenses = await getExpenses({ startDate, endDate, status: 'paid' });
  
  const summary = {
    totalExpenses: 0,
    byCategory: {} as Record<string, number>,
    byVendor: {} as Record<string, number>,
    byMonth: {} as Record<string, number>
  };
  
  expenses.forEach(expense => {
    summary.totalExpenses += expense.amount;
    
    // By category
    if (!summary.byCategory[expense.category]) {
      summary.byCategory[expense.category] = 0;
    }
    summary.byCategory[expense.category] += expense.amount;
    
    // By vendor
    if (expense.vendor) {
      if (!summary.byVendor[expense.vendor]) {
        summary.byVendor[expense.vendor] = 0;
      }
      summary.byVendor[expense.vendor] += expense.amount;
    }
    
    // By month
    const month = expense.date.substring(0, 7); // YYYY-MM
    if (!summary.byMonth[month]) {
      summary.byMonth[month] = 0;
    }
    summary.byMonth[month] += expense.amount;
  });
  
  return summary;
}