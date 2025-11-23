// Module 6: Lab Work Tracking - Main Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { LabCase, LabCaseStatus } from '../types/lab';
import { mockLabPartners, getDefaultLab } from '../data/labPartners';
import { generateLabCaseNumber, sortLabCases, filterLabCases, getLabStatistics } from '../utils/labHelpers';
import LabCaseForm from './LabCaseForm';
import LabCaseList from './LabCaseList';
import LabStatistics from './LabStatistics';
import '../styles/lab.css';

const LabWorkManagement: React.FC = () => {
  const [labCases, setLabCases] = useState<LabCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<LabCase[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<LabCase | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLab, setSelectedLab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('date');

  // Load saved lab cases from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dentalLabCases');
    if (saved) {
      setLabCases(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever cases change
  useEffect(() => {
    if (labCases.length > 0) {
      localStorage.setItem('dentalLabCases', JSON.stringify(labCases));
    }
  }, [labCases]);

  // Apply filters and sorting
  useEffect(() => {
    let result = filterLabCases(labCases, {
      status: selectedStatus,
      labName: selectedLab,
      searchTerm
    });
    result = sortLabCases(result, sortBy);
    setFilteredCases(result);
  }, [labCases, selectedStatus, selectedLab, searchTerm, sortBy]);

  const handleAddCase = (caseData: Partial<LabCase>) => {
    const newCase: LabCase = {
      id: `case-${Date.now()}`,
      caseNumber: generateLabCaseNumber(),
      createdAt: new Date().toISOString(),
      createdBy: 'Dr. Ahmed',
      updatedAt: new Date().toISOString(),
      status: 'sent',
      ...caseData
    } as LabCase;

    setLabCases(prev => [newCase, ...prev]);
    setShowForm(false);

    // Auto-add lab expense
    const expense = {
      id: `exp-${Date.now()}`,
      labCaseId: newCase.id,
      amount: newCase.totalCharges,
      date: newCase.dateSent,
      paid: false,
      category: 'Lab Charges'
    };
    
    // Save expense to localStorage
    const savedExpenses = localStorage.getItem('dentalExpenses');
    const expenses = savedExpenses ? JSON.parse(savedExpenses) : [];
    localStorage.setItem('dentalExpenses', JSON.stringify([expense, ...expenses]));
  };

  const handleUpdateCase = (caseData: Partial<LabCase>) => {
    if (!editingCase) return;

    const updatedCase: LabCase = {
      ...editingCase,
      ...caseData,
      updatedAt: new Date().toISOString()
    };

    setLabCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    setEditingCase(null);
    setShowForm(false);
  };

  const handleUpdateStatus = (caseId: string, newStatus: LabCaseStatus) => {
    setLabCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      
      const updated = {
        ...c,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      if (newStatus === 'returned' && !c.actualReturnDate) {
        updated.actualReturnDate = new Date().toISOString().split('T')[0];
      }

      if (newStatus === 'delivered' && !c.dateDelivered) {
        updated.dateDelivered = new Date().toISOString().split('T')[0];
      }

      return updated;
    }));
  };

  const handleDeleteCase = (caseId: string) => {
    if (confirm('Are you sure you want to delete this lab case?')) {
      setLabCases(prev => prev.filter(c => c.id !== caseId));
    }
  };

  const handleEdit = (labCase: LabCase) => {
    setEditingCase(labCase);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCase(null);
  };

  const statistics = getLabStatistics(labCases);
  const uniqueLabs = Array.from(new Set(labCases.map(c => c.labName)));

  return (
    <div className="lab-work-management">
      <div className="lab-header">
        <div className="lab-header-left">
          <h1>🧪 Lab Work Tracking</h1>
          <p className="lab-subtitle">Manage dental lab cases and expenses</p>
        </div>
        <button 
          className="btn-add-case"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Close' : '+ New Lab Case'}
        </button>
      </div>

      <LabStatistics statistics={statistics} />

      {showForm && (
        <div className="lab-form-overlay">
          <LabCaseForm
            initialData={editingCase || undefined}
            onSubmit={editingCase ? handleUpdateCase : handleAddCase}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="lab-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent to Lab</option>
            <option value="in_progress">In Progress</option>
            <option value="returned">Returned</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Lab:</label>
          <select 
            value={selectedLab} 
            onChange={(e) => setSelectedLab(e.target.value)}
          >
            <option value="all">All Labs</option>
            {uniqueLabs.map(lab => (
              <option key={lab} value={lab}>{lab}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date Sent</option>
            <option value="return">Return Date</option>
            <option value="patient">Patient Name</option>
            <option value="status">Status</option>
            <option value="charges">Charges</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <input
            type="text"
            placeholder="🔍 Search cases, patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <LabCaseList
        cases={filteredCases}
        onUpdateStatus={handleUpdateStatus}
        onEdit={handleEdit}
        onDelete={handleDeleteCase}
      />

      {filteredCases.length === 0 && (
        <div className="no-cases">
          <div className="no-cases-icon">🧪</div>
          <p>No lab cases found</p>
          <p className="no-cases-hint">Create your first lab case to get started</p>
        </div>
      )}
    </div>
  );
};

export default LabWorkManagement;
