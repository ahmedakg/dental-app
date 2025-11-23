// Module 7: Sample Data for Testing
// Abdullah Dental Care Management System

export const samplePatients = [
  {
    id: 'P001',
    name: 'Ahmed Khan',
    phone: '0300-1234567',
    tags: ['VIP', 'Regular'],
    createdAt: '2024-01-15T10:00:00Z',
    lastVisit: '2024-11-20T14:00:00Z'
  },
  {
    id: 'P002',
    name: 'Fatima Ali',
    phone: '0301-2345678',
    tags: ['Regular'],
    createdAt: '2024-03-20T11:00:00Z',
    lastVisit: '2024-11-21T15:30:00Z'
  },
  {
    id: 'P003',
    name: 'Hassan Shah',
    phone: '0302-3456789',
    tags: ['New'],
    createdAt: '2024-11-15T09:00:00Z',
    lastVisit: '2024-11-22T10:00:00Z'
  },
  {
    id: 'P004',
    name: 'Zainab Malik',
    phone: '0303-4567890',
    tags: ['Defaulter'],
    createdAt: '2024-02-10T13:00:00Z',
    lastVisit: '2024-05-15T16:00:00Z'
  },
  {
    id: 'P005',
    name: 'Usman Ahmed',
    phone: '0304-5678901',
    tags: ['VIP'],
    createdAt: '2024-06-01T10:30:00Z',
    lastVisit: '2024-11-19T11:00:00Z'
  }
];

export const sampleAppointments = [
  {
    id: 'A001',
    patientId: 'P001',
    date: '2024-11-20',
    time: '14:00',
    status: 'completed',
    type: 'general',
    createdAt: '2024-11-18T09:00:00Z'
  },
  {
    id: 'A002',
    patientId: 'P002',
    date: '2024-11-21',
    time: '15:30',
    status: 'completed',
    type: 'general',
    createdAt: '2024-11-19T10:00:00Z'
  },
  {
    id: 'A003',
    patientId: 'P003',
    date: '2024-11-22',
    time: '10:00',
    status: 'completed',
    type: 'orthodontist',
    createdAt: '2024-11-20T11:00:00Z'
  },
  {
    id: 'A004',
    patientId: 'P005',
    date: '2024-11-19',
    time: '11:00',
    status: 'completed',
    type: 'general',
    createdAt: '2024-11-17T14:00:00Z'
  },
  {
    id: 'A005',
    patientId: 'P001',
    date: '2024-11-23',
    time: '16:00',
    status: 'scheduled',
    type: 'general',
    createdAt: '2024-11-21T09:00:00Z'
  },
  {
    id: 'A006',
    patientId: 'P002',
    date: '2024-11-18',
    time: '14:30',
    status: 'cancelled',
    type: 'general',
    createdAt: '2024-11-16T10:00:00Z'
  }
];

export const sampleTreatments = [
  {
    id: 'T001',
    code: 'RST001',
    name: 'Composite Filling',
    category: 'Restorative Dentistry',
    totalCost: 4000,
    status: 'completed',
    completedAt: '2024-11-20T14:30:00Z',
    createdAt: '2024-11-20T14:00:00Z'
  },
  {
    id: 'T002',
    code: 'END001',
    name: 'Root Canal Treatment',
    category: 'Endodontics',
    totalCost: 15000,
    status: 'in-progress',
    createdAt: '2024-11-21T15:30:00Z'
  },
  {
    id: 'T003',
    code: 'PRO001',
    name: 'Porcelain Crown',
    category: 'Prosthodontics',
    totalCost: 35000,
    status: 'pending',
    createdAt: '2024-11-22T10:00:00Z'
  },
  {
    id: 'T004',
    code: 'COS001',
    name: 'Teeth Whitening',
    category: 'Cosmetic Dentistry',
    totalCost: 12000,
    status: 'completed',
    completedAt: '2024-11-19T11:30:00Z',
    createdAt: '2024-11-19T11:00:00Z'
  }
];

export const sampleTreatmentPlans = [
  {
    id: 'TP001',
    patientId: 'P001',
    treatments: [
      {
        code: 'RST001',
        name: 'Composite Filling',
        category: 'Restorative Dentistry',
        totalCost: 4000,
        status: 'completed'
      },
      {
        code: 'CLE001',
        name: 'Dental Cleaning',
        category: 'Preventive Care',
        totalCost: 2000,
        status: 'pending'
      }
    ]
  },
  {
    id: 'TP002',
    patientId: 'P002',
    treatments: [
      {
        code: 'END001',
        name: 'Root Canal Treatment',
        category: 'Endodontics',
        totalCost: 15000,
        status: 'in-progress'
      },
      {
        code: 'PRO001',
        name: 'Porcelain Crown',
        category: 'Prosthodontics',
        totalCost: 35000,
        status: 'pending'
      }
    ]
  },
  {
    id: 'TP003',
    patientId: 'P003',
    treatments: [
      {
        code: 'ORT001',
        name: 'Metal Braces',
        category: 'Orthodontics',
        totalCost: 80000,
        status: 'pending'
      }
    ]
  },
  {
    id: 'TP004',
    patientId: 'P005',
    treatments: [
      {
        code: 'COS001',
        name: 'Teeth Whitening',
        category: 'Cosmetic Dentistry',
        totalCost: 12000,
        status: 'completed'
      },
      {
        code: 'COS002',
        name: 'Veneer (per tooth)',
        category: 'Cosmetic Dentistry',
        totalCost: 25000,
        status: 'pending'
      }
    ]
  }
];

export const samplePayments = [
  {
    id: 'PAY001',
    patientId: 'P001',
    amount: 4000,
    status: 'paid',
    date: '2024-11-20',
    method: 'cash'
  },
  {
    id: 'PAY002',
    patientId: 'P002',
    amount: 15000,
    status: 'pending',
    date: '2024-11-21'
  },
  {
    id: 'PAY003',
    patientId: 'P003',
    amount: 80000,
    status: 'pending',
    date: '2024-11-22'
  },
  {
    id: 'PAY004',
    patientId: 'P005',
    amount: 12000,
    status: 'paid',
    date: '2024-11-19',
    method: 'bank_transfer'
  },
  {
    id: 'PAY005',
    patientId: 'P004',
    amount: 8000,
    status: 'pending',
    date: '2024-05-15'
  }
];

export const sampleLabCases = [
  {
    id: 'LAB001',
    caseNumber: 'LAB-2024-0001',
    patientId: 'P002',
    jobType: 'crown',
    labName: 'Peshawar Dental Lab',
    dateSent: '2024-11-21',
    expectedReturnDate: '2024-11-28',
    status: 'in_progress'
  },
  {
    id: 'LAB002',
    caseNumber: 'LAB-2024-0002',
    patientId: 'P001',
    jobType: 'denture',
    labName: 'Hayatabad Dental Lab',
    dateSent: '2024-11-15',
    expectedReturnDate: '2024-11-22',
    actualReturnDate: '2024-11-22',
    status: 'returned'
  }
];

export const samplePrescriptions = [
  {
    id: 'RX001',
    patientId: 'P001',
    issuedDate: '2024-11-20'
  },
  {
    id: 'RX002',
    patientId: 'P002',
    issuedDate: '2024-11-21'
  },
  {
    id: 'RX003',
    patientId: 'P005',
    issuedDate: '2024-11-19'
  }
];
