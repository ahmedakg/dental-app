// Module 7: Analytics & Reports - Type Definitions
// Abdullah Dental Care Management System

export type ReportType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type RevenueCategory = 'collections' | 'pending' | 'lost';
export type PatientCategory = 'new' | 'returning' | 'vip' | 'defaulter';

export interface DailySummary {
  date: string;
  patientsCount: number;
  newPatients: number;
  appointmentsCount: number;
  completedAppointments: number;
  cancelledAppointments: number;
  revenueCollected: number;
  revenuePending: number;
  treatmentsCompleted: number;
  treatmentsStarted: number;
  labCasesSent: number;
  labCasesReturned: number;
  prescriptionsIssued: number;
}

export interface WeeklySummary extends DailySummary {
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  dailyBreakdown: DailySummary[];
  topTreatments: TreatmentStat[];
  topPatients: PatientStat[];
}

export interface MonthlySummary extends WeeklySummary {
  month: number;
  year: number;
  monthName: string;
  weeklyBreakdown: WeeklySummary[];
  revenueGrowth: number; // percentage compared to last month
  patientGrowth: number;
  treatmentCategories: CategoryStat[];
}

export interface YearlySummary {
  year: number;
  monthlyBreakdown: MonthlySummary[];
  totalRevenue: number;
  totalPatients: number;
  totalAppointments: number;
  averageRevenuePerPatient: number;
  averageRevenuePerVisit: number;
  topMonth: string;
  topTreatment: string;
  growthRate: number;
}

export interface TreatmentStat {
  treatmentCode: string;
  treatmentName: string;
  count: number;
  revenue: number;
  averagePrice: number;
}

export interface PatientStat {
  patientId: string;
  patientName: string;
  visitCount: number;
  totalSpent: number;
  lastVisit: string;
  status: string;
}

export interface CategoryStat {
  category: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface RevenueBreakdown {
  collected: number;
  pending: number;
  outstanding: number; // > 30 days
  lost: number; // cancelled/defaulted
  projected: number; // pending treatments in plans
}

export interface PatientMetrics {
  totalActive: number;
  totalInactive: number;
  newThisMonth: number;
  returningThisMonth: number;
  vipCount: number;
  defaulterCount: number;
  averageVisitsPerPatient: number;
  retentionRate: number; // percentage
}

export interface AppointmentMetrics {
  totalScheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  cancellationRate: number;
  averageWaitTime: number; // days
  peakHours: { hour: number; count: number }[];
  peakDays: { day: string; count: number }[];
}

export interface TreatmentMetrics {
  totalPlanned: number;
  totalCompleted: number;
  totalInProgress: number;
  totalCancelled: number;
  completionRate: number;
  pendingRevenue: number;
  topCategories: CategoryStat[];
  topProcedures: TreatmentStat[];
}

export interface LabMetrics {
  totalCases: number;
  casesInLab: number;
  casesReturned: number;
  casesDelivered: number;
  averageTurnaround: number; // days
  totalLabExpenses: number;
  topLabPartners: { name: string; count: number; avgTime: number }[];
}

export interface PrescriptionMetrics {
  totalIssued: number;
  averageItemsPerPrescription: number;
  topMedications: { name: string; count: number }[];
  topConditions: { condition: string; count: number }[];
}

export interface InventoryMetrics {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  reorderNeeded: string[];
  topUsedItems: { name: string; quantity: number }[];
}

export interface PerformanceMetrics {
  naveedScore: number; // gamification total
  naveedLevel: number;
  naveedBadges: string[];
  averageServiceTime: number; // minutes per appointment
  patientSatisfaction: number; // if tracking
  efficiency: number; // appointments per day
}

export interface CustomReportFilters {
  startDate: string;
  endDate: string;
  patientIds?: string[];
  treatmentCategories?: string[];
  paymentStatus?: ('paid' | 'pending' | 'partial')[];
  appointmentTypes?: ('general' | 'orthodontist')[];
  includeRevenue?: boolean;
  includePatients?: boolean;
  includeAppointments?: boolean;
  includeTreatments?: boolean;
  includeLabCases?: boolean;
  includePrescriptions?: boolean;
  includeInventory?: boolean;
}

export interface ExportFormat {
  type: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeDetails: boolean;
  orientation?: 'portrait' | 'landscape';
}
