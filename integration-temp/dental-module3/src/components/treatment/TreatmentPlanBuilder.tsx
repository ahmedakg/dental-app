// Module 3: Treatment Plan Builder Component
// Create comprehensive treatment plans with tooth selection

import React, { useState } from 'react';
import { ToothChart } from './ToothChart';
import { 
  Treatment, 
  TreatmentPlan, 
  TreatmentPlanItem,
  ToothType 
} from '../types/treatment';
import { 
  TREATMENTS, 
  getTreatmentsByCategory, 
  getAllCategories,
  searchTreatments,
  calculateTreatmentTotal 
} from '../data/treatments';
import { formatTeethList } from '../data/toothChart';

interface TreatmentPlanBuilderProps {
  patientId: string;
  patientName: string;
  onSave: (plan: TreatmentPlan) => void;
  existingPlan?: TreatmentPlan;
}

export const TreatmentPlanBuilder: React.FC<TreatmentPlanBuilderProps> = ({
  patientId,
  patientName,
  onSave,
  existingPlan
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [toothType, setToothType] = useState<ToothType>('adult');
  const [planItems, setPlanItems] = useState<TreatmentPlanItem[]>(existingPlan?.items || []);
  const [discount, setDiscount] = useState(0);
  const [priority, setPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [notes, setNotes] = useState('');
  const [planNotes, setPlanNotes] = useState(existingPlan?.notes || '');
  const [showChart, setShowChart] = useState(false);

  const categories = getAllCategories();
  
  const filteredTreatments = searchQuery
    ? searchTreatments(searchQuery)
    : selectedCategory === 'all'
    ? TREATMENTS
    : getTreatmentsByCategory(selectedCategory as any);

  const handleAddToothChart = () => {
    if (!selectedTreatment) return;
    if (selectedTeeth.length === 0) {
      alert('Please select at least one tooth from the chart');
      return;
    }

    const newItem: TreatmentPlanItem = {
      id: `item-${Date.now()}`,
      treatmentId: selectedTreatment.id,
      treatment: selectedTreatment,
      teeth: [...selectedTeeth],
      quantity: selectedTeeth.length,
      pricePerUnit: selectedTreatment.pricePKR,
      discount,
      totalPrice: calculateTreatmentTotal(selectedTreatment, selectedTeeth.length, discount),
      notes,
      priority,
      estimatedSessions: Math.ceil(selectedTeeth.length * (selectedTreatment.duration || 30) / 60)
    };

    setPlanItems([...planItems, newItem]);
    
    // Reset form
    setSelectedTeeth([]);
    setDiscount(0);
    setNotes('');
    setShowChart(false);
  };

  const handleAddWithoutTeeth = () => {
    if (!selectedTreatment) return;

    const quantity = 1;
    const newItem: TreatmentPlanItem = {
      id: `item-${Date.now()}`,
      treatmentId: selectedTreatment.id,
      treatment: selectedTreatment,
      teeth: [],
      quantity,
      pricePerUnit: selectedTreatment.pricePKR,
      discount,
      totalPrice: calculateTreatmentTotal(selectedTreatment, quantity, discount),
      notes,
      priority,
      estimatedSessions: 1
    };

    setPlanItems([...planItems, newItem]);
    
    // Reset form
    setDiscount(0);
    setNotes('');
  };

  const handleRemoveItem = (itemId: string) => {
    setPlanItems(planItems.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setPlanItems(planItems.map(item => {
      if (item.id === itemId) {
        const newTotal = calculateTreatmentTotal(item.treatment, newQuantity, item.discount);
        return { ...item, quantity: newQuantity, totalPrice: newTotal };
      }
      return item;
    }));
  };

  const handleUpdateDiscount = (itemId: string, newDiscount: number) => {
    if (newDiscount < 0 || newDiscount > 50) return;
    
    setPlanItems(planItems.map(item => {
      if (item.id === itemId) {
        const newTotal = calculateTreatmentTotal(item.treatment, item.quantity, newDiscount);
        return { ...item, discount: newDiscount, totalPrice: newTotal };
      }
      return item;
    }));
  };

  const calculatePlanTotal = () => {
    return planItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSavePlan = () => {
    if (planItems.length === 0) {
      alert('Please add at least one treatment to the plan');
      return;
    }

    const plan: TreatmentPlan = {
      id: existingPlan?.id || `plan-${Date.now()}`,
      patientId,
      patientName,
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      createdBy: 'Dr. Ahmed Abdullah',
      updatedAt: new Date().toISOString(),
      status: 'pending',
      items: planItems,
      totalAmount: calculatePlanTotal(),
      paidAmount: existingPlan?.paidAmount || 0,
      remainingAmount: calculatePlanTotal() - (existingPlan?.paidAmount || 0),
      notes: planNotes,
      consentSigned: false
    };

    onSave(plan);
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div className="treatment-plan-builder">
      <div className="builder-header">
        <h2>Treatment Plan for {patientName}</h2>
        <button onClick={handleSavePlan} className="save-plan-btn">
          💾 Save Treatment Plan
        </button>
      </div>

      <div className="builder-layout">
        {/* Treatment Selection Panel */}
        <div className="treatment-selection-panel">
          <h3>Add Treatments</h3>
          
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search treatments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="treatment-search"
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Treatment List */}
          <div className="treatment-list">
            {filteredTreatments.map(treatment => (
              <div
                key={treatment.id}
                className={`treatment-item ${selectedTreatment?.id === treatment.id ? 'selected' : ''}`}
                onClick={() => setSelectedTreatment(treatment)}
              >
                <div className="treatment-info">
                  <strong>{treatment.name}</strong>
                  <span className="treatment-code">{treatment.code}</span>
                </div>
                <div className="treatment-price">
                  Rs. {treatment.pricePKR.toLocaleString()}
                  <span className="price-usd">${treatment.priceUSD}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Treatment Details & Add Form */}
          {selectedTreatment && (
            <div className="treatment-add-form">
              <h4>{selectedTreatment.name}</h4>
              <p className="treatment-description">{selectedTreatment.description}</p>
              
              <div className="form-row">
                <label>Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>

              <div className="form-row">
                <label>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🔵 Medium</option>
                  <option value="low">⚪ Low</option>
                </select>
              </div>

              <div className="form-row">
                <label>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes for this treatment..."
                  rows={2}
                />
              </div>

              <div className="add-buttons">
                <button onClick={() => setShowChart(!showChart)} className="tooth-chart-btn">
                  {showChart ? '📋 Hide' : '🦷 Select Teeth'}
                </button>
                <button onClick={handleAddWithoutTeeth} className="add-simple-btn">
                  ➕ Add Treatment
                </button>
              </div>

              {/* Tooth Chart */}
              {showChart && (
                <div className="tooth-chart-section">
                  <div className="chart-type-toggle">
                    <button
                      className={toothType === 'adult' ? 'active' : ''}
                      onClick={() => setToothType('adult')}
                    >
                      Adult Teeth
                    </button>
                    <button
                      className={toothType === 'primary' ? 'active' : ''}
                      onClick={() => setToothType('primary')}
                    >
                      Primary Teeth
                    </button>
                  </div>

                  <ToothChart
                    type={toothType}
                    selectedTeeth={selectedTeeth}
                    onTeethSelect={setSelectedTeeth}
                  />

                  {selectedTeeth.length > 0 && (
                    <button onClick={handleAddToothChart} className="add-with-teeth-btn">
                      ➕ Add {selectedTeeth.length} Teeth to Plan
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Treatment Plan Summary */}
        <div className="treatment-plan-summary">
          <h3>Current Plan ({planItems.length} items)</h3>

          {planItems.length === 0 ? (
            <div className="empty-plan">
              <p>No treatments added yet</p>
              <p className="hint">Select a treatment from the left and add it to the plan</p>
            </div>
          ) : (
            <>
              <div className="plan-items-list">
                {planItems.map((item, index) => (
                  <div key={item.id} className="plan-item">
                    <div className="plan-item-header">
                      <span className="item-number">#{index + 1}</span>
                      <span 
                        className="item-priority" 
                        style={{ background: getPriorityColor(item.priority) }}
                      >
                        {item.priority}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="remove-item-btn"
                        title="Remove"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="plan-item-body">
                      <strong>{item.treatment.name}</strong>
                      <span className="item-code">{item.treatment.code}</span>

                      {item.teeth.length > 0 && (
                        <div className="item-teeth">
                          🦷 Teeth: {formatTeethList(item.teeth)}
                        </div>
                      )}

                      <div className="item-controls">
                        <div className="quantity-control">
                          <label>Qty:</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                            disabled={item.teeth.length > 0}
                          />
                        </div>

                        <div className="discount-control">
                          <label>Discount:</label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={item.discount}
                            onChange={(e) => handleUpdateDiscount(item.id, Number(e.target.value))}
                          />
                          <span>%</span>
                        </div>
                      </div>

                      <div className="item-pricing">
                        <div>Unit Price: Rs. {item.pricePerUnit.toLocaleString()}</div>
                        {item.discount > 0 && (
                          <div className="discount-amount">
                            Discount: -{item.discount}%
                          </div>
                        )}
                        <div className="item-total">
                          Total: Rs. {item.totalPrice.toLocaleString()}
                        </div>
                      </div>

                      {item.notes && (
                        <div className="item-notes">
                          📝 {item.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan Total */}
              <div className="plan-total-section">
                <div className="plan-stats">
                  <div className="stat">
                    <span>Total Items:</span>
                    <strong>{planItems.length}</strong>
                  </div>
                  <div className="stat">
                    <span>Estimated Sessions:</span>
                    <strong>
                      {planItems.reduce((sum, item) => sum + item.estimatedSessions, 0)}
                    </strong>
                  </div>
                </div>

                <div className="plan-total">
                  <span>Grand Total:</span>
                  <strong>Rs. {calculatePlanTotal().toLocaleString()}</strong>
                </div>
              </div>

              {/* Plan Notes */}
              <div className="plan-notes-section">
                <label>Plan Notes</label>
                <textarea
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  placeholder="Overall treatment plan notes, special instructions, sequencing..."
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
