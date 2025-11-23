// Module 8: Vendor Management
import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Phone, Mail, MapPin } from 'lucide-react';
import { addVendor, getVendors } from '../utils/expenseDb';
import type { Vendor, ExpenseCategory } from '../types/expense';

const CATEGORIES: ExpenseCategory[] = [
  'Supplies', 'Equipment', 'Rent', 'Utilities', 'Salary',
  'Marketing', 'Maintenance', 'Lab Fees', 'Transportation',
  'Professional Fees', 'Miscellaneous'
];

interface Props {
  onUpdate: () => void;
}

export function VendorManagement({ onUpdate }: Props) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Supplies');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    const data = await getVendors();
    setVendors(data.sort((a, b) => b.totalPaid - a.totalPaid));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    await addVendor({
      name: name.trim(),
      category,
      phone: phone || undefined,
      email: email || undefined,
      address: address || undefined,
      notes: notes || undefined,
      activeFrom: new Date().toISOString()
    });
    
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setNotes('');
    setShowForm(false);
    
    await loadVendors();
    onUpdate();
  }

  return (
    <div className="vendor-management">
      {/* Header */}
      <div className="vendor-header">
        <div className="header-title">
          <Users size={24} />
          <h3>Vendor Management</h3>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><Plus size={18} /> Add Vendor</>}
        </button>
      </div>

      {/* Add Vendor Form */}
      {showForm && (
        <form className="vendor-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Vendor Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dental Supplies Co."
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vendor@example.com"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, Pakistan"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional information..."
                rows={2}
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary">
            Save Vendor
          </button>
        </form>
      )}

      {/* Vendor List */}
      {vendors.length === 0 ? (
        <div className="empty-state">
          <Users size={48} color="#9ca3af" />
          <p>No vendors added yet</p>
        </div>
      ) : (
        <div className="vendor-grid">
          {vendors.map(vendor => (
            <div key={vendor.id} className="vendor-card">
              <div className="vendor-card-header">
                <div className="vendor-name">{vendor.name}</div>
                <span className="vendor-category">{vendor.category}</span>
              </div>
              
              <div className="vendor-info">
                {vendor.phone && (
                  <div className="info-row">
                    <Phone size={16} />
                    <span>{vendor.phone}</span>
                  </div>
                )}
                {vendor.email && (
                  <div className="info-row">
                    <Mail size={16} />
                    <span>{vendor.email}</span>
                  </div>
                )}
                {vendor.address && (
                  <div className="info-row">
                    <MapPin size={16} />
                    <span>{vendor.address}</span>
                  </div>
                )}
              </div>
              
              {vendor.notes && (
                <div className="vendor-notes">{vendor.notes}</div>
              )}
              
              <div className="vendor-stats">
                <div className="stat">
                  <span className="stat-label">Total Paid</span>
                  <span className="stat-value">Rs. {vendor.totalPaid.toLocaleString()}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Active Since</span>
                  <span className="stat-value">{new Date(vendor.activeFrom).toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}