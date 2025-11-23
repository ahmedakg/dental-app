// Module 5: Revenue Analytics Engine
// Abdullah Dental Care Management System

import { billingDb } from './billingDb';
import type { RevenueMetrics, FinancialSummary, DailyRevenue, NaveedPerformance } from '../types/billing';

// Date Range Helpers
export function getDateRange(period: 'today' | 'week' | 'month' | 'year'): { startDate: string; endDate: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'today':
      return {
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
    
    case 'week': {
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return {
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0]
      };
    }
    
    case 'month': {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      return {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0]
      };
    }
    
    case 'year': {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      
      return {
        startDate: startOfYear.toISOString().split('T')[0],
        endDate: endOfYear.toISOString().split('T')[0]
      };
    }
  }
}

// Calculate Revenue Metrics for a Period
export async function calculateRevenueMetrics(
  period: 'today' | 'week' | 'month' | 'year'
): Promise<RevenueMetrics> {
  const { startDate, endDate } = getDateRange(period);
  
  // Get all invoices in range
  const invoices = await billingDb.invoices
    .where('date')
    .between(startDate + 'T00:00:00', endDate + 'T23:59:59', true, true)
    .toArray();
  
  // Get all payments in range
  const payments = await billingDb.payments
    .where('date')
    .between(startDate + 'T00:00:00', endDate + 'T23:59:59', true, true)
    .toArray();
  
  // Get all expenses in range
  const expenses = await billingDb.expenses
    .where('date')
    .between(startDate + 'T00:00:00', endDate + 'T23:59:59', true, true)
    .toArray();
  
  // Calculate totals
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  const invoicesIssued = invoices.length;
  const invoicesPaid = invoices.filter(i => i.paymentStatus === 'paid').length;
  
  const pendingAmount = invoices
    .filter(i => ['pending', 'partial'].includes(i.paymentStatus))
    .reduce((sum, i) => sum + i.remainingAmount, 0);
  
  const overdueAmount = invoices
    .filter(i => i.paymentStatus === 'overdue')
    .reduce((sum, i) => sum + i.remainingAmount, 0);
  
  const averageInvoiceValue = invoicesIssued > 0 ? totalRevenue / invoicesIssued : 0;
  
  // Top Treatments
  const treatmentStats = new Map<string, { count: number; revenue: number }>();
  
  for (const invoice of invoices) {
    for (const item of invoice.items) {
      const existing = treatmentStats.get(item.treatmentName) || { count: 0, revenue: 0 };
      treatmentStats.set(item.treatmentName, {
        count: existing.count + item.quantity,
        revenue: existing.revenue + item.total
      });
    }
  }
  
  const topTreatments = Array.from(treatmentStats.entries())
    .map(([treatmentName, stats]) => ({
      treatmentName,
      count: stats.count,
      revenue: stats.revenue
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
  
  // Payment Method Breakdown
  let cashTotal = 0;
  let cardTotal = 0;
  let digitalTotal = 0;
  
  for (const payment of payments) {
    if (payment.methods) {
      for (const method of payment.methods) {
        if (method.method === 'cash') cashTotal += method.amount;
        else if (method.method === 'card') cardTotal += method.amount;
        else digitalTotal += method.amount;
      }
    } else {
      if (payment.method === 'cash') cashTotal += payment.amount;
      else if (payment.method === 'card') cardTotal += payment.amount;
      else digitalTotal += payment.amount;
    }
  }
  
  return {
    period,
    startDate,
    endDate,
    totalRevenue,
    totalExpenses,
    netProfit,
    profitMargin,
    invoicesIssued,
    invoicesPaid,
    pendingAmount,
    overdueAmount,
    averageInvoiceValue,
    topTreatments,
    paymentMethodBreakdown: {
      cash: cashTotal,
      card: cardTotal,
      digital: digitalTotal
    }
  };
}

// Get Today's Revenue
export async function getTodayRevenue(): Promise<DailyRevenue> {
  const today = new Date().toISOString().split('T')[0];
  let revenue = await billingDb.dailyRevenue.get(today);
  
  if (!revenue) {
    revenue = {
      date: today,
      totalInvoices: 0,
      totalRevenue: 0,
      cashReceived: 0,
      cardReceived: 0,
      digitalReceived: 0,
      totalExpenses: 0,
      netProfit: 0,
      patientsSeen: 0,
      newPatients: 0,
      appointmentsCompleted: 0,
      treatmentsCompleted: 0
    };
  }
  
  return revenue;
}

// Calculate Naveed's Performance
export async function calculateNaveedPerformance(
  period: 'week' | 'month'
): Promise<NaveedPerformance> {
  const { startDate, endDate } = getDateRange(period);
  
  // These will be calculated from other modules
  const appointmentsBooked = 0; // From Module 2
  const patientsAdded = 0; // From Module 1
  const gapsFilled = 0; // From Module 2
  const whatsappConversions = 0; // From Module 2
  const averageResponseTime = 0; // From Module 2
  
  // Revenue generated by Naveed's appointments
  const revenueGenerated = 0; // From cross-module analytics
  
  // Calculate score (0-100)
  let score = 0;
  score += Math.min(appointmentsBooked * 2, 30); // 30 points max
  score += Math.min(patientsAdded * 5, 20); // 20 points max
  score += Math.min(gapsFilled * 3, 20); // 20 points max
  score += Math.min(whatsappConversions * 2, 15); // 15 points max
  score += averageResponseTime < 5 ? 15 : averageResponseTime < 10 ? 10 : 5; // 15 points max
  
  // Determine level
  let level: NaveedPerformance['level'] = 'Rookie';
  if (score >= 80) level = 'Legend';
  else if (score >= 65) level = 'Master';
  else if (score >= 50) level = 'Expert';
  else if (score >= 35) level = 'Professional';
  
  // Award badges
  const badges: string[] = [];
  if (appointmentsBooked >= 50) badges.push('📅 Booking Champion');
  if (patientsAdded >= 10) badges.push('👥 Growth Guru');
  if (gapsFilled >= 20) badges.push('⚡ Gap Master');
  if (whatsappConversions >= 15) badges.push('💬 WhatsApp Wizard');
  if (revenueGenerated >= 100000) badges.push('💰 Revenue Rockstar');
  
  return {
    period,
    appointmentsBooked,
    patientsAdded,
    revenueGenerated,
    gapsFilled,
    whatsappConversions,
    averageResponseTime,
    score,
    level,
    badges
  };
}

// Get Complete Financial Summary
export async function getFinancialSummary(): Promise<FinancialSummary> {
  const today = await getTodayRevenue();
  const thisWeek = await calculateRevenueMetrics('week');
  const thisMonth = await calculateRevenueMetrics('month');
  const thisYear = await calculateRevenueMetrics('year');
  
  const pendingPayments = await billingDb.invoices
    .where('paymentStatus')
    .anyOf(['pending', 'partial'])
    .reverse()
    .sortBy('date');
  
  const overduePayments = await billingDb.invoices
    .where('paymentStatus')
    .equals('overdue')
    .reverse()
    .sortBy('date');
  
  // Get upcoming installments
  const allInvoices = await billingDb.invoices
    .where('paymentStatus')
    .anyOf(['pending', 'partial'])
    .toArray();
  
  const upcomingInstallments = allInvoices
    .flatMap(invoice => 
      invoice.paymentPlan?.installments
        .filter(inst => inst.status === 'pending')
        .map(inst => ({ ...inst, patientName: invoice.patientName })) || []
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 10);
  
  const naveedPerformance = await calculateNaveedPerformance('month');
  
  return {
    today,
    thisWeek,
    thisMonth,
    thisYear,
    pendingPayments,
    overduePayments,
    upcomingInstallments,
    naveedPerformance
  };
}

// Export Revenue Report (for PDF generation later)
export async function exportRevenueReport(
  period: 'week' | 'month' | 'year',
  startDate?: string,
  endDate?: string
): Promise<{
  metrics: RevenueMetrics;
  invoices: any[];
  expenses: any[];
  dailyBreakdown: DailyRevenue[];
}> {
  const dateRange = startDate && endDate 
    ? { startDate, endDate }
    : getDateRange(period);
  
  const metrics = await calculateRevenueMetrics(period);
  
  const invoices = await billingDb.invoices
    .where('date')
    .between(dateRange.startDate + 'T00:00:00', dateRange.endDate + 'T23:59:59', true, true)
    .toArray();
  
  const expenses = await billingDb.expenses
    .where('date')
    .between(dateRange.startDate + 'T00:00:00', dateRange.endDate + 'T23:59:59', true, true)
    .toArray();
  
  const dailyBreakdown = await billingDb.dailyRevenue
    .where('date')
    .between(dateRange.startDate, dateRange.endDate, true, true)
    .toArray();
  
  return {
    metrics,
    invoices,
    expenses,
    dailyBreakdown
  };
}
