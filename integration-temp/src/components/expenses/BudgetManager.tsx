// Module 8: Budget Manager
import React, { useState } from 'react';
import { Target, AlertTriangle, TrendingUp, Save } from 'lucide-react';
import { setBudget, updateBudgetSpend } from '../utils/expenseDb';
import type { BudgetLimit, ExpenseCategory } from '../types/expense';

const CATEGORIES: ExpenseCategory[] = [
  'Supplies', 'Equipment', 'Rent', 'Utilities', 'Salary',
  'Marketing', 'Maintenance', 'Lab Fees', 'Transportation',
  'Professional Fees', 'Miscellaneous'
];

interface Props {
  budgets: BudgetLimit[];
  summary: any;
  month: string;
  onUpdate: () => void;
}

export function BudgetManager({ budgets, summary, month, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('Supplies');
  const [limit, setLimit] = useState('');
  const [threshold, setThreshold] = useState('80');

  async function handleAddBudget(e: React.FormEvent) {
    e.preventDefault();
    
    await setBudget({
      category,
      monthlyLimit: parseFloat(limit),
      alertThreshold: parseFloat(threshold),
      month
    });
    
    await updateBudgetSpend(category, month);
    
    setLimit('');
    setThreshold('80');
    setShowForm(false);
    onUpdate();
  }

  function getBudgetStatus(budget: BudgetLimit) {
    const percentage = (budget.currentSpend / budget.monthlyLimit) * 100;
    
    if (percentage >= 100) return { status: 'exceeded', color: '#ef4444', icon: AlertTriangle };
    if (percentage >= budget.alertThreshold) return { status: 'warning', color: '#f59e0b', icon: AlertTriangle };
    return { status: 'good', color: '#22c55e', icon: TrendingUp };
  }

  return (
    <div className="budget-manager">
      {/* Header */}
      <div className="budget-header">
        <h3>Budget Management - {formatMonth(month)}</h3>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Set Budget'}
        </button>
      </div>

      {/* Add Budget Form */}
      {showForm && (
        <form className="budget-form" onSubmit={handleAddBudget}>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Monthly Limit (PKR)</label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="50000"
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Alert Threshold (%)</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="80"
                min="0"
                max="100"
                required
              />
            </div>
            
            <button type="submit" className="btn-primary">
              <Save size={18} />
              Save
            </button>
          </div>
        </form>
      )}

      {/* Budget List */}
      {budgets.length === 0 ? (
        <div className="empty-state">
          <Target size={48} color="#9ca3af" />
          <p>No budgets set for this month</p>
          <p className="text-sm">Set budgets to track and control spending</p>
        </div>
      ) : (
        <div className="budget-list">
          {budgets.map(budget => {
            const { status, color, icon: Icon } = getBudgetStatus(budget);
            const percentage = Math.min((budget.currentSpend / budget.monthlyLimit) * 100, 100);
            const remaining = budget.monthlyLimit - budget.currentSpend;
            
            return (
              <div key={budget.id} className="budget-card" style={{ borderLeft: `4px solid ${color}` }}>
                <div className="budget-header-row">
                  <div className="budget-category">
                    <Icon size={20} color={color} />
                    <span>{budget.category}</span>
                  </div>
                  <div className="budget-status" style={{ color }}>
                    {status === 'exceeded' ? 'EXCEEDED' : status === 'warning' ? 'WARNING' : 'ON TRACK'}
                  </div>
                </div>
                
                <div className="budget-amounts">
                  <div className="amount-row">
                    <span className="amount-label">Spent:</span>
                    <span className="amount-value">Rs. {budget.currentSpend.toLocaleString()}</span>
                  </div>
                  <div className="amount-row">
                    <span className="amount-label">Budget:</span>
                    <span className="amount-value">Rs. {budget.monthlyLimit.toLocaleString()}</span>
                  </div>
                  <div className="amount-row">
                    <span className="amount-label">Remaining:</span>
                    <span className="amount-value" style={{ color: remaining < 0 ? '#ef4444' : '#22c55e' }}>
                      Rs. {remaining.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="budget-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%`, background: color }}
                    />
                  </div>
                  <div className="progress-label">{percentage.toFixed(1)}% used</div>
                </div>
                
                {status !== 'good' && (
                  <div className="budget-alert" style={{ background: `${color}20`, color }}>
                    {status === 'exceeded' 
                      ? `⚠️ Over budget by Rs. ${Math.abs(remaining).toLocaleString()}`
                      : `⚡ Approaching limit (${budget.alertThreshold}% threshold)`
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Overall Summary */}
      {budgets.length > 0 && (
        <div className="budget-summary">
          <h4>Monthly Summary</h4>
          <div className="summary-stats">
            <div className="summary-stat">
              <span>Total Budget:</span>
              <span className="stat-value">Rs. {budgets.reduce((sum, b) => sum + b.monthlyLimit, 0).toLocaleString()}</span>
            </div>
            <div className="summary-stat">
              <span>Total Spent:</span>
              <span className="stat-value">Rs. {budgets.reduce((sum, b) => sum + b.currentSpend, 0).toLocaleString()}</span>
            </div>
            <div className="summary-stat">
              <span>Categories Over Budget:</span>
              <span className="stat-value" style={{ color: '#ef4444' }}>
                {budgets.filter(b => b.currentSpend > b.monthlyLimit).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}