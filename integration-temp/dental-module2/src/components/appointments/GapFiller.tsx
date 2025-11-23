// Module 2: Gap Filler Component
// Smart revenue optimization - suggests patients for empty slots

import React, { useState, useEffect } from 'react';
import { Appointment, GapFillerSuggestion } from '../types/appointments';
import {
  getNextAvailableSlot,
  generateWhatsAppMessage,
  sendWhatsAppMessage,
  format24To12,
  generateTimeSlots
} from '../utils/appointmentUtils';

interface GapFillerProps {
  currentDate: string;
  appointments: Appointment[];
  onClose: () => void;
  onBookSlot: (time: string, date: string) => void;
}

const GapFiller: React.FC<GapFillerProps> = ({
  currentDate,
  appointments,
  onClose,
  onBookSlot
}) => {
  const [suggestions, setSuggestions] = useState<GapFillerSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [emptySlots, setEmptySlots] = useState<string[]>([]);

  useEffect(() => {
    loadSuggestions();
  }, [currentDate, appointments]);

  const loadSuggestions = async () => {
    setLoading(true);
    
    try {
      // Find empty slots
      const allSlots = generateTimeSlots();
      const occupied = appointments.map(apt => apt.time);
      const empty = allSlots
        .filter(slot => {
          const timeStr = format24To12(slot.display);
          const time24 = `${slot.hour.toString().padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}`;
          return !occupied.includes(time24);
        })
        .map(slot => slot.display);
      
      setEmptySlots(empty);
      
      // TODO: Integrate with Module 1 and Module 3 (Treatment Planning)
      // to find patients with:
      // 1. Pending treatments
      // 2. High priority
      // 3. Last visited more than 2 weeks ago
      
      // For now, using mock data
      const mockSuggestions: GapFillerSuggestion[] = [
        {
          patientId: 'pat_001',
          patientName: 'Ali Ahmed',
          patientPhone: '0321-1234567',
          pendingTreatment: 'Root Canal (Tooth #36)',
          lastVisit: '2024-11-05',
          availableSlot: empty[0] || 'No slots',
          priority: 9
        },
        {
          patientId: 'pat_002',
          patientName: 'Fatima Khan',
          patientPhone: '0333-9876543',
          pendingTreatment: 'Filling (Tooth #16)',
          lastVisit: '2024-11-10',
          availableSlot: empty[1] || 'No slots',
          priority: 7
        },
        {
          patientId: 'pat_003',
          patientName: 'Imran Shah',
          patientPhone: '0345-5551234',
          pendingTreatment: 'Crown (Tooth #46)',
          lastVisit: '2024-10-28',
          availableSlot: empty[2] || 'No slots',
          priority: 8
        }
      ];
      
      setSuggestions(mockSuggestions.filter(s => s.availableSlot !== 'No slots'));
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = (suggestion: GapFillerSuggestion) => {
    const message = generateWhatsAppMessage(
      suggestion.patientName,
      suggestion.availableSlot,
      suggestion.pendingTreatment
    );
    sendWhatsAppMessage(suggestion.patientPhone, message);
  };

  const handleQuickBook = (suggestion: GapFillerSuggestion) => {
    const time24 = suggestion.availableSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (time24) {
      let hour = parseInt(time24[1]);
      const minute = time24[2];
      const period = time24[3].toUpperCase();
      
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute}`;
      onBookSlot(timeStr, currentDate);
      onClose();
    }
  };

  const getDaysSinceVisit = (lastVisit: string): number => {
    const last = new Date(lastVisit);
    const today = new Date();
    const diff = today.getTime() - last.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (priority: number): string => {
    if (priority >= 8) return '#ef4444'; // red - high
    if (priority >= 6) return '#f59e0b'; // orange - medium
    return '#10b981'; // green - low
  };

  return (
    <div className="gap-filler-panel">
      <div className="gap-filler-header">
        <div className="header-content">
          <h3>💡 Smart Gap Filler</h3>
          <p className="subtitle">Fill empty slots and maximize revenue</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="empty-slots-summary">
        <div className="summary-card">
          <span className="summary-value">{emptySlots.length}</span>
          <span className="summary-label">Empty Slots Today</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{suggestions.length}</span>
          <span className="summary-label">Quick Win Opportunities</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Finding opportunities...</p>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="empty-state">
          <p>🎉 No pending treatments or all slots filled!</p>
          <p className="hint">Great job keeping the schedule packed.</p>
        </div>
      ) : (
        <div className="suggestions-list">
          {suggestions.map(suggestion => (
            <div key={suggestion.patientId} className="suggestion-card">
              <div className="suggestion-header">
                <div className="patient-info">
                  <h4>{suggestion.patientName}</h4>
                  <span className="phone">{suggestion.patientPhone}</span>
                </div>
                <div 
                  className="priority-badge"
                  style={{ background: getPriorityColor(suggestion.priority) }}
                >
                  P{suggestion.priority}
                </div>
              </div>

              <div className="suggestion-body">
                <div className="treatment-info">
                  <span className="label">Pending:</span>
                  <span className="treatment">{suggestion.pendingTreatment}</span>
                </div>

                <div className="visit-info">
                  <span className="label">Last visit:</span>
                  <span className="days">
                    {getDaysSinceVisit(suggestion.lastVisit)} days ago
                  </span>
                </div>

                <div className="slot-info">
                  <span className="label">Suggested slot:</span>
                  <span className="slot">{suggestion.availableSlot}</span>
                </div>
              </div>

              <div className="suggestion-actions">
                <button
                  className="btn-whatsapp"
                  onClick={() => handleSendWhatsApp(suggestion)}
                >
                  💬 Send WhatsApp
                </button>
                <button
                  className="btn-quick-book"
                  onClick={() => handleQuickBook(suggestion)}
                >
                  📅 Quick Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {emptySlots.length > 0 && (
        <div className="available-slots">
          <h4>All Available Slots Today:</h4>
          <div className="slots-grid">
            {emptySlots.map(slot => (
              <div key={slot} className="slot-chip">
                {slot}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="gap-filler-tips">
        <h4>💰 Revenue Tips:</h4>
        <ul>
          <li>Contact VIP patients first for better conversion</li>
          <li>Bundle treatments to fill longer gaps</li>
          <li>Evening slots (7-9 PM) work best for working professionals</li>
          <li>Track which messages get the best response rate</li>
        </ul>
      </div>
    </div>
  );
};

export default GapFiller;
