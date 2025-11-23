// Module 4: Prescription System - Type Definitions
// Abdullah Dental Care Management System

export type ProtocolTier = 'premium' | 'standard' | 'basic';
export type MedicationFrequency = 'OD' | 'BD' | 'TDS' | 'QID' | 'SOS';
export type MedicationRoute = 'oral' | 'topical' | 'rinse' | 'injection';
export type PrescriptionStatus = 'draft' | 'issued' | 'dispensed';

export interface Medication {
  id: string;
  genericName: string;
  brandName: string;
  strength: string;
  form: string; // tablet, capsule, syrup, gel, etc.
  route: MedicationRoute;
  price: number; // PKR
  manufacturer: string;
  contraindications: string[];
  pregnancy: 'safe' | 'caution' | 'avoid';
  breastfeeding: 'safe' | 'caution' | 'avoid';
  interactions: string[];
}

export interface DosageInstruction {
  medication: Medication;
  dose: string; // "1 tablet", "5ml"
  frequency: MedicationFrequency;
  timing: string; // "after meals", "before sleep"
  duration: string; // "3 days", "5 days", "7 days"
  specialInstructions?: string;
}

export interface DentalCondition {
  id: string;
  code: string;
  name: string;
  category: 'pain' | 'infection' | 'inflammation' | 'prophylaxis' | 'post-op' | 'emergency';
  description: string;
  protocols: {
    premium: TreatmentProtocol;
    standard: TreatmentProtocol;
    basic: TreatmentProtocol;
  };
}

export interface TreatmentProtocol {
  tier: ProtocolTier;
  medications: DosageInstruction[];
  instructions: string[];
  warnings: string[];
  followUpDays: number;
  dietaryRestrictions: string[];
}

export interface MedicalAlert {
  type: 'error' | 'warning' | 'info';
  message: string;
  affectedMedications: string[];
  action: 'remove' | 'replace' | 'adjust' | 'monitor';
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female';
  patientPhone: string;
  
  conditionId: string;
  conditionName: string;
  diagnosis: string;
  toothNumbers?: string[];
  
  protocolTier: ProtocolTier;
  medications: DosageInstruction[];
  instructions: string[];
  warnings: string[];
  dietaryRestrictions: string[];
  followUpDate: string;
  
  medicalAlerts: MedicalAlert[];
  
  issuedBy: string; // Dr. name
  issuedAt: string;
  status: PrescriptionStatus;
  
  pdfGenerated: boolean;
  pdfPath?: string;
}

export interface PatientMedicalHistory {
  patientId: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  isPregnant: boolean;
  isBreastfeeding: boolean;
  bloodThinners: boolean;
  diabetic: boolean;
  hypertensive: boolean;
  asthmatic: boolean;
  liverDisease: boolean;
  kidneyDisease: boolean;
  lastUpdated: string;
}
