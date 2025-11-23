// Module 4: Prescription Creator Component
// Main interface for creating prescriptions with medical safety checks

import React, { useState, useEffect } from 'react';
import {
  Prescription,
  DentalCondition,
  ProtocolTier,
  PatientMedicalHistory,
  MedicalAlert,
  TreatmentProtocol
} from '../../types/prescription';
import { DENTAL_CONDITIONS, searchConditions } from '../../data/conditions';
import { MedicalSafetyChecker } from '../../utils/medicalSafetyChecker';
import { printPrescription, downloadPrescription } from '../../utils/prescriptionPDF';
import '../../styles/prescription.css';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  medicalHistory: PatientMedicalHistory;
}

interface PrescriptionCreatorProps {
  patient: Patient;
  onClose: () => void;
  onSave: (prescription: Prescription) => void;
}

export const PrescriptionCreator: React.FC<PrescriptionCreatorProps> = ({
  patient,
  onClose,
  onSave
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConditions, setFilteredConditions] = useState<DentalCondition[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<DentalCondition | null>(null);
  const [selectedTier, setSelectedTier] = useState<ProtocolTier>('standard');
  const [diagnosis, setDiagnosis] = useState('');
  const [toothNumbers, setToothNumbers] = useState('');
  const [protocol, setProtocol] = useState<TreatmentProtocol | null>(null);
  const [alerts, setAlerts] = useState<MedicalAlert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [step, setStep] = useState<'search' | 'protocol' | 'review'>('search');

  // Search conditions
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchConditions(searchQuery);
      setFilteredConditions(results);
    } else {
      setFilteredConditions(DENTAL_CONDITIONS.slice(0, 10));
    }
  }, [searchQuery]);

  // Handle condition selection
  const handleConditionSelect = (condition: DentalCondition) => {
    setSelectedCondition(condition);
    setDiagnosis(condition.name);
    setStep('protocol');
  };

  // Handle tier selection and safety check
  const handleTierSelect = (tier: ProtocolTier) => {
    if (!selectedCondition) return;

    setSelectedTier(tier);
    const selectedProtocol = selectedCondition.protocols[tier];
    
    const { safeProtocol, alerts: medAlerts } = MedicalSafetyChecker.checkProtocol(
      selectedProtocol,
      patient.medicalHistory
    );

    setProtocol(safeProtocol);
    setAlerts(medAlerts);
    
    if (medAlerts.length > 0) {
      setShowAlerts(true);
    }
  };

  // Generate prescription
  const handleGenerate = () => {
    if (!selectedCondition || !protocol) return;

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + protocol.followUpDays);

    const prescription: Prescription = {
      id: `rx-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientPhone: patient.phone,
      conditionId: selectedCondition.id,
      conditionName: selectedCondition.name,
      diagnosis: diagnosis,
      toothNumbers: toothNumbers ? toothNumbers.split(',').map(n => n.trim()) : undefined,
      protocolTier: selectedTier,
      medications: protocol.medications,
      instructions: protocol.instructions,
      warnings: protocol.warnings,
      dietaryRestrictions: protocol.dietaryRestrictions,
      followUpDate: followUpDate.toISOString(),
      medicalAlerts: alerts,
      issuedBy: 'Dr. Ahmed Abdullah Khan',
      issuedAt: new Date().toISOString(),
      status: 'issued',
      pdfGenerated: false
    };

    setStep('review');
    onSave(prescription);
  };

  const handlePrint = () => {
    if (!selectedCondition || !protocol) return;
    
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + protocol.followUpDays);

    const prescription: Prescription = {
      id: `rx-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientPhone: patient.phone,
      conditionId: selectedCondition.id,
      conditionName: selectedCondition.name,
      diagnosis: diagnosis,
      toothNumbers: toothNumbers ? toothNumbers.split(',').map(n => n.trim()) : undefined,
      protocolTier: selectedTier,
      medications: protocol.medications,
      instructions: protocol.instructions,
      warnings: protocol.warnings,
      dietaryRestrictions: protocol.dietaryRestrictions,
      followUpDate: followUpDate.toISOString(),
      medicalAlerts: alerts,
      issuedBy: 'Dr. Ahmed Abdullah Khan',
      issuedAt: new Date().toISOString(),
      status: 'issued',
      pdfGenerated: true
    };

    printPrescription(prescription);
  };

  return (
    <div className="prescription-creator-overlay">
      <div className="prescription-creator-modal">
        
        <div className="prescription-header">
          <div>
            <h2>🩺 Create Prescription</h2>
            <p className="patient-name">{patient.name}, {patient.age}y, {patient.gender === 'male' ? 'M' : 'F'}</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="steps-indicator">
          <div className={`step ${step === 'search' ? 'active' : 'completed'}`}>
            1. Select Condition
          </div>
          <div className={`step ${step === 'protocol' ? 'active' : step === 'review' ? 'completed' : ''}`}>
            2. Choose Protocol
          </div>
          <div className={`step ${step === 'review' ? 'active' : ''}`}>
            3. Review & Print
          </div>
        </div>

        {step === 'search' && (
          <div className="step-content">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search conditions... (e.g., extraction, abscess, RCT)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="condition-search-input"
                autoFocus
              />
            </div>

            <div className="conditions-grid">
              {filteredConditions.map(condition => (
                <div
                  key={condition.id}
                  className="condition-card"
                  onClick={() => handleConditionSelect(condition)}
                >
                  <div className="condition-category">{condition.category}</div>
                  <div className="condition-name">{condition.name}</div>
                  <div className="condition-code">{condition.code}</div>
                  <div className="condition-description">{condition.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'protocol' && selectedCondition && (
          <div className="step-content">
            <div className="selected-condition-banner">
              <strong>{selectedCondition.name}</strong>
              <span className="condition-code">{selectedCondition.code}</span>
            </div>

            <div className="diagnosis-input-group">
              <label>Diagnosis Details:</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="diagnosis-input"
                placeholder="Add specific details..."
              />
            </div>

            <div className="tooth-input-group">
              <label>Tooth Numbers (FDI):</label>
              <input
                type="text"
                value={toothNumbers}
                onChange={(e) => setToothNumbers(e.target.value)}
                className="tooth-input"
                placeholder="e.g., 16, 17, 18"
              />
            </div>

            <h3>Select Treatment Protocol:</h3>
            <div className="protocol-tiers">
              <div
                className={`tier-card premium ${selectedTier === 'premium' ? 'selected' : ''}`}
                onClick={() => handleTierSelect('premium')}
              >
                <div className="tier-badge">💎 PREMIUM</div>
                <div className="tier-description">
                  <ul>
                    <li>Best medications</li>
                    <li>Faster recovery</li>
                    <li>Comprehensive care</li>
                    <li>Premium brands</li>
                  </ul>
                </div>
                <div className="tier-cost">Highest cost</div>
              </div>

              <div
                className={`tier-card standard ${selectedTier === 'standard' ? 'selected' : ''}`}
                onClick={() => handleTierSelect('standard')}
              >
                <div className="tier-badge">⭐ STANDARD</div>
                <div className="tier-description">
                  <ul>
                    <li>Effective medications</li>
                    <li>Good recovery</li>
                    <li>Balanced approach</li>
                    <li>Quality brands</li>
                  </ul>
                </div>
                <div className="tier-cost">Moderate cost</div>
              </div>

              <div
                className={`tier-card basic ${selectedTier === 'basic' ? 'selected' : ''}`}
                onClick={() => handleTierSelect('basic')}
              >
                <div className="tier-badge">✓ BASIC</div>
                <div className="tier-description">
                  <ul>
                    <li>Essential medications</li>
                    <li>Adequate recovery</li>
                    <li>Cost-effective</li>
                    <li>Generic options</li>
                  </ul>
                </div>
                <div className="tier-cost">Lowest cost</div>
              </div>
            </div>

            {showAlerts && alerts.length > 0 && (
              <div className="medical-alerts-section">
                <h3>⚠️ Medical Safety Alerts</h3>
                {alerts.map((alert, index) => (
                  <div key={index} className={`alert alert-${alert.type}`}>
                    <div className="alert-message">{alert.message}</div>
                    {alert.affectedMedications.length > 0 && (
                      <div className="alert-meds">
                        Affected: {alert.affectedMedications.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {protocol && (
              <div className="protocol-preview">
                <h3>📋 Selected Protocol Preview</h3>
                
                <div className="medications-preview">
                  <h4>Medications:</h4>
                  {protocol.medications.map((med, idx) => (
                    <div key={idx} className="med-preview-item">
                      <strong>{med.medication.brandName}</strong> {med.medication.strength}
                      <div className="med-dosage-preview">
                        {med.dose} {med.frequency} {med.timing} × {med.duration}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="instructions-preview">
                  <h4>Instructions:</h4>
                  <ul>
                    {protocol.instructions.map((inst, idx) => (
                      <li key={idx}>{inst}</li>
                    ))}
                  </ul>
                </div>

                {protocol.warnings.length > 0 && (
                  <div className="warnings-preview">
                    <h4>⚠️ Warnings:</h4>
                    <ul>
                      {protocol.warnings.map((warn, idx) => (
                        <li key={idx}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep('search')}>
                ← Back
              </button>
              <button
                className="btn-primary"
                onClick={handleGenerate}
                disabled={!protocol}
              >
                Continue to Review →
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="step-content">
            <div className="review-success">
              <div className="success-icon">✅</div>
              <h3>Prescription Ready!</h3>
              <p>Prescription has been generated and saved</p>
            </div>

            <div className="review-actions">
              <button className="btn-print" onClick={handlePrint}>
                🖨️ Print Prescription
              </button>
              <button className="btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
