// Module 5: Payment Recording Component
// Abdullah Dental Care Management System

import React, { useState } from 'react';
import { Invoice, PaymentMethod, PaymentRecord } from '../types/billing';
import { addPayment } from '../data/billingDatabase';
import { formatPKR, formatDate } from '../utils/billingUtils';

interface PaymentRecordingProps {
  invoice: Invoice;
  onPaymentRecorded: (invoice: Invoice) => void;
  onCancel: () => void;
}

export const PaymentRecording: React.FC<PaymentRecordingProps> = ({
  invoice,
  onPaymentRecorded,
  onCancel
}) => {
  const [amount, setAmount] = useState<number>(invoice.amountDue);
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const paymentMethods: { value: PaymentMethod; label: string; requiresRef: boolean }[] = [
    { value: 'cash', label: 'Cash', requiresRef: false },
    { value: 'card', label: 'Credit/Debit Card', requiresRef: true },
    { value: 'bank_transfer', label: 'Bank Transfer', requiresRef: true },
    { value: 'easypaisa', label: 'Easypaisa', requiresRef: true },
    { value: 'jazzcash', label: 'JazzCash', requiresRef: true },
    { value: 'check', label: 'Check', requiresRef: true }
  ];

  const selectedMethodInfo = paymentMethods.find(m => m.value === method);

  const handleRecordPayment = async () => {
    setError('');
    
    // Validation
    if (amount <= 0) {
      setError('Payment amount must be greater than zero');
      return;
    }
    
    if (amount > invoice.amountDue) {
      setError(`Payment amount cannot exceed amount due (${formatPKR(invoice.amountDue)})`);
      return;
    }
    
    if (selectedMethodInfo?.requiresRef && !transactionRef.trim()) {
      setError('Transaction reference is required for this payment method');
      return;
    }
    
    setIsProcessing(true);
    try {
      const payment: Omit<PaymentRecord, 'id'> = {
        invoiceId: invoice.id,
        patientId: invoice.patientId,
        patientName: invoice.patientName,
        amount,
        method,
        transactionRef: transactionRef.trim() || undefined,
        receivedBy: 'Dr. Ahmed', // Would come from auth context
        receivedAt: new Date().toISOString(),
        notes: notes.trim() || undefined
      };
      
      await addPayment(payment);
      
      // Refresh invoice data
      const updatedInvoice = { ...invoice }; // In real app, would fetch fresh data
      onPaymentRecorded(updatedInvoice);
    } catch (err) {
      setError('Failed to record payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = Math.round((invoice.amountDue * percentage) / 100);
    setAmount(quickAmount);
  };

  return (
    <div className="payment-recording">
      <div className="payment-header">
        <h2>Record Payment</h2>
        <button onClick={onCancel} className="btn-close" disabled={isProcessing}>
          ×
        </button>
      </div>

      <div className="invoice-summary">
        <div className="summary-row">
          <span>Invoice:</span>
          <strong>{invoice.invoiceNumber}</strong>
        </div>
        <div className="summary-row">
          <span>Patient:</span>
          <strong>{invoice.patientName}</strong>
        </div>
        <div className="summary-row">
          <span>Total Amount:</span>
          <strong>{formatPKR(invoice.total)}</strong>
        </div>
        <div className="summary-row">
          <span>Already Paid:</span>
          <strong className="paid-amount">{formatPKR(invoice.amountPaid)}</strong>
        </div>
        <div className="summary-row highlight">
          <span>Amount Due:</span>
          <strong className="due-amount">{formatPKR(invoice.amountDue)}</strong>
        </div>
      </div>

      <div className="payment-form">
        <div className="form-group">
          <label>Payment Amount (Rs.)</label>
          <input
            type="number"
            min="1"
            max={invoice.amountDue}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="amount-input"
            disabled={isProcessing}
          />
          
          <div className="quick-amounts">
            <button
              type="button"
              onClick={() => handleQuickAmount(25)}
              className="quick-amount-btn"
              disabled={isProcessing}
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => handleQuickAmount(50)}
              className="quick-amount-btn"
              disabled={isProcessing}
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => handleQuickAmount(75)}
              className="quick-amount-btn"
              disabled={isProcessing}
            >
              75%
            </button>
            <button
              type="button"
              onClick={() => setAmount(invoice.amountDue)}
              className="quick-amount-btn"
              disabled={isProcessing}
            >
              Full
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            className="method-select"
            disabled={isProcessing}
          >
            {paymentMethods.map(m => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {selectedMethodInfo?.requiresRef && (
          <div className="form-group">
            <label>
              Transaction Reference *
              <span className="field-hint">
                {method === 'check' ? 'Check Number' : 
                 method === 'bank_transfer' ? 'Transaction ID' :
                 method === 'card' ? 'Last 4 digits' :
                 'Reference Number'}
              </span>
            </label>
            <input
              type="text"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder={method === 'check' ? 'CHK-12345' : 'REF-12345'}
              className="ref-input"
              disabled={isProcessing}
            />
          </div>
        )}

        <div className="form-group">
          <label>Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about this payment..."
            className="notes-textarea"
            rows={2}
            disabled={isProcessing}
          />
        </div>
      </div>

      {invoice.payments.length > 0 && (
        <div className="payment-history">
          <h3>Previous Payments</h3>
          <div className="payments-list">
            {invoice.payments.map((payment, index) => (
              <div key={index} className="payment-item">
                <div className="payment-info">
                  <span className="payment-date">{formatDate(payment.receivedAt, true)}</span>
                  <span className="payment-method-badge">{payment.method}</span>
                </div>
                <div className="payment-amount">{formatPKR(payment.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="payment-actions">
        <button
          onClick={onCancel}
          className="btn-secondary"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          onClick={handleRecordPayment}
          className="btn-primary"
          disabled={isProcessing || amount <= 0}
        >
          {isProcessing ? 'Recording...' : 'Record Payment'}
        </button>
      </div>
    </div>
  );
};
