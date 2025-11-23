// Module 3: Main Treatment Management Component
// Central hub for all treatment planning features

import React, { useState, useEffect } from 'react';
import { TreatmentPlanBuilder } from './TreatmentPlanBuilder';
import { PendingTreatmentsTracker } from './PendingTreatmentsTracker';
import { TreatmentHistoryView } from './TreatmentHistoryView';
import { TreatmentPlan, TreatmentHistory } from '../types/treatment';
import { TreatmentDB } from '../utils/treatmentDB';

interface TreatmentManagementProps {
  currentPatientId?: string;
  currentPatientName?: string;
  onBack?: () => void;
}

type ViewMode = 'pending' | 'create' | 'history';

export const TreatmentManagement: React.FC<TreatmentManagementProps> = ({
  currentPatientId,
  currentPatientName,
  onBack
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('pending');
  const [allPlans, setAllPlans] = useState<TreatmentPlan[]>([]);
  const [currentHistory, setCurrentHistory] = useState<TreatmentHistory[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(currentPatientId);
  const [selectedPatientName, setSelectedPatientName] = useState<string | undefined>(currentPatientName);
  const [isLoading, setIsLoading] = useState(true);

  // Load all treatment plans on mount
  useEffect(() => {
    loadTreatmentPlans();
  }, []);

  // Load patient history when patient is selected
  useEffect(() => {
    if (selectedPatientId && viewMode === 'history') {
      loadPatientHistory(selectedPatientId);
    }
  }, [selectedPatientId, viewMode]);

  const loadTreatmentPlans = async () => {
    try {
      setIsLoading(true);
      const plans = await TreatmentDB.plans.getAll();
      setAllPlans(plans);
    } catch (error) {
      console.error('Error loading treatment plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPatientHistory = async (patientId: string) => {
    try {
      const history = await TreatmentDB.history.getByPatient(patientId);
      setCurrentHistory(history);
    } catch (error) {
      console.error('Error loading treatment history:', error);
    }
  };

  const handleSavePlan = async (plan: TreatmentPlan) => {
    try {
      await TreatmentDB.plans.save(plan);
      await loadTreatmentPlans();
      
      // Show success message
      alert(`Treatment plan saved successfully for ${plan.patientName}!`);
      
      // Switch to pending view
      setViewMode('pending');
    } catch (error) {
      console.error('Error saving treatment plan:', error);
      alert('Error saving treatment plan. Please try again.');
    }
  };

  const handleSelectPatient = (patientId: string) => {
    const plan = allPlans.find(p => p.patientId === patientId);
    if (plan) {
      setSelectedPatientId(patientId);
      setSelectedPatientName(plan.patientName);
      setViewMode('history');
    }
  };

  const handleMarkComplete = async (planId: string, itemId: string) => {
    try {
      // Get the plan
      const plan = allPlans.find(p => p.id === planId);
      if (!plan) return;

      // Find the item
      const item = plan.items.find(i => i.id === itemId);
      if (!item) return;

      // Create treatment history entry
      const historyEntry: TreatmentHistory = {
        id: `history-${Date.now()}`,
        patientId: plan.patientId,
        treatmentPlanId: planId,
        treatmentId: item.treatmentId,
        treatmentName: item.treatment.name,
        teeth: item.teeth,
        date: new Date().toISOString(),
        performedBy: 'Dr. Ahmed Abdullah',
        notes: item.notes,
        amount: item.totalPrice,
        paid: false,
        followUpRequired: false
      };

      await TreatmentDB.history.save(historyEntry);

      // Update tooth chart if teeth involved
      if (item.teeth.length > 0) {
        for (const toothNumber of item.teeth) {
          await TreatmentDB.charts.updateTooth(plan.patientId, toothNumber, 'treated');
        }
      }

      // Remove item from plan
      const updatedItems = plan.items.filter(i => i.id !== itemId);
      plan.items = updatedItems;
      
      // Recalculate totals
      plan.totalAmount = updatedItems.reduce((sum, i) => sum + i.totalPrice, 0);
      plan.remainingAmount = plan.totalAmount - plan.paidAmount;
      plan.updatedAt = new Date().toISOString();

      // If no items left, mark plan as completed
      if (updatedItems.length === 0) {
        plan.status = 'completed';
      }

      await TreatmentDB.plans.save(plan);
      await loadTreatmentPlans();

      alert('Treatment marked as completed!');
    } catch (error) {
      console.error('Error marking treatment as complete:', error);
      alert('Error completing treatment. Please try again.');
    }
  };

  const handleSendReminder = async (patientId: string, planId: string) => {
    const plan = allPlans.find(p => p.id === planId);
    if (!plan) return;

    // Calculate reminder message
    const urgentCount = plan.items.filter(i => i.priority === 'urgent').length;
    const totalAmount = plan.remainingAmount;

    const message = `
Dear ${plan.patientName},

This is a friendly reminder from Abdullah Dental Care about your pending treatments.

You have ${plan.items.length} pending treatment(s)${urgentCount > 0 ? ` (${urgentCount} urgent)` : ''}.
Remaining amount: Rs. ${totalAmount.toLocaleString()}

Please contact us to schedule your next appointment.

Best regards,
Dr. Ahmed Abdullah Khan Gandapur
Abdullah Dental Care, Hayatabad
    `.trim();

    // Use OS share menu (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Treatment Reminder',
          text: message
        });
      } catch (error) {
        console.error('Error sharing:', error);
        fallbackCopyToClipboard(message);
      }
    } else {
      fallbackCopyToClipboard(message);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Reminder message copied to clipboard! You can now paste it in WhatsApp.');
    }).catch(err => {
      console.error('Error copying to clipboard:', err);
      alert('Unable to copy message. Please try again.');
    });
  };

  const handleAddNote = async (historyId: string, note: string) => {
    try {
      const history = await TreatmentDB.history.getById(historyId);
      if (history) {
        history.notes = history.notes ? `${history.notes}\n\n${note}` : note;
        await TreatmentDB.history.save(history);
        
        if (selectedPatientId) {
          await loadPatientHistory(selectedPatientId);
        }
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleCreateNewPlan = () => {
    if (!currentPatientId || !currentPatientName) {
      alert('Please select a patient first');
      return;
    }
    
    setSelectedPatientId(currentPatientId);
    setSelectedPatientName(currentPatientName);
    setViewMode('create');
  };

  return (
    <div className="treatment-management">
      {/* Navigation Header */}
      <div className="treatment-nav">
        {onBack && (
          <button onClick={onBack} className="back-btn">
            ← Back
          </button>
        )}
        
        <div className="nav-tabs">
          <button
            className={viewMode === 'pending' ? 'active' : ''}
            onClick={() => setViewMode('pending')}
          >
            💰 Pending Treatments
          </button>
          
          <button
            className={viewMode === 'create' ? 'active' : ''}
            onClick={handleCreateNewPlan}
          >
            ➕ Create Plan
          </button>
          
          <button
            className={viewMode === 'history' ? 'active' : ''}
            onClick={() => setViewMode('history')}
            disabled={!selectedPatientId}
          >
            📋 History
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="treatment-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading treatment data...</p>
          </div>
        ) : (
          <>
            {viewMode === 'pending' && (
              <PendingTreatmentsTracker
                allPlans={allPlans}
                onSelectPatient={handleSelectPatient}
                onMarkComplete={handleMarkComplete}
                onSendReminder={handleSendReminder}
              />
            )}

            {viewMode === 'create' && selectedPatientId && selectedPatientName && (
              <TreatmentPlanBuilder
                patientId={selectedPatientId}
                patientName={selectedPatientName}
                onSave={handleSavePlan}
              />
            )}

            {viewMode === 'history' && selectedPatientId && selectedPatientName && (
              <TreatmentHistoryView
                patientId={selectedPatientId}
                patientName={selectedPatientName}
                history={currentHistory}
                onAddNote={handleAddNote}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
