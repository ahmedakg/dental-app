// Module 3: Pending Treatments Tracker
// Track all pending treatments across all patients - "Revenue Machine"

import React, { useState, useMemo } from 'react';
import { TreatmentPlan, TreatmentPlanItem } from '../types/treatment';
import { formatTeethList } from '../data/toothChart';

interface PendingTreatmentsTrackerProps {
  allPlans: TreatmentPlan[];
  onSelectPatient: (patientId: string) => void;
  onMarkComplete: (planId: string, itemId: string) => void;
  onSendReminder: (patientId: string, planId: string) => void;
}

type SortField = 'patient' | 'priority' | 'amount' | 'date';
type FilterPriority = 'all' | 'urgent' | 'high' | 'medium' | 'low';

export const PendingTreatmentsTracker: React.FC<PendingTreatmentsTrackerProps> = ({
  allPlans,
  onSelectPatient,
  onMarkComplete,
  onSendReminder
}) => {
  const [sortBy, setSortBy] = useState<SortField>('priority');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());

  // Extract all pending items from all plans
  const pendingItems = useMemo(() => {
    const items: Array<{
      plan: TreatmentPlan;
      item: TreatmentPlanItem;
    }> = [];

    allPlans
      .filter(plan => plan.status === 'pending' || plan.status === 'in-progress')
      .forEach(plan => {
        plan.items.forEach(item => {
          items.push({ plan, item });
        });
      });

    return items;
  }, [allPlans]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const total = pendingItems.reduce((sum, { item }) => sum + item.totalPrice, 0);
    const urgent = pendingItems.filter(({ item }) => item.priority === 'urgent').length;
    const patients = new Set(pendingItems.map(({ plan }) => plan.patientId)).size;
    
    return {
      totalRevenue: total,
      urgentCount: urgent,
      patientCount: patients,
      itemCount: pendingItems.length
    };
  }, [pendingItems]);

  // Filter and sort pending items
  const filteredItems = useMemo(() => {
    let filtered = pendingItems;

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(({ item }) => item.priority === filterPriority);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(({ plan, item }) =>
        plan.patientName.toLowerCase().includes(query) ||
        item.treatment.name.toLowerCase().includes(query) ||
        item.treatment.code.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'patient':
          return a.plan.patientName.localeCompare(b.plan.patientName);
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.item.priority] - priorityOrder[b.item.priority];
        case 'amount':
          return b.item.totalPrice - a.item.totalPrice;
        case 'date':
          return new Date(a.plan.createdAt).getTime() - new Date(b.plan.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [pendingItems, filterPriority, searchQuery, sortBy]);

  // Group by patient
  const groupedByPatient = useMemo(() => {
    const groups = new Map<string, typeof filteredItems>();
    
    filteredItems.forEach(item => {
      const patientId = item.plan.patientId;
      if (!groups.has(patientId)) {
        groups.set(patientId, []);
      }
      groups.get(patientId)!.push(item);
    });

    return groups;
  }, [filteredItems]);

  const togglePlanExpanded = (planId: string) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
    } else {
      newExpanded.add(planId);
    }
    setExpandedPlans(newExpanded);
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🔵';
      case 'low': return '⚪';
      default: return '⚪';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div className="pending-treatments-tracker">
      <div className="tracker-header">
        <h2>💰 Pending Treatments - Revenue Machine</h2>
        <div className="revenue-stats">
          <div className="stat-card total-revenue">
            <span className="stat-label">Total Pending Revenue</span>
            <span className="stat-value">Rs. {stats.totalRevenue.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Items</span>
            <span className="stat-value">{stats.itemCount}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Patients</span>
            <span className="stat-value">{stats.patientCount}</span>
          </div>
          <div className="stat-card urgent">
            <span className="stat-label">🔴 Urgent</span>
            <span className="stat-value">{stats.urgentCount}</span>
          </div>
        </div>
      </div>

      <div className="tracker-controls">
        <input
          type="text"
          placeholder="🔍 Search patient or treatment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
          className="priority-filter"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">🔴 Urgent Only</option>
          <option value="high">🟠 High Priority</option>
          <option value="medium">🔵 Medium Priority</option>
          <option value="low">⚪ Low Priority</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortField)}
          className="sort-select"
        >
          <option value="priority">Sort by Priority</option>
          <option value="amount">Sort by Amount</option>
          <option value="patient">Sort by Patient</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <p>🎉 No pending treatments found!</p>
          {searchQuery && <p className="hint">Try adjusting your search or filters</p>}
        </div>
      ) : (
        <div className="pending-list">
          {Array.from(groupedByPatient.entries()).map(([patientId, items]) => {
            const firstPlan = items[0].plan;
            const patientTotal = items.reduce((sum, { item }) => sum + item.totalPrice, 0);
            
            return (
              <div key={patientId} className="patient-group">
                <div className="patient-group-header">
                  <div className="patient-info">
                    <strong 
                      onClick={() => onSelectPatient(patientId)}
                      className="patient-name-link"
                    >
                      {firstPlan.patientName}
                    </strong>
                    <span className="patient-stats">
                      {items.length} pending items • Rs. {patientTotal.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onSendReminder(patientId, firstPlan.id)}
                    className="reminder-btn"
                  >
                    📱 Send Reminder
                  </button>
                </div>

                <div className="patient-items">
                  {items.map(({ plan, item }) => (
                    <div key={`${plan.id}-${item.id}`} className="pending-item">
                      <div className="item-priority-badge" style={{ background: getPriorityColor(item.priority) }}>
                        {getPriorityIcon(item.priority)}
                      </div>

                      <div className="item-content">
                        <div className="item-main">
                          <strong>{item.treatment.name}</strong>
                          <span className="item-code">{item.treatment.code}</span>
                        </div>

                        {item.teeth.length > 0 && (
                          <div className="item-teeth">
                            🦷 {formatTeethList(item.teeth)}
                          </div>
                        )}

                        {item.notes && (
                          <div className="item-notes">
                            📝 {item.notes}
                          </div>
                        )}

                        <div className="item-meta">
                          <span>Qty: {item.quantity}</span>
                          {item.discount > 0 && (
                            <span className="discount-badge">-{item.discount}%</span>
                          )}
                          <span>Est. Sessions: {item.estimatedSessions}</span>
                        </div>
                      </div>

                      <div className="item-actions">
                        <div className="item-amount">
                          Rs. {item.totalPrice.toLocaleString()}
                        </div>
                        <button
                          onClick={() => onMarkComplete(plan.id, item.id)}
                          className="complete-btn"
                          title="Mark as completed"
                        >
                          ✓ Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="tracker-footer">
        <button className="export-btn">
          📊 Export to Excel
        </button>
        <button className="print-btn">
          🖨️ Print Report
        </button>
      </div>
    </div>
  );
};
