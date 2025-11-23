// Module 2: Today View Component
// Shows time slot grid for today with appointments

import React from 'react';
import { Appointment } from '../types/appointments';
import { 
  generateTimeSlots, 
  format12To24,
  getAppointmentColor 
} from '../utils/appointmentUtils';

interface TodayViewProps {
  date: string;
  appointments: Appointment[];
  onSlotClick: (time: string, date: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

const TodayView: React.FC<TodayViewProps> = ({
  date,
  appointments,
  onSlotClick,
  onAppointmentClick
}) => {
  const timeSlots = generateTimeSlots();
  
  // Find appointment for a specific time slot
  const findAppointment = (slotDisplay: string): Appointment | undefined => {
    const timeStr = format12To24(slotDisplay);
    return appointments.find(
      apt => apt.time === timeStr && 
             apt.status !== 'cancelled' && 
             apt.status !== 'noshow'
    );
  };

  const renderSlot = (slot: typeof timeSlots[0]) => {
    const appointment = findAppointment(slot.display);
    const isOccupied = !!appointment;
    
    if (isOccupied && appointment) {
      return (
        <div
          key={slot.display}
          className="time-slot occupied"
          style={{ borderLeft: `4px solid ${getAppointmentColor(appointment.type)}` }}
          onClick={() => onAppointmentClick(appointment)}
        >
          <div className="slot-time">{slot.display}</div>
          <div className="slot-content">
            <div className="patient-name">{appointment.patientName}</div>
            <div className="patient-phone">{appointment.patientPhone}</div>
            {appointment.reason && (
              <div className="appointment-reason">{appointment.reason}</div>
            )}
            <div className="appointment-status-badge">
              {appointment.status === 'completed' && '✅ Completed'}
              {appointment.status === 'scheduled' && '📅 Scheduled'}
            </div>
          </div>
        </div>
      );
    }
    
    // Empty slot
    return (
      <div
        key={slot.display}
        className="time-slot empty"
        onClick={() => onSlotClick(format12To24(slot.display), date)}
      >
        <div className="slot-time">{slot.display}</div>
        <div className="slot-content">
          <div className="empty-indicator">
            <span className="plus-icon">+</span>
            <span>Available</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="today-view">
      <div className="time-slots-grid">
        {timeSlots.map(slot => renderSlot(slot))}
      </div>
      
      {appointments.length === 0 && (
        <div className="empty-day-message">
          <p>📭 No appointments scheduled for today</p>
          <p className="hint">Click any time slot to book an appointment</p>
        </div>
      )}
    </div>
  );
};

export default TodayView;
