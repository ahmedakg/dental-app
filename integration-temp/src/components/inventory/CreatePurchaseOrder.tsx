// Module 7: Purchase Order Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, ShoppingCart } from 'lucide-react';
import { inventoryDb, generateNextPONumber } from '../utils/inventoryDb';
import type { InventoryItem, Supplier, PurchaseOrder, PurchaseOrderItem } from '../types/inventory';

export const CreatePurchaseOrder: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allItems = await inventoryDb.items.toArray();
    const allSuppliers = await inventoryDb.suppliers.where('isActive').equals(true).toArray();
    setItems(allItems.sort((a, b) => a.name.localeCompare(b.name)));
    setSuppliers(allSuppliers);
  };

  const availableItems = selectedSupplier
    ? items.filter(item => item.supplier === suppliers.find(s => s.id === selectedSupplier)?.name)
    : items;

  const addItem = (item: InventoryItem) => {
    const existing = orderItems.find(oi => oi.itemId === item.id);
    if (existing) return;

    const reorderQty = item.maxStock - item.currentStock;
    const newOrderItem: PurchaseOrderItem = {
      itemId: item.id,
      itemName: item.name,
      quantity: reorderQty > 0 ? reorderQty : 10,
      unitCost: item.costPerUnit,
      totalCost: (reorderQty > 0 ? reorderQty : 10) * item.costPerUnit
    };

    setOrderItems([...orderItems, newOrderItem]);
  };

  const removeItem = (itemId: string) => {
    setOrderItems(orderItems.filter(oi => oi.itemId !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setOrderItems(orderItems.map(oi => 
      oi.itemId === itemId 
        ? { ...oi, quantity, totalCost: quantity * oi.unitCost }
        : oi
    ));
  };

  const updateUnitCost = (itemId: string, unitCost: number) => {
    setOrderItems(orderItems.map(oi => 
      oi.itemId === itemId 
        ? { ...oi, unitCost, totalCost: oi.quantity * unitCost }
        : oi
    ));
  };

  const totalAmount = orderItems.reduce((sum, oi) => sum + oi.totalCost, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || orderItems.length === 0) return;

    setLoading(true);

    try {
      const poNumber = await generateNextPONumber();
      const supplier = suppliers.find(s => s.id === selectedSupplier);

      const order: PurchaseOrder = {
        id: `PO-${Date.now()}`,
        poNumber,
        supplier: supplier?.name || '',
        items: orderItems,
        totalAmount,
        orderDate: new Date().toISOString(),
        expectedDelivery: expectedDelivery || undefined,
        status: 'pending',
        notes: notes || undefined,
        createdBy: 'Naveed',
        createdAt: new Date().toISOString()
      };

      await inventoryDb.orders.add(order);

      // Update supplier stats
      if (supplier) {
        await inventoryDb.suppliers.update(supplier.id, {
          totalOrders: supplier.totalOrders + 1
        });
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.hash = '#/inventory/orders';
      }, 1500);
    } catch (error) {
      console.error('Error creating purchase order:', error);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="po-form-container">
        <h1 className="form-title">
          <ShoppingCart className="title-icon" />
          Create Purchase Order
        </h1>

        {success && (
          <div className="alert alert-success">
            Purchase order created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="po-form">
          {/* Supplier Selection */}
          <div className="form-group">
            <label className="form-label">Supplier *</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select supplier...</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} - {supplier.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Expected Delivery */}
          <div className="form-group">
            <label className="form-label">Expected Delivery Date</label>
            <input
              type="date"
              value={expectedDelivery}
              onChange={(e) => setExpectedDelivery(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
            />
          </div>

          {/* Add Items */}
          {selectedSupplier && (
            <div className="form-group">
              <label className="form-label">Add Items</label>
              <select
                onChange={(e) => {
                  const item = items.find(i => i.id === e.target.value);
                  if (item) {
                    addItem(item);
                    e.target.value = '';
                  }
                }}
                className="form-select"
              >
                <option value="">Select item to add...</option>
                {availableItems
                  .filter(item => !orderItems.find(oi => oi.itemId === item.id))
                  .map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - Current: {item.currentStock}, Need: {item.maxStock - item.currentStock}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Order Items Table */}
          {orderItems.length > 0 && (
            <div className="order-items-section">
              <h3>Order Items ({orderItems.length})</h3>
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Cost (Rs.)</th>
                    <th>Total (Rs.)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map(orderItem => (
                    <tr key={orderItem.itemId}>
                      <td>{orderItem.itemName}</td>
                      <td>
                        <input
                          type="number"
                          value={orderItem.quantity}
                          onChange={(e) => updateQuantity(orderItem.itemId, parseInt(e.target.value) || 0)}
                          min="1"
                          className="quantity-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={orderItem.unitCost}
                          onChange={(e) => updateUnitCost(orderItem.itemId, parseInt(e.target.value) || 0)}
                          min="0"
                          className="cost-input"
                        />
                      </td>
                      <td className="total-cell">
                        {orderItem.totalCost.toLocaleString()}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeItem(orderItem.itemId)}
                          className="btn-remove"
                        >
                          <Trash2 className="btn-icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="total-label">Total Amount:</td>
                    <td className="total-amount">Rs. {totalAmount.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
              rows={3}
              placeholder="Any special instructions or notes..."
            />
          </div>

          {/* Actions */}
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
              disabled={!selectedSupplier || orderItems.length === 0 || loading}
            >
              <Save className="btn-icon" />
              {loading ? 'Creating...' : 'Create Purchase Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
