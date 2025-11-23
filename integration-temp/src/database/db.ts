// Unified Database Configuration for Abdullah Dental Care
// Integrates all 8 modules into one database

import Dexie, { Table } from 'dexie';

// Import types from all modules
export interface Patient {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  medicalHistory?: string[];
  behaviorTag?: string;
  outstandingBalance?: number;
  registeredAt: string;
  lastVisit?: string;
}

export interface Appointment {
  id?: number;
  patientId: number;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  duration: number;
  type: 'general' | 'orthodontist';
  status: 'scheduled' | 'completed' | 'cancelled' | 'noshow';
  reason?: string;
  notes?: string;
  createdAt: string;
}

export interface Treatment {
  id?: number;
  code: string;
  name: string;
  category: string;
  priceUSD: number;
  pricePKR: number;
  description?: string;
}

export interface TreatmentPlan {
  id?: number;
  patientId: number;
  patientName: string;
  treatments: any[];
  teethNumbers: number[];
  totalCost: number;
  discount: number;
  finalCost: number;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface Prescription {
  id?: number;
  patientId: number;
  patientName: string;
  condition: string;
  medications: any[];
  instructions: string;
  date: string;
  createdBy: string;
}

export interface Invoice {
  id?: number;
  invoiceNumber: string;
  patientId: number;
  patientName: string;
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
  date: string;
  createdBy: string;
}

export interface Payment {
  id?: number;
  invoiceId: number;
  amount: number;
  method: string;
  date: string;
  receivedBy: string;
}

export interface LabCase {
  id?: number;
  caseNumber: string;
  patientId: number;
  patientName: string;
  jobType: string;
  labName: string;
  totalCharges: number;
  dateSent: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'sent' | 'in_progress' | 'returned' | 'delivered';
  createdAt: string;
}

export interface InventoryItem {
  id?: number;
  code: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

export interface Expense {
  id?: number;
  expenseNumber: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: 'paid' | 'pending';
  vendor?: string;
  createdAt: string;
}

// Database Class
class DentalDatabase extends Dexie {
  patients!: Table<Patient, number>;
  appointments!: Table<Appointment, number>;
  treatments!: Table<Treatment, number>;
  treatmentPlans!: Table<TreatmentPlan, number>;
  prescriptions!: Table<Prescription, number>;
  invoices!: Table<Invoice, number>;
  payments!: Table<Payment, number>;
  labCases!: Table<LabCase, number>;
  inventory!: Table<InventoryItem, number>;
  expenses!: Table<Expense, number>;

  constructor() {
    super('AbdullahDentalCare');
    
    this.version(1).stores({
      patients: '++id, name, phone, email, registeredAt',
      appointments: '++id, patientId, date, time, type, status',
      treatments: '++id, code, category, name',
      treatmentPlans: '++id, patientId, status, createdAt',
      prescriptions: '++id, patientId, date',
      invoices: '++id, invoiceNumber, patientId, date, status',
      payments: '++id, invoiceId, date',
      labCases: '++id, caseNumber, patientId, status, dateSent',
      inventory: '++id, code, name, category',
      expenses: '++id, expenseNumber, category, date, status'
    });
  }
}

export const db = new DentalDatabase();

// Initialize with sample treatments data
export async function initializeTreatments() {
  const count = await db.treatments.count();
  if (count > 0) return; // Already initialized

  const treatments = [
    // Consultation & Diagnosis
    { code: 'CD001', name: 'Initial Consultation', category: 'Consultation & Diagnosis', priceUSD: 10, pricePKR: 2800 },
    { code: 'CD002', name: 'Full Mouth X-Ray (OPG)', category: 'Consultation & Diagnosis', priceUSD: 15, pricePKR: 4200 },
    { code: 'CD003', name: 'Single Tooth X-Ray', category: 'Consultation & Diagnosis', priceUSD: 3, pricePKR: 840 },
    
    // Preventive Care
    { code: 'PC001', name: 'Scaling & Polishing', category: 'Preventive Care', priceUSD: 20, pricePKR: 5600 },
    { code: 'PC002', name: 'Fluoride Treatment', category: 'Preventive Care', priceUSD: 15, pricePKR: 4200 },
    { code: 'PC003', name: 'Dental Sealants (per tooth)', category: 'Preventive Care', priceUSD: 10, pricePKR: 2800 },
    
    // Restorative
    { code: 'RD001', name: 'Amalgam Filling', category: 'Restorative Dentistry', priceUSD: 20, pricePKR: 5600 },
    { code: 'RD002', name: 'Composite Filling', category: 'Restorative Dentistry', priceUSD: 30, pricePKR: 8400 },
    { code: 'RD003', name: 'Porcelain Crown', category: 'Restorative Dentistry', priceUSD: 200, pricePKR: 56000 },
    { code: 'RD004', name: 'Zirconia Crown', category: 'Restorative Dentistry', priceUSD: 250, pricePKR: 70000 },
    
    // Endodontics
    { code: 'EN001', name: 'Root Canal - Single Canal', category: 'Endodontics', priceUSD: 80, pricePKR: 22400 },
    { code: 'EN002', name: 'Root Canal - Two Canal', category: 'Endodontics', priceUSD: 100, pricePKR: 28000 },
    { code: 'EN003', name: 'Root Canal - Three Canal', category: 'Endodontics', priceUSD: 120, pricePKR: 33600 },
    
    // Oral Surgery
    { code: 'OS001', name: 'Simple Extraction', category: 'Oral Surgery', priceUSD: 15, pricePKR: 4200 },
    { code: 'OS002', name: 'Surgical Extraction', category: 'Oral Surgery', priceUSD: 40, pricePKR: 11200 },
    { code: 'OS003', name: 'Wisdom Tooth Removal', category: 'Oral Surgery', priceUSD: 60, pricePKR: 16800 },
    
    // Prosthodontics
    { code: 'PR001', name: 'Complete Denture (per jaw)', category: 'Prosthodontics', priceUSD: 300, pricePKR: 84000 },
    { code: 'PR002', name: 'Partial Denture', category: 'Prosthodontics', priceUSD: 200, pricePKR: 56000 },
    { code: 'PR003', name: 'Dental Bridge (3 units)', category: 'Prosthodontics', priceUSD: 400, pricePKR: 112000 },
    { code: 'PR004', name: 'Dental Implant', category: 'Prosthodontics', priceUSD: 800, pricePKR: 224000 },
    
    // Orthodontics
    { code: 'OR001', name: 'Metal Braces', category: 'Orthodontics', priceUSD: 1000, pricePKR: 280000 },
    { code: 'OR002', name: 'Ceramic Braces', category: 'Orthodontics', priceUSD: 1500, pricePKR: 420000 },
    { code: 'OR003', name: 'Retainers (pair)', category: 'Orthodontics', priceUSD: 150, pricePKR: 42000 },
    
    // Cosmetic
    { code: 'CM001', name: 'Teeth Whitening', category: 'Cosmetic Dentistry', priceUSD: 150, pricePKR: 42000 },
    { code: 'CM002', name: 'Veneer (per tooth)', category: 'Cosmetic Dentistry', priceUSD: 300, pricePKR: 84000 },
    
    // Emergency
    { code: 'EM001', name: 'Emergency Visit', category: 'Emergency Care', priceUSD: 30, pricePKR: 8400 },
    { code: 'EM002', name: 'Pain Management', category: 'Emergency Care', priceUSD: 20, pricePKR: 5600 }
  ];

  await db.treatments.bulkAdd(treatments);
}

// Initialize database
initializeTreatments();
