// Module 2: Appointment System - Type Definitions
// Abdullah Dental Care Management System

export type AppointmentType = 'general' | 'orthodontist';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'noshow';
export type CalendarView = 'today' | 'week' | 'month';

export interface TimeSlot {
  hour: number;
  minute: number;
  display: string; // "3:00 PM"
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string; // ISO date string
  time: string; // "15:00" (24-hour)
  duration: number; // minutes (default 30)
  type: AppointmentType;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

export interface WaitlistEntry {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  requestedDate?: string; // preferred date if any
  priority: 'vip' | 'regular' | 'normal';
  reason: string;
  addedAt: string;
  notifiedAt?: string;
}

export interface DaySchedule {
  date: string;
  appointments: Appointment[];
  slots: {
    time: string;
    occupied: boolean;
    appointment?: Appointment;
  }[];
}

export interface CalendarSettings {
  generalStart: string; // "15:00"
  generalEnd: string; // "22:00"
  slotDuration: number; // 30 minutes
  orthodontistDays: string[]; // ISO date strings
}

export interface AppointmentStats {
  totalToday: number;
  completed: number;
  scheduled: number;
  cancelled: number;
  noShows: number;
  emptySlots: number;
  revenue: number;
}

export interface GapFillerSuggestion {
  patientId: string;
  patientName: string;
  patientPhone: string;
  pendingTreatment: string;
  lastVisit: string;
  availableSlot: string;
  priority: number;
}
