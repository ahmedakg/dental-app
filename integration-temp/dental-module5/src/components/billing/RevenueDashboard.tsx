// Module 5: Revenue Dashboard Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { getFinancialSummary } from '../../utils/revenueAnalytics';
import type { FinancialSummary } from '../../types/billing';

export function RevenueDashboard() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    setLoading(true);
    try {
      const data = await getFinancialSummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to load financial summary:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !summary) {
    return (
      <div className="revenue-dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading financial data...</p>
        </div>
      </div>
    );
  }

  const currentMetrics = {
    today: summary.today,
    week: summary.thisWeek,
    month: summary.thisMonth,
    year: summary.thisYear
  }[selectedPeriod];

  return (
    <div className="revenue-dashboard">
      <div className="dashboard-header">
        <h1>💰 Revenue Dashboard</h1>
        <button onClick={loadSummary} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="period-selector">
        {(['today', 'week', 'month', 'year'] as const).map(period => (
          <button
            key={period}
            className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💵</div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">
              {selectedPeriod === 'today' 
                ? `PKR ${summary.today.totalRevenue.toLocaleString()}`
                : `PKR ${currentMetrics.totalRevenue.toLocaleString()}`
              }
            </p>
          </div>
        </div>

        <div className="metric-card expenses">
          <div className="metric-icon">📤</div>
          <div className="metric-content">
            <h3>Total Expenses</h3>
            <p className="metric-value">
              {selectedPeriod === 'today'
                ? `PKR ${summary.today.totalExpenses.toLocaleString()}`
                : `PKR ${currentMetrics.totalExpenses.toLocaleString()}`
              }
            </p>
          </div>
        </div>

        <div className="metric-card profit">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>Net Profit</h3>
            <p className="metric-value">
              {selectedPeriod === 'today'
                ? `PKR ${summary.today.netProfit.toLocaleString()}`
                : `PKR ${currentMetrics.netProfit.toLocaleString()}`
              }
            </p>
            {selectedPeriod !== 'today' && (
              <p className="metric-detail">
                Margin: {currentMetrics.profitMargin.toFixed(1)}%
              </p>
            )}
          </div>
        </div>

        {selectedPeriod !== 'today' && (
          <div className="metric-card pending">
            <div className="metric-icon">⏳</div>
            <div className="metric-content">
              <h3>Pending Payments</h3>
              <p className="metric-value">
                PKR {currentMetrics.pendingAmount.toLocaleString()}
              </p>
              <p className="metric-detail">
                Overdue: PKR {currentMetrics.overdueAmount.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedPeriod !== 'today' && (
        <div className="payment-breakdown">
          <h2>💳 Payment Methods</h2>
          <div className="payment-methods">
            <div className="payment-method">
              <span className="method-label">Cash</span>
              <span className="method-amount">
                PKR {currentMetrics.paymentMethodBreakdown.cash.toLocaleString()}
              </span>
              <div className="method-bar">
                <div 
                  className="method-fill cash"
                  style={{
                    width: `${(currentMetrics.paymentMethodBreakdown.cash / currentMetrics.totalRevenue) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="payment-method">
              <span className="method-label">Card</span>
              <span className="method-amount">
                PKR {currentMetrics.paymentMethodBreakdown.card.toLocaleString()}
              </span>
              <div className="method-bar">
                <div 
                  className="method-fill card"
                  style={{
                    width: `${(currentMetrics.paymentMethodBreakdown.card / currentMetrics.totalRevenue) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="payment-method">
              <span className="method-label">Digital (Bank/Jazz/Easy)</span>
              <span className="method-amount">
                PKR {currentMetrics.paymentMethodBreakdown.digital.toLocaleString()}
              </span>
              <div className="method-bar">
                <div 
                  className="method-fill digital"
                  style={{
                    width: `${(currentMetrics.paymentMethodBreakdown.digital / currentMetrics.totalRevenue) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPeriod !== 'today' && currentMetrics.topTreatments.length > 0 && (
        <div className="top-treatments">
          <h2>🦷 Top Revenue Treatments</h2>
          <div className="treatments-list">
            {currentMetrics.topTreatments.slice(0, 5).map((treatment, index) => (
              <div key={index} className="treatment-item">
                <div className="treatment-rank">#{index + 1}</div>
                <div className="treatment-info">
                  <p className="treatment-name">{treatment.treatmentName}</p>
                  <p className="treatment-stats">
                    {treatment.count} treatments • PKR {treatment.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.pendingPayments.length > 0 && (
        <div className="pending-payments-alert">
          <h2>⚠️ Pending Payments ({summary.pendingPayments.length})</h2>
          <div className="pending-list">
            {summary.pendingPayments.slice(0, 5).map(invoice => (
              <div key={invoice.id} className="pending-item">
                <div className="pending-patient">
                  <strong>{invoice.patientName}</strong>
                  <span>{invoice.patientPhone}</span>
                </div>
                <div className="pending-amount">
                  <span className="amount">PKR {invoice.remainingAmount.toLocaleString()}</span>
                  <span className={`status ${invoice.paymentStatus}`}>
                    {invoice.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {summary.pendingPayments.length > 5 && (
            <button className="view-all-btn">
              View All ({summary.pendingPayments.length})
            </button>
          )}
        </div>
      )}

      <div className="naveed-performance">
        <h2>🎮 Naveed's Performance (This Month)</h2>
        <div className="performance-card">
          <div className="performance-header">
            <div className="level-badge">{summary.naveedPerformance.level}</div>
            <div className="score">{summary.naveedPerformance.score}/100</div>
          </div>
          
          <div className="performance-stats">
            <div className="stat">
              <span className="stat-label">Appointments Booked</span>
              <span className="stat-value">{summary.naveedPerformance.appointmentsBooked}</span>
            </div>
            <div className="stat">
              <span className="stat-label">New Patients Added</span>
              <span className="stat-value">{summary.naveedPerformance.patientsAdded}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Revenue Generated</span>
              <span className="stat-value">
                PKR {summary.naveedPerformance.revenueGenerated.toLocaleString()}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Gaps Filled</span>
              <span className="stat-value">{summary.naveedPerformance.gapsFilled}</span>
            </div>
          </div>

          {summary.naveedPerformance.badges.length > 0 && (
            <div className="badges">
              <h4>Badges Earned:</h4>
              <div className="badge-list">
                {summary.naveedPerformance.badges.map((badge, index) => (
                  <span key={index} className="badge">{badge}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
