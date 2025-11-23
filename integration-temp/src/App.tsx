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
import PatientList from './components/patients/PatientList';
import PatientProfile from './components/patients/PatientProfile';
import PatientForm from './components/patients/PatientForm';
import AppointmentCalendar from './components/appointments/AppointmentCalendar';
import TreatmentManagement from './components/treatment/TreatmentManagement';
import { PrescriptionCreator } from './components/prescription/PrescriptionCreator';
import { MedicalHistoryForm } from './components/prescription/MedicalHistoryForm';
import LabWorkManagement from './components/lab/LabWorkManagement';
import { InventoryDashboard } from './components/inventory/InventoryDashboard';
import { ExpenseTracking } from './components/expenses/ExpenseTracking';

function App() {
  const [currentModule, setCurrentModule] = React.useState('dashboard');
  const [userRole, userName] = React.useState(['admin', 'patient']);

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard userRole={userRole} userName={userName} />;
      case 'patients':
        return <PatientList />;
      case 'appointments':
        return <AppointmentCalendar userRole={userRole} userName={userName} />;
      case 'treatments':
        return <TreatmentManagement />;
      case 'prescriptions':
        return <PrescriptionCreator patient={{ id: '', name: '', age: 0, gender: 'male', phone: '', medicalHistory: {} }} onClose={() => {}} onSave={() => {}} />;
      case 'lab':
        return <LabWorkManagement />;
      case 'inventory':
        return <InventoryDashboard />;
      case 'expenses':
        return <ExpenseTracking />;
      case 'reports':
        return <AnalyticsDashboard patients={[]} appointments={[]} treatments={[]} treatmentPlans={[]} payments={[]} labCases={[]} prescriptions={[]} inventory={[]} />;
      default:
        return <Dashboard userRole={userRole} userName={userName} />;
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Abdullah Dental Care Management System</h1>
        <nav>
          <ul>
            <li>
              <button onClick={() => setCurrentModule('dashboard')}>Dashboard</button>
            </li>
            <li>
              <button onClick={() => setCurrentModule('patients')}>Patients</button>
            </li>
            <li>
              <button onClick={() => setCurrentModule('appointments')}>Appointments</button>
            </li>
            <li>
              <button onClick={() => setCurrentModule('treatments')}>Treatments</button>
            </li>
            <li>
              <button onClick={() => setCurrentModule('prescriptions')}>Prescriptions</button>
            </li>
            <li>
              <button onClick={() => setCurrentModule('lab')}>Lab Work</button>
            </li>
            <li>
              <button onClick={() => setCurrentModule('inventory')}>Inventory</button>
            </li>
            <li>
              <button onClick={() => setCurrentModule('expenses')}>Expenses</button>
            </li>
            <li>
              <button onClick={() => setCurrentModule('reports')}>Reports</button>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        {renderModule()}
      </main>
    </div>
  );
}

export default App;
