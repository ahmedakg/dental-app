// Module 7: Purchase Orders List Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { inventoryDb } from '../utils/inventoryDb';
import type { PurchaseOrder } from '../types/inventory';

export const PurchaseOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'ordered' | 'received' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await inventoryDb.orders.toArray();
      setOrders(allOrders.sort((a, b) => 
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      ));
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === selectedStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    ordered: orders.filter(o => o.status === 'ordered').length,
    received: orders.filter(o => o.status === 'received').length,
    totalValue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0)
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="status-icon" />,
      ordered: <ShoppingCart className="status-icon" />,
      received: <CheckCircle className="status-icon" />,
      cancelled: <XCircle className="status-icon" />
    };
    return icons[status as keyof typeof icons];
  };

  const getStatusClass = (status: string) => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading-state">Loading purchase orders...</div>
      </div>
    );
  }

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

      <div className="po-list-container">
        <div className="po-header">
          <h1 className="po-title">
            <ShoppingCart className="title-icon" />
            Purchase Orders
          </h1>
          <button 
            className="btn-primary"
            onClick={() => window.location.hash = '#/inventory/purchase'}
          >
            Create New Order
          </button>
        </div>

        {/* Stats */}
        <div className="po-stats-grid">
          <div className="po-stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="po-stat-card stat-pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
          <div className="po-stat-card stat-ordered">
            <div className="stat-label">Ordered</div>
            <div className="stat-value">{stats.ordered}</div>
          </div>
          <div className="po-stat-card stat-received">
            <div className="stat-label">Received</div>
            <div className="stat-value">{stats.received}</div>
          </div>
          <div className="po-stat-card stat-value">
            <div className="stat-label">Total Value</div>
            <div className="stat-value">Rs. {stats.totalValue.toLocaleString()}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="po-filters">
          <button
            className={`filter-btn ${selectedStatus === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('all')}
          >
            All ({orders.length})
          </button>
          <button
            className={`filter-btn ${selectedStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={`filter-btn ${selectedStatus === 'ordered' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('ordered')}
          >
            Ordered ({stats.ordered})
          </button>
          <button
            className={`filter-btn ${selectedStatus === 'received' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('received')}
          >
            Received ({stats.received})
          </button>
        </div>

        {/* Orders List */}
        <div className="po-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <Package className="empty-icon" />
              <p>No purchase orders found</p>
            </div>
          ) : (
            <table className="po-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Order Date</th>
                  <th>Supplier</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Expected Delivery</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="po-row">
                    <td className="po-number">{order.poNumber}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td className="supplier-name">{order.supplier}</td>
                    <td className="items-count">{order.items.length} items</td>
                    <td className="amount">Rs. {order.totalAmount.toLocaleString()}</td>
                    <td>
                      {order.expectedDelivery 
                        ? formatDate(order.expectedDelivery)
                        : '-'
                      }
                    </td>
                    <td>
                      <span className={getStatusClass(order.status)}>
                        {getStatusIcon(order.status)}
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-action btn-view"
                        onClick={() => window.location.hash = `#/inventory/order/${order.id}`}
                      >
                        <Eye className="btn-icon" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrdersList;
