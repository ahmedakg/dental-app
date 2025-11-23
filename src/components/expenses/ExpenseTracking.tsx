// Module 8: Expense Tracking - Main Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, AlertCircle, Calendar, FileText } from 'lucide-react';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { ExpenseAnalytics } from './ExpenseAnalytics';
import { BudgetManager } from './BudgetManager';
import { VendorManagement } from './VendorManagement';
import { getExpenses, getExpenseSummary, getBudgets } from '../utils/expenseDb';
import type { Expense, BudgetLimit } from '../types/expense';

export function ExpenseTracking() {
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'analytics' | 'budget' | 'vendors'>('list');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  async function loadData() {
    const startDate = `${selectedMonth}-01`;
    const endDate = `${selectedMonth}-31`;
    
    const [expenseData, summaryData, budgetData] = await Promise.all([
      getExpenses({ startDate, endDate }),
      getExpenseSummary(startDate, endDate),
      getBudgets(selectedMonth)
    ]);
    
    setExpenses(expenseData);
    setSummary(summaryData);
    setBudgets(budgetData);
  }

  function handleExpenseAdded() {
    loadData();
    setActiveTab('list');
  }

  return (
    <div className="expense-tracking">
      {/* Header */}
      <div className="expense-header">
        <div className="header-left">
          <DollarSign size={32} />
          <div>
            <h1>Expense Tracking</h1>
            <p>Monitor clinic expenses and budget</p>
          </div>
        </div>
        
        <div className="month-selector">
          <label>Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            max={new Date().toISOString().substring(0, 7)}
          />
        </div>
      </div>

      {/* Quick Stats */}
      {summary && (
        <div className="expense-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fee2e2' }}>
              <TrendingDown size={24} color="#dc2626" />
            </div>
            <div className="stat-details">
              <div className="stat-label">Total Expenses</div>
              <div className="stat-value">Rs. {summary.totalExpenses.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>
              <Calendar size={24} color="#2563eb" />
            </div>
            <div className="stat-details">
              <div className="stat-label">This Month</div>
              <div className="stat-value">{expenses.filter(e => e.status === 'paid').length} payments</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>
              <AlertCircle size={24} color="#f59e0b" />
            </div>
            <div className="stat-details">
              <div className="stat-label">Pending</div>
              <div className="stat-value">
                Rs. {expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0e7ff' }}>
              <FileText size={24} color="#6366f1" />
            </div>
            <div className="stat-details">
              <div className="stat-label">Total Entries</div>
              <div className="stat-value">{expenses.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="expense-tabs">
        <button
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => setActiveTab('add')}
        >
          Add Expense
        </button>
        <button
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          Expense List
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={activeTab === 'budget' ? 'active' : ''}
          onClick={() => setActiveTab('budget')}
        >
          Budget Manager
        </button>
        <button
          className={activeTab === 'vendors' ? 'active' : ''}
          onClick={() => setActiveTab('vendors')}
        >
          Vendors
        </button>
      </div>

      {/* Content */}
      <div className="expense-content">
        {activeTab === 'add' && <ExpenseForm onSuccess={handleExpenseAdded} />}
        {activeTab === 'list' && <ExpenseList expenses={expenses} onUpdate={loadData} />}
        {activeTab === 'analytics' && <ExpenseAnalytics summary={summary} expenses={expenses} />}
        {activeTab === 'budget' && <BudgetManager budgets={budgets} summary={summary} month={selectedMonth} onUpdate={loadData} />}
        {activeTab === 'vendors' && <VendorManagement onUpdate={loadData} />}
      </div>
    </div>
  );
}