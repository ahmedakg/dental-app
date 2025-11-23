// Module 2: Appointment Calendar - Main Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { 
  Appointment, 
  AppointmentType, 
  CalendarView,
  DaySchedule 
} from '../types/appointments';
import {
  getTodayAppointments,
  getAppointmentsByDateRange,
  getAppointmentsByDate
} from '../utils/database';
import {
  getTodayISO,
  getDateOffset,
  formatDate,
  buildDaySchedule,
  getWeekDates,
  calculateStats,
  getNextAvailableSlot
} from '../utils/appointmentUtils';
import TodayView from './TodayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import QuickBooking from './QuickBooking';
import AppointmentDetails from './AppointmentDetails';
import GapFiller from './GapFiller';
import '../styles/appointments.css';

interface AppointmentCalendarProps {
  userRole: 'doctor' | 'assistant';
  userName: string;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  userRole,
  userName
}) => {
  const [view, setView] = useState<CalendarView>('today');
  const [calendarType, setCalendarType] = useState<AppointmentType>('general');
  const [currentDate, setCurrentDate] = useState<string>(getTodayISO());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showQuickBooking, setShowQuickBooking] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<{time: string, date: string} | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showGapFiller, setShowGapFiller] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);

  // Load appointments based on current view
  useEffect(() => {
    loadAppointments();
  }, [currentDate, view, calendarType]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      let data: Appointment[] = [];
      
      if (view === 'today') {
        data = await getAppointmentsByDate(currentDate);
      } else if (view === 'week') {
        const weekDates = getWeekDates(currentDate);
        const startDate = weekDates[0];
        const endDate = weekDates[6];
        data = await getAppointmentsByDateRange(startDate, endDate);
      } else if (view === 'month') {
        const date = new Date(currentDate);
        const year = date.getFullYear();
        const month = date.getMonth();
        const startDate = new Date(year, month, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
        data = await getAppointmentsByDateRange(startDate, endDate);
      }
      
      // Filter by calendar type
      const filtered = data.filter(apt => apt.type === calendarType);
      setAppointments(filtered);
      
      // Calculate stats for today
      if (view === 'today') {
        setStats(calculateStats(filtered));
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (time: string, date: string) => {
    setSelectedSlot({ time, date });
    setShowQuickBooking(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseQuickBooking = () => {
    setShowQuickBooking(false);
    setSelectedSlot(null);
    loadAppointments(); // Refresh after booking
  };

  const handleCloseDetails = () => {
    setSelectedAppointment(null);
    loadAppointments(); // Refresh after any changes
  };

  const handleNavigateDate = (direction: 'prev' | 'next') => {
    const offset = direction === 'next' ? 1 : -1;
    const newDate = getDateOffset(offset);
    setCurrentDate(newDate);
  };

  const handleGoToToday = () => {
    setCurrentDate(getTodayISO());
    setView('today');
  };

  const toggleGapFiller = () => {
    setShowGapFiller(!showGapFiller);
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <div className="calendar-header-top">
        <div className="calendar-title">
          <h1>📅 Appointment Calendar</h1>
          <div className="calendar-type-toggle">
            <button
              className={calendarType === 'general' ? 'active' : ''}
              onClick={() => setCalendarType('general')}
            >
              🦷 General
            </button>
            <button
              className={calendarType === 'orthodontist' ? 'active' : ''}
              onClick={() => setCalendarType('orthodontist')}
            >
              🦴 Orthodontist
            </button>
          </div>
        </div>
        
        <div className="calendar-actions">
          <button className="btn-today" onClick={handleGoToToday}>
            Today
          </button>
          <button 
            className={`btn-gap-filler ${showGapFiller ? 'active' : ''}`}
            onClick={toggleGapFiller}
          >
            💡 Smart Fill
          </button>
        </div>
      </div>
      
      <div className="calendar-header-bottom">
        <div className="view-switcher">
          <button
            className={view === 'today' ? 'active' : ''}
            onClick={() => setView('today')}
          >
            Today
          </button>
          <button
            className={view === 'week' ? 'active' : ''}
            onClick={() => setView('week')}
          >
            Week
          </button>
          <button
            className={view === 'month' ? 'active' : ''}
            onClick={() => setView('month')}
          >
            Month
          </button>
        </div>
        
        <div className="date-navigation">
          <button onClick={() => handleNavigateDate('prev')}>
            ← Prev
          </button>
          <span className="current-date">
            {formatDate(currentDate)}
          </span>
          <button onClick={() => handleNavigateDate('next')}>
            Next →
          </button>
        </div>
      </div>
      
      {stats && view === 'today' && (
        <div className="quick-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.totalToday}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card completed">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="stat-card scheduled">
            <span className="stat-value">{stats.scheduled}</span>
            <span className="stat-label">Scheduled</span>
          </div>
          <div className="stat-card empty">
            <span className="stat-value">{stats.emptySlots}</span>
            <span className="stat-label">Empty Slots</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderView = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      );
    }

    switch (view) {
      case 'today':
        return (
          <TodayView
            date={currentDate}
            appointments={appointments}
            onSlotClick={handleSlotClick}
            onAppointmentClick={handleAppointmentClick}
          />
        );
      case 'week':
        return (
          <WeekView
            startDate={currentDate}
            appointments={appointments}
            onSlotClick={handleSlotClick}
            onAppointmentClick={handleAppointmentClick}
          />
        );
      case 'month':
        return (
          <MonthView
            currentDate={currentDate}
            appointments={appointments}
            onDateClick={(date) => {
              setCurrentDate(date);
              setView('today');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="appointment-calendar">
      {renderHeader()}
      
      <div className="calendar-content">
        {renderView()}
        
        {showGapFiller && (
          <GapFiller
            currentDate={currentDate}
            appointments={appointments}
            onClose={toggleGapFiller}
            onBookSlot={handleSlotClick}
          />
        )}
      </div>
      
      {/* Quick Booking Modal */}
      {showQuickBooking && selectedSlot && (
        <QuickBooking
          date={selectedSlot.date}
          time={selectedSlot.time}
          type={calendarType}
          onClose={handleCloseQuickBooking}
          createdBy={userName}
        />
      )}
      
      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={handleCloseDetails}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default AppointmentCalendar;
