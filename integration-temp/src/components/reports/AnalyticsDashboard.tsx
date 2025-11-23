// Module 7: Analytics Dashboard Component
// Abdullah Dental Care Management System

import React, { useState, useEffect, useMemo } from 'react';
import type {
  ReportType,
  DailySummary,
  RevenueBreakdown,
  PatientMetrics,
  AppointmentMetrics,
  TreatmentMetrics
} from '../types/analytics';
import {
  generateDailySummary,
  calculateRevenueBreakdown,
  calculatePatientMetrics,
  calculateAppointmentMetrics,
  calculateTreatmentMetrics,
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  getMonthName
} from '../utils/analytics';
import '../styles/analytics.css';

interface AnalyticsDashboardProps {
  patients: any[];
  appointments: any[];
  treatments: any[];
  treatmentPlans: any[];
  payments: any[];
  labCases: any[];
  prescriptions: any[];
  inventory?: any[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  patients,
  appointments,
  treatments,
  treatmentPlans,
  payments,
  labCases,
  prescriptions,
  inventory = []
}) => {
  const today = formatDate(new Date());
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [selectedDate, setSelectedDate] = useState(today);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Get date range based on report type
  const dateRange = useMemo(() => {
    const current = new Date(selectedDate);
    let start: Date, end: Date;

    switch (reportType) {
      case 'daily':
        start = new Date(current);
        end = new Date(current);
        break;
      case 'weekly':
        start = new Date(current);
        start.setDate(start.getDate() - start.getDay());
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        break;
      case 'monthly':
        start = new Date(current.getFullYear(), current.getMonth(), 1);
        end = new Date(current.getFullYear(), current.getMonth() + 1, 0);
        break;
      case 'yearly':
        start = new Date(current.getFullYear(), 0, 1);
        end = new Date(current.getFullYear(), 11, 31);
        break;
      case 'custom':
        start = customStartDate ? new Date(customStartDate) : new Date();
        end = customEndDate ? new Date(customEndDate) : new Date();
        break;
      default:
        start = new Date(current);
        end = new Date(current);
    }

    return {
      start: formatDate(start),
      end: formatDate(end),
      label: reportType === 'custom' 
        ? `${formatDate(start)} to ${formatDate(end)}`
        : reportType === 'yearly'
        ? current.getFullYear().toString()
        : reportType === 'monthly'
        ? `${getMonthName(current.getMonth() + 1)} ${current.getFullYear()}`
        : reportType === 'weekly'
        ? `Week of ${formatDate(start)}`
        : formatDate(current)
    };
  }, [reportType, selectedDate, customStartDate, customEndDate]);

  // Calculate all metrics
  const revenueMetrics = useMemo(() => 
    calculateRevenueBreakdown(payments, treatments),
    [payments, treatments]
  );

  const patientMetrics = useMemo(() =>
    calculatePatientMetrics(patients, appointments, dateRange.start, dateRange.end),
    [patients, appointments, dateRange]
  );

  const appointmentMetrics = useMemo(() =>
    calculateAppointmentMetrics(appointments, dateRange.start, dateRange.end),
    [appointments, dateRange]
  );

  const treatmentMetrics = useMemo(() =>
    calculateTreatmentMetrics(treatments, treatmentPlans),
    [treatments, treatmentPlans]
  );

  const dailySummary = useMemo(() =>
    generateDailySummary(
      selectedDate,
      patients,
      appointments,
      treatments,
      payments,
      labCases,
      prescriptions
    ),
    [selectedDate, patients, appointments, treatments, payments, labCases, prescriptions]
  );

  const handleExportPDF = () => {
    alert('PDF export functionality - integrate with your preferred PDF library (jsPDF, pdfmake, etc.)');
  };

  const handleExportExcel = () => {
    alert('Excel export functionality - integrate with xlsx library');
  };

  const handleExportCSV = () => {
    alert('CSV export functionality - will be implemented');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="analytics-dashboard">
      {/* Header with Controls */}
      <div className="analytics-header">
        <div className="analytics-title-section">
          <h2>📊 Analytics & Reports</h2>
          <p className="analytics-subtitle">{dateRange.label}</p>
        </div>

        <div className="analytics-controls">
          <div className="report-type-selector">
            <button
              className={reportType === 'daily' ? 'active' : ''}
              onClick={() => setReportType('daily')}
            >
              Daily
            </button>
            <button
              className={reportType === 'weekly' ? 'active' : ''}
              onClick={() => setReportType('weekly')}
            >
              Weekly
            </button>
            <button
              className={reportType === 'monthly' ? 'active' : ''}
              onClick={() => setReportType('monthly')}
            >
              Monthly
            </button>
            <button
              className={reportType === 'yearly' ? 'active' : ''}
              onClick={() => setReportType('yearly')}
            >
              Yearly
            </button>
            <button
              className={reportType === 'custom' ? 'active' : ''}
              onClick={() => setReportType('custom')}
            >
              Custom
            </button>
          </div>

          {reportType !== 'custom' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-picker"
            />
          )}

          {reportType === 'custom' && (
            <div className="custom-date-range">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                placeholder="Start Date"
              />
              <span>to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                placeholder="End Date"
              />
            </div>
          )}

          <div className="export-controls">
            <button
              className="export-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              📥 Export
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <button onClick={handleExportPDF}>📄 Export PDF</button>
                <button onClick={handleExportExcel}>📊 Export Excel</button>
                <button onClick={handleExportCSV}>📋 Export CSV</button>
                <button onClick={handlePrint}>🖨️ Print</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        {/* Revenue Card */}
        <div className="metric-card revenue-card">
          <div className="metric-header">
            <h3>💰 Revenue Overview</h3>
          </div>
          <div className="metric-body">
            <div className="metric-item primary">
              <span className="label">Collected</span>
              <span className="value">{formatCurrency(revenueMetrics.collected)}</span>
            </div>
            <div className="metric-item warning">
              <span className="label">Pending</span>
              <span className="value">{formatCurrency(revenueMetrics.pending)}</span>
            </div>
            <div className="metric-item danger">
              <span className="label">Outstanding (30+ days)</span>
              <span className="value">{formatCurrency(revenueMetrics.outstanding)}</span>
            </div>
            <div className="metric-item success">
              <span className="label">Projected (Plans)</span>
              <span className="value">{formatCurrency(revenueMetrics.projected)}</span>
            </div>
            <div className="metric-item total">
              <span className="label">Total Pipeline</span>
              <span className="value">
                {formatCurrency(revenueMetrics.collected + revenueMetrics.pending + revenueMetrics.projected)}
              </span>
            </div>
          </div>
        </div>

        {/* Patient Metrics Card */}
        <div className="metric-card patient-card">
          <div className="metric-header">
            <h3>👥 Patient Metrics</h3>
          </div>
          <div className="metric-body">
            <div className="metric-item">
              <span className="label">Total Active</span>
              <span className="value">{patientMetrics.totalActive}</span>
            </div>
            <div className="metric-item">
              <span className="label">New This Month</span>
              <span className="value success">{patientMetrics.newThisMonth}</span>
            </div>
            <div className="metric-item">
              <span className="label">Returning This Month</span>
              <span className="value">{patientMetrics.returningThisMonth}</span>
            </div>
            <div className="metric-item">
              <span className="label">VIP Patients</span>
              <span className="value warning">{patientMetrics.vipCount}</span>
            </div>
            <div className="metric-item">
              <span className="label">Avg Visits per Patient</span>
              <span className="value">{patientMetrics.averageVisitsPerPatient}</span>
            </div>
            <div className="metric-item">
              <span className="label">Retention Rate</span>
              <span className="value">{formatPercentage(patientMetrics.retentionRate)}</span>
            </div>
          </div>
        </div>

        {/* Appointment Metrics Card */}
        <div className="metric-card appointment-card">
          <div className="metric-header">
            <h3>📅 Appointment Metrics</h3>
          </div>
          <div className="metric-body">
            <div className="metric-item">
              <span className="label">Total Scheduled</span>
              <span className="value">{appointmentMetrics.totalScheduled}</span>
            </div>
            <div className="metric-item success">
              <span className="label">Completed</span>
              <span className="value">{appointmentMetrics.completed}</span>
            </div>
            <div className="metric-item danger">
              <span className="label">Cancelled</span>
              <span className="value">{appointmentMetrics.cancelled}</span>
            </div>
            <div className="metric-item warning">
              <span className="label">No-Show</span>
              <span className="value">{appointmentMetrics.noShow}</span>
            </div>
            <div className="metric-item">
              <span className="label">Completion Rate</span>
              <span className="value">{formatPercentage(appointmentMetrics.completionRate)}</span>
            </div>
            <div className="metric-item">
              <span className="label">Avg Wait Time</span>
              <span className="value">{appointmentMetrics.averageWaitTime} days</span>
            </div>
          </div>
        </div>

        {/* Treatment Metrics Card */}
        <div className="metric-card treatment-card">
          <div className="metric-header">
            <h3>🦷 Treatment Metrics</h3>
          </div>
          <div className="metric-body">
            <div className="metric-item">
              <span className="label">Total Planned</span>
              <span className="value">{treatmentMetrics.totalPlanned}</span>
            </div>
            <div className="metric-item success">
              <span className="label">Completed</span>
              <span className="value">{treatmentMetrics.totalCompleted}</span>
            </div>
            <div className="metric-item warning">
              <span className="label">In Progress</span>
              <span className="value">{treatmentMetrics.totalInProgress}</span>
            </div>
            <div className="metric-item">
              <span className="label">Completion Rate</span>
              <span className="value">{formatPercentage(treatmentMetrics.completionRate)}</span>
            </div>
            <div className="metric-item primary">
              <span className="label">Pending Revenue</span>
              <span className="value">{formatCurrency(treatmentMetrics.pendingRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Treatments & Categories */}
      <div className="detailed-analytics">
        <div className="analytics-section">
          <h3>🏆 Top Treatment Categories</h3>
          <div className="top-items-list">
            {treatmentMetrics.topCategories.map((cat, idx) => (
              <div key={idx} className="top-item">
                <div className="item-rank">#{idx + 1}</div>
                <div className="item-details">
                  <div className="item-name">{cat.category}</div>
                  <div className="item-stats">
                    {cat.count} procedures • {formatCurrency(cat.revenue)} • {formatPercentage(cat.percentage)}
                  </div>
                </div>
                <div className="item-bar" style={{ width: `${cat.percentage}%` }}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-section">
          <h3>💎 Top Procedures</h3>
          <div className="top-items-list">
            {treatmentMetrics.topProcedures.slice(0, 5).map((proc, idx) => (
              <div key={idx} className="top-item">
                <div className="item-rank">#{idx + 1}</div>
                <div className="item-details">
                  <div className="item-name">{proc.treatmentName}</div>
                  <div className="item-stats">
                    {proc.count} times • {formatCurrency(proc.revenue)} • Avg: {formatCurrency(proc.averagePrice)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Times Analysis */}
      {appointmentMetrics.peakHours.length > 0 && (
        <div className="analytics-section peak-times">
          <h3>⏰ Peak Performance Analysis</h3>
          <div className="peak-times-grid">
            <div className="peak-section">
              <h4>Busiest Hours</h4>
              <div className="peak-list">
                {appointmentMetrics.peakHours.map((peak, idx) => (
                  <div key={idx} className="peak-item">
                    <span className="peak-label">
                      {peak.hour === 12 ? '12 PM' : peak.hour > 12 ? `${peak.hour - 12} PM` : `${peak.hour} AM`}
                    </span>
                    <span className="peak-value">{peak.count} appointments</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="peak-section">
              <h4>Busiest Days</h4>
              <div className="peak-list">
                {appointmentMetrics.peakDays.map((peak, idx) => (
                  <div key={idx} className="peak-item">
                    <span className="peak-label">{peak.day}</span>
                    <span className="peak-value">{peak.count} appointments</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Summary (only for daily reports) */}
      {reportType === 'daily' && (
        <div className="analytics-section daily-summary">
          <h3>📋 Today's Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-icon">👥</span>
              <div className="summary-details">
                <span className="summary-value">{dailySummary.patientsCount}</span>
                <span className="summary-label">Patients Seen</span>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">📅</span>
              <div className="summary-details">
                <span className="summary-value">{dailySummary.completedAppointments}/{dailySummary.appointmentsCount}</span>
                <span className="summary-label">Appointments</span>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🦷</span>
              <div className="summary-details">
                <span className="summary-value">{dailySummary.treatmentsCompleted}</span>
                <span className="summary-label">Treatments Done</span>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">💰</span>
              <div className="summary-details">
                <span className="summary-value">{formatCurrency(dailySummary.revenueCollected)}</span>
                <span className="summary-label">Revenue Today</span>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🔬</span>
              <div className="summary-details">
                <span className="summary-value">{dailySummary.labCasesSent}</span>
                <span className="summary-label">Lab Cases Sent</span>
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-icon">💊</span>
              <div className="summary-details">
                <span className="summary-value">{dailySummary.prescriptionsIssued}</span>
                <span className="summary-label">Prescriptions</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="analytics-footer">
        <p className="clinic-branding">Abdullah Dental Care • Hayatabad, Peshawar</p>
        <p className="report-timestamp">Report generated: {new Date().toLocaleString('en-PK')}</p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
