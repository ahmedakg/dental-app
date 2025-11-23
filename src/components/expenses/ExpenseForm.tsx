// Module 8: Expense Form
import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { addExpense, getVendors } from '../utils/expenseDb';
import type { ExpenseCategory, PaymentMethod, Vendor } from '../types/expense';

const CATEGORIES: ExpenseCategory[] = [
  'Supplies', 'Equipment', 'Rent', 'Utilities', 'Salary',
  'Marketing', 'Maintenance', 'Lab Fees', 'Transportation',
  'Professional Fees', 'Miscellaneous'
];

const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'bank_transfer', 'card', 'easypaisa', 'jazzcash', 'cheque'];

interface Props {
  onSuccess: () => void;
}

export function ExpenseForm({ onSuccess }: Props) {
  const [category, setCategory] = useState<ExpenseCategory>('Supplies');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [status, setStatus] = useState<'paid' | 'pending'>('paid');
  const [vendor, setVendor] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    const data = await getVendors();
    setVendors(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!description.trim() || !amount) {
      alert('Please fill in required fields');
      return;
    }

    await addExpense({
      category,
      description: description.trim(),
      amount: parseFloat(amount),
      date,
      paymentMethod,
      status,
      vendor: vendor || undefined,
      invoiceNumber: invoiceNumber || undefined,
      notes: notes || undefined,
      isRecurring,
      createdBy: 'Dr. Ahmed'
    });

    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setVendor('');
    setInvoiceNumber('');
    setNotes('');
    setIsRecurring(false);
    
    alert('Expense added successfully!');
    onSuccess();
  }

  function handleCancel() {
    if (confirm('Discard this expense?')) {
      onSuccess();
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)} required>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount (PKR) *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="0"
            step="1"
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Description *</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this expense for?"
            required
          />
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="card">Card</option>
            <option value="easypaisa">EasyPaisa</option>
            <option value="jazzcash">JazzCash</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as 'paid' | 'pending')}>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="form-group">
          <label>Vendor</label>
          <input
            type="text"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            placeholder="Vendor name (optional)"
            list="vendor-list"
          />
          <datalist id="vendor-list">
            {vendors.map(v => (
              <option key={v.id} value={v.name} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label>Invoice Number</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="form-group full-width">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional details..."
            rows={3}
          />
        </div>

        <div className="form-group full-width">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <span>Recurring Expense (monthly)</span>
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={handleCancel}>
          <X size={18} />
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          <Save size={18} />
          Save Expense
        </button>
      </div>
    </form>
  );
}