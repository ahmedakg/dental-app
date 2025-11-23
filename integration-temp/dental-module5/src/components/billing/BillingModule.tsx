// Module 5: Main Billing Module Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { Invoice } from '../types/billing';
import { initializeBillingSettings } from '../data/billingDatabase';
import { InvoiceCreation } from './InvoiceCreation';
import { PaymentRecording } from './PaymentRecording';
import { RevenueDashboard } from './RevenueDashboard';
import { InvoiceList } from './InvoiceList';
import { InvoiceDetail } from './InvoiceDetail';
import { ExpenseManagement } from './ExpenseManagement';
import { NaveedPerformanceDashboard } from './NaveedPerformanceDashboard';

type BillingView = 
  | 'dashboard' 
  | 'invoices' 
  | 'create-invoice' 
  | 'invoice-detail'
  | 'record-payment'
  | 'expenses'
  | 'naveed-performance';

interface BillingModuleProps {
  // Mock data for demo - in real app, would come from other modules
  patients?: any[];
  treatments?: any[];
  currentUser?: string;
}

export const BillingModule: React.FC<BillingModuleProps> = ({
  patients = [],
  treatments = [],
  currentUser = 'Dr. Ahmed'
}) => {
  const [currentView, setCurrentView] = useState<BillingView>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      await initializeBillingSettings();
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize billing module:', error);
    }
  };

  const handleViewChange = (view: BillingView) => {
    setCurrentView(view);
    if (view !== 'invoice-detail' && view !== 'record-payment') {
      setSelectedInvoice(null);
    }
  };

  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('invoice-detail');
  };

  const handleInvoiceCreated = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('invoice-detail');
  };

  const handleRecordPayment = () => {
    if (selectedInvoice) {
      setCurrentView('record-payment');
    }
  };

  const handlePaymentRecorded = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('invoice-detail');
  };

  const handlePrintInvoice = () => {
    // Trigger browser print
    window.print();
  };

  if (!isInitialized) {
    return (
      <div className="billing-module-loading">
        <div className="loading-spinner"></div>
        <p>Initializing Billing Module...</p>
      </div>
    );
  }

  return (
    <div className="billing-module">
      <nav className="billing-nav">
        <div className="nav-brand">
          <h1>💰 Billing & Revenue</h1>
        </div>
        
        <div className="nav-links">
          <button
            className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleViewChange('dashboard')}
          >
            📊 Dashboard
          </button>
          
          <button
            className={`nav-link ${currentView === 'invoices' ? 'active' : ''}`}
            onClick={() => handleViewChange('invoices')}
          >
            📄 Invoices
          </button>
          
          <button
            className={`nav-link ${currentView === 'expenses' ? 'active' : ''}`}
            onClick={() => handleViewChange('expenses')}
          >
            💸 Expenses
          </button>
          
          <button
            className={`nav-link ${currentView === 'naveed-performance' ? 'active' : ''}`}
            onClick={() => handleViewChange('naveed-performance')}
          >
            🎯 Naveed's Performance
          </button>
        </div>

        <div className="nav-actions">
          <button
            onClick={() => handleViewChange('create-invoice')}
            className="btn-create-invoice"
          >
            + New Invoice
          </button>
        </div>
      </nav>

      <div className="billing-content">
        {currentView === 'dashboard' && (
          <RevenueDashboard />
        )}

        {currentView === 'invoices' && (
          <InvoiceList
            onInvoiceSelect={handleInvoiceSelect}
            onCreateInvoice={() => handleViewChange('create-invoice')}
          />
        )}

        {currentView === 'create-invoice' && (
          <InvoiceCreation
            patient={patients[0] || { id: '1', name: 'Demo Patient', phone: '0300-0000000' }}
            treatments={treatments}
            onInvoiceCreated={handleInvoiceCreated}
            onCancel={() => handleViewChange('invoices')}
          />
        )}

        {currentView === 'invoice-detail' && selectedInvoice && (
          <InvoiceDetail
            invoice={selectedInvoice}
            onRecordPayment={handleRecordPayment}
            onPrint={handlePrintInvoice}
            onClose={() => handleViewChange('invoices')}
          />
        )}

        {currentView === 'record-payment' && selectedInvoice && (
          <PaymentRecording
            invoice={selectedInvoice}
            onPaymentRecorded={handlePaymentRecorded}
            onCancel={() => setCurrentView('invoice-detail')}
          />
        )}

        {currentView === 'expenses' && (
          <ExpenseManagement />
        )}

        {currentView === 'naveed-performance' && (
          <NaveedPerformanceDashboard />
        )}
      </div>
    </div>
  );
};
