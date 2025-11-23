// Module 6: Lab Work Tracking - Utility Functions
// Abdullah Dental Care Management System

import { LabCase } from '../types/lab';

export const generateLabCaseNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LAB-${year}-${random}`;
};

export const calculateExpectedReturn = (sentDate: string, turnaroundDays: number = 7): string => {
  const sent = new Date(sentDate);
  sent.setDate(sent.getDate() + turnaroundDays);
  return sent.toISOString().split('T')[0];
};

export const calculateTotalCharges = (
  chargesPerUnit: number,
  totalUnits: number
): number => {
  return chargesPerUnit * totalUnits;
};

export const isOverdue = (expectedReturn: string, status: string): boolean => {
  if (status === 'returned' || status === 'delivered') return false;
  const today = new Date();
  const expected = new Date(expectedReturn);
  return today > expected;
};

export const getDaysUntilReturn = (expectedReturn: string): number => {
  const today = new Date();
  const expected = new Date(expectedReturn);
  const diff = Math.ceil((expected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export const getDaysInLab = (sentDate: string, returnDate?: string): number => {
  const sent = new Date(sentDate);
  const returned = returnDate ? new Date(returnDate) : new Date();
  const diff = Math.ceil((returned.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export const formatTeethNumbers = (teethNumbers?: number[]): string => {
  if (!teethNumbers || teethNumbers.length === 0) return 'N/A';
  return `#${teethNumbers.join(', #')}`;
};

export const getStatusProgress = (status: string): number => {
  const progress = {
    sent: 25,
    in_progress: 50,
    returned: 75,
    delivered: 100
  };
  return progress[status as keyof typeof progress] || 0;
};

export const sortLabCases = (cases: LabCase[], sortBy: string): LabCase[] => {
  return [...cases].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime();
      case 'return':
        return new Date(a.expectedReturnDate).getTime() - new Date(b.expectedReturnDate).getTime();
      case 'patient':
        return a.patientName.localeCompare(b.patientName);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'charges':
        return b.totalCharges - a.totalCharges;
      default:
        return 0;
    }
  });
};

export const filterLabCases = (
  cases: LabCase[],
  filters: {
    status?: string;
    labName?: string;
    dateRange?: { start: string; end: string };
    searchTerm?: string;
  }
): LabCase[] => {
  let filtered = [...cases];

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(c => c.status === filters.status);
  }

  if (filters.labName && filters.labName !== 'all') {
    filtered = filtered.filter(c => c.labName === filters.labName);
  }

  if (filters.dateRange) {
    filtered = filtered.filter(c => {
      const sent = new Date(c.dateSent);
      const start = new Date(filters.dateRange!.start);
      const end = new Date(filters.dateRange!.end);
      return sent >= start && sent <= end;
    });
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(c =>
      c.patientName.toLowerCase().includes(term) ||
      c.caseNumber.toLowerCase().includes(term) ||
      c.jobDescription.toLowerCase().includes(term)
    );
  }

  return filtered;
};

export const getLabStatistics = (cases: LabCase[]) => {
  const total = cases.length;
  const sent = cases.filter(c => c.status === 'sent').length;
  const inProgress = cases.filter(c => c.status === 'in_progress').length;
  const returned = cases.filter(c => c.status === 'returned').length;
  const delivered = cases.filter(c => c.status === 'delivered').length;
  const overdue = cases.filter(c => isOverdue(c.expectedReturnDate, c.status)).length;
  
  const totalCharges = cases.reduce((sum, c) => sum + c.totalCharges, 0);
  const unpaidCases = cases.filter(c => c.status !== 'delivered');
  const unpaidAmount = unpaidCases.reduce((sum, c) => sum + c.totalCharges, 0);

  return {
    total,
    sent,
    inProgress,
    returned,
    delivered,
    overdue,
    totalCharges,
    unpaidAmount,
    averageCost: total > 0 ? Math.round(totalCharges / total) : 0
  };
};

export const formatCurrency = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateRelative = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  
  return formatDate(dateString);
};
