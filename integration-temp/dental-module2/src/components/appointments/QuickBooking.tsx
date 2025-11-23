// Module 2: Quick Booking Component
// Modal for creating new appointments

import React, { useState, useEffect } from 'react';
import { AppointmentType } from '../types/appointments';
import { createAppointment } from '../utils/database';
import { format24To12 } from '../utils/appointmentUtils';

// This would normally import from Module 1
// For now, we'll use a simplified patient search
interface Patient {
  id: string;
  name: string;
  phone: string;
}

interface QuickBookingProps {
  date: string;
  time: string;
  type: AppointmentType;
  onClose: () => void;
  createdBy: string;
}

const QuickBooking: React.FC<QuickBookingProps> = ({
  date,
  time,
  type,
  onClose,
  createdBy
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNewPatient, setShowNewPatient] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);
  const [saving, setSaving] = useState<boolean>(false);
  
  // New patient fields
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');

  const handlePatientSearch = async (term: string) => {
    setSearchTerm(term);
    // TODO: Integrate with Module 1 patient search
    // For now, this is a placeholder
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm('');
  };

  const handleSave = async () => {
    if (!selectedPatient && !showNewPatient) {
      alert('Please select a patient or add a new one');
      return;
    }

    if (showNewPatient && (!newName || !newPhone)) {
      alert('Please enter patient name and phone');
      return;
    }

    setSaving(true);

    try {
      let patientId = selectedPatient?.id || '';
      let patientName = selectedPatient?.name || newName;
      let patientPhone = selectedPatient?.phone || newPhone;

      // If new patient, create patient first (Module 1 integration)
      if (showNewPatient) {
        // TODO: Call Module 1's createPatient function
        patientId = `pat_${Date.now()}`; // Placeholder
      }

      // Create appointment
      await createAppointment({
        patientId,
        patientName,
        patientPhone,
        date,
        time,
        duration,
        type,
        status: 'scheduled',
        reason: reason || undefined,
        notes: notes || undefined,
        createdBy
      });

      alert('✅ Appointment booked successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error booking appointment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content quick-booking" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📅 Book Appointment</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="booking-info">
          <div className="info-row">
            <span className="label">Date:</span>
            <span className="value">{new Date(date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="info-row">
            <span className="label">Time:</span>
            <span className="value">{format24To12(time)}</span>
          </div>
          <div className="info-row">
            <span className="label">Type:</span>
            <span className="value">{type === 'general' ? '🦷 General' : '🦴 Orthodontist'}</span>
          </div>
        </div>

        <div className="booking-form">
          {!showNewPatient ? (
            <>
              <div className="form-group">
                <label>Search Patient</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handlePatientSearch(e.target.value)}
                  placeholder="Search by name or phone..."
                  className="search-input"
                />
                {/* TODO: Show search results dropdown */}
              </div>

              {selectedPatient && (
                <div className="selected-patient">
                  <div className="patient-card">
                    <div className="patient-info">
                      <strong>{selectedPatient.name}</strong>
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => setSelectedPatient(null)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <button
                className="btn-secondary"
                onClick={() => setShowNewPatient(true)}
              >
                + New Patient
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                />
              </div>

              <button
                className="btn-secondary"
                onClick={() => {
                  setShowNewPatient(false);
                  setNewName('');
                  setNewPhone('');
                }}
              >
                ← Back to Search
              </button>
            </>
          )}

          <div className="form-group">
            <label>Reason for Visit</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Root Canal, Cleaning, Braces Adjustment"
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <select 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={saving || (!selectedPatient && !showNewPatient)}
          >
            {saving ? 'Booking...' : '✅ Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickBooking;
