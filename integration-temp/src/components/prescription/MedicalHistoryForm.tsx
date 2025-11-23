// Module 4: Medical History Component
// Manages patient medical history for safety screening

import React, { useState } from 'react';
import { PatientMedicalHistory } from '../../types/prescription';

interface MedicalHistoryFormProps {
  patientId: string;
  initialHistory?: PatientMedicalHistory;
  onSave: (history: PatientMedicalHistory) => void;
  onCancel: () => void;
}

export const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  patientId,
  initialHistory,
  onSave,
  onCancel
}) => {
  const [history, setHistory] = useState<PatientMedicalHistory>(
    initialHistory || {
      patientId,
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      isPregnant: false,
      isBreastfeeding: false,
      bloodThinners: false,
      diabetic: false,
      hypertensive: false,
      asthmatic: false,
      liverDisease: false,
      kidneyDisease: false,
      lastUpdated: new Date().toISOString()
    }
  );

  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');

  const handleAddAllergy = () => {
    if (allergyInput.trim()) {
      setHistory({
        ...history,
        allergies: [...history.allergies, allergyInput.trim()]
      });
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (index: number) => {
    setHistory({
      ...history,
      allergies: history.allergies.filter((_, i) => i !== index)
    });
  };

  const handleAddCondition = () => {
    if (conditionInput.trim()) {
      setHistory({
        ...history,
        chronicConditions: [...history.chronicConditions, conditionInput.trim()]
      });
      setConditionInput('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setHistory({
      ...history,
      chronicConditions: history.chronicConditions.filter((_, i) => i !== index)
    });
  };

  const handleAddMedication = () => {
    if (medicationInput.trim()) {
      setHistory({
        ...history,
        currentMedications: [...history.currentMedications, medicationInput.trim()]
      });
      setMedicationInput('');
    }
  };

  const handleRemoveMedication = (index: number) => {
    setHistory({
      ...history,
      currentMedications: history.currentMedications.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    onSave({
      ...history,
      lastUpdated: new Date().toISOString()
    });
  };

  return (
    <div className="medical-history-form">
      <h2>Medical History</h2>
      
      {/* Allergies Section */}
      <div className="form-section">
        <h3>🚨 Allergies</h3>
        <div className="input-with-button">
          <input
            type="text"
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
            placeholder="Enter allergy (e.g., Penicillin, NSAIDs)"
          />
          <button onClick={handleAddAllergy}>Add</button>
        </div>
        <div className="tags-list">
          {history.allergies.map((allergy, index) => (
            <span key={index} className="tag tag-danger">
              {allergy}
              <button onClick={() => handleRemoveAllergy(index)}>×</button>
            </span>
          ))}
          {history.allergies.length === 0 && (
            <p className="no-items">No known allergies</p>
          )}
        </div>
      </div>

      {/* Chronic Conditions */}
      <div className="form-section">
        <h3>📋 Chronic Conditions</h3>
        <div className="input-with-button">
          <input
            type="text"
            value={conditionInput}
            onChange={(e) => setConditionInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
            placeholder="Enter condition (e.g., Hypertension, Diabetes)"
          />
          <button onClick={handleAddCondition}>Add</button>
        </div>
        <div className="tags-list">
          {history.chronicConditions.map((condition, index) => (
            <span key={index} className="tag tag-warning">
              {condition}
              <button onClick={() => handleRemoveCondition(index)}>×</button>
            </span>
          ))}
          {history.chronicConditions.length === 0 && (
            <p className="no-items">No chronic conditions</p>
          )}
        </div>
      </div>

      {/* Current Medications */}
      <div className="form-section">
        <h3>💊 Current Medications</h3>
        <div className="input-with-button">
          <input
            type="text"
            value={medicationInput}
            onChange={(e) => setMedicationInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMedication()}
            placeholder="Enter medication (e.g., Aspirin, Metformin)"
          />
          <button onClick={handleAddMedication}>Add</button>
        </div>
        <div className="tags-list">
          {history.currentMedications.map((medication, index) => (
            <span key={index} className="tag tag-info">
              {medication}
              <button onClick={() => handleRemoveMedication(index)}>×</button>
            </span>
          ))}
          {history.currentMedications.length === 0 && (
            <p className="no-items">No current medications</p>
          )}
        </div>
      </div>

      {/* Medical Conditions Checklist */}
      <div className="form-section">
        <h3>⚕️ Medical Conditions</h3>
        <div className="checkboxes-grid">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={history.isPregnant}
              onChange={(e) => setHistory({ ...history, isPregnant: e.target.checked })}
            />
            <span>Pregnant</span>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={history.isBreastfeeding}
              onChange={(e) => setHistory({ ...history, isBreastfeeding: e.target.checked })}
            />
            <span>Breastfeeding</span>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={history.bloodThinners}
              onChange={(e) => setHistory({ ...history, bloodThinners: e.target.checked })}
            />
            <span>On Blood Thinners</span>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={history.diabetic}
              onChange={(e) => setHistory({ ...history, diabetic: e.target.checked })}
            />
            <span>Diabetic</span>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={history.hypertensive}
              onChange={(e) => setHistory({ ...history, hypertensive: e.target.checked })}
            />
            <span>Hypertensive</span>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={history.asthmatic}
              onChange={(e) => setHistory({ ...history, asthmatic: e.target.checked })}
            />
            <span>Asthmatic</span>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={history.liverDisease}
              onChange={(e) => setHistory({ ...history, liverDisease: e.target.checked })}
            />
            <span>Liver Disease</span>
          </label>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={history.kidneyDisease}
              onChange={(e) => setHistory({ ...history, kidneyDisease: e.target.checked })}
            />
            <span>Kidney Disease</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-primary" onClick={handleSave}>
          Save Medical History
        </button>
      </div>
    </div>
  );
};

// Add CSS styles
const styles = `
.medical-history-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
}

.medical-history-form h2 {
  margin-bottom: 30px;
  color: #2d3748;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.form-section h3 {
  margin-bottom: 15px;
  color: #4a5568;
  font-size: 18px;
}

.input-with-button {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.input-with-button input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #cbd5e0;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s;
}

.input-with-button input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-with-button button {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.input-with-button button:hover {
  background: #5568d3;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.tag button {
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.tag button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.tag-danger {
  background: #fed7d7;
  color: #c53030;
}

.tag-warning {
  background: #feebc8;
  color: #c05621;
}

.tag-info {
  background: #bee3f8;
  color: #2c5282;
}

.no-items {
  color: #a0aec0;
  font-style: italic;
  margin: 10px 0;
}

.checkboxes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox-item:hover {
  background: #edf2f7;
}

.checkbox-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-item span {
  font-size: 15px;
  color: #2d3748;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e2e8f0;
}
`;
