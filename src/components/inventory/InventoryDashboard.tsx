// Module 7: Inventory Dashboard Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { 
  Package, AlertTriangle, TrendingUp, ShoppingCart, 
  Search, Plus, Filter, Download, RefreshCw 
} from 'lucide-react';
import { 
  inventoryDb, 
  initializeInventoryData, 
  getStockStatus,
  generateStockAlerts 
} from '../utils/inventoryDb';
import type { InventoryItem, StockStatus, ItemCategory, StockAlert } from '../types/inventory';
import '../styles/inventory.css';

export const InventoryDashboard: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<StockStatus | 'All'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await initializeInventoryData();
      const allItems = await inventoryDb.items.toArray();
      const generatedAlerts = await generateStockAlerts();
      
      setItems(allItems.sort((a, b) => a.name.localeCompare(b.name)));
      setAlerts(generatedAlerts.filter(a => !a.resolved));
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || getStockStatus(item) === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    totalItems: items.length,
    lowStock: items.filter(i => getStockStatus(i) === 'low').length,
    critical: items.filter(i => getStockStatus(i) === 'critical').length,
    outOfStock: items.filter(i => getStockStatus(i) === 'out_of_stock').length,
    totalValue: items.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0)
  };

  const categories: (ItemCategory | 'All')[] = [
    'All', 'Consumables', 'Instruments', 'Materials', 
    'Medications', 'Disposables', 'Equipment', 'Office Supplies'
  ];

  const statuses: (StockStatus | 'All')[] = ['All', 'in_stock', 'low', 'critical', 'out_of_stock'];

  const getStatusBadge = (item: InventoryItem) => {
    const status = getStockStatus(item);
    const badges = {
      in_stock: { label: 'In Stock', className: 'status-badge status-in-stock' },
      low: { label: 'Low Stock', className: 'status-badge status-low' },
      critical: { label: 'Critical', className: 'status-badge status-critical' },
      out_of_stock: { label: 'Out of Stock', className: 'status-badge status-out' }
    };
    return badges[status];
  };

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading-state">
          <RefreshCw className="loading-icon" />
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      {/* Header */}
      <div className="inventory-header">
        <div>
          <h1 className="inventory-title">
            <Package className="title-icon" />
            Inventory Management
          </h1>
          <p className="inventory-subtitle">Abdullah Dental Care - Stock Control</p>
        </div>
        <button className="btn-primary" onClick={() => window.location.hash = '#/inventory/add'}>
          <Plus className="btn-icon" />
          Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-header">
            <Package className="stat-icon" />
            <span className="stat-label">Total Items</span>
          </div>
          <div className="stat-value">{stats.totalItems}</div>
          <div className="stat-footer">All inventory items</div>
        </div>

        <div className="stat-card stat-value-card">
          <div className="stat-header">
            <TrendingUp className="stat-icon" />
            <span className="stat-label">Total Value</span>
          </div>
          <div className="stat-value">Rs. {stats.totalValue.toLocaleString()}</div>
          <div className="stat-footer">Current stock value</div>
        </div>

        <div className="stat-card stat-low">
          <div className="stat-header">
            <AlertTriangle className="stat-icon" />
            <span className="stat-label">Low Stock</span>
          </div>
          <div className="stat-value">{stats.lowStock}</div>
          <div className="stat-footer">Items need reordering</div>
        </div>

        <div className="stat-card stat-critical">
          <div className="stat-header">
            <AlertTriangle className="stat-icon" />
            <span className="stat-label">Critical</span>
          </div>
          <div className="stat-value">{stats.critical + stats.outOfStock}</div>
          <div className="stat-footer">Urgent action needed</div>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h2 className="alerts-title">
            <AlertTriangle className="alerts-icon" />
            Active Alerts ({alerts.length})
          </h2>
          <div className="alerts-list">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert.id} className={`alert-card alert-${alert.priority}`}>
                <div className="alert-header">
                  <span className="alert-item-name">{alert.itemName}</span>
                  <span className={`alert-type alert-type-${alert.alertType}`}>
                    {alert.alertType.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="alert-action">{alert.requiredAction}</div>
                <div className="alert-footer">
                  <span>Current: {alert.currentStock}</span>
                  <button 
                    className="btn-alert-action"
                    onClick={() => window.location.hash = `#/inventory/purchase`}
                  >
                    <ShoppingCart className="btn-icon" />
                    Create Purchase Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search items by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter className="filter-icon" />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | 'All')}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value as StockStatus | 'All')}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Status' : status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-secondary" onClick={loadData}>
          <RefreshCw className="btn-icon" />
          Refresh
        </button>
      </div>

      {/* Items List */}
      <div className="items-section">
        <div className="items-header">
          <h2>Inventory Items ({filteredItems.length})</h2>
          <button className="btn-secondary">
            <Download className="btn-icon" />
            Export
          </button>
        </div>

        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min / Max</th>
                <th>Unit Cost</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const badge = getStatusBadge(item);
                return (
                  <tr key={item.id} className={`item-row ${getStockStatus(item)}`}>
                    <td className="item-code">{item.code}</td>
                    <td className="item-name">
                      <div>{item.name}</div>
                      {item.location && (
                        <div className="item-location">{item.location}</div>
                      )}
                    </td>
                    <td>{item.category}</td>
                    <td className="stock-value">
                      <strong>{item.currentStock}</strong> {item.unit}
                    </td>
                    <td className="min-max">
                      {item.minStock} / {item.maxStock} {item.unit}
                    </td>
                    <td>Rs. {item.costPerUnit.toLocaleString()}</td>
                    <td className="total-value">
                      Rs. {(item.currentStock * item.costPerUnit).toLocaleString()}
                    </td>
                    <td>
                      <span className={badge.className}>{badge.label}</span>
                    </td>
                    <td className="supplier-name">{item.supplier}</td>
                    <td className="actions">
                      <button 
                        className="btn-action btn-adjust"
                        onClick={() => window.location.hash = `#/inventory/adjust/${item.id}`}
                        title="Adjust Stock"
                      >
                        Adjust
                      </button>
                      <button 
                        className="btn-action btn-view"
                        onClick={() => window.location.hash = `#/inventory/view/${item.id}`}
                        title="View Details"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
