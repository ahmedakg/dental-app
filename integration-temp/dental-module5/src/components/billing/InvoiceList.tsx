// Module 5: Invoice List Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { Invoice } from '../types/billing';
import { getAllInvoices, searchInvoices, getInvoicesByStatus } from '../data/billingDatabase';
import { formatPKR, formatDate, getStatusColor } from '../utils/billingUtils';

interface InvoiceListProps {
  onInvoiceSelect: (invoice: Invoice) => void;
  onCreateInvoice?: () => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  onInvoiceSelect,
  onCreateInvoice
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [invoices, searchQuery, statusFilter, sortBy, sortOrder]);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await getAllInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...invoices];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(query) ||
        inv.patientName.toLowerCase().includes(query) ||
        inv.patientPhone.includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
          break;
        case 'amount':
          comparison = a.total - b.total;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredInvoices(filtered);
  };

  const handleStatusFilterChange = async (status: string) => {
    setStatusFilter(status);
    if (status !== 'all') {
      const filtered = await getInvoicesByStatus(status);
      // Will be further filtered by search query in useEffect
    }
  };

  const calculateTotalStats = () => {
    const total = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paid = filteredInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const due = filteredInvoices.reduce((sum, inv) => sum + inv.amountDue, 0);
    
    return { total, paid, due };
  };

  const stats = calculateTotalStats();

  if (isLoading) {
    return <div className="invoice-list-loading">Loading invoices...</div>;
  }

  return (
    <div className="invoice-list">
      <div className="list-header">
        <h2>Invoices</h2>
        {onCreateInvoice && (
          <button onClick={onCreateInvoice} className="btn-primary">
            + New Invoice
          </button>
        )}
      </div>

      <div className="list-filters">
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice #, patient name, or phone..."
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="list-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{formatPKR(stats.total)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Paid:</span>
          <span className="stat-value paid">{formatPKR(stats.paid)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Due:</span>
          <span className="stat-value due">{formatPKR(stats.due)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Invoices:</span>
          <span className="stat-value">{filteredInvoices.length}</span>
        </div>
      </div>

      <div className="invoices-table">
        {filteredInvoices.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Patient</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id} className="invoice-row">
                  <td className="invoice-number">{invoice.invoiceNumber}</td>
                  <td className="invoice-date">{formatDate(invoice.issuedAt)}</td>
                  <td className="patient-info">
                    <div className="patient-name">{invoice.patientName}</div>
                    <div className="patient-phone">{invoice.patientPhone}</div>
                  </td>
                  <td className="amount">{formatPKR(invoice.total)}</td>
                  <td className="paid-amount">{formatPKR(invoice.amountPaid)}</td>
                  <td className="due-amount">
                    {invoice.amountDue > 0 ? formatPKR(invoice.amountDue) : '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => onInvoiceSelect(invoice)}
                      className="btn-action"
                      title="View Invoice"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-invoices-message">
            <div className="no-data-icon">📄</div>
            <h3>No Invoices Found</h3>
            <p>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Create your first invoice to get started.'}
            </p>
          </div>
        )}
      </div>

      <div className="list-actions">
        <button onClick={loadInvoices} className="btn-secondary">
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};
