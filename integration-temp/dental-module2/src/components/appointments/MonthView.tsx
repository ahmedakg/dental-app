// Module 2: Month View Component
// Shows calendar month with appointment counts

import React from 'react';
import { Appointment } from '../types/appointments';
import { getMonthDates } from '../utils/appointmentUtils';

interface MonthViewProps {
  currentDate: string;
  appointments: Appointment[];
  onDateClick: (date: string) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  appointments,
  onDateClick
}) => {
  const date = new Date(currentDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const getAppointmentCount = (day: number): number => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr).length;
  };
  
  const getCompletedCount = (day: number): number => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return appointments.filter(
      apt => apt.date === dateStr && apt.status === 'completed'
    ).length;
  };
  
  const isToday = (day: number): boolean => {
    const today = new Date();
    return today.getFullYear() === year &&
           today.getMonth() === month &&
           today.getDate() === day;
  };
  
  const handleDayClick = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    onDateClick(dateStr);
  };
  
  const renderCalendarDays = () => {
    const days: JSX.Element[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const appointmentCount = getAppointmentCount(day);
      const completedCount = getCompletedCount(day);
      const today = isToday(day);
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${today ? 'today' : ''} ${appointmentCount > 0 ? 'has-appointments' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          <div className="day-number">{day}</div>
          {appointmentCount > 0 && (
            <div className="appointment-indicators">
              <div className="appointment-count">
                {appointmentCount} apt{appointmentCount !== 1 ? 's' : ''}
              </div>
              {completedCount > 0 && (
                <div className="completed-indicator">
                  ✅ {completedCount}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="month-view">
      <div className="month-header">
        <h2>{monthName}</h2>
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
        </div>
        
        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>
      
      <div className="month-legend">
        <div className="legend-item">
          <div className="legend-color today"></div>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <div className="legend-color has-appointments"></div>
          <span>Has Appointments</span>
        </div>
      </div>
    </div>
  );
};

export default MonthView;
