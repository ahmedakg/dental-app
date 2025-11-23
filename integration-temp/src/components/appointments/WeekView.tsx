// Module 2: Week View Component
// Shows 7-day grid with appointments

import React from 'react';
import { Appointment } from '../types/appointments';
import { 
  getWeekDates, 
  formatDate,
  getAppointmentColor,
  format24To12
} from '../utils/appointmentUtils';

interface WeekViewProps {
  startDate: string;
  appointments: Appointment[];
  onSlotClick: (time: string, date: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  startDate,
  appointments,
  onSlotClick,
  onAppointmentClick
}) => {
  const weekDates = getWeekDates(startDate);
  
  const getAppointmentsForDate = (date: string): Appointment[] => {
    return appointments
      .filter(apt => apt.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const renderDayColumn = (date: string) => {
    const dayAppointments = getAppointmentsForDate(date);
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = dateObj.getDate();
    const isToday = date === new Date().toISOString().split('T')[0];
    
    return (
      <div key={date} className={`week-day-column ${isToday ? 'today' : ''}`}>
        <div className="day-header">
          <div className="day-name">{dayName}</div>
          <div className="day-number">{dayNumber}</div>
          {isToday && <div className="today-badge">Today</div>}
        </div>
        
        <div className="day-appointments">
          {dayAppointments.length === 0 ? (
            <div className="no-appointments">
              <span>No appointments</span>
              <button
                className="quick-add-btn"
                onClick={() => onSlotClick('15:00', date)}
              >
                + Add
              </button>
            </div>
          ) : (
            dayAppointments.map(apt => (
              <div
                key={apt.id}
                className="week-appointment"
                style={{ borderLeft: `3px solid ${getAppointmentColor(apt.type)}` }}
                onClick={() => onAppointmentClick(apt)}
              >
                <div className="apt-time">{format24To12(apt.time)}</div>
                <div className="apt-patient">{apt.patientName}</div>
                {apt.reason && (
                  <div className="apt-reason">{apt.reason}</div>
                )}
                {apt.status === 'completed' && (
                  <div className="apt-status completed">✅</div>
                )}
              </div>
            ))
          )}
        </div>
        
        {dayAppointments.length > 0 && (
          <div className="day-summary">
            <span>{dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="week-view">
      <div className="week-grid">
        {weekDates.map(date => renderDayColumn(date))}
      </div>
    </div>
  );
};

export default WeekView;
