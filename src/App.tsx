// Module 7: Demo App Component
// Abdullah Dental Care Management System

import React from 'react';
import { AnalyticsDashboard } from './components/reports/AnalyticsDashboard';
import {
  samplePatients,
  sampleAppointments,
  sampleTreatments,
  sampleTreatmentPlans,
  samplePayments,
  sampleLabCases,
  samplePrescriptions
} from './data/sampleData';
import './styles/analytics.css';

function App() {
  return (
    <div className="app">
      <AnalyticsDashboard
        patients={samplePatients}
        appointments={sampleAppointments}
        treatments={sampleTreatments}
        treatmentPlans={sampleTreatmentPlans}
        payments={samplePayments}
        labCases={sampleLabCases}
        prescriptions={samplePrescriptions}
      />
    </div>
  );
}

export default App;
