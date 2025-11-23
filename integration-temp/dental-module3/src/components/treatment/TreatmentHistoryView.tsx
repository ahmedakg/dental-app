// Module 3: Treatment History Component
// Display complete treatment history for a patient

import React, { useState } from 'react';
import { TreatmentHistory } from '../types/treatment';
import { formatTeethList } from '../data/toothChart';

interface TreatmentHistoryViewProps {
  patientId: string;
  patientName: string;
  history: TreatmentHistory[];
  onAddNote: (historyId: string, note: string) => void;
}

export const TreatmentHistoryView: React.FC<TreatmentHistoryViewProps> = ({
  patientId,
  patientName,
  history,
  onAddNote
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'treatment'>('date');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Get unique years from history
  const years = Array.from(
    new Set(
      history.map(h => new Date(h.date).getFullYear().toString())
    )
  ).sort((a, b) => Number(b) - Number(a));

  // Filter and sort history
  const filteredHistory = history
    .filter(h => filterYear === 'all' || new Date(h.date).getFullYear().toString() === filterYear)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.treatmentName.localeCompare(b.treatmentName);
      }
    });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getTotalTreatments = () => history.length;
  const getTotalAmount = () => history.reduce((sum, h) => sum + h.amount, 0);
  const getTotalPaid = () => history.filter(h => h.paid).reduce((sum, h) => sum + h.amount, 0);

  return (
    <div className="treatment-history-view">
      <div className="history-header">
        <h2>Treatment History - {patientName}</h2>
        <div className="history-stats">
          <div className="stat">
            <span>Total Treatments:</span>
            <strong>{getTotalTreatments()}</strong>
          </div>
          <div className="stat">
            <span>Total Amount:</span>
            <strong>Rs. {getTotalAmount().toLocaleString()}</strong>
          </div>
          <div className="stat">
            <span>Total Paid:</span>
            <strong>Rs. {getTotalPaid().toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="history-controls">
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="year-filter"
        >
          <option value="all">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'treatment')}
          className="sort-select"
        >
          <option value="date">Sort by Date (Newest First)</option>
          <option value="treatment">Sort by Treatment Name</option>
        </select>

        <button className="export-btn">
          📄 Export History
        </button>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="empty-history">
          <p>No treatment history found</p>
          {filterYear !== 'all' && (
            <p className="hint">Try selecting a different year or "All Years"</p>
          )}
        </div>
      ) : (
        <div className="history-timeline">
          {filteredHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-header">
                <div className="history-date">
                  📅 {formatDate(item.date)}
                </div>
                <div className="history-status">
                  {item.paid ? (
                    <span className="status-paid">✓ Paid</span>
                  ) : (
                    <span className="status-unpaid">⚠️ Unpaid</span>
                  )}
                  {item.followUpRequired && (
                    <span className="status-followup">🔔 Follow-up</span>
                  )}
                </div>
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="expand-btn"
                >
                  {expandedItems.has(item.id) ? '▼' : '▶'}
                </button>
              </div>

              <div className="history-item-body">
                <div className="treatment-summary">
                  <strong>{item.treatmentName}</strong>
                  <span className="treatment-id">ID: {item.treatmentId}</span>
                </div>

                {item.teeth.length > 0 && (
                  <div className="treated-teeth">
                    🦷 Teeth: {formatTeethList(item.teeth)}
                  </div>
                )}

                <div className="treatment-provider">
                  👨‍⚕️ Performed by: {item.performedBy}
                </div>

                <div className="treatment-amount">
                  Amount: Rs. {item.amount.toLocaleString()}
                </div>

                {expandedItems.has(item.id) && (
                  <div className="history-details">
                    {item.notes && (
                      <div className="detail-section">
                        <strong>Notes:</strong>
                        <p>{item.notes}</p>
                      </div>
                    )}

                    {item.complications && (
                      <div className="detail-section complications">
                        <strong>⚠️ Complications:</strong>
                        <p>{item.complications}</p>
                      </div>
                    )}

                    {item.followUpRequired && item.followUpDate && (
                      <div className="detail-section followup">
                        <strong>Follow-up Scheduled:</strong>
                        <p>📅 {formatDate(item.followUpDate)}</p>
                      </div>
                    )}

                    {item.beforePhotos && item.beforePhotos.length > 0 && (
                      <div className="detail-section photos">
                        <strong>Before Photos:</strong>
                        <div className="photo-grid">
                          {item.beforePhotos.map((photo, idx) => (
                            <img key={idx} src={photo} alt={`Before ${idx + 1}`} />
                          ))}
                        </div>
                      </div>
                    )}

                    {item.afterPhotos && item.afterPhotos.length > 0 && (
                      <div className="detail-section photos">
                        <strong>After Photos:</strong>
                        <div className="photo-grid">
                          {item.afterPhotos.map((photo, idx) => (
                            <img key={idx} src={photo} alt={`After ${idx + 1}`} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="detail-actions">
                      <button className="btn-secondary">
                        📝 Add Note
                      </button>
                      <button className="btn-secondary">
                        📸 Add Photo
                      </button>
                      <button className="btn-secondary">
                        🖨️ Print Record
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
