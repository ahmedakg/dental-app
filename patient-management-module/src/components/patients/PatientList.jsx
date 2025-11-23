import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, Plus, Users } from 'lucide-react';
import { db } from '../../lib/db';
import PatientCard from './PatientCard';
import PatientSearch from './PatientSearch';

export default function PatientList({ onSelectPatient, onAddNew }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, recent, balance

  // Live query that updates automatically when data changes
  const allPatients = useLiveQuery(
    () => db.patients.orderBy('name').toArray(),
    []
  );

  // Filter and sort patients
  const filteredPatients = allPatients?.filter(patient => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    );
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'balance':
        return (b.outstandingBalance || 0) - (a.outstandingBalance || 0);
      default:
        return 0;
    }
  }) || [];

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <div className="header-title">
          <Users size={28} />
          <h2>Patients</h2>
        </div>
        <div className="patient-count">
          {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
        </div>
      </div>

      <PatientSearch
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by name or phone..."
      />

      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Name (A-Z)</option>
          <option value="recent">Recent First</option>
          <option value="balance">Balance (High to Low)</option>
        </select>
      </div>

      <div className="patient-list-content">
        {filteredPatients.length === 0 ? (
          <div className="empty-state">
            <Users size={64} />
            <p>
              {searchQuery
                ? 'No patients found matching your search'
                : 'No patients yet. Add your first patient!'}
            </p>
            {!searchQuery && (
              <button className="btn-primary" onClick={onAddNew}>
                <Plus size={20} />
                Add First Patient
              </button>
            )}
          </div>
        ) : (
          <div className="patient-grid">
            {filteredPatients.map(patient => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => onSelectPatient(patient)}
              />
            ))}
          </div>
        )}
      </div>

      <button className="fab-button" onClick={onAddNew} title="Add New Patient">
        <Plus size={24} />
      </button>
    </div>
  );
}
