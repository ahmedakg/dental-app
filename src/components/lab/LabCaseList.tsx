// Module 6: Lab Work Tracking - Case List Component
// Abdullah Dental Care Management System

import React from 'react';
import { LabCase, LabCaseStatus, STATUS_COLORS, STATUS_LABELS } from '../types/lab';
import { 
  formatDate, 
  formatDateRelative, 
  formatCurrency, 
  formatTeethNumbers, 
  isOverdue, 
  getDaysUntilReturn,
  getDaysInLab,
  getStatusProgress 
} from '../utils/labHelpers';

interface LabCaseListProps {
  cases: LabCase[];
  onUpdateStatus: (caseId: string, status: LabCaseStatus) => void;
  onEdit: (labCase: LabCase) => void;
  onDelete: (caseId: string) => void;
}

const LabCaseList: React.FC<LabCaseListProps> = ({ 
  cases, 
  onUpdateStatus, 
  onEdit, 
  onDelete 
}) => {
  const handleStatusChange = (caseId: string, currentStatus: LabCaseStatus) => {
    const statusFlow: Record<LabCaseStatus, LabCaseStatus> = {
      sent: 'in_progress',
      in_progress: 'returned',
      returned: 'delivered',
      delivered: 'delivered' // no change
    };

    const nextStatus = statusFlow[currentStatus];
    if (nextStatus !== currentStatus) {
      onUpdateStatus(caseId, nextStatus);
    }
  };

  const getStatusButton = (labCase: LabCase) => {
    const statusActions: Record<LabCaseStatus, string> = {
      sent: 'Mark In Progress',
      in_progress: 'Mark Returned',
      returned: 'Mark Delivered',
      delivered: '✓ Delivered'
    };

    return (
      <button
        className={`btn-status status-${labCase.status}`}
        onClick={() => handleStatusChange(labCase.id, labCase.status)}
        disabled={labCase.status === 'delivered'}
      >
        {statusActions[labCase.status]}
      </button>
    );
  };

  return (
    <div className="lab-case-list">
      {cases.map(labCase => {
        const overdue = isOverdue(labCase.expectedReturnDate, labCase.status);
        const daysUntilReturn = getDaysUntilReturn(labCase.expectedReturnDate);
        const daysInLab = getDaysInLab(labCase.dateSent, labCase.actualReturnDate);
        const progress = getStatusProgress(labCase.status);

        return (
          <div key={labCase.id} className={`lab-case-card ${overdue ? 'overdue' : ''}`}>
            <div className="case-header">
              <div className="case-number">
                <span className="case-id">{labCase.caseNumber}</span>
                <span 
                  className="case-status-badge"
                  style={{ backgroundColor: STATUS_COLORS[labCase.status] }}
                >
                  {STATUS_LABELS[labCase.status]}
                </span>
              </div>
              <div className="case-actions">
                <button 
                  className="btn-icon btn-edit"
                  onClick={() => onEdit(labCase)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  className="btn-icon btn-delete"
                  onClick={() => onDelete(labCase.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="case-body">
              <div className="case-info-grid">
                <div className="info-item">
                  <span className="info-label">Patient:</span>
                  <span className="info-value">{labCase.patientName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{labCase.patientPhone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Job:</span>
                  <span className="info-value">{labCase.jobDescription}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Teeth:</span>
                  <span className="info-value">{formatTeethNumbers(labCase.teethNumbers)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Lab:</span>
                  <span className="info-value">{labCase.labName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Charges:</span>
                  <span className="info-value charges">{formatCurrency(labCase.totalCharges)}</span>
                </div>
              </div>

              <div className="case-timeline">
                <div className="timeline-item">
                  <span className="timeline-label">Sent:</span>
                  <span className="timeline-value">{formatDate(labCase.dateSent)}</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">Expected:</span>
                  <span className={`timeline-value ${overdue ? 'overdue-text' : ''}`}>
                    {formatDateRelative(labCase.expectedReturnDate)}
                    {overdue && <span className="overdue-badge">OVERDUE</span>}
                  </span>
                </div>
                {labCase.actualReturnDate && (
                  <div className="timeline-item">
                    <span className="timeline-label">Returned:</span>
                    <span className="timeline-value">{formatDate(labCase.actualReturnDate)}</span>
                  </div>
                )}
                {labCase.dateDelivered && (
                  <div className="timeline-item">
                    <span className="timeline-label">Delivered:</span>
                    <span className="timeline-value">{formatDate(labCase.dateDelivered)}</span>
                  </div>
                )}
              </div>

              <div className="case-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: STATUS_COLORS[labCase.status]
                    }}
                  />
                </div>
                <div className="progress-info">
                  {labCase.status !== 'delivered' && (
                    <span className="days-info">
                      {labCase.status === 'sent' || labCase.status === 'in_progress' ? (
                        overdue ? 
                          `${Math.abs(daysUntilReturn)} days overdue` :
                          `${daysUntilReturn} days until return`
                      ) : (
                        `${daysInLab} days in lab`
                      )}
                    </span>
                  )}
                  {labCase.status === 'delivered' && (
                    <span className="days-info">Completed in {daysInLab} days</span>
                  )}
                </div>
              </div>

              {labCase.notes && (
                <div className="case-notes">
                  <strong>Notes:</strong> {labCase.notes}
                </div>
              )}
            </div>

            <div className="case-footer">
              {getStatusButton(labCase)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LabCaseList;
