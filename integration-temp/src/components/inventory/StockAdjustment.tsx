// Module 7: Stock Adjustment Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Minus, AlertCircle } from 'lucide-react';
import { inventoryDb, recordStockTransaction, getStockStatus } from '../utils/inventoryDb';
import type { InventoryItem } from '../types/inventory';

interface StockAdjustmentProps {
  itemId?: string;
}

export const StockAdjustment: React.FC<StockAdjustmentProps> = ({ itemId }) => {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (itemId) {
      loadItem();
    }
  }, [itemId]);

  const loadItem = async () => {
    if (!itemId) return;
    try {
      const loadedItem = await inventoryDb.items.get(itemId);
      if (loadedItem) {
        setItem(loadedItem);
      }
    } catch (err) {
      setError('Failed to load item');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || quantity <= 0) return;

    setLoading(true);
    setError('');

    try {
      await recordStockTransaction(
        item.id,
        adjustmentType,
        quantity,
        reason,
        'Naveed'
      );

      setSuccess(true);
      setTimeout(() => {
        window.location.hash = '#/inventory';
      }, 1500);
    } catch (err) {
      setError('Failed to record adjustment');
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <div className="inventory-container">
        <div className="loading-state">Loading item...</div>
      </div>
    );
  }

  const newStock = adjustmentType === 'in' 
    ? item.currentStock + quantity 
    : item.currentStock - quantity;

  const isValid = quantity > 0 && 
                 (adjustmentType === 'in' || quantity <= item.currentStock);

  return (
    <div className="inventory-container">
      <div className="page-header">
        <button 
          className="btn-back" 
          onClick={() => window.location.hash = '#/inventory'}
        >
          <ArrowLeft className="btn-icon" />
          Back to Inventory
        </button>
      </div>

      <div className="adjustment-form-container">
        <h1 className="form-title">Stock Adjustment</h1>

        {success && (
          <div className="alert alert-success">
            <AlertCircle className="alert-icon" />
            Stock adjusted successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <AlertCircle className="alert-icon" />
            {error}
          </div>
        )}

        {/* Item Info */}
        <div className="item-info-card">
          <div className="item-info-row">
            <span className="info-label">Item:</span>
            <span className="info-value">{item.name}</span>
          </div>
          <div className="item-info-row">
            <span className="info-label">Code:</span>
            <span className="info-value">{item.code}</span>
          </div>
          <div className="item-info-row">
            <span className="info-label">Current Stock:</span>
            <span className="info-value stock-highlight">
              {item.currentStock} {item.unit}
            </span>
          </div>
          <div className="item-info-row">
            <span className="info-label">Status:</span>
            <span className={`status-badge status-${getStockStatus(item)}`}>
              {getStockStatus(item).replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Adjustment Form */}
        <form onSubmit={handleSubmit} className="adjustment-form">
          {/* Adjustment Type */}
          <div className="form-group">
            <label className="form-label">Adjustment Type</label>
            <div className="adjustment-type-buttons">
              <button
                type="button"
                className={`type-btn ${adjustmentType === 'in' ? 'active' : ''}`}
                onClick={() => setAdjustmentType('in')}
              >
                <Plus className="btn-icon" />
                Add Stock
              </button>
              <button
                type="button"
                className={`type-btn ${adjustmentType === 'out' ? 'active' : ''}`}
                onClick={() => setAdjustmentType('out')}
              >
                <Minus className="btn-icon" />
                Remove Stock
              </button>
              <button
                type="button"
                className={`type-btn ${adjustmentType === 'adjustment' ? 'active' : ''}`}
                onClick={() => setAdjustmentType('adjustment')}
              >
                Adjust
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label className="form-label">Quantity ({item.unit})</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              min="0"
              max={adjustmentType === 'out' ? item.currentStock : undefined}
              className="form-input"
              placeholder="Enter quantity"
            />
            {adjustmentType === 'out' && quantity > item.currentStock && (
              <div className="form-error">
                Cannot remove more than current stock ({item.currentStock})
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="form-group">
            <label className="form-label">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select reason...</option>
              {adjustmentType === 'in' && (
                <>
                  <option value="Purchase received">Purchase received</option>
                  <option value="Returned from use">Returned from use</option>
                  <option value="Correction">Correction</option>
                </>
              )}
              {adjustmentType === 'out' && (
                <>
                  <option value="Used in treatment">Used in treatment</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Expired">Expired</option>
                  <option value="Sample given">Sample given</option>
                  <option value="Correction">Correction</option>
                </>
              )}
              {adjustmentType === 'adjustment' && (
                <>
                  <option value="Physical count correction">Physical count correction</option>
                  <option value="System error correction">System error correction</option>
                </>
              )}
            </select>
          </div>

          {/* Preview */}
          <div className="adjustment-preview">
            <h3>Preview</h3>
            <div className="preview-calculation">
              <span className="preview-current">
                Current: {item.currentStock} {item.unit}
              </span>
              <span className="preview-operator">
                {adjustmentType === 'in' ? '+' : '-'}
              </span>
              <span className="preview-quantity">
                {quantity} {item.unit}
              </span>
              <span className="preview-equals">=</span>
              <span className={`preview-result ${newStock < item.minStock ? 'warning' : ''}`}>
                New Stock: {newStock} {item.unit}
              </span>
            </div>

            {newStock < item.minStock && (
              <div className="preview-warning">
                <AlertCircle className="warning-icon" />
                Warning: New stock will be below minimum level ({item.minStock})
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => window.location.hash = '#/inventory'}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!isValid || loading}
            >
              <Save className="btn-icon" />
              {loading ? 'Saving...' : 'Save Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustment;
