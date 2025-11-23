// Module 5: Invoice Detail View Component
// Abdullah Dental Care Management System

import React, { useState } from 'react';
import { Invoice } from '../types/billing';
import { formatPKR, formatDate, getStatusColor, generatePaymentReminder } from '../utils/billingUtils';
import { getBillingSettings } from '../data/billingDatabase';

interface InvoiceDetailProps {
  invoice: Invoice;
  onRecordPayment: () => void;
  onPrint: () => void;
  onClose: () => void;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  invoice,
  onRecordPayment,
  onPrint,
  onClose
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleWhatsAppReminder = () => {
    if (invoice.amountDue <= 0) {
      alert('This invoice is fully paid.');
      return;
    }

    const dueDate = invoice.dueDate || new Date().toISOString();
    const message = generatePaymentReminder(
      invoice.patientName,
      invoice.amountDue,
      dueDate
    );

    // Use Web Share API if available, otherwise copy to clipboard
    if (navigator.share) {
      navigator.share({
        title: `Payment Reminder - ${invoice.invoiceNumber}`,
        text: message
      }).catch(err => console.log('Share cancelled'));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message);
      alert('Reminder message copied to clipboard! Open WhatsApp and paste.');
    }
  };

  const handlePrintInvoice = async () => {
    // In a real implementation, this would generate a professional PDF
    // For now, we'll just trigger the browser's print
    onPrint();
  };

  const progressPercentage = invoice.total > 0 
    ? (invoice.amountPaid / invoice.total) * 100 
    : 0;

  return (
    <div className="invoice-detail">
      <div className="detail-header">
        <div className="header-left">
          <h2>Invoice Details</h2>
          <div className="invoice-number-large">{invoice.invoiceNumber}</div>
        </div>
        <button onClick={onClose} className="btn-close">×</button>
      </div>

      <div className="invoice-status-section">
        <div className="status-badge-large">
          <span className={`status-indicator ${getStatusColor(invoice.status)}`}>
            {invoice.status.toUpperCase()}
          </span>
        </div>
        
        <div className="payment-progress">
          <div className="progress-info">
            <span>Payment Progress</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="progress-amounts">
            <span className="paid-amount">Paid: {formatPKR(invoice.amountPaid)}</span>
            <span className="due-amount">Due: {formatPKR(invoice.amountDue)}</span>
          </div>
        </div>
      </div>

      <div className="invoice-info-grid">
        <div className="info-section patient-section">
          <h3>Patient Information</h3>
          <div className="info-row">
            <span className="label">Name:</span>
            <span className="value">{invoice.patientName}</span>
          </div>
          <div className="info-row">
            <span className="label">Phone:</span>
            <span className="value">{invoice.patientPhone}</span>
          </div>
          <div className="info-row">
            <span className="label">Patient ID:</span>
            <span className="value">{invoice.patientId}</span>
          </div>
        </div>

        <div className="info-section dates-section">
          <h3>Important Dates</h3>
          <div className="info-row">
            <span className="label">Issued:</span>
            <span className="value">{formatDate(invoice.issuedAt, true)}</span>
          </div>
          <div className="info-row">
            <span className="label">Due Date:</span>
            <span className="value">
              {invoice.dueDate ? formatDate(invoice.dueDate) : 'N/A'}
            </span>
          </div>
          {invoice.paidAt && (
            <div className="info-row">
              <span className="label">Paid:</span>
              <span className="value">{formatDate(invoice.paidAt, true)}</span>
            </div>
          )}
          <div className="info-row">
            <span className="label">Issued By:</span>
            <span className="value">{invoice.issuedBy}</span>
          </div>
        </div>
      </div>

      <div className="treatments-section">
        <h3>Treatments & Services</h3>
        <table className="treatments-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Treatment</th>
              <th>Teeth</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="treatment-code">{item.treatmentCode}</td>
                <td className="treatment-name">{item.treatmentName}</td>
                <td className="tooth-numbers">
                  {item.toothNumbers?.join(', ') || 'General'}
                </td>
                <td className="quantity">{item.quantity}</td>
                <td className="unit-price">{formatPKR(item.unitPrice)}</td>
                <td className="item-total">{formatPKR(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="invoice-totals-section">
        <div className="totals-row">
          <span className="label">Subtotal:</span>
          <span className="value">{formatPKR(invoice.subtotal)}</span>
        </div>
        {invoice.discount > 0 && (
          <>
            <div className="totals-row discount-row">
              <span className="label">
                Discount
                {invoice.discountReason && (
                  <span className="discount-reason"> ({invoice.discountReason})</span>
                )}:
              </span>
              <span className="value">- {formatPKR(invoice.discount)}</span>
            </div>
          </>
        )}
        {invoice.tax > 0 && (
          <div className="totals-row">
            <span className="label">Tax:</span>
            <span className="value">{formatPKR(invoice.tax)}</span>
          </div>
        )}
        <div className="totals-row grand-total">
          <span className="label">Total:</span>
          <span className="value">{formatPKR(invoice.total)}</span>
        </div>
        <div className="totals-row usd-equivalent">
          <span className="label">USD Equivalent:</span>
          <span className="value">${invoice.totalUSD.toFixed(2)}</span>
        </div>
      </div>

      {invoice.payments.length > 0 && (
        <div className="payments-history-section">
          <h3>Payment History</h3>
          <table className="payments-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Ref</th>
                <th>Received By</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((payment, index) => (
                <tr key={index}>
                  <td>{formatDate(payment.receivedAt, true)}</td>
                  <td className="payment-amount">{formatPKR(payment.amount)}</td>
                  <td>
                    <span className="payment-method-badge">{payment.method}</span>
                  </td>
                  <td className="transaction-ref">
                    {payment.transactionRef || '-'}
                  </td>
                  <td>{payment.receivedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {invoice.notes && (
        <div className="notes-section">
          <h3>Notes</h3>
          <p className="invoice-notes">{invoice.notes}</p>
        </div>
      )}

      <div className="invoice-actions">
        <button
          onClick={handlePrintInvoice}
          className="btn-secondary"
        >
          🖨️ Print Invoice
        </button>

        {invoice.amountDue > 0 && (
          <>
            <button
              onClick={onRecordPayment}
              className="btn-primary"
            >
              💰 Record Payment
            </button>

            <button
              onClick={handleWhatsAppReminder}
              className="btn-whatsapp"
            >
              📱 WhatsApp Reminder
            </button>
          </>
        )}

        {invoice.status === 'paid' && (
          <div className="paid-badge">
            ✅ Fully Paid
          </div>
        )}
      </div>

      <div className="invoice-meta">
        <div className="meta-item">
          Printed: {invoice.printCount} time(s)
          {invoice.lastPrintedAt && ` • Last: ${formatDate(invoice.lastPrintedAt, true)}`}
        </div>
      </div>
    </div>
  );
};
