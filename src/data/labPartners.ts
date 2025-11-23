// Module 6: Lab Work Tracking - Mock Lab Partners
// Abdullah Dental Care Management System

import { LabPartner } from '../types/lab';

export const mockLabPartners: LabPartner[] = [
  {
    id: 'lab-001',
    name: 'Peshawar Dental Lab',
    contactPerson: 'Hameed Khan',
    phone: '0333-1234567',
    address: 'Saddar Road, Peshawar',
    email: 'info@peshawarlabs.com',
    isDefault: true,
    averageTurnaround: 7,
    rating: 4.5,
    totalCases: 145,
    activeFrom: '2023-01-15',
    notes: 'Reliable, good quality crowns'
  },
  {
    id: 'lab-002',
    name: 'Hayatabad Dental Solutions',
    contactPerson: 'Yasir Ahmad',
    phone: '0334-9876543',
    address: 'Phase 3, Hayatabad',
    isDefault: false,
    averageTurnaround: 5,
    rating: 4.8,
    totalCases: 89,
    activeFrom: '2023-06-01',
    notes: 'Fast turnaround, premium pricing'
  },
  {
    id: 'lab-003',
    name: 'Northern Dental Prosthetics',
    contactPerson: 'Tariq Shah',
    phone: '0345-5551234',
    address: 'University Road, Peshawar',
    isDefault: false,
    averageTurnaround: 10,
    rating: 4.2,
    totalCases: 67,
    activeFrom: '2022-08-20',
    notes: 'Good for dentures and partials'
  }
];

export const getDefaultLab = (): LabPartner => {
  return mockLabPartners.find(lab => lab.isDefault) || mockLabPartners[0];
};

export const getAllLabs = (): LabPartner[] => {
  return [...mockLabPartners].sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return b.rating - a.rating;
  });
};

export const getLabById = (id: string): LabPartner | undefined => {
  return mockLabPartners.find(lab => lab.id === id);
};
