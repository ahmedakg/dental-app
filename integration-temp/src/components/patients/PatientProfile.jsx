import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowLeft, Edit, Phone, MapPin, Briefcase, Calendar,
  AlertTriangle, MessageSquare, FileText, DollarSign, Activity
} from 'lucide-react';
import { db } from '../../lib/db';
import { format } from 'date-fns';

const BEHAVIOR_TAG_COLORS = {
  VIP: '#FFD700',
  Rich: '#4CAF50',
  Regular: '#2196F3',
  Miser: '#FF9800',
  Difficult: '#F44336',
  'Con Artist': '#B71C1C',
  Poor: '#9E9E9E',
  'Over Sensitive': '#E91E63',
  Irritating: '#9C27B0'
};

export default function PatientProfile({ patient, onBack, onEdit, onBookAppointment, onAddTreatment, onSendReminder }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Live queries for patient data
  const treatments = useLiveQuery(
    () => db.treatments.where('patientId').equals(patient.id).reverse().toArray(),
    [patient.id]
  );

  const appointments = useLiveQuery(
    () => db.appointments.where('patientId').equals(patient.id).reverse().toArray(),
    [patient.id]
  );

  const prescriptions = useLiveQuery(
    () => db.prescriptions.where('patientId').equals(patient.id).reverse().toArray(),
    [patient.id]
  );

  // Check for critical medical conditions
  const hasCriticalConditions = patient.medicalHistory && (
    patient.medicalHistory.bloodThinners ||
    patient.medicalHistory.diabetes ||
    patient.medicalHistory.heartConditions ||
    patient.medicalHistory.communicableDiseases ||
    patient.medicalHistory.pregnancy
  );

  // Calculate total visits
  const totalVisits = appointments?.filter(apt => apt.status === 'Completed').length || 0;

  const formatPhone = (phone) => {
    if (phone.length === 11) {
      return `${phone.slice(0, 4)}-${phone.slice(4, 8)}-${phone.slice(8)}`;
    }
    return phone;
  };

  return (
    <div className="patient-profile">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <button className="edit-button" onClick={onEdit}>
          <Edit size={20} />
          Edit
        </button>
      </div>

      {/* Patient Info Section */}
      <div className="profile-info-card">
        <div className="profile-name-section">
          <h1>{patient.name}</h1>
          <span
            className="behavior-tag-large"
            style={{ backgroundColor: BEHAVIOR_TAG_COLORS[patient.behaviorTag] }}
          >
            {patient.behaviorTag}
          </span>
        </div>

        <div className="profile-meta">
          <div className="meta-item">
            <Phone size={18} />
            <span>{formatPhone(patient.phone)}</span>
          </div>
          <div className="meta-item">
            <Calendar size={18} />
            <span>{patient.age} years • {patient.gender}</span>
          </div>
          {patient.address && (
            <div className="meta-item">
              <MapPin size={18} />
              <span>{patient.address}</span>
            </div>
          )}
          {patient.occupation && (
            <div className="meta-item">
              <Briefcase size={18} />
              <span>{patient.occupation}</span>
            </div>
          )}
        </div>

        {/* Medical Alert */}
        {hasCriticalConditions && (
          <div className="medical-alert">
            <AlertTriangle size={20} />
            <div>
              <strong>MEDICAL ALERT:</strong>
              <ul>
                {patient.medicalHistory.bloodThinners && <li>Blood Thinners</li>}
                {patient.medicalHistory.diabetes && <li>Diabetes</li>}
                {patient.medicalHistory.heartConditions && <li>Heart Conditions</li>}
                {patient.medicalHistory.communicableDiseases && <li>Communicable Diseases</li>}
                {patient.medicalHistory.pregnancy && <li>Pregnancy</li>}
              </ul>
            </div>
          </div>
        )}

        {/* Allergies */}
        {patient.medicalHistory?.allergies && (
          <div className="allergies-alert">
            <AlertTriangle size={18} />
            <span>Allergies: {patient.medicalHistory.allergies}</span>
          </div>
        )}

        {/* Outstanding Balance */}
        {patient.outstandingBalance > 0 && (
          <div className="balance-alert-large">
            <DollarSign size={20} />
            <div>
              <strong>Outstanding Balance:</strong>
              <span className="balance-amount">Rs. {patient.outstandingBalance.toLocaleString()}</span>
            </div>
            <button className="btn-small" onClick={onSendReminder}>
              <MessageSquare size={16} />
              Send Payment Reminder
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-button" onClick={onBookAppointment}>
          <Calendar size={20} />
          Book Appointment
        </button>
        <button className="action-button" onClick={onAddTreatment}>
          <Activity size={20} />
          Add Treatment
        </button>
        <button className="action-button" onClick={() => alert('Prescription feature - Module 4')}>
          <FileText size={20} />
          Prescription
        </button>
        <button className="action-button" onClick={onSendReminder}>
          <MessageSquare size={20} />
          WhatsApp
        </button>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'treatments' ? 'active' : ''}`}
          onClick={() => setActiveTab('treatments')}
        >
          Treatments ({treatments?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments ({appointments?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          Medical History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">Rs. {patient.totalSpent?.toLocaleString() || '0'}</div>
                <div className="stat-label">Total Spent</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{totalVisits}</div>
                <div className="stat-label">Total Visits</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {patient.lastVisit
                    ? format(new Date(patient.lastVisit), 'MMM dd, yyyy')
                    : 'Never'}
                </div>
                <div className="stat-label">Last Visit</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">Rs. {patient.outstandingBalance?.toLocaleString() || '0'}</div>
                <div className="stat-label">Outstanding</div>
              </div>
            </div>

            {patient.notes && (
              <div className="notes-section">
                <h3>Private Notes</h3>
                <p>{patient.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'treatments' && (
          <div className="treatments-list">
            {treatments && treatments.length > 0 ? (
              treatments.map(treatment => (
                <div key={treatment.id} className="treatment-item">
                  <div className="treatment-date">
                    {format(new Date(treatment.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="treatment-details">
                    <div className="treatment-total">Rs. {treatment.total.toLocaleString()}</div>
                    <div className="treatment-status">
                      <span className={`status-badge ${treatment.status.toLowerCase()}`}>
                        {treatment.status}
                      </span>
                    </div>
                    {treatment.balance > 0 && (
                      <div className="treatment-balance">Balance: Rs. {treatment.balance.toLocaleString()}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-tab">No treatments recorded yet</div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="appointments-list">
            {appointments && appointments.length > 0 ? (
              appointments.map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-date">
                    {format(new Date(appointment.date), 'MMM dd, yyyy')} • {appointment.time}
                  </div>
                  <div className="appointment-reason">{appointment.reason || 'General checkup'}</div>
                  <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-tab">No appointments yet</div>
            )}
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="medical-history-content">
            <h3>Conditions</h3>
            <div className="conditions-list">
              <div className="condition-item">
                <span>Blood Thinners:</span>
                <strong>{patient.medicalHistory?.bloodThinners ? 'Yes' : 'No'}</strong>
              </div>
              <div className="condition-item">
                <span>Diabetes:</span>
                <strong>{patient.medicalHistory?.diabetes ? 'Yes' : 'No'}</strong>
              </div>
              <div className="condition-item">
                <span>Heart Conditions:</span>
                <strong>{patient.medicalHistory?.heartConditions ? 'Yes' : 'No'}</strong>
              </div>
              <div className="condition-item">
                <span>Communicable Diseases:</span>
                <strong>{patient.medicalHistory?.communicableDiseases ? 'Yes' : 'No'}</strong>
              </div>
              {patient.gender === 'Female' && (
                <div className="condition-item">
                  <span>Pregnancy:</span>
                  <strong>{patient.medicalHistory?.pregnancy ? 'Yes' : 'No'}</strong>
                </div>
              )}
            </div>

            {patient.medicalHistory?.allergies && (
              <div className="medical-section">
                <h3>Allergies</h3>
                <p className="allergy-text">{patient.medicalHistory.allergies}</p>
              </div>
            )}

            {patient.medicalHistory?.otherConditions && (
              <div className="medical-section">
                <h3>Other Conditions</h3>
                <p>{patient.medicalHistory.otherConditions}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
