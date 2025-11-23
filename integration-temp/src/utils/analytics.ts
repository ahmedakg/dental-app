// Module 7: Analytics Utilities
// Abdullah Dental Care Management System

import type {
  DailySummary,
  WeeklySummary,
  MonthlySummary,
  RevenueBreakdown,
  PatientMetrics,
  AppointmentMetrics,
  TreatmentMetrics,
  TreatmentStat,
  PatientStat,
  CategoryStat
} from '../types/analytics';

// Date utilities
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const getWeekNumber = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const getWeekDates = (weekNumber: number, year: number): { start: Date; end: Date } => {
  const jan1 = new Date(year, 0, 1);
  const daysOffset = (weekNumber - 1) * 7;
  const weekStart = new Date(jan1.getTime() + daysOffset * 24 * 60 * 60 * 1000);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6); // Sunday
  return { start: weekStart, end: weekEnd };
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
};

export const isDateInRange = (date: string, start: string, end: string): boolean => {
  const d = new Date(date);
  const s = new Date(start);
  const e = new Date(end);
  return d >= s && d <= e;
};

// Revenue calculations
export const calculateRevenueBreakdown = (
  payments: any[],
  treatments: any[]
): RevenueBreakdown => {
  const collected = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const outstanding = payments
    .filter(p => {
      if (p.status !== 'pending') return false;
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(p.date).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSince > 30;
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const lost = payments
    .filter(p => p.status === 'cancelled' || p.status === 'defaulted')
    .reduce((sum, p) => sum + p.amount, 0);

  const projected = treatments
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.totalCost, 0);

  return { collected, pending, outstanding, lost, projected };
};

// Patient analytics
export const calculatePatientMetrics = (
  patients: any[],
  appointments: any[],
  startDate: string,
  endDate: string
): PatientMetrics => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

  const totalActive = patients.filter(p => {
    const lastVisit = new Date(p.lastVisit || p.createdAt);
    return lastVisit >= sixMonthsAgo;
  }).length;

  const totalInactive = patients.length - totalActive;

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const newThisMonth = patients.filter(p => {
    const created = new Date(p.createdAt);
    return created >= monthStart;
  }).length;

  const returningThisMonth = appointments.filter(a => {
    const apptDate = new Date(a.date);
    if (apptDate < monthStart) return false;
    const prevAppts = appointments.filter(prev => 
      prev.patientId === a.patientId && 
      new Date(prev.date) < apptDate
    );
    return prevAppts.length > 0;
  }).length;

  const vipCount = patients.filter(p => p.tags?.includes('VIP')).length;
  const defaulterCount = patients.filter(p => p.tags?.includes('Defaulter')).length;

  const totalVisits = appointments.filter(a => a.status === 'completed').length;
  const averageVisitsPerPatient = patients.length > 0 ? totalVisits / patients.length : 0;

  const patientsWithReturn = new Set(
    appointments
      .filter(a => new Date(a.date) >= sixMonthsAgo)
      .map(a => a.patientId)
  ).size;
  const retentionRate = patients.length > 0 ? (patientsWithReturn / patients.length) * 100 : 0;

  return {
    totalActive,
    totalInactive,
    newThisMonth,
    returningThisMonth,
    vipCount,
    defaulterCount,
    averageVisitsPerPatient: Math.round(averageVisitsPerPatient * 10) / 10,
    retentionRate: Math.round(retentionRate * 10) / 10
  };
};

// Appointment analytics
export const calculateAppointmentMetrics = (
  appointments: any[],
  startDate: string,
  endDate: string
): AppointmentMetrics => {
  const filtered = appointments.filter(a => isDateInRange(a.date, startDate, endDate));

  const totalScheduled = filtered.length;
  const completed = filtered.filter(a => a.status === 'completed').length;
  const cancelled = filtered.filter(a => a.status === 'cancelled').length;
  const noShow = filtered.filter(a => a.status === 'noshow').length;

  const completionRate = totalScheduled > 0 ? (completed / totalScheduled) * 100 : 0;
  const cancellationRate = totalScheduled > 0 ? (cancelled / totalScheduled) * 100 : 0;

  // Calculate average wait time (days between creation and appointment)
  const waitTimes = filtered.map(a => {
    const created = new Date(a.createdAt);
    const apptDate = new Date(a.date);
    return Math.floor((apptDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  });
  const averageWaitTime = waitTimes.length > 0
    ? waitTimes.reduce((sum, t) => sum + t, 0) / waitTimes.length
    : 0;

  // Peak hours analysis
  const hourCounts: Record<number, number> = {};
  filtered.forEach(a => {
    const hour = parseInt(a.time.split(':')[0]);
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const peakHours = Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Peak days analysis
  const dayCounts: Record<string, number> = {};
  filtered.forEach(a => {
    const date = new Date(a.date);
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
  });
  const peakDays = Object.entries(dayCounts)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    totalScheduled,
    completed,
    cancelled,
    noShow,
    completionRate: Math.round(completionRate * 10) / 10,
    cancellationRate: Math.round(cancellationRate * 10) / 10,
    averageWaitTime: Math.round(averageWaitTime * 10) / 10,
    peakHours,
    peakDays
  };
};

// Treatment analytics
export const calculateTreatmentMetrics = (
  treatments: any[],
  treatmentPlans: any[]
): TreatmentMetrics => {
  const allTreatments = treatmentPlans.flatMap(tp => tp.treatments || []);

  const totalPlanned = allTreatments.filter(t => t.status === 'pending').length;
  const totalCompleted = allTreatments.filter(t => t.status === 'completed').length;
  const totalInProgress = allTreatments.filter(t => t.status === 'in-progress').length;
  const totalCancelled = allTreatments.filter(t => t.status === 'cancelled').length;

  const completionRate = (totalPlanned + totalCompleted + totalInProgress + totalCancelled) > 0
    ? (totalCompleted / (totalPlanned + totalCompleted + totalInProgress + totalCancelled)) * 100
    : 0;

  const pendingRevenue = allTreatments
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.totalCost, 0);

  // Category statistics
  const categoryMap: Record<string, { count: number; revenue: number }> = {};
  allTreatments.forEach(t => {
    const cat = t.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { count: 0, revenue: 0 };
    }
    categoryMap[cat].count++;
    categoryMap[cat].revenue += t.totalCost || 0;
  });

  const totalRevenue = Object.values(categoryMap).reduce((sum, c) => sum + c.revenue, 0);
  const topCategories: CategoryStat[] = Object.entries(categoryMap)
    .map(([category, data]) => ({
      category,
      count: data.count,
      revenue: data.revenue,
      percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Procedure statistics
  const procedureMap: Record<string, { name: string; count: number; revenue: number }> = {};
  allTreatments.forEach(t => {
    const code = t.code || t.treatmentCode || 'UNKNOWN';
    if (!procedureMap[code]) {
      procedureMap[code] = { name: t.name || t.treatmentName || 'Unknown', count: 0, revenue: 0 };
    }
    procedureMap[code].count++;
    procedureMap[code].revenue += t.totalCost || 0;
  });

  const topProcedures: TreatmentStat[] = Object.entries(procedureMap)
    .map(([code, data]) => ({
      treatmentCode: code,
      treatmentName: data.name,
      count: data.count,
      revenue: data.revenue,
      averagePrice: data.count > 0 ? data.revenue / data.count : 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return {
    totalPlanned,
    totalCompleted,
    totalInProgress,
    totalCancelled,
    completionRate: Math.round(completionRate * 10) / 10,
    pendingRevenue,
    topCategories,
    topProcedures
  };
};

// Generate daily summary
export const generateDailySummary = (
  date: string,
  patients: any[],
  appointments: any[],
  treatments: any[],
  payments: any[],
  labCases: any[],
  prescriptions: any[]
): DailySummary => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const dayPatients = patients.filter(p => {
    const created = new Date(p.createdAt);
    return created >= dayStart && created <= dayEnd;
  });

  const dayAppointments = appointments.filter(a => {
    const apptDate = new Date(a.date);
    return apptDate >= dayStart && apptDate <= dayEnd;
  });

  const dayPayments = payments.filter(p => {
    const payDate = new Date(p.date);
    return payDate >= dayStart && payDate <= dayEnd;
  });

  const dayTreatments = treatments.filter(t => {
    const treatDate = new Date(t.completedAt || t.createdAt);
    return treatDate >= dayStart && treatDate <= dayEnd;
  });

  const dayLabSent = labCases.filter(l => {
    const sentDate = new Date(l.dateSent);
    return sentDate >= dayStart && sentDate <= dayEnd;
  });

  const dayLabReturned = labCases.filter(l => {
    if (!l.actualReturnDate) return false;
    const returnDate = new Date(l.actualReturnDate);
    return returnDate >= dayStart && returnDate <= dayEnd;
  });

  const dayPrescriptions = prescriptions.filter(p => {
    const rxDate = new Date(p.issuedDate);
    return rxDate >= dayStart && rxDate <= dayEnd;
  });

  return {
    date,
    patientsCount: dayAppointments.filter((a, i, arr) => 
      arr.findIndex(x => x.patientId === a.patientId) === i
    ).length,
    newPatients: dayPatients.length,
    appointmentsCount: dayAppointments.length,
    completedAppointments: dayAppointments.filter(a => a.status === 'completed').length,
    cancelledAppointments: dayAppointments.filter(a => a.status === 'cancelled').length,
    revenueCollected: dayPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),
    revenuePending: dayPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),
    treatmentsCompleted: dayTreatments.filter(t => t.status === 'completed').length,
    treatmentsStarted: dayTreatments.filter(t => t.status === 'in-progress').length,
    labCasesSent: dayLabSent.length,
    labCasesReturned: dayLabReturned.length,
    prescriptionsIssued: dayPrescriptions.length
  };
};

// Export formatters
export const formatCurrency = (amount: number): string => {
  return `PKR ${amount.toLocaleString('en-PK')}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
