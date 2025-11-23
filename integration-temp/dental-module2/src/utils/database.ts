// Module 2: Appointment System - Database Schema Extension
// Add to existing database.ts from Module 1

import Dexie, { Table } from 'dexie';
import { Appointment, WaitlistEntry } from './types/appointments';
// Import Patient from Module 1
// import { Patient } from './types/patients';

export interface AbdullahDentalDB extends Dexie {
  // From Module 1
  // patients: Table<Patient>;
  
  // Module 2: Appointments
  appointments: Table<Appointment>;
  waitlist: Table<WaitlistEntry>;
}

export const db = new Dexie('AbdullahDentalCare') as AbdullahDentalDB;

// Database schema - version 2 (adds appointment tables)
db.version(2).stores({
  // Existing from Module 1
  patients: 'id, phone, name, createdAt',
  
  // New for Module 2
  appointments: 'id, patientId, date, time, type, status, createdAt',
  waitlist: 'id, patientId, priority, addedAt'
});

// Database helper functions for appointments

/**
 * Get all appointments for a specific date
 */
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  return await db.appointments
    .where('date')
    .equals(date)
    .sortBy('time');
};

/**
 * Get appointments for date range
 */
export const getAppointmentsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Appointment[]> => {
  return await db.appointments
    .where('date')
    .between(startDate, endDate, true, true)
    .sortBy('date');
};

/**
 * Get all appointments for a patient
 */
export const getPatientAppointments = async (
  patientId: string
): Promise<Appointment[]> => {
  return await db.appointments
    .where('patientId')
    .equals(patientId)
    .reverse()
    .sortBy('date');
};

/**
 * Create new appointment
 */
export const createAppointment = async (
  appointment: Omit<Appointment, 'id' | 'createdAt'>
): Promise<string> => {
  const id = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newAppointment: Appointment = {
    ...appointment,
    id,
    createdAt: new Date().toISOString()
  };
  
  await db.appointments.add(newAppointment);
  return id;
};

/**
 * Update appointment
 */
export const updateAppointment = async (
  id: string,
  updates: Partial<Appointment>
): Promise<void> => {
  await db.appointments.update(id, updates);
};

/**
 * Delete appointment
 */
export const deleteAppointment = async (id: string): Promise<void> => {
  await db.appointments.delete(id);
};

/**
 * Mark appointment as completed
 */
export const completeAppointment = async (id: string): Promise<void> => {
  await db.appointments.update(id, {
    status: 'completed',
    completedAt: new Date().toISOString()
  });
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (
  id: string,
  reason?: string
): Promise<void> => {
  await db.appointments.update(id, {
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    cancelReason: reason
  });
};

/**
 * Mark as no-show
 */
export const markNoShow = async (id: string): Promise<void> => {
  await db.appointments.update(id, {
    status: 'noshow'
  });
};

/**
 * Get today's appointments
 */
export const getTodayAppointments = async (): Promise<Appointment[]> => {
  const today = new Date().toISOString().split('T')[0];
  return await getAppointmentsByDate(today);
};

/**
 * Get upcoming appointments
 */
export const getUpcomingAppointments = async (
  limit: number = 10
): Promise<Appointment[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  return await db.appointments
    .where('date')
    .aboveOrEqual(today)
    .and(apt => apt.status === 'scheduled')
    .limit(limit)
    .sortBy('date');
};

/**
 * Add to waitlist
 */
export const addToWaitlist = async (
  entry: Omit<WaitlistEntry, 'id' | 'addedAt'>
): Promise<string> => {
  const id = `wait_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newEntry: WaitlistEntry = {
    ...entry,
    id,
    addedAt: new Date().toISOString()
  };
  
  await db.waitlist.add(newEntry);
  return id;
};

/**
 * Get waitlist
 */
export const getWaitlist = async (): Promise<WaitlistEntry[]> => {
  return await db.waitlist
    .orderBy('priority')
    .reverse()
    .toArray();
};

/**
 * Remove from waitlist
 */
export const removeFromWaitlist = async (id: string): Promise<void> => {
  await db.waitlist.delete(id);
};

/**
 * Update waitlist entry
 */
export const updateWaitlistEntry = async (
  id: string,
  updates: Partial<WaitlistEntry>
): Promise<void> => {
  await db.waitlist.update(id, updates);
};

/**
 * Get appointment statistics for date range
 */
export const getAppointmentStats = async (startDate: string, endDate: string) => {
  const appointments = await getAppointmentsByDateRange(startDate, endDate);
  
  return {
    total: appointments.length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    scheduled: appointments.filter(apt => apt.status === 'scheduled').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    noShows: appointments.filter(apt => apt.status === 'noshow').length,
    byType: {
      general: appointments.filter(apt => apt.type === 'general').length,
      orthodontist: appointments.filter(apt => apt.type === 'orthodontist').length
    }
  };
};

export default db;
