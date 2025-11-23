// Module 5: Invoice Creation Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, BillingSettings } from '../types/billing';
import { 
  createInvoice, 
  getBillingSettings,
  getNextInvoiceNumber 
} from '../data/billingDatabase';
import { 
  calculateInvoiceTotals, 
  usdToPkr,
  validateInvoiceData 
} from '../utils/billingUtils';

// Assuming these types exist from Module 1 and Module 3
interface Patient {
  id: string;
  name: string;
  phone: string;
}

interface Treatment {
  id: string;
  code: string;
  name: string;
  category: string;
  priceUSD: number;
  pricePKR: number;
}

interface InvoiceCreationProps {
  patient: Patient;
  treatments: Treatment[];
  onInvoiceCreated: (invoice: Invoice) => void;
  onCancel: () => void;
}

export const InvoiceCreation: React.FC<InvoiceCreationProps> = ({
  patient,
  treatments,
  onInvoiceCreated,
  onCancel
}) => {
  const [settings, setSettings] = useState<BillingSettings | null>(null);
  const [selectedTreatments, setSelectedTreatments] = useState<Map<string, InvoiceItem>>(new Map());
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountReason, setDiscountReason] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState<string>('');

  useEffect(() => {
    loadSettings();
    loadNextInvoiceNumber();
    
    // Set default due date (7 days from now)
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 7);
    setDueDate(defaultDue.toISOString().split('T')[0]);
  }, []);

  const loadSettings = async () => {
    const s = await getBillingSettings();
    setSettings(s);
  };

  const loadNextInvoiceNumber = async () => {
    const num = await getNextInvoiceNumber();
    setNextInvoiceNumber(num);
  };

  const handleTreatmentToggle = (treatment: Treatment, toothNumbers?: number[]) => {
    const key = `${treatment.id}-${toothNumbers?.join(',') || 'general'}`;
    const newSelected = new Map(selectedTreatments);
    
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      const item: InvoiceItem = {
        treatmentId: treatment.id,
        treatmentCode: treatment.code,
        treatmentName: treatment.name,
        toothNumbers,
        quantity: 1,
        unitPrice: treatment.pricePKR,
        total: treatment.pricePKR,
        category: treatment.category
      };
      newSelected.set(key, item);
    }
    
    setSelectedTreatments(newSelected);
  };

  const handleQuantityChange = (key: string, quantity: number) => {
    const newSelected = new Map(selectedTreatments);
    const item = newSelected.get(key);
    if (item && quantity > 0) {
      item.quantity = quantity;
      item.total = item.unitPrice * quantity;
      newSelected.set(key, item);
      setSelectedTreatments(newSelected);
    }
  };

  const calculateTotals = () => {
    if (!settings) return { subtotal: 0, discountAmount: 0, tax: 0, total: 0, totalUSD: 0 };
    
    const subtotal = Array.from(selectedTreatments.values())
      .reduce((sum, item) => sum + item.total, 0);
    
    const { discountAmount, tax, total } = calculateInvoiceTotals(
      subtotal,
      discount,
      discountType,
      settings.taxRate,
      settings.enableTax
    );
    
    const totalUSD = parseFloat((total / settings.usdToPkrRate).toFixed(2));
    
    return { subtotal, discountAmount, tax, total, totalUSD };
  };

  const handleCreateInvoice = async () => {
    if (!settings) return;
    
    const items = Array.from(selectedTreatments.values());
    const totals = calculateTotals();
    
    const invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'> = {
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      treatmentIds: items.map(i => i.treatmentId),
      items,
      subtotal: totals.subtotal,
      discount: totals.discountAmount,
      discountReason: discountReason || undefined,
      tax: totals.tax,
      total: totals.total,
      totalUSD: totals.totalUSD,
      status: 'pending',
      issuedAt: new Date().toISOString(),
      issuedBy: 'Dr. Ahmed', // Would come from auth context
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      payments: [],
      amountPaid: 0,
      amountDue: totals.total,
      notes: notes || undefined,
      printCount: 0
    };
    
    const validationErrors = validateInvoiceData(invoiceData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsProcessing(true);
    try {
      const invoice = await createInvoice(invoiceData);
      onInvoiceCreated(invoice);
    } catch (error) {
      setErrors(['Failed to create invoice. Please try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  const totals = calculateTotals();

  if (!settings) {
    return <div className="billing-loading">Loading billing settings...</div>;
  }

  return (
    <div className="invoice-creation">
      <div className="invoice-header">
        <h2>Create Invoice</h2>
        <div className="invoice-number-preview">
          Invoice: <strong>{nextInvoiceNumber}</strong>
        </div>
      </div>

      <div className="patient-info-section">
        <h3>Patient Information</h3>
        <div className="patient-details">
          <div className="detail-row">
            <span className="label">Name:</span>
            <span className="value">{patient.name}</span>
          </div>
          <div className="detail-row">
            <span className="label">Phone:</span>
            <span className="value">{patient.phone}</span>
          </div>
        </div>
      </div>

      <div className="treatment-selection-section">
        <h3>Select Treatments</h3>
        <div className="treatment-list">
          {treatments.map(treatment => {
            const key = `${treatment.id}-general`;
            const isSelected = selectedTreatments.has(key);
            const item = selectedTreatments.get(key);
            
            return (
              <div key={treatment.id} className={`treatment-item ${isSelected ? 'selected' : ''}`}>
                <div className="treatment-main">
                  <label className="treatment-checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTreatmentToggle(treatment)}
                    />
                    <div className="treatment-info">
                      <div className="treatment-name">{treatment.name}</div>
                      <div className="treatment-code">{treatment.code}</div>
                    </div>
                  </label>
                  <div className="treatment-price">
                    Rs. {treatment.pricePKR.toLocaleString()}
                  </div>
                </div>
                
                {isSelected && item && (
                  <div className="treatment-quantity">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(key, parseInt(e.target.value) || 1)}
                      className="quantity-input"
                    />
                    <div className="item-total">
                      Total: Rs. {item.total.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="discount-section">
        <h3>Discount (Optional)</h3>
        <div className="discount-controls">
          <div className="discount-type">
            <label>
              <input
                type="radio"
                value="percentage"
                checked={discountType === 'percentage'}
                onChange={() => setDiscountType('percentage')}
              />
              Percentage (%)
            </label>
            <label>
              <input
                type="radio"
                value="fixed"
                checked={discountType === 'fixed'}
                onChange={() => setDiscountType('fixed')}
              />
              Fixed Amount (Rs.)
            </label>
          </div>
          
          <div className="discount-input-group">
            <input
              type="number"
              min="0"
              max={discountType === 'percentage' ? 100 : totals.subtotal}
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              placeholder={discountType === 'percentage' ? '0' : '0'}
              className="discount-input"
            />
            <span className="discount-suffix">
              {discountType === 'percentage' ? '%' : 'Rs.'}
            </span>
          </div>
          
          <input
            type="text"
            value={discountReason}
            onChange={(e) => setDiscountReason(e.target.value)}
            placeholder="Reason for discount (optional)"
            className="discount-reason"
          />
        </div>
      </div>

      <div className="invoice-totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>Rs. {totals.subtotal.toLocaleString()}</span>
        </div>
        {totals.discountAmount > 0 && (
          <div className="total-row discount-row">
            <span>Discount:</span>
            <span>- Rs. {totals.discountAmount.toLocaleString()}</span>
          </div>
        )}
        {settings.enableTax && totals.tax > 0 && (
          <div className="total-row">
            <span>Tax ({settings.taxRate}%):</span>
            <span>Rs. {totals.tax.toLocaleString()}</span>
          </div>
        )}
        <div className="total-row grand-total">
          <span>Total:</span>
          <span>Rs. {totals.total.toLocaleString()}</span>
        </div>
        <div className="total-row usd-total">
          <span>USD Equivalent:</span>
          <span>${totals.totalUSD.toFixed(2)}</span>
        </div>
      </div>

      <div className="invoice-details-section">
        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
          />
        </div>
        
        <div className="form-group">
          <label>Notes (Optional):</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes for this invoice..."
            className="notes-textarea"
            rows={3}
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <div key={index} className="error-message">{error}</div>
          ))}
        </div>
      )}

      <div className="invoice-actions">
        <button
          onClick={onCancel}
          className="btn-secondary"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          onClick={handleCreateInvoice}
          className="btn-primary"
          disabled={isProcessing || selectedTreatments.size === 0}
        >
          {isProcessing ? 'Creating...' : 'Create Invoice'}
        </button>
      </div>
    </div>
  );
};
