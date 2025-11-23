// Module 3: Treatment Planning System - Type Definitions
// Abdullah Dental Care Management System

export type ToothType = 'adult' | 'primary';
export type ToothStatus = 'healthy' | 'selected' | 'treated' | 'extracted' | 'missing';
export type TreatmentCategory = 
  | 'Consultation & Diagnosis'
  | 'Preventive Care'
  | 'Restorative Dentistry'
  | 'Endodontics'
  | 'Periodontics'
  | 'Oral Surgery'
  | 'Prosthodontics'
  | 'Orthodontics'
  | 'Cosmetic Dentistry'
  | 'Pediatric Dentistry'
  | 'Emergency Care';

export type TreatmentStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface Tooth {
  number: number; // FDI notation
  type: ToothType;
  status: ToothStatus;
  position: {
    quadrant: 1 | 2 | 3 | 4 | 5; // 1=UR, 2=UL, 3=LL, 4=LR, 5=Primary
    index: number;
  };
}

export interface Treatment {
  id: string;
  code: string;
  name: string;
  category: TreatmentCategory;
  priceUSD: number;
  pricePKR: number;
  description?: string;
  duration?: number; // minutes
  requiresLab?: boolean;
  requiresAnesthesia?: boolean;
}

export interface TreatmentPlanItem {
  id: string;
  treatmentId: string;
  treatment: Treatment;
  teeth: number[]; // FDI numbers
  quantity: number;
  pricePerUnit: number;
  discount: number; // percentage
  totalPrice: number;
  notes?: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  estimatedSessions: number;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  status: TreatmentStatus;
  items: TreatmentPlanItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  notes?: string;
  consentSigned: boolean;
  consentDate?: string;
}

export interface TreatmentHistory {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  treatmentId: string;
  treatmentName: string;
  teeth: number[];
  date: string;
  performedBy: string;
  notes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  complications?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  amount: number;
  paid: boolean;
}

export interface ToothChart {
  patientId: string;
  adultTeeth: Map<number, Tooth>;
  primaryTeeth: Map<number, Tooth>;
  lastUpdated: string;
  updatedBy: string;
}
