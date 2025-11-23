// Module 6: Lab Work Tracking - Case Form Component
// Abdullah Dental Care Management System

import React, { useState, useEffect } from 'react';
import { LabCase, JobType, ChargeType, JOB_TYPES } from '../types/lab';
import { getAllLabs, getDefaultLab } from '../data/labPartners';
import { calculateExpectedReturn, calculateTotalCharges, formatTeethNumbers } from '../utils/labHelpers';

interface LabCaseFormProps {
  initialData?: Partial<LabCase>;
  onSubmit: (data: Partial<LabCase>) => void;
  onCancel: () => void;
}

const LabCaseForm: React.FC<LabCaseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const defaultLab = getDefaultLab();
  const allLabs = getAllLabs();

  const [formData, setFormData] = useState({
    patientName: initialData?.patientName || '',
    patientPhone: initialData?.patientPhone || '',
    jobType: initialData?.jobType || 'crown' as JobType,
    jobDescription: initialData?.jobDescription || '',
    teethNumbers: initialData?.teethNumbers || [] as number[],
    teethInput: initialData?.teethNumbers ? formatTeethNumbers(initialData.teethNumbers) : '',
    labName: initialData?.labName || defaultLab.name,
    chargeType: initialData?.chargeType || 'per_tooth' as ChargeType,
    chargesPerUnit: initialData?.chargesPerUnit || 0,
    totalUnits: initialData?.totalUnits || 1,
    dateSent: initialData?.dateSent || new Date().toISOString().split('T')[0],
    turnaroundDays: 7,
    notes: initialData?.notes || ''
  });

  const [patients] = useState(() => {
    const saved = localStorage.getItem('dentalPatients');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Auto-fill job description based on job type
    if (!initialData) {
      const jobType = JOB_TYPES.find(j => j.value === formData.jobType);
      if (jobType && !formData.jobDescription) {
        setFormData(prev => ({ ...prev, jobDescription: jobType.label }));
      }
    }
  }, [formData.jobType, initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find((p: any) => p.id === patientId);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientName: patient.name,
        patientPhone: patient.phone
      }));
    }
  };

  const handleTeethInput = (value: string) => {
    setFormData(prev => ({ ...prev, teethInput: value }));
    
    // Parse teeth numbers from input (e.g., "16, 17, 18" or "#16, #17")
    const numbers = value
      .replace(/#/g, '')
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0);
    
    setFormData(prev => ({ 
      ...prev, 
      teethNumbers: numbers,
      totalUnits: numbers.length > 0 ? numbers.length : 1
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientName || !formData.patientPhone) {
      alert('Please select or enter patient details');
      return;
    }

    if (formData.chargesPerUnit <= 0) {
      alert('Please enter valid lab charges');
      return;
    }

    const totalCharges = calculateTotalCharges(
      formData.chargesPerUnit,
      formData.totalUnits
    );

    const expectedReturn = calculateExpectedReturn(
      formData.dateSent,
      formData.turnaroundDays
    );

    const caseData: Partial<LabCase> = {
      patientId: `patient-${Date.now()}`,
      patientName: formData.patientName,
      patientPhone: formData.patientPhone,
      jobType: formData.jobType,
      jobDescription: formData.jobDescription,
      teethNumbers: formData.teethNumbers.length > 0 ? formData.teethNumbers : undefined,
      labName: formData.labName,
      chargeType: formData.chargeType,
      chargesPerUnit: formData.chargesPerUnit,
      totalUnits: formData.totalUnits,
      totalCharges,
      dateSent: formData.dateSent,
      expectedReturnDate: expectedReturn,
      notes: formData.notes
    };

    onSubmit(caseData);
  };

  return (
    <div className="lab-form-container">
      <form className="lab-case-form" onSubmit={handleSubmit}>
        <h2>{initialData ? 'Edit Lab Case' : 'New Lab Case'}</h2>

        <div className="form-section">
          <h3>Patient Information</h3>
          
          <div className="form-group">
            <label>Select Existing Patient (Optional)</label>
            <select
              onChange={(e) => handlePatientSelect(e.target.value)}
              className="form-input"
            >
              <option value="">-- New Patient --</option>
              {patients.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Patient Name *</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                value={formData.patientPhone}
                onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                className="form-input"
                placeholder="03XX-XXXXXXX"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Lab Work Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Job Type *</label>
              <select
                value={formData.jobType}
                onChange={(e) => handleInputChange('jobType', e.target.value)}
                className="form-input"
                required
              >
                {JOB_TYPES.map(job => (
                  <option key={job.value} value={job.value}>
                    {job.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Lab Name *</label>
              <select
                value={formData.labName}
                onChange={(e) => handleInputChange('labName', e.target.value)}
                className="form-input"
                required
              >
                {allLabs.map(lab => (
                  <option key={lab.id} value={lab.name}>
                    {lab.name} {lab.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <input
              type="text"
              value={formData.jobDescription}
              onChange={(e) => handleInputChange('jobDescription', e.target.value)}
              className="form-input"
              placeholder="e.g., PFM Crown #16, Full Upper Denture"
              required
            />
          </div>

          <div className="form-group">
            <label>Teeth Numbers (Optional)</label>
            <input
              type="text"
              value={formData.teethInput}
              onChange={(e) => handleTeethInput(e.target.value)}
              className="form-input"
              placeholder="e.g., 16, 17, 18 or #16, #17, #18"
            />
            <small className="form-hint">
              Enter FDI tooth numbers separated by commas
            </small>
          </div>
        </div>

        <div className="form-section">
          <h3>Charges & Timeline</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Charge Type *</label>
              <select
                value={formData.chargeType}
                onChange={(e) => handleInputChange('chargeType', e.target.value)}
                className="form-input"
              >
                <option value="per_tooth">Per Tooth</option>
                <option value="per_jaw">Per Jaw</option>
                <option value="per_case">Per Case</option>
              </select>
            </div>

            <div className="form-group">
              <label>Charges Per Unit (Rs.) *</label>
              <input
                type="number"
                value={formData.chargesPerUnit}
                onChange={(e) => handleInputChange('chargesPerUnit', parseFloat(e.target.value) || 0)}
                className="form-input"
                min="0"
                step="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Total Units *</label>
              <input
                type="number"
                value={formData.totalUnits}
                onChange={(e) => handleInputChange('totalUnits', parseInt(e.target.value) || 1)}
                className="form-input"
                min="1"
                required
              />
            </div>
          </div>

          <div className="total-charges-display">
            <strong>Total Lab Charges:</strong>
            <span className="charges-amount">
              Rs. {calculateTotalCharges(formData.chargesPerUnit, formData.totalUnits).toLocaleString('en-PK')}
            </span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date Sent *</label>
              <input
                type="date"
                value={formData.dateSent}
                onChange={(e) => handleInputChange('dateSent', e.target.value)}
                className="form-input"
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Turnaround (Days)</label>
              <input
                type="number"
                value={formData.turnaroundDays}
                onChange={(e) => handleInputChange('turnaroundDays', parseInt(e.target.value) || 7)}
                className="form-input"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Expected Return</label>
              <input
                type="text"
                value={calculateExpectedReturn(formData.dateSent, formData.turnaroundDays)}
                className="form-input"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="form-input"
              rows={3}
              placeholder="Any special instructions or notes..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            {initialData ? 'Update Case' : 'Create Lab Case'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabCaseForm;
