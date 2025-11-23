// Module 6: Lab Work Tracking - Statistics Component
// Abdullah Dental Care Management System

import React from 'react';
import { formatCurrency } from '../utils/labHelpers';

interface StatisticsData {
  total: number;
  sent: number;
  inProgress: number;
  returned: number;
  delivered: number;
  overdue: number;
  totalCharges: number;
  unpaidAmount: number;
  averageCost: number;
}

interface LabStatisticsProps {
  statistics: StatisticsData;
}

const LabStatistics: React.FC<LabStatisticsProps> = ({ statistics }) => {
  return (
    <div className="lab-statistics">
      <div className="stat-card stat-total">
        <div className="stat-icon">🧪</div>
        <div className="stat-content">
          <div className="stat-value">{statistics.total}</div>
          <div className="stat-label">Total Cases</div>
        </div>
      </div>

      <div className="stat-card stat-active">
        <div className="stat-icon">🔄</div>
        <div className="stat-content">
          <div className="stat-value">{statistics.sent + statistics.inProgress}</div>
          <div className="stat-label">Active Cases</div>
          <div className="stat-breakdown">
            {statistics.sent} sent, {statistics.inProgress} in progress
          </div>
        </div>
      </div>

      <div className="stat-card stat-returned">
        <div className="stat-icon">📦</div>
        <div className="stat-content">
          <div className="stat-value">{statistics.returned}</div>
          <div className="stat-label">Awaiting Delivery</div>
        </div>
      </div>

      <div className="stat-card stat-delivered">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-value">{statistics.delivered}</div>
          <div className="stat-label">Delivered</div>
        </div>
      </div>

      {statistics.overdue > 0 && (
        <div className="stat-card stat-overdue">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{statistics.overdue}</div>
            <div className="stat-label">Overdue Cases</div>
          </div>
        </div>
      )}

      <div className="stat-card stat-charges">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <div className="stat-value">{formatCurrency(statistics.totalCharges)}</div>
          <div className="stat-label">Total Lab Charges</div>
          <div className="stat-breakdown">
            Avg: {formatCurrency(statistics.averageCost)} per case
          </div>
        </div>
      </div>

      {statistics.unpaidAmount > 0 && (
        <div className="stat-card stat-unpaid">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(statistics.unpaidAmount)}</div>
            <div className="stat-label">Unpaid Charges</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabStatistics;
