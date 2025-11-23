// Module 2: Appointment Details Component
// View and manage appointment details

import React, { useState } from 'react';
import { Appointment, AppointmentStatus } from '../types/appointments';
import {
  updateAppointment,
  completeAppointment,
  cancelAppointment,
  markNoShow,
  deleteAppointment
} from '../utils/database';
import { format24To12, sendWhatsAppMessage, generateWhatsAppMessage } from '../utils/appointmentUtils';

interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
  userRole: 'doctor' | 'assistant';
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onClose,
  userRole
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [reason, setReason] = useState<string>(appointment.reason || '');
  const [notes, setNotes] = useState<string>(appointment.notes || '');
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAppointment(appointment.id, {
        reason: reason || undefined,
        notes: notes || undefined
      });
      alert('✅ Appointment updated');
      setEditing(false);
      onClose();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    const confirmMessages: Record<AppointmentStatus, string> = {
      completed: 'Mark this appointment as completed?',
      cancelled: 'Cancel this appointment?',
      noshow: 'Mark as no-show?',
      scheduled: 'Mark as scheduled?'
    };

    if (!confirm(confirmMessages[newStatus])) return;

    try {
      if (newStatus === 'completed') {
        await completeAppointment(appointment.id);
      } else if (newStatus === 'cancelled') {
        const reason = prompt('Cancellation reason (optional):');
        await cancelAppointment(appointment.id, reason || undefined);
      } else if (newStatus === 'noshow') {
        await markNoShow(appointment.id);
      } else {
        await updateAppointment(appointment.id, { status: newStatus });
      }
      alert('✅ Status updated');
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('⚠️ Delete this appointment? This cannot be undone.')) return;

    try {
      await deleteAppointment(appointment.id);
      alert('✅ Appointment deleted');
      onClose();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Error deleting appointment');
    }
  };

  const handleSendReminder = () => {
    const message = generateWhatsAppMessage(
      appointment.patientName,
      format24To12(appointment.time),
      appointment.reason
    );
    sendWhatsAppMessage(appointment.patientPhone, message);
  };

  const getStatusColor = (status: AppointmentStatus): string => {
    const colors: Record<AppointmentStatus, string> = {
      scheduled: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444',
      noshow: '#f59e0b'
    };
    return colors[status];
  };

  const getStatusLabel = (status: AppointmentStatus): string => {
    const labels: Record<AppointmentStatus, string> = {
      scheduled: '📅 Scheduled',
      completed: '✅ Completed',
      cancelled: '❌ Cancelled',
      noshow: '⚠️ No Show'
    };
    return labels[status];
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content appointment-details" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Appointment Details</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="appointment-info">
          <div className="status-badge" style={{ background: getStatusColor(appointment.status) }}>
            {getStatusLabel(appointment.status)}
          </div>

          <div className="info-section">
            <h3>Patient Information</h3>
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{appointment.patientName}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone:</span>
              <span className="value">{appointment.patientPhone}</span>
            </div>
          </div>

          <div className="info-section">
            <h3>Appointment Details</h3>
            <div className="info-row">
              <span className="label">Date:</span>
              <span className="value">
                {new Date(appointment.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Time:</span>
              <span className="value">{format24To12(appointment.time)}</span>
            </div>
            <div className="info-row">
              <span className="label">Duration:</span>
              <span className="value">{appointment.duration} minutes</span>
            </div>
            <div className="info-row">
              <span className="label">Type:</span>
              <span className="value">
                {appointment.type === 'general' ? '🦷 General' : '🦴 Orthodontist'}
              </span>
            </div>
          </div>

          {editing ? (
            <>
              <div className="form-group">
                <label>Reason for Visit</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Root Canal, Cleaning"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={4}
                />
              </div>
            </>
          ) : (
            <>
              {appointment.reason && (
                <div className="info-section">
                  <h3>Reason</h3>
                  <p>{appointment.reason}</p>
                </div>
              )}

              {appointment.notes && (
                <div className="info-section">
                  <h3>Notes</h3>
                  <p>{appointment.notes}</p>
                </div>
              )}
            </>
          )}

          <div className="info-section metadata">
            <div className="info-row">
              <span className="label">Created by:</span>
              <span className="value">{appointment.createdBy}</span>
            </div>
            <div className="info-row">
              <span className="label">Created at:</span>
              <span className="value">
                {new Date(appointment.createdAt).toLocaleString()}
              </span>
            </div>
            {appointment.completedAt && (
              <div className="info-row">
                <span className="label">Completed at:</span>
                <span className="value">
                  {new Date(appointment.completedAt).toLocaleString()}
                </span>
              </div>
            )}
            {appointment.cancelledAt && (
              <div className="info-row">
                <span className="label">Cancelled at:</span>
                <span className="value">
                  {new Date(appointment.cancelledAt).toLocaleString()}
                </span>
              </div>
            )}
            {appointment.cancelReason && (
              <div className="info-row">
                <span className="label">Cancel reason:</span>
                <span className="value">{appointment.cancelReason}</span>
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          {appointment.status === 'scheduled' && (
            <button
              className="btn-whatsapp"
              onClick={handleSendReminder}
            >
              💬 Send Reminder
            </button>
          )}

          {!editing && (
            <button
              className="btn-secondary"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit
            </button>
          )}

          {editing && (
            <>
              <button
                className="btn-secondary"
                onClick={() => {
                  setEditing(false);
                  setReason(appointment.reason || '');
                  setNotes(appointment.notes || '');
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : '💾 Save'}
              </button>
            </>
          )}
        </div>

        {!editing && (
          <div className="status-actions">
            <h3>Change Status</h3>
            <div className="status-buttons">
              {appointment.status !== 'completed' && (
                <button
                  className="status-btn completed"
                  onClick={() => handleStatusChange('completed')}
                >
                  ✅ Mark Completed
                </button>
              )}
              {appointment.status === 'scheduled' && (
                <>
                  <button
                    className="status-btn cancelled"
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    ❌ Cancel
                  </button>
                  <button
                    className="status-btn noshow"
                    onClick={() => handleStatusChange('noshow')}
                  >
                    ⚠️ No Show
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {userRole === 'doctor' && (
          <div className="danger-zone">
            <button className="btn-danger" onClick={handleDelete}>
              🗑️ Delete Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
