import { Phone, Calendar, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

export default function PatientCard({ patient, onClick }) {
  const hasBalance = patient.outstandingBalance > 0;
  const lastVisitText = patient.lastVisit
    ? formatDistanceToNow(new Date(patient.lastVisit), { addSuffix: true })
    : 'Never visited';

  return (
    <div className="patient-card" onClick={onClick}>
      <div className="patient-card-header">
        <h3>{patient.name}</h3>
        <span
          className="behavior-tag"
          style={{ backgroundColor: BEHAVIOR_TAG_COLORS[patient.behaviorTag] }}
        >
          {patient.behaviorTag}
        </span>
      </div>

      <div className="patient-card-info">
        <div className="info-row">
          <Phone size={16} />
          <span>{formatPhone(patient.phone)}</span>
        </div>
        <div className="info-row">
          <span className="patient-meta">
            {patient.age} years • {patient.gender}
          </span>
        </div>
        <div className="info-row">
          <Calendar size={16} />
          <span className="last-visit">{lastVisitText}</span>
        </div>
      </div>

      {hasBalance && (
        <div className="balance-alert">
          <AlertCircle size={16} />
          <span>Outstanding: Rs. {patient.outstandingBalance.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}

function formatPhone(phone) {
  // Format 03345822622 as 0334-5822-622
  if (phone.length === 11) {
    return `${phone.slice(0, 4)}-${phone.slice(4, 8)}-${phone.slice(8)}`;
  }
  return phone;
}
