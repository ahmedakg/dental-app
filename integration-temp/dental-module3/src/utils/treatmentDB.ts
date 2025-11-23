// Module 3: Database Utilities for Treatment Planning
// IndexedDB operations for storing treatment plans

import { TreatmentPlan, TreatmentHistory, ToothChart } from '../types/treatment';

const DB_NAME = 'AbdullahDentalCare';
const DB_VERSION = 3;

// Store names
const STORES = {
  TREATMENT_PLANS: 'treatment_plans',
  TREATMENT_HISTORY: 'treatment_history',
  TOOTH_CHARTS: 'tooth_charts'
};

// Initialize database
export const initTreatmentDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Treatment Plans store
      if (!db.objectStoreNames.contains(STORES.TREATMENT_PLANS)) {
        const plansStore = db.createObjectStore(STORES.TREATMENT_PLANS, { keyPath: 'id' });
        plansStore.createIndex('patientId', 'patientId', { unique: false });
        plansStore.createIndex('status', 'status', { unique: false });
        plansStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Treatment History store
      if (!db.objectStoreNames.contains(STORES.TREATMENT_HISTORY)) {
        const historyStore = db.createObjectStore(STORES.TREATMENT_HISTORY, { keyPath: 'id' });
        historyStore.createIndex('patientId', 'patientId', { unique: false });
        historyStore.createIndex('date', 'date', { unique: false });
      }

      // Tooth Charts store
      if (!db.objectStoreNames.contains(STORES.TOOTH_CHARTS)) {
        const chartsStore = db.createObjectStore(STORES.TOOTH_CHARTS, { keyPath: 'patientId' });
        chartsStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
      }
    };
  });
};

// ============================================
// TREATMENT PLAN OPERATIONS
// ============================================

export const saveTreatmentPlan = async (plan: TreatmentPlan): Promise<void> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_PLANS, 'readwrite');
  const store = tx.objectStore(STORES.TREATMENT_PLANS);
  
  await store.put(plan);
  await tx.complete;
};

export const getTreatmentPlan = async (planId: string): Promise<TreatmentPlan | undefined> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_PLANS, 'readonly');
  const store = tx.objectStore(STORES.TREATMENT_PLANS);
  
  return await store.get(planId);
};

export const getTreatmentPlansByPatient = async (patientId: string): Promise<TreatmentPlan[]> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_PLANS, 'readonly');
  const store = tx.objectStore(STORES.TREATMENT_PLANS);
  const index = store.index('patientId');
  
  return await index.getAll(patientId);
};

export const getAllTreatmentPlans = async (): Promise<TreatmentPlan[]> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_PLANS, 'readonly');
  const store = tx.objectStore(STORES.TREATMENT_PLANS);
  
  return await store.getAll();
};

export const getPendingTreatmentPlans = async (): Promise<TreatmentPlan[]> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_PLANS, 'readonly');
  const store = tx.objectStore(STORES.TREATMENT_PLANS);
  const index = store.index('status');
  
  const pending = await index.getAll('pending');
  const inProgress = await index.getAll('in-progress');
  
  return [...pending, ...inProgress];
};

export const updateTreatmentPlanStatus = async (
  planId: string,
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
): Promise<void> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_PLANS, 'readwrite');
  const store = tx.objectStore(STORES.TREATMENT_PLANS);
  
  const plan = await store.get(planId);
  if (plan) {
    plan.status = status;
    plan.updatedAt = new Date().toISOString();
    await store.put(plan);
  }
  
  await tx.complete;
};

export const updatePaymentForPlan = async (
  planId: string,
  paidAmount: number
): Promise<void> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_PLANS, 'readwrite');
  const store = tx.objectStore(STORES.TREATMENT_PLANS);
  
  const plan = await store.get(planId);
  if (plan) {
    plan.paidAmount = paidAmount;
    plan.remainingAmount = plan.totalAmount - paidAmount;
    plan.updatedAt = new Date().toISOString();
    
    // Auto-complete if fully paid
    if (plan.remainingAmount <= 0) {
      plan.status = 'completed';
    }
    
    await store.put(plan);
  }
  
  await tx.complete;
};

export const deleteTreatmentPlan = async (planId: string): Promise<void> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_PLANS, 'readwrite');
  const store = tx.objectStore(STORES.TREATMENT_PLANS);
  
  await store.delete(planId);
  await tx.complete;
};

// ============================================
// TREATMENT HISTORY OPERATIONS
// ============================================

export const saveTreatmentHistory = async (history: TreatmentHistory): Promise<void> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_HISTORY, 'readwrite');
  const store = tx.objectStore(STORES.TREATMENT_HISTORY);
  
  await store.put(history);
  await tx.complete;
};

export const getTreatmentHistoryByPatient = async (patientId: string): Promise<TreatmentHistory[]> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_HISTORY, 'readonly');
  const store = tx.objectStore(STORES.TREATMENT_HISTORY);
  const index = store.index('patientId');
  
  return await index.getAll(patientId);
};

export const getTreatmentHistoryById = async (historyId: string): Promise<TreatmentHistory | undefined> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_HISTORY, 'readonly');
  const store = tx.objectStore(STORES.TREATMENT_HISTORY);
  
  return await store.get(historyId);
};

export const deleteTreatmentHistory = async (historyId: string): Promise<void> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TREATMENT_HISTORY, 'readwrite');
  const store = tx.objectStore(STORES.TREATMENT_HISTORY);
  
  await store.delete(historyId);
  await tx.complete;
};

// ============================================
// TOOTH CHART OPERATIONS
// ============================================

export const saveToothChart = async (chart: ToothChart): Promise<void> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TOOTH_CHARTS, 'readwrite');
  const store = tx.objectStore(STORES.TOOTH_CHARTS);
  
  // Convert Map to array for storage
  const chartData = {
    ...chart,
    adultTeeth: Array.from(chart.adultTeeth.entries()),
    primaryTeeth: Array.from(chart.primaryTeeth.entries())
  };
  
  await store.put(chartData);
  await tx.complete;
};

export const getToothChart = async (patientId: string): Promise<ToothChart | undefined> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TOOTH_CHARTS, 'readonly');
  const store = tx.objectStore(STORES.TOOTH_CHARTS);
  
  const chartData = await store.get(patientId);
  
  if (chartData) {
    // Convert arrays back to Map
    return {
      ...chartData,
      adultTeeth: new Map(chartData.adultTeeth),
      primaryTeeth: new Map(chartData.primaryTeeth)
    };
  }
  
  return undefined;
};

export const updateToothStatus = async (
  patientId: string,
  toothNumber: number,
  status: 'healthy' | 'selected' | 'treated' | 'extracted' | 'missing'
): Promise<void> => {
  const db = await initTreatmentDB();
  const tx = db.transaction(STORES.TOOTH_CHARTS, 'readwrite');
  const store = tx.objectStore(STORES.TOOTH_CHARTS);
  
  const chart = await getToothChart(patientId);
  
  if (chart) {
    const isAdult = toothNumber >= 11 && toothNumber <= 48;
    const teethMap = isAdult ? chart.adultTeeth : chart.primaryTeeth;
    
    const tooth = teethMap.get(toothNumber);
    if (tooth) {
      tooth.status = status;
      chart.lastUpdated = new Date().toISOString();
      
      await saveToothChart(chart);
    }
  }
  
  await tx.complete;
};

// ============================================
// SEARCH AND ANALYTICS
// ============================================

export const searchTreatmentPlans = async (query: string): Promise<TreatmentPlan[]> => {
  const allPlans = await getAllTreatmentPlans();
  const lowerQuery = query.toLowerCase();
  
  return allPlans.filter(plan =>
    plan.patientName.toLowerCase().includes(lowerQuery) ||
    plan.notes?.toLowerCase().includes(lowerQuery) ||
    plan.items.some(item =>
      item.treatment.name.toLowerCase().includes(lowerQuery) ||
      item.treatment.code.toLowerCase().includes(lowerQuery)
    )
  );
};

export const getTotalPendingRevenue = async (): Promise<number> => {
  const pendingPlans = await getPendingTreatmentPlans();
  return pendingPlans.reduce((sum, plan) => sum + plan.remainingAmount, 0);
};

export const getTreatmentStats = async (patientId: string) => {
  const plans = await getTreatmentPlansByPatient(patientId);
  const history = await getTreatmentHistoryByPatient(patientId);
  
  return {
    totalPlans: plans.length,
    pendingPlans: plans.filter(p => p.status === 'pending' || p.status === 'in-progress').length,
    completedPlans: plans.filter(p => p.status === 'completed').length,
    totalAmount: plans.reduce((sum, p) => sum + p.totalAmount, 0),
    paidAmount: plans.reduce((sum, p) => sum + p.paidAmount, 0),
    remainingAmount: plans.reduce((sum, p) => sum + p.remainingAmount, 0),
    totalTreatments: history.length,
    lastTreatment: history.length > 0 ? history[history.length - 1].date : null
  };
};

// Export all functions
export const TreatmentDB = {
  init: initTreatmentDB,
  plans: {
    save: saveTreatmentPlan,
    get: getTreatmentPlan,
    getByPatient: getTreatmentPlansByPatient,
    getAll: getAllTreatmentPlans,
    getPending: getPendingTreatmentPlans,
    updateStatus: updateTreatmentPlanStatus,
    updatePayment: updatePaymentForPlan,
    delete: deleteTreatmentPlan,
    search: searchTreatmentPlans
  },
  history: {
    save: saveTreatmentHistory,
    getByPatient: getTreatmentHistoryByPatient,
    getById: getTreatmentHistoryById,
    delete: deleteTreatmentHistory
  },
  charts: {
    save: saveToothChart,
    get: getToothChart,
    updateTooth: updateToothStatus
  },
  analytics: {
    getPendingRevenue: getTotalPendingRevenue,
    getStats: getTreatmentStats
  }
};
