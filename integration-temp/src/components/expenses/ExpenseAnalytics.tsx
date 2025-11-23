// Module 8: Expense Analytics
import React from 'react';
import { PieChart, TrendingDown, DollarSign, Package } from 'lucide-react';
import type { Expense } from '../types/expense';

interface Props {
  summary: any;
  expenses: Expense[];
}

export function ExpenseAnalytics({ summary, expenses }: Props) {
  if (!summary) return <div>Loading...</div>;

  const topCategories = Object.entries(summary.byCategory)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  const topVendors = Object.entries(summary.byVendor)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  const monthlyData = Object.entries(summary.byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6);

  return (
    <div className="expense-analytics">
      {/* Overview Cards */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-header">
            <DollarSign size={24} color="#ef4444" />
            <h3>Total Expenses</h3>
          </div>
          <div className="card-value">Rs. {summary.totalExpenses.toLocaleString()}</div>
          <div className="card-subtitle">{expenses.length} transactions</div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <TrendingDown size={24} color="#f59e0b" />
            <h3>Average/Month</h3>
          </div>
          <div className="card-value">
            Rs. {Math.round(summary.totalExpenses / Math.max(monthlyData.length, 1)).toLocaleString()}
          </div>
          <div className="card-subtitle">Last 6 months</div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <Package size={24} color="#8b5cf6" />
            <h3>Top Category</h3>
          </div>
          <div className="card-value">{topCategories[0]?.[0] || 'N/A'}</div>
          <div className="card-subtitle">
            Rs. {(topCategories[0]?.[1] as number)?.toLocaleString() || 0}
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <PieChart size={24} color="#06b6d4" />
            <h3>Categories</h3>
          </div>
          <div className="card-value">{Object.keys(summary.byCategory).length}</div>
          <div className="card-subtitle">Active categories</div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="analytics-section">
        <h3>Top 5 Categories</h3>
        <div className="category-bars">
          {topCategories.map(([category, amount]: any) => {
            const percentage = (amount / summary.totalExpenses) * 100;
            return (
              <div key={category} className="category-bar-item">
                <div className="category-info">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">Rs. {amount.toLocaleString()}</span>
                </div>
                <div className="category-bar">
                  <div
                    className="category-bar-fill"
                    style={{ width: `${percentage}%`, background: getCategoryColor(category) }}
                  />
                </div>
                <div className="category-percentage">{percentage.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Vendors */}
      {topVendors.length > 0 && (
        <div className="analytics-section">
          <h3>Top 5 Vendors</h3>
          <div className="vendor-list">
            {topVendors.map(([vendor, amount]: any, index) => (
              <div key={vendor} className="vendor-item">
                <div className="vendor-rank">#{index + 1}</div>
                <div className="vendor-details">
                  <div className="vendor-name">{vendor}</div>
                  <div className="vendor-amount">Rs. {amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Trend */}
      <div className="analytics-section">
        <h3>Monthly Trend (Last 6 Months)</h3>
        <div className="trend-chart">
          {monthlyData.map(([month, amount]: any) => {
            const maxAmount = Math.max(...monthlyData.map(([, amt]: any) => amt));
            const height = (amount / maxAmount) * 100;
            
            return (
              <div key={month} className="trend-bar">
                <div
                  className="trend-bar-fill"
                  style={{ height: `${height}%` }}
                  title={`Rs. ${amount.toLocaleString()}`}
                />
                <div className="trend-label">{formatMonth(month)}</div>
                <div className="trend-amount">Rs. {(amount / 1000).toFixed(0)}K</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="analytics-section">
        <h3>Payment Methods</h3>
        <div className="payment-methods">
          {['cash', 'bank_transfer', 'card', 'easypaisa', 'jazzcash', 'cheque'].map(method => {
            const methodExpenses = expenses.filter(e => e.paymentMethod === method && e.status === 'paid');
            const total = methodExpenses.reduce((sum, e) => sum + e.amount, 0);
            const percentage = (total / summary.totalExpenses) * 100;
            
            return (
              <div key={method} className="payment-method-item">
                <span className="method-name">{formatPaymentMethod(method)}</span>
                <div className="method-bar">
                  <div className="method-bar-fill" style={{ width: `${percentage}%` }} />
                </div>
                <span className="method-amount">Rs. {total.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Supplies': '#3b82f6',
    'Equipment': '#8b5cf6',
    'Rent': '#f59e0b',
    'Utilities': '#ef4444',
    'Salary': '#22c55e',
    'Marketing': '#ec4899',
    'Maintenance': '#f97316',
    'Lab Fees': '#a855f7',
    'Transportation': '#eab308',
    'Professional Fees': '#06b6d4',
    'Miscellaneous': '#6b7280'
  };
  return colors[category] || '#6b7280';
}

function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function formatPaymentMethod(method: string): string {
  const formatted: Record<string, string> = {
    'cash': 'Cash',
    'bank_transfer': 'Bank',
    'card': 'Card',
    'easypaisa': 'EasyPaisa',
    'jazzcash': 'JazzCash',
    'cheque': 'Cheque'
  };
  return formatted[method] || method;
}