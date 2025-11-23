// Module 5: Expense Management Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory } from '../types/billing';
import { 
  createExpense, 
  getAllExpenses, 
  updateExpense, 
  deleteExpense 
} from '../data/billingDatabase';
import { formatPKR, formatDate } from '../utils/billingUtils';

export const ExpenseManagement: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    category: 'supplies' as ExpenseCategory,
    description: '',
    amount: 0,
    vendor: '',
    paymentMethod: 'cash' as any,
    receiptNumber: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    isRecurring: false,
    recurringFrequency: 'monthly' as any
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await getAllExpenses();
      setExpenses(data.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || formData.amount <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateExpense(editingId, {
          ...formData,
          addedAt: new Date().toISOString()
        });
      } else {
        await createExpense({
          ...formData,
          addedBy: 'Dr. Ahmed', // Would come from auth context
          addedAt: new Date().toISOString()
        });
      }
      
      await loadExpenses();
      resetForm();
    } catch (error) {
      alert('Failed to save expense');
    }
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      vendor: expense.vendor || '',
      paymentMethod: expense.paymentMethod,
      receiptNumber: expense.receiptNumber || '',
      date: expense.date.split('T')[0],
      notes: expense.notes || '',
      isRecurring: expense.isRecurring,
      recurringFrequency: expense.recurringFrequency || 'monthly'
    });
    setEditingId(expense.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await deleteExpense(id);
      await loadExpenses();
    } catch (error) {
      alert('Failed to delete expense');
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'supplies',
      description: '',
      amount: 0,
      vendor: '',
      paymentMethod: 'cash',
      receiptNumber: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      isRecurring: false,
      recurringFrequency: 'monthly'
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const categories: { value: ExpenseCategory; label: string; icon: string }[] = [
    { value: 'supplies', label: 'Supplies', icon: '🏥' },
    { value: 'equipment', label: 'Equipment', icon: '🔧' },
    { value: 'rent', label: 'Rent', icon: '🏢' },
    { value: 'utilities', label: 'Utilities', icon: '💡' },
    { value: 'salaries', label: 'Salaries', icon: '💵' },
    { value: 'marketing', label: 'Marketing', icon: '📢' },
    { value: 'lab', label: 'Lab Fees', icon: '🧪' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const calculateTotals = () => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = categories.map(cat => ({
      ...cat,
      total: expenses
        .filter(exp => exp.category === cat.value)
        .reduce((sum, exp) => sum + exp.amount, 0)
    }));
    
    return { total, byCategory };
  };

  const totals = calculateTotals();

  if (isLoading) {
    return <div className="expense-loading">Loading expenses...</div>;
  }

  return (
    <div className="expense-management">
      <div className="expense-header">
        <h2>Expense Management</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary"
        >
          {isAdding ? '✖ Cancel' : '+ Add Expense'}
        </button>
      </div>

      <div className="expense-summary">
        <div className="summary-card total-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-label">Total Expenses</div>
            <div className="card-value">{formatPKR(totals.total)}</div>
          </div>
        </div>
        
        {totals.byCategory.filter(cat => cat.total > 0).slice(0, 3).map(cat => (
          <div key={cat.value} className="summary-card category-card">
            <div className="card-icon">{cat.icon}</div>
            <div className="card-content">
              <div className="card-label">{cat.label}</div>
              <div className="card-value">{formatPKR(cat.total)}</div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="expense-form-container">
          <form onSubmit={handleSubmit} className="expense-form">
            <h3>{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as ExpenseCategory})}
                  className="form-select"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Amount (Rs.) *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What was this expense for?"
                className="form-input"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vendor</label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  placeholder="Supplier name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                  className="form-select"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="easypaisa">Easypaisa</option>
                  <option value="jazzcash">JazzCash</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <div className="form-group">
                <label>Receipt #</label>
                <input
                  type="text"
                  value={formData.receiptNumber}
                  onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                  placeholder="Optional"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional details..."
                className="form-textarea"
                rows={2}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                />
                Recurring Expense
              </label>
              
              {formData.isRecurring && (
                <select
                  value={formData.recurringFrequency}
                  onChange={(e) => setFormData({...formData, recurringFrequency: e.target.value as any})}
                  className="form-select small"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              )}
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Expense' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="expenses-list">
        <h3>Recent Expenses</h3>
        {expenses.length > 0 ? (
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>
                    <span className="category-badge">
                      {categories.find(c => c.value === expense.category)?.icon}
                      {' '}
                      {categories.find(c => c.value === expense.category)?.label}
                    </span>
                  </td>
                  <td className="expense-description">
                    {expense.description}
                    {expense.isRecurring && (
                      <span className="recurring-badge">🔄 Recurring</span>
                    )}
                  </td>
                  <td>{expense.vendor || '-'}</td>
                  <td className="expense-amount">{formatPKR(expense.amount)}</td>
                  <td>
                    <span className="payment-method-small">{expense.paymentMethod}</span>
                  </td>
                  <td className="expense-actions">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="btn-edit"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="btn-delete"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-expenses-message">
            <div className="no-data-icon">📊</div>
            <h3>No Expenses Recorded</h3>
            <p>Start tracking your clinic expenses to monitor profitability.</p>
          </div>
        )}
      </div>
    </div>
  );
};
