// Module 2: Appointment System - Utilities
// Abdullah Dental Care Management System

import { TimeSlot, Appointment, DaySchedule } from '../types/appointments';

/**
 * Generate time slots from 3 PM to 10 PM with 30-minute increments
 */
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 15; // 3 PM
  const endHour = 22; // 10 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    // On the hour
    slots.push({
      hour,
      minute: 0,
      display: formatTime(hour, 0)
    });
    
    // Half past
    slots.push({
      hour,
      minute: 30,
      display: formatTime(hour, 30)
    });
  }
  
  return slots;
};

/**
 * Format hour and minute to 12-hour display
 */
export const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
};

/**
 * Convert 24-hour time string to 12-hour display
 */
export const format24To12 = (time24: string): string => {
  const [hourStr, minuteStr] = time24.split(':');
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  return formatTime(hour, minute);
};

/**
 * Convert 12-hour display to 24-hour time string
 */
export const format12To24 = (time12: string): string => {
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '00:00';
  
  let hour = parseInt(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  
  return `${hour.toString().padStart(2, '0')}:${minute}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export const getTodayISO = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Get date offset by days
 */
export const getDateOffset = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

/**
 * Build day schedule with all slots and appointments
 */
export const buildDaySchedule = (
  date: string,
  appointments: Appointment[]
): DaySchedule => {
  const slots = generateTimeSlots();
  
  const schedule: DaySchedule = {
    date,
    appointments: appointments.filter(apt => apt.date === date),
    slots: slots.map(slot => {
      const timeStr = format12To24(slot.display);
      const appointment = appointments.find(
        apt => apt.date === date && apt.time === timeStr
      );
      
      return {
        time: slot.display,
        occupied: !!appointment,
        appointment
      };
    })
  };
  
  return schedule;
};

/**
 * Get week dates starting from given date
 */
export const getWeekDates = (startDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

/**
 * Get month dates
 */
export const getMonthDates = (year: number, month: number): string[] => {
  const dates: string[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

/**
 * Calculate appointment statistics
 */
export const calculateStats = (appointments: Appointment[]) => {
  const today = getTodayISO();
  const todayAppointments = appointments.filter(apt => apt.date === today);
  
  return {
    totalToday: todayAppointments.length,
    completed: todayAppointments.filter(apt => apt.status === 'completed').length,
    scheduled: todayAppointments.filter(apt => apt.status === 'scheduled').length,
    cancelled: todayAppointments.filter(apt => apt.status === 'cancelled').length,
    noShows: todayAppointments.filter(apt => apt.status === 'noshow').length,
    emptySlots: generateTimeSlots().length - todayAppointments.filter(
      apt => apt.status !== 'cancelled' && apt.status !== 'noshow'
    ).length
  };
};

/**
 * Generate WhatsApp message for appointment reminder
 */
export const generateWhatsAppMessage = (
  patientName: string,
  slot: string,
  treatment?: string
): string => {
  const greeting = 'السلام علیکم'; // Salaam in Urdu
  const message = treatment
    ? `${greeting} ${patientName} sahib, we have a slot at ${slot} today for your ${treatment}. Can you come? - Abdullah Dental Care`
    : `${greeting} ${patientName} sahib, you have an appointment at ${slot} today at Abdullah Dental Care. See you soon!`;
  
  return encodeURIComponent(message);
};

/**
 * Open WhatsApp with pre-filled message
 */
export const sendWhatsAppMessage = (phone: string, message: string): void => {
  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if running on mobile (has native share)
  if (navigator.share) {
    navigator.share({
      text: decodeURIComponent(message)
    }).catch(err => console.log('Share cancelled', err));
  } else {
    // Desktop: open WhatsApp Web
    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(url, '_blank');
  }
};

/**
 * Get appointment color based on type
 */
export const getAppointmentColor = (type: string): string => {
  const colors: Record<string, string> = {
    general: '#10b981', // green
    orthodontist: '#3b82f6', // blue
    surgery: '#ef4444' // red (for future use)
  };
  return colors[type] || colors.general;
};

/**
 * Check if slot is available
 */
export const isSlotAvailable = (
  date: string,
  time: string,
  appointments: Appointment[]
): boolean => {
  return !appointments.some(
    apt => apt.date === date && 
           apt.time === time && 
           apt.status !== 'cancelled' && 
           apt.status !== 'noshow'
  );
};

/**
 * Get next available slot today
 */
export const getNextAvailableSlot = (appointments: Appointment[]): string | null => {
  const today = getTodayISO();
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const slots = generateTimeSlots();
  
  for (const slot of slots) {
    // Skip past slots
    if (slot.hour < currentHour || (slot.hour === currentHour && slot.minute <= currentMinute)) {
      continue;
    }
    
    const timeStr = format12To24(slot.display);
    if (isSlotAvailable(today, timeStr, appointments)) {
      return slot.display;
    }
  }
  
  return null;
};
