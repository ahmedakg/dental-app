// Example Usage of Module 4: Prescription System
// Shows how to integrate into your existing patient management system

import React, { useState } from 'react';
import { PrescriptionCreator } from './src/components/prescription/PrescriptionCreator';
import { MedicalHistoryForm } from './src/components/prescription/MedicalHistoryForm';
import { Prescription, PatientMedicalHistory } from './src/types/prescription';

// Your existing Patient type (from Module 1)
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  medicalHistory?: PatientMedicalHistory;
}

// Example Component: Patient Profile with Prescription Feature
export function PatientProfile() {
  // Sample patient data
  const [patient, setPatient] = useState<Patient>({
    id: 'pat-001',
    name: 'Ali Khan',
    age: 35,
    gender: 'male',
    phone: '+92-300-1234567',
    medicalHistory: {
      patientId: 'pat-001',
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
  });

  const [showPrescription, setShowPrescription] = useState(false);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // Handle saving prescription
  const handleSavePrescription = (prescription: Prescription) => {
    console.log('New prescription created:', prescription);
    
    // Add to prescriptions list
    setPrescriptions([...prescriptions, prescription]);
    
    // Here you would typically save to your database
    // Example: await api.savePrescription(prescription);
    
    setShowPrescription(false);
    alert('Prescription saved successfully!');
  };

  // Handle updating medical history
  const handleUpdateMedicalHistory = (history: PatientMedicalHistory) => {
    console.log('Medical history updated:', history);
    
    setPatient({
      ...patient,
      medicalHistory: history
    });
    
    // Here you would typically save to your database
    // Example: await api.updatePatientMedicalHistory(patient.id, history);
    
    setShowMedicalHistory(false);
    alert('Medical history updated successfully!');
  };

  return (
    <div className="patient-profile">
      <div className="patient-header">
        <h1>{patient.name}</h1>
        <p>{patient.age} years old, {patient.gender === 'male' ? 'Male' : 'Female'}</p>
        <p>📞 {patient.phone}</p>
      </div>

      <div className="action-buttons">
        <button 
          className="btn-primary"
          onClick={() => setShowMedicalHistory(true)}
        >
          📋 Update Medical History
        </button>

        <button 
          className="btn-primary"
          onClick={() => setShowPrescription(true)}
        >
          🩺 Create Prescription
        </button>
      </div>

      {/* Medical History Summary */}
      <div className="medical-history-summary">
        <h3>Medical History</h3>
        {patient.medicalHistory && (
          <>
            {patient.medicalHistory.allergies.length > 0 && (
              <div className="alert-section">
                <strong>🚨 Allergies:</strong> {patient.medicalHistory.allergies.join(', ')}
              </div>
            )}
            {patient.medicalHistory.chronicConditions.length > 0 && (
              <div className="info-section">
                <strong>📋 Conditions:</strong> {patient.medicalHistory.chronicConditions.join(', ')}
              </div>
            )}
            {patient.medicalHistory.currentMedications.length > 0 && (
              <div className="info-section">
                <strong>💊 Current Meds:</strong> {patient.medicalHistory.currentMedications.join(', ')}
              </div>
            )}
          </>
        )}
      </div>

      {/* Prescriptions History */}
      <div className="prescriptions-history">
        <h3>Prescription History ({prescriptions.length})</h3>
        {prescriptions.map((rx, index) => (
          <div key={rx.id} className="prescription-card">
            <div className="prescription-header">
              <strong>{rx.conditionName}</strong>
              <span className="date">{new Date(rx.issuedAt).toLocaleDateString()}</span>
            </div>
            <div className="prescription-details">
              <p><strong>Diagnosis:</strong> {rx.diagnosis}</p>
              <p><strong>Medications:</strong> {rx.medications.length} items</p>
              <p><strong>Protocol:</strong> {rx.protocolTier}</p>
              {rx.medicalAlerts.length > 0 && (
                <p><strong>⚠️ Alerts:</strong> {rx.medicalAlerts.length}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Medical History Modal */}
      {showMedicalHistory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <MedicalHistoryForm
              patientId={patient.id}
              initialHistory={patient.medicalHistory}
              onSave={handleUpdateMedicalHistory}
              onCancel={() => setShowMedicalHistory(false)}
            />
          </div>
        </div>
      )}

      {/* Prescription Creator Modal */}
      {showPrescription && patient.medicalHistory && (
        <PrescriptionCreator
          patient={{
            id: patient.id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            medicalHistory: patient.medicalHistory
          }}
          onClose={() => setShowPrescription(false)}
          onSave={handleSavePrescription}
        />
      )}
    </div>
  );
}

// Example: Integration with existing appointment system
export function AppointmentComplete({ appointmentId }: { appointmentId: string }) {
  const [showPrescription, setShowPrescription] = useState(false);
  
  // Load patient from appointment
  const patient = {
    id: 'pat-001',
    name: 'Ali Khan',
    age: 35,
    gender: 'male' as const,
    phone: '+92-300-1234567',
    medicalHistory: {
      patientId: 'pat-001',
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
  };

  const handleCompleteTreatment = () => {
    // Mark appointment complete
    // Then show prescription creator
    setShowPrescription(true);
  };

  return (
    <div>
      <button onClick={handleCompleteTreatment}>
        ✅ Complete Treatment & Create Prescription
      </button>

      {showPrescription && (
        <PrescriptionCreator
          patient={patient}
          onClose={() => setShowPrescription(false)}
          onSave={(prescription) => {
            console.log('Prescription created for appointment:', appointmentId);
            // Save prescription linked to appointment
            setShowPrescription(false);
          }}
        />
      )}
    </div>
  );
}

// Example: Quick Prescription from Dashboard
export function QuickPrescription() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPrescription, setShowPrescription] = useState(false);

  const recentPatients: Patient[] = [
    {
      id: 'pat-001',
      name: 'Ali Khan',
      age: 35,
      gender: 'male',
      phone: '+92-300-1234567',
      medicalHistory: {
        patientId: 'pat-001',
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
    },
    // ... more patients
  ];

  return (
    <div className="quick-prescription">
      <h3>Quick Prescription</h3>
      <p>Select a recent patient to create prescription:</p>
      
      <div className="patient-list">
        {recentPatients.map(patient => (
          <button
            key={patient.id}
            className="patient-quick-btn"
            onClick={() => {
              setSelectedPatient(patient);
              setShowPrescription(true);
            }}
          >
            {patient.name}
          </button>
        ))}
      </div>

      {showPrescription && selectedPatient && selectedPatient.medicalHistory && (
        <PrescriptionCreator
          patient={{
            id: selectedPatient.id,
            name: selectedPatient.name,
            age: selectedPatient.age,
            gender: selectedPatient.gender,
            phone: selectedPatient.phone,
            medicalHistory: selectedPatient.medicalHistory
          }}
          onClose={() => {
            setShowPrescription(false);
            setSelectedPatient(null);
          }}
          onSave={(prescription) => {
            console.log('Quick prescription created:', prescription);
            setShowPrescription(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
}

// Example: Add styles
const styles = `
.patient-profile {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
}

.patient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.btn-primary {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.medical-history-summary,
.prescriptions-history {
  background: #f7fafc;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
}

.alert-section {
  padding: 15px;
  background: #fff5f5;
  border-left: 4px solid #fc8181;
  border-radius: 8px;
  margin: 10px 0;
}

.info-section {
  padding: 15px;
  background: #ebf8ff;
  border-left: 4px solid #4299e1;
  border-radius: 8px;
  margin: 10px 0;
}

.prescription-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  margin: 15px 0;
}

.prescription-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
`;
