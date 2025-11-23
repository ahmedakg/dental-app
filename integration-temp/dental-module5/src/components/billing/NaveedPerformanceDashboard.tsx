// Module 5: Naveed Performance Dashboard
// Abdullah Dental Care Management System
// GAMIFICATION: Track Naveed's performance and achievements

import React, { useState, useEffect } from 'react';
import { NaveedPerformance } from '../types/billing';
import { getAllInvoices } from '../data/billingDatabase';
import { formatPKR } from '../utils/billingUtils';

export const NaveedPerformanceDashboard: React.FC = () => {
  const [performance, setPerformance] = useState<NaveedPerformance | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    calculatePerformance();
  }, [timeframe]);

  const calculatePerformance = async () => {
    setIsLoading(true);
    try {
      const invoices = await getAllInvoices();
      
      // Calculate date range
      const now = new Date();
      let startDate: Date;
      
      if (timeframe === 'week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      
      // Filter invoices created by Naveed in this period
      const naveedInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.issuedAt);
        return invDate >= startDate && invDate <= now;
        // In real implementation, would filter by inv.issuedBy === 'Naveed'
      });
      
      // Calculate metrics
      const revenueGenerated = naveedInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
      const appointmentsBooked = naveedInvoices.length;
      const totalInvoiceValue = naveedInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const averageTicketSize = appointmentsBooked > 0 ? totalInvoiceValue / appointmentsBooked : 0;
      
      const paidCount = naveedInvoices.filter(inv => inv.status === 'paid').length;
      const conversionRate = appointmentsBooked > 0 ? (paidCount / appointmentsBooked) * 100 : 0;
      
      // Set monthly target (would be configurable)
      const monthlyTarget = 500000; // Rs. 500k
      const weeklyTarget = monthlyTarget / 4;
      const target = timeframe === 'month' ? monthlyTarget : weeklyTarget;
      const achievement = target > 0 ? (revenueGenerated / target) * 100 : 0;
      
      // Calculate bonus (2% of revenue if target achieved)
      const bonusEarned = achievement >= 100 ? revenueGenerated * 0.02 : 0;
      
      const perfData: NaveedPerformance = {
        period: timeframe === 'month' ? 'This Month' : 'This Week',
        appointmentsBooked,
        revenueGenerated,
        conversionRate,
        averageTicketSize,
        gapsFilled: 0, // Would come from Module 2 appointment data
        waitlistManaged: 0, // Would come from Module 2 waitlist data
        target,
        achievement,
        bonusEarned
      };
      
      setPerformance(perfData);
    } catch (error) {
      console.error('Failed to calculate performance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="performance-loading">Calculating performance...</div>;
  }

  if (!performance) {
    return <div className="no-performance-data">No performance data available</div>;
  }

  const achievementLevel = 
    performance.achievement >= 100 ? 'excellent' :
    performance.achievement >= 75 ? 'good' :
    performance.achievement >= 50 ? 'average' : 'needs-improvement';

  return (
    <div className="naveed-performance">
      <div className="performance-header">
        <div className="header-content">
          <h1>Naveed's Performance Dashboard</h1>
          <p className="header-subtitle">Track your achievements and earn bonuses! 🎯</p>
        </div>
        
        <div className="timeframe-toggle">
          <button
            className={`toggle-btn ${timeframe === 'week' ? 'active' : ''}`}
            onClick={() => setTimeframe('week')}
          >
            This Week
          </button>
          <button
            className={`toggle-btn ${timeframe === 'month' ? 'active' : ''}`}
            onClick={() => setTimeframe('month')}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="target-progress">
        <div className="progress-header">
          <div className="progress-title">
            <span className="period-label">{performance.period}</span>
            <span className="target-label">Target: {formatPKR(performance.target)}</span>
          </div>
          <div className="achievement-percentage">
            <span className={`achievement-value ${achievementLevel}`}>
              {performance.achievement.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className={`progress-bar-fill ${achievementLevel}`}
            style={{ width: `${Math.min(performance.achievement, 100)}%` }}
          >
            {performance.achievement >= 20 && (
              <span className="progress-label">{formatPKR(performance.revenueGenerated)}</span>
            )}
          </div>
        </div>
        
        {performance.achievement >= 100 && (
          <div className="achievement-badge">
            🎉 TARGET ACHIEVED! Bonus Earned: {formatPKR(performance.bonusEarned)}
          </div>
        )}
      </div>

      <div className="performance-metrics">
        <div className="metric-card appointments-card">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <div className="metric-label">Appointments Booked</div>
            <div className="metric-value">{performance.appointmentsBooked}</div>
            <div className="metric-insight">
              Keep filling those slots! 💪
            </div>
          </div>
        </div>

        <div className="metric-card revenue-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-label">Revenue Generated</div>
            <div className="metric-value">{formatPKR(performance.revenueGenerated)}</div>
            <div className="metric-insight">
              {performance.target - performance.revenueGenerated > 0 
                ? `${formatPKR(performance.target - performance.revenueGenerated)} to target`
                : 'Target exceeded! 🚀'}
            </div>
          </div>
        </div>

        <div className="metric-card conversion-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-label">Conversion Rate</div>
            <div className="metric-value">{performance.conversionRate.toFixed(1)}%</div>
            <div className="metric-insight">
              {performance.conversionRate >= 80 ? 'Excellent!' :
               performance.conversionRate >= 60 ? 'Good work!' :
               'Focus on follow-ups'}
            </div>
          </div>
        </div>

        <div className="metric-card ticket-card">
          <div className="metric-icon">🎫</div>
          <div className="metric-content">
            <div className="metric-label">Avg Ticket Size</div>
            <div className="metric-value">{formatPKR(performance.averageTicketSize)}</div>
            <div className="metric-insight">
              {performance.averageTicketSize >= 15000 ? 'Premium service!' :
               performance.averageTicketSize >= 10000 ? 'Good value' :
               'Try upselling'}
            </div>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h3>🏆 Achievements & Badges</h3>
        <div className="badges-grid">
          {performance.appointmentsBooked >= 50 && (
            <div className="badge earned">
              <div className="badge-icon">📅</div>
              <div className="badge-name">Booking Master</div>
              <div className="badge-desc">50+ appointments</div>
            </div>
          )}
          
          {performance.conversionRate >= 80 && (
            <div className="badge earned">
              <div className="badge-icon">🎯</div>
              <div className="badge-name">Closer</div>
              <div className="badge-desc">80%+ conversion</div>
            </div>
          )}
          
          {performance.achievement >= 100 && (
            <div className="badge earned">
              <div className="badge-icon">💎</div>
              <div className="badge-name">Target Crusher</div>
              <div className="badge-desc">100% target achieved</div>
            </div>
          )}
          
          {performance.averageTicketSize >= 15000 && (
            <div className="badge earned">
              <div className="badge-icon">💰</div>
              <div className="badge-name">Premium Seller</div>
              <div className="badge-desc">Rs. 15k+ avg ticket</div>
            </div>
          )}
          
          {/* Locked badges */}
          {performance.appointmentsBooked < 50 && (
            <div className="badge locked">
              <div className="badge-icon">🔒</div>
              <div className="badge-name">Booking Master</div>
              <div className="badge-desc">Unlock at 50 appointments</div>
            </div>
          )}
          
          {performance.conversionRate < 80 && (
            <div className="badge locked">
              <div className="badge-icon">🔒</div>
              <div className="badge-name">Closer</div>
              <div className="badge-desc">Unlock at 80% conversion</div>
            </div>
          )}
        </div>
      </div>

      <div className="performance-tips">
        <h3>💡 Tips to Boost Performance</h3>
        <div className="tips-list">
          {performance.conversionRate < 80 && (
            <div className="tip">
              <span className="tip-icon">📱</span>
              <div className="tip-content">
                <strong>Improve Conversion:</strong> Send WhatsApp reminders to patients 
                with pending treatments. Use the Smart Gap Filler from appointments module!
              </div>
            </div>
          )}
          
          {performance.averageTicketSize < 15000 && (
            <div className="tip">
              <span className="tip-icon">💬</span>
              <div className="tip-content">
                <strong>Increase Ticket Size:</strong> When patients come for routine checkup, 
                mention pending treatments like whitening or deep cleaning.
              </div>
            </div>
          )}
          
          {performance.achievement < 75 && (
            <div className="tip">
              <span className="tip-icon">🎯</span>
              <div className="tip-content">
                <strong>Reach Your Target:</strong> Focus on VIP and Regular patients. 
                They're more likely to book and pay on time.
              </div>
            </div>
          )}
          
          <div className="tip">
            <span className="tip-icon">⭐</span>
            <div className="tip-content">
              <strong>Pro Tip:</strong> The earlier you book appointments in the month, 
              the better your chances of hitting target! Start strong! 💪
            </div>
          </div>
        </div>
      </div>

      <div className="performance-footer">
        <button onClick={calculatePerformance} className="btn-secondary">
          🔄 Refresh Data
        </button>
        <div className="bonus-info">
          💰 Earn 2% bonus on all revenue when you hit 100% target!
        </div>
      </div>
    </div>
  );
};
