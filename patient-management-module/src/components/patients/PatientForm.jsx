import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Save, AlertCircle } from 'lucide-react';
import { db } from '../../lib/db';

const BEHAVIOR_TAGS = [
  'Regular', 'VIP', 'Rich', 'Poor', 'Miser', 'Difficult', 'Con Artist', 'Over Sensitive', 'Irritating'
];

export default function PatientForm({ patient, onSave, onCancel }) {
  const isEditing = !!patient;
  const [isExtended, setIsExtended] = useState(isEditing);
  const [errors, setErrors] = useState({});
  const [isDuplicatePhone, setIsDuplicatePhone] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Male',
    address: '',
    occupation: '',
    behaviorTag: 'Regular',
    medicalHistory: {
      bloodThinners: false,
      diabetes: false,
      heartConditions: false,
      allergies: '',
      communicableDiseases: false,
      pregnancy: false,
      otherConditions: ''
    },
    notes: ''
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        phone: patient.phone || '',
        age: patient.age || '',
        gender: patient.gender || 'Male',
        address: patient.address || '',
        occupation: patient.occupation || '',
        behaviorTag: patient.behaviorTag || 'Regular',
        medicalHistory: patient.medicalHistory || {
          bloodThinners: false,
          diabetes: false,
          heartConditions: false,
          allergies: '',
          communicableDiseases: false,
          pregnancy: false,
          otherConditions: ''
        },
        notes: patient.notes || ''
      });
    }
  }, [patient]);

  // Check for duplicate phone
  useEffect(() => {
    const checkDuplicate = async () => {
      if (formData.phone.length === 11) {
        const existing = await db.patients
          .where('phone')
          .equals(formData.phone)
          .first();
        
        if (existing && (!patient || existing.id !== patient.id)) {
          setIsDuplicatePhone(true);
        } else {
          setIsDuplicatePhone(false);
        }
      }
    };
    checkDuplicate();
  }, [formData.phone, patient]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleMedicalHistoryChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value
      }
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^03\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 11 digits starting with 03 (e.g., 03345822622)';
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }

    // Duplicate phone
    if (isDuplicatePhone) {
      newErrors.phone = 'This phone number is already registered';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
        createdAt: patient?.createdAt || new Date(),
        totalSpent: patient?.totalSpent || 0,
        outstandingBalance: patient?.outstandingBalance || 0,
        lastVisit: patient?.lastVisit || null
      };

      if (patient) {
        // Update existing
        await db.patients.update(patient.id, patientData);
      } else {
        // Create new
        await db.patients.add(patientData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Error saving patient. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content patient-form-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Patient' : 'Add New Patient'}</h2>
          <button className="icon-button" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="patient-form">
          {/* Quick Mode Fields */}
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter patient name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
                placeholder="03XXXXXXXXX"
                maxLength={11}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
              {isDuplicatePhone && !errors.phone && (
                <span className="warning-text">
                  <AlertCircle size={16} />
                  This phone number already exists
                </span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  placeholder="Age"
                  min="1"
                  max="120"
                  className={errors.age ? 'error' : ''}
                />
                {errors.age && <span className="error-text">{errors.age}</span>}
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <div className="radio-group">
                  {['Male', 'Female', 'Other'].map(gender => (
                    <label key={gender} className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                      />
                      {gender}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Extended Mode Toggle */}
          <button
            type="button"
            className="extend-toggle"
            onClick={() => setIsExtended(!isExtended)}
          >
            {isExtended ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            {isExtended ? 'Hide' : 'Show'} Extended Information
          </button>

          {/* Extended Mode Fields */}
          {isExtended && (
            <>
              <div className="form-section">
                <h3>Additional Information</h3>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Full address"
                    rows={2}
                  />
                </div>

                <div className="form-group">
                  <label>Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    placeholder="For affordability assessment"
                  />
                </div>

                <div className="form-group">
                  <label>Behavior Tag</label>
                  <select
                    value={formData.behaviorTag}
                    onChange={(e) => handleChange('behaviorTag', e.target.value)}
                  >
                    {BEHAVIOR_TAGS.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <small>Confidential - For internal use only</small>
                </div>
              </div>

              <div className="form-section medical-history-section">
                <h3>Medical History</h3>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.medicalHistory.bloodThinners}
                      onChange={(e) => handleMedicalHistoryChange('bloodThinners', e.target.checked)}
                    />
                    Blood Thinners
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.medicalHistory.diabetes}
                      onChange={(e) => handleMedicalHistoryChange('diabetes', e.target.checked)}
                    />
                    Diabetes
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.medicalHistory.heartConditions}
                      onChange={(e) => handleMedicalHistoryChange('heartConditions', e.target.checked)}
                    />
                    Heart Conditions
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.medicalHistory.communicableDiseases}
                      onChange={(e) => handleMedicalHistoryChange('communicableDiseases', e.target.checked)}
                    />
                    Communicable Diseases
                  </label>

                  {formData.gender === 'Female' && (
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.medicalHistory.pregnancy}
                        onChange={(e) => handleMedicalHistoryChange('pregnancy', e.target.checked)}
                      />
                      Pregnancy
                    </label>
                  )}
                </div>

                <div className="form-group">
                  <label>Allergies</label>
                  <input
                    type="text"
                    value={formData.medicalHistory.allergies}
                    onChange={(e) => handleMedicalHistoryChange('allergies', e.target.value)}
                    placeholder="Comma-separated (e.g., Penicillin, Latex)"
                  />
                </div>

                <div className="form-group">
                  <label>Other Conditions</label>
                  <textarea
                    value={formData.medicalHistory.otherConditions}
                    onChange={(e) => handleMedicalHistoryChange('otherConditions', e.target.value)}
                    placeholder="Any other medical conditions"
                    rows={2}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Private Notes</h3>
                <div className="form-group">
                  <label>Notes (Dr. Ahmed only)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Private notes about the patient"
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={Object.keys(errors).length > 0 || isDuplicatePhone}
            >
              <Save size={20} />
              {isEditing ? 'Update Patient' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
