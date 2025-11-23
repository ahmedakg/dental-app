// Module 3: Treatment Planning System - Main Export
// Abdullah Dental Care Management System

// Components
export { ToothChart } from './components/treatment/ToothChart';
export { TreatmentPlanBuilder } from './components/treatment/TreatmentPlanBuilder';
export { PendingTreatmentsTracker } from './components/treatment/PendingTreatmentsTracker';
export { TreatmentHistoryView } from './components/treatment/TreatmentHistoryView';
export { TreatmentManagement } from './components/treatment/TreatmentManagement';

// Types
export type {
  ToothType,
  ToothStatus,
  TreatmentCategory,
  TreatmentStatus,
  Tooth,
  Treatment,
  TreatmentPlanItem,
  TreatmentPlan,
  TreatmentHistory,
  ToothChart as ToothChartType
} from './types/treatment';

// Data
export {
  TREATMENTS,
  getTreatmentByCode,
  getTreatmentsByCategory,
  getAllCategories,
  searchTreatments,
  calculateTreatmentTotal
} from './data/treatments';

export {
  ADULT_TEETH_POSITIONS,
  PRIMARY_TEETH_POSITIONS,
  initializeToothChart,
  getToothName,
  getQuadrant,
  formatTeethList,
  isValidToothNumber,
  getQuadrantTeeth
} from './data/toothChart';

// Database
export { TreatmentDB } from './utils/treatmentDB';

// Version
export const MODULE_VERSION = '3.0.0';
export const MODULE_NAME = 'Treatment Planning System';
