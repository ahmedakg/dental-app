// Module 6: Lab Work Tracking - Type Definitions
// Abdullah Dental Care Management System

export type LabCaseStatus = 'sent' | 'in_progress' | 'returned' | 'delivered';
export type JobType = 'crown' | 'bridge' | 'denture' | 'implant' | 'orthodontic' | 'veneer' | 'other';
export type ChargeType = 'per_tooth' | 'per_jaw' | 'per_case';

export interface LabCase {
  id: string;
  caseNumber: string; // Auto-generated: LAB-2024-0001
  patientId: string;
  patientName: string;
  patientPhone: string;
  jobType: JobType;
  jobDescription: string;
  teethNumbers?: number[]; // FDI notation
  labName: string;
  chargeType: ChargeType;
  chargesPerUnit: number;
  totalUnits: number; // teeth count or jaw count
  totalCharges: number;
  dateSent: string; // ISO date
  expectedReturnDate: string; // ISO date
  actualReturnDate?: string; // ISO date
  dateDelivered?: string; // ISO date when fitted to patient
  status: LabCaseStatus;
  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface LabPartner {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  address?: string;
  email?: string;
  isDefault: boolean;
  averageTurnaround: number; // days
  rating: number; // 1-5
  totalCases: number;
  activeFrom: string;
  notes?: string;
}

export interface LabExpense {
  id: string;
  labCaseId: string;
  amount: number;
  date: string;
  paid: boolean;
  paidDate?: string;
  paymentMethod?: string;
}

export const JOB_TYPES = [
  { value: 'crown', label: 'PFM Crown / Zirconia Crown' },
  { value: 'bridge', label: 'Fixed Bridge' },
  { value: 'denture', label: 'Denture (Complete/Partial)' },
  { value: 'implant', label: 'Implant Crown/Abutment' },
  { value: 'orthodontic', label: 'Orthodontic Appliance' },
  { value: 'veneer', label: 'Porcelain Veneer' },
  { value: 'other', label: 'Other Lab Work' }
] as const;

export const STATUS_COLORS = {
  sent: '#FFA500',
  in_progress: '#4169E1',
  returned: '#32CD32',
  delivered: '#9370DB'
} as const;

export const STATUS_LABELS = {
  sent: 'Sent to Lab',
  in_progress: 'In Progress',
  returned: 'Returned to Clinic',
  delivered: 'Delivered to Patient'
} as const;
