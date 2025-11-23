// Module 8: Expense List
import React, { useState } from 'react';
import { Trash2, Edit, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { deleteExpense, updateExpense } from '../utils/expenseDb';
import type { Expense } from '../types/expense';

interface Props {
  expenses: Expense[];
  onUpdate: () => void;
}

export function ExpenseList({ expenses, onUpdate }: Props) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredExpenses = expenses.filter(exp => {
    if (filter !== 'all' && exp.status !== filter) return false;
    if (categoryFilter !== 'all' && exp.category !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(expenses.map(e => e.category)));

  async function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return;
    
    await deleteExpense(id);
    onUpdate();
  }

  async function handleMarkAsPaid(id: string) {
    await updateExpense(id, { status: 'paid' });
    onUpdate();
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'paid':
        return <CheckCircle size={18} color="#22c55e" />;
      case 'pending':
        return <Clock size={18} color="#f59e0b" />;
      case 'overdue':
        return <AlertCircle size={18} color="#ef4444" />;
      default:
        return null;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'paid': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  }

  return (
    <div className="expense-list">
      {/* Filters */}
      <div className="expense-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Category:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-summary">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </div>
      </div>

      {/* List */}
      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} color="#9ca3af" />
          <p>No expenses found</p>
        </div>
      ) : (
        <div className="expense-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Expense #</th>
                <th>Category</th>
                <th>Description</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(expense => (
                <tr key={expense.id}>
                  <td>{new Date(expense.date).toLocaleDateString('en-GB')}</td>
                  <td className="expense-number">{expense.expenseNumber}</td>
                  <td>
                    <span className="category-badge" style={{ background: getCategoryColor(expense.category) }}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="description-cell">
                    <div>{expense.description}</div>
                    {expense.notes && <div className="expense-notes">{expense.notes}</div>}
                  </td>
                  <td>{expense.vendor || '-'}</td>
                  <td className="amount-cell">Rs. {expense.amount.toLocaleString()}</td>
                  <td className="method-cell">{formatPaymentMethod(expense.paymentMethod)}</td>
                  <td>
                    <span className="status-badge" style={{ color: getStatusColor(expense.status) }}>
                      {getStatusIcon(expense.status)}
                      <span>{expense.status}</span>
                    </span>
                  </td>
                  <td className="actions-cell">
                    {expense.status === 'pending' && (
                      <button
                        className="btn-icon"
                        onClick={() => handleMarkAsPaid(expense.id)}
                        title="Mark as paid"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(expense.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {filteredExpenses.length > 0 && (
        <div className="expense-summary">
          <div className="summary-row">
            <span>Total:</span>
            <span className="summary-amount">
              Rs. {filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </span>
          </div>
          <div className="summary-row">
            <span>Paid:</span>
            <span className="summary-amount text-success">
              Rs. {filteredExpenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </span>
          </div>
          <div className="summary-row">
            <span>Pending:</span>
            <span className="summary-amount text-warning">
              Rs. {filteredExpenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Supplies': '#dbeafe',
    'Equipment': '#e0e7ff',
    'Rent': '#fef3c7',
    'Utilities': '#fecaca',
    'Salary': '#dcfce7',
    'Marketing': '#fce7f3',
    'Maintenance': '#fed7aa',
    'Lab Fees': '#ddd6fe',
    'Transportation': '#fef9c3',
    'Professional Fees': '#cffafe',
    'Miscellaneous': '#e5e7eb'
  };
  return colors[category] || '#e5e7eb';
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