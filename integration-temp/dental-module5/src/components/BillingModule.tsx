// Module 5: Main Billing Module Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import InvoiceForm from './billing/InvoiceForm';
import InvoiceList from './billing/InvoiceList';
import RevenueDashboard from './billing/RevenueDashboard';
import ExpenseTracker from './billing/ExpenseTracker';
import NaveedDashboard from './billing/NaveedDashboard';
import type { Invoice, Expense, NaveedPerformance } from '../types/billing';

type ViewMode = 'dashboard' | 'invoices' | 'expenses' | 'naveed' | 'new-invoice' | 'edit-invoice';

interface BillingModuleProps {
  // If you want to pass in data from parent/database
  initialInvoices?: Invoice[];
  initialExpenses?: Expense[];
  currentUserId: string;
  currentUserName: string;
}

export default function BillingModule({
  initialInvoices = [],
  initialExpenses = [],
  currentUserId,
  currentUserName
}: BillingModuleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // For new invoice (would come from patient selection)
  const [newInvoicePatient, setNewInvoicePatient] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);

  /**
   * Load data from IndexedDB/storage
   */
  useEffect(() => {
    // TODO: Load from IndexedDB
    // Example:
    // const loadedInvoices = await db.invoices.toArray();
    // setInvoices(loadedInvoices);
  }, []);

  /**
   * Save invoice
   */
  const handleSaveInvoice = (invoice: Invoice) => {
    const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
    
    if (existingIndex >= 0) {
      // Update existing
      const updated = [...invoices];
      updated[existingIndex] = invoice;
      setInvoices(updated);
    } else {
      // Add new
      setInvoices([...invoices, invoice]);
    }

    // TODO: Save to IndexedDB
    // await db.invoices.put(invoice);

    setViewMode('invoices');
    setSelectedInvoice(null);
  };

  /**
   * Delete invoice
   */
  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(inv => inv.id !== invoiceId));
    // TODO: Delete from IndexedDB
    // await db.invoices.delete(invoiceId);
  };

  /**
   * Add expense
   */
  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
    // TODO: Save to IndexedDB
    // await db.expenses.put(expense);
  };

  /**
   * Delete expense
   */
  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(exp => exp.id !== expenseId));
    // TODO: Delete from IndexedDB
    // await db.expenses.delete(expenseId);
  };

  /**
   * Print invoice
   */
  const handlePrintInvoice = (invoice: Invoice) => {
    // TODO: Generate PDF and trigger print
    console.log('Print invoice:', invoice.invoiceNumber);
    alert('PDF generation coming in next update!');
  };

  /**
   * Calculate Naveed's performance
   * In real app, this would be calculated from actual data
   */
  const naveedPerformance: NaveedPerformance = {
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString()
    },
    newPatientsAdded: 12,
    appointmentsBooked: 45,
    appointmentsFilled: 8,
    paymentsCollected: invoices.reduce((sum, inv) => sum + inv.amountPaid, 0),
    collectionRate: 87.5,
    averageCheckoutTime: 9.5,
    invoiceAccuracy: 96.8,
    revenueGenerated: invoices.reduce((sum, inv) => sum + inv.total, 0),
    discountsGiven: invoices.reduce((sum, inv) => sum + (inv.discount || 0), 0),
    totalPoints: 3450,
    level: 7,
    rank: 'Pro'
  };

  /**
   * Handle creating new invoice - this would normally open patient selector first
   */
  const handleNewInvoice = () => {
    // For demo purposes, using dummy patient
    setNewInvoicePatient({
      id: 'patient-demo',
      name: 'Demo Patient',
      phone: '0300-1234567'
    });
    setViewMode('new-invoice');
  };

  return (
    <div className="billing-module">
      {/* Navigation */}
      <nav className="billing-nav">
        <h1>💰 Billing & Revenue</h1>
        
        <div className="nav-buttons">
          <button
            className={viewMode === 'dashboard' ? 'active' : ''}
            onClick={() => setViewMode('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={viewMode === 'invoices' ? 'active' : ''}
            onClick={() => setViewMode('invoices')}
          >
            📄 Invoices
          </button>
          <button
            className={viewMode === 'expenses' ? 'active' : ''}
            onClick={() => setViewMode('expenses')}
          >
            💸 Expenses
          </button>
          <button
            className={viewMode === 'naveed' ? 'active' : ''}
            onClick={() => setViewMode('naveed')}
          >
            👨‍⚕️ Naveed
          </button>
        </div>

        {viewMode === 'invoices' && (
          <button className="btn-primary" onClick={handleNewInvoice}>
            + New Invoice
          </button>
        )}
      </nav>

      {/* Content */}
      <div className="billing-content">
        {viewMode === 'dashboard' && (
          <RevenueDashboard
            invoices={invoices}
            expenses={expenses}
          />
        )}

        {viewMode === 'invoices' && (
          <InvoiceList
            invoices={invoices}
            onViewInvoice={(invoice) => {
              setSelectedInvoice(invoice);
              setViewMode('edit-invoice');
            }}
            onEditInvoice={(invoice) => {
              setSelectedInvoice(invoice);
              setViewMode('edit-invoice');
            }}
            onDeleteInvoice={handleDeleteInvoice}
            onPrintInvoice={handlePrintInvoice}
          />
        )}

        {viewMode === 'expenses' && (
          <ExpenseTracker
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {viewMode === 'naveed' && (
          <NaveedDashboard performance={naveedPerformance} />
        )}

        {viewMode === 'new-invoice' && newInvoicePatient && (
          <InvoiceForm
            patientId={newInvoicePatient.id}
            patientName={newInvoicePatient.name}
            patientPhone={newInvoicePatient.phone}
            onSave={handleSaveInvoice}
            onCancel={() => {
              setViewMode('invoices');
              setNewInvoicePatient(null);
            }}
          />
        )}

        {viewMode === 'edit-invoice' && selectedInvoice && (
          <InvoiceForm
            patientId={selectedInvoice.patientId}
            patientName={selectedInvoice.patientName}
            patientPhone={selectedInvoice.patientPhone}
            existingInvoice={selectedInvoice}
            onSave={handleSaveInvoice}
            onCancel={() => {
              setViewMode('invoices');
              setSelectedInvoice(null);
            }}
          />
        )}
      </div>

      <style>{`
        .billing-module {
          min-height: 100vh;
          background-color: #F9FAFB;
        }

        .billing-nav {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background-color: white;
          border-bottom: 1px solid #E5E7EB;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .billing-nav h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1F2937;
          margin: 0;
        }

        .nav-buttons {
          display: flex;
          gap: 10px;
          flex: 1;
        }

        .nav-buttons button {
          padding: 10px 20px;
          border: 1px solid #D1D5DB;
          background-color: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-buttons button:hover {
          background-color: #F3F4F6;
        }

        .nav-buttons button.active {
          background-color: #3B82F6;
          color: white;
          border-color: #3B82F6;
        }

        .billing-content {
          padding: 20px;
        }

        @media (max-width: 768px) {
          .billing-nav {
            flex-direction: column;
            align-items: stretch;
          }

          .nav-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
