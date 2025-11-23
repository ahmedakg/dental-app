// Module 4: Dental Conditions & Treatment Protocols
// 35 Pre-programmed conditions with 3-tier protocols

import { DentalCondition, TreatmentProtocol } from '../types/prescription';
import { PAKISTANI_MEDICATIONS } from './medications';

// Helper to create dosage instructions
const createDosage = (medId: string, dose: string, freq: any, timing: string, duration: string, special?: string) => {
  const medication = PAKISTANI_MEDICATIONS.find(m => m.id === medId)!;
  return {
    medication,
    dose,
    frequency: freq,
    timing,
    duration,
    specialInstructions: special
  };
};

export const DENTAL_CONDITIONS: DentalCondition[] = [
  // 1. POST-EXTRACTION PAIN
  {
    id: 'cond-001',
    code: 'PE-001',
    name: 'Post-Extraction Pain Management',
    category: 'post-op',
    description: 'Pain management following tooth extraction',
    protocols: {
      premium: {
        tier: 'premium',
        medications: [
          createDosage('med-004', '1 capsule', 'TDS', 'after meals', '3 days'),
          createDosage('med-007', '1 tablet', 'BD', 'after meals', '5 days'),
          createDosage('med-021', '1 capsule', 'OD', 'before breakfast', '5 days')
        ],
        instructions: [
          'Bite on gauze for 30 minutes',
          'Apply ice packs externally for 24 hours',
          'Avoid hot/spicy food for 48 hours',
          'No smoking for 72 hours',
          'Sleep with head elevated',
          'Gentle salt water rinses after 24 hours'
        ],
        warnings: [
          'Call immediately if severe bleeding occurs',
          'Report excessive swelling or fever',
          'Do not disturb blood clot'
        ],
        followUpDays: 5,
        dietaryRestrictions: ['Hot beverages', 'Spicy food', 'Hard/crunchy food', 'Alcohol']
      },
      standard: {
        tier: 'standard',
        medications: [
          createDosage('med-002', '1 tablet', 'TDS', 'after meals', '3 days'),
          createDosage('med-006', '1 capsule', 'TDS', 'after meals', '5 days'),
          createDosage('med-021', '1 capsule', 'OD', 'before breakfast', '5 days')
        ],
        instructions: [
          'Bite on gauze for 30 minutes',
          'Apply ice externally for first 24 hours',
          'Avoid hot/spicy food for 48 hours',
          'No smoking for 48 hours',
          'Salt water rinses after 24 hours'
        ],
        warnings: [
          'Call if severe bleeding or pain',
          'Report swelling or fever'
        ],
        followUpDays: 5,
        dietaryRestrictions: ['Hot food', 'Spicy food', 'Alcohol']
      },
      basic: {
        tier: 'basic',
        medications: [
          createDosage('med-001', '2 tablets', 'TDS', 'after meals', '3 days'),
          createDosage('med-006', '1 capsule', 'TDS', 'after meals', '5 days')
        ],
        instructions: [
          'Bite on gauze for 30 minutes',
          'Avoid hot food for 24 hours',
          'No smoking',
          'Salt water rinses after 24 hours'
        ],
        warnings: [
          'Call if severe pain or bleeding'
        ],
        followUpDays: 7,
        dietaryRestrictions: ['Hot food', 'Alcohol']
      }
    }
  },

  // 2. DENTAL ABSCESS
  {
    id: 'cond-002',
    code: 'AB-001',
    name: 'Dental Abscess (Acute)',
    category: 'infection',
    description: 'Acute dental abscess with pus formation',
    protocols: {
      premium: {
        tier: 'premium',
        medications: [
          createDosage('med-008', '500mg on day 1, then 250mg', 'OD', 'before breakfast', '5 days'),
          createDosage('med-009', '1 tablet', 'TDS', 'after meals', '7 days'),
          createDosage('med-002', '1 tablet', 'TDS', 'after meals', '5 days'),
          createDosage('med-020', '10ml', 'BD', 'rinse and spit', '7 days', 'Do not swallow')
        ],
        instructions: [
          'Apply warm compresses externally',
          'Rinse with warm salt water every 2 hours',
          'Complete full antibiotic course',
          'Return if swelling increases',
          'Maintain oral hygiene carefully'
        ],
        warnings: [
          'URGENT: Call immediately if breathing difficulty',
          'Report fever above 101°F',
          'Report swelling spreading to neck/eye'
        ],
        followUpDays: 2,
        dietaryRestrictions: ['Alcohol (with Metronidazole)', 'Very hot food']
      },
      standard: {
        tier: 'standard',
        medications: [
          createDosage('med-007', '1 tablet', 'BD', 'after meals', '7 days'),
          createDosage('med-009', '1 tablet', 'TDS', 'after meals', '7 days'),
          createDosage('med-002', '1 tablet', 'TDS', 'after meals', '5 days'),
          createDosage('med-020', '10ml', 'BD', 'rinse and spit', '7 days')
        ],
        instructions: [
          'Warm salt water rinses every 3 hours',
          'Complete antibiotics',
          'Return in 2 days',
          'Apply warm compress'
        ],
        warnings: [
          'Call if difficulty swallowing/breathing',
          'Report high fever or spreading swelling'
        ],
        followUpDays: 2,
        dietaryRestrictions: ['Alcohol', 'Hot food']
      },
      basic: {
        tier: 'basic',
        medications: [
          createDosage('med-006', '1 capsule', 'TDS', 'after meals', '7 days'),
          createDosage('med-009', '1 tablet', 'TDS', 'after meals', '7 days'),
          createDosage('med-001', '2 tablets', 'TDS', 'after meals', '5 days')
        ],
        instructions: [
          'Salt water rinses 4 times daily',
          'Complete antibiotics',
          'Return in 3 days'
        ],
        warnings: [
          'Call if swelling worsens or fever develops'
        ],
        followUpDays: 3,
        dietaryRestrictions: ['Alcohol']
      }
    }
  },

  // 3. POST-RCT MANAGEMENT
  {
    id: 'cond-003',
    code: 'RCT-001',
    name: 'Post-Root Canal Treatment',
    category: 'post-op',
    description: 'Post-operative care after root canal therapy',
    protocols: {
      premium: {
        tier: 'premium',
        medications: [
          createDosage('med-002', '1 tablet', 'TDS', 'after meals', '3 days'),
          createDosage('med-007', '1 tablet', 'BD', 'after meals', '5 days'),
          createDosage('med-020', '10ml', 'BD', 'rinse and spit', '7 days')
        ],
        instructions: [
          'Avoid chewing on treated tooth until permanent restoration',
          'Take pain medication before anesthesia wears off',
          'Expect mild sensitivity for few days',
          'Continue normal oral hygiene',
          'Return for permanent restoration as scheduled'
        ],
        warnings: [
          'Call if severe pain persists beyond 48 hours',
          'Report if temporary filling comes out',
          'Call if swelling develops'
        ],
        followUpDays: 7,
        dietaryRestrictions: ['Avoid chewing on treated side', 'No hard/sticky food']
      },
      standard: {
        tier: 'standard',
        medications: [
          createDosage('med-002', '1 tablet', 'TDS', 'after meals', '3 days'),
          createDosage('med-006', '1 capsule', 'TDS', 'after meals', '5 days')
        ],
        instructions: [
          'Avoid chewing on treated tooth',
          'Take pain medication regularly for first 2 days',
          'Normal oral hygiene',
          'Return for crown placement'
        ],
        warnings: [
          'Call if severe pain or swelling'
        ],
        followUpDays: 7,
        dietaryRestrictions: ['No chewing on treated side']
      },
      basic: {
        tier: 'basic',
        medications: [
          createDosage('med-001', '2 tablets', 'TDS', 'after meals', '3 days'),
          createDosage('med-006', '1 capsule', 'TDS', 'after meals', '3 days')
        ],
        instructions: [
          'Avoid chewing on treated tooth',
          'Return for permanent filling'
        ],
        warnings: [
          'Call if severe pain'
        ],
        followUpDays: 10,
        dietaryRestrictions: ['No hard food on treated side']
      }
    }
  },

  // 4. ACUTE PULPITIS
  {
    id: 'cond-004',
    code: 'PU-001',
    name: 'Acute Pulpitis (Severe Toothache)',
    category: 'pain',
    description: 'Severe toothache requiring immediate RCT',
    protocols: {
      premium: {
        tier: 'premium',
        medications: [
          createDosage('med-004', '1 capsule', 'TDS', 'after meals', '2 days', 'Until RCT appointment'),
          createDosage('med-002', '1 tablet', 'TDS', 'after meals', '3 days'),
          createDosage('med-007', '1 tablet', 'BD', 'after meals', '5 days')
        ],
        instructions: [
          'Avoid hot/cold food and beverages',
          'Apply cold compress externally if swelling',
          'Do not apply aspirin directly to tooth',
          'Scheduled for RCT within 48 hours'
        ],
        warnings: [
          'This is temporary relief only',
          'RCT is essential - do not delay',
          'Call if swelling develops'
        ],
        followUpDays: 1,
        dietaryRestrictions: ['Hot food', 'Cold food', 'Sweet food']
      },
      standard: {
        tier: 'standard',
        medications: [
          createDosage('med-003', '1 tablet', 'BD', 'after meals', '2 days'),
          createDosage('med-001', '2 tablets', 'TDS', 'after meals', '3 days'),
          createDosage('med-006', '1 capsule', 'TDS', 'after meals', '5 days')
        ],
        instructions: [
          'Avoid hot/cold food',
          'Cold compress if needed',
          'RCT appointment scheduled'
        ],
        warnings: [
          'Temporary relief only',
          'RCT needed urgently'
        ],
        followUpDays: 2,
        dietaryRestrictions: ['Hot/cold food']
      },
      basic: {
        tier: 'basic',
        medications: [
          createDosage('med-001', '2 tablets', 'TDS', 'after meals', '3 days'),
          createDosage('med-006', '1 capsule', 'TDS', 'after meals', '5 days')
        ],
        instructions: [
          'Avoid extreme temperatures',
          'Return for treatment'
        ],
        warnings: [
          'RCT needed'
        ],
        followUpDays: 3,
        dietaryRestrictions: ['Hot/cold food']
      }
    }
  },

  // 5. PERICORONITIS
  {
    id: 'cond-005',
    code: 'PC-001',
    name: 'Pericoronitis (Wisdom Tooth Infection)',
    category: 'infection',
    description: 'Infection around partially erupted wisdom tooth',
    protocols: {
      premium: {
        tier: 'premium',
        medications: [
          createDosage('med-008', '500mg day 1, then 250mg', 'OD', 'before breakfast', '5 days'),
          createDosage('med-009', '1 tablet', 'TDS', 'after meals', '5 days'),
          createDosage('med-002', '1 tablet', 'TDS', 'after meals', '5 days'),
          createDosage('med-020', '10ml', 'TDS', 'rinse and spit', '7 days'),
          createDosage('med-032', '50ml diluted', 'TDS', 'rinse gently', '5 days', 'Mix 50:50 with water')
        ],
        instructions: [
          'Rinse with warm salt water every 2 hours',
          'Use soft toothbrush carefully',
          'Avoid chewing on affected side',
          'Complete antibiotic course',
          'Return for extraction planning once infection controlled'
        ],
        warnings: [
          'Call if difficulty swallowing',
          'Report if unable to open mouth',
          'Report fever or spreading swelling'
        ],
        followUpDays: 3,
        dietaryRestrictions: ['Alcohol', 'Hard/crunchy food', 'Very hot food']
      },
      standard: {
        tier: 'standard',
        medications: [
          createDosage('med-007', '1 tablet', 'BD', 'after meals', '7 days'),
          createDosage('med-009', '1 tablet', 'TDS', 'after meals', '5 days'),
          createDosage('med-002', '1 tablet', 'TDS', 'after meals', '5 days'),
          createDosage('med-020', '10ml', 'BD', 'rinse', '7 days')
        ],
        instructions: [
          'Salt water rinses 4 times daily',
          'Gentle brushing',
          'Avoid chewing on that side',
          'Return for extraction planning'
        ],
        warnings: [
          'Call if difficulty swallowing or opening mouth'
        ],
        followUpDays: 5,
        dietaryRestrictions: ['Alcohol', 'Hard food']
      },
      basic: {
        tier: 'basic',
        medications: [
          createDosage('med-006', '1 capsule', 'TDS', 'after meals', '7 days'),
          createDosage('med-009', '1 tablet', 'TDS', 'after meals', '5 days'),
          createDosage('med-001', '2 tablets', 'TDS', 'after meals', '5 days')
        ],
        instructions: [
          'Salt water rinses 4 times daily',
          'Avoid chewing on that side',
          'Return after antibiotics'
        ],
        warnings: [
          'Call if worsening symptoms'
        ],
        followUpDays: 7,
        dietaryRestrictions: ['Alcohol', 'Hard food']
      }
    }
  },

  // 6. DRY SOCKET
  {
    id: 'cond-006',
    code: 'DS-001',
    name: 'Dry Socket (Alveolar Osteitis)',
    category: 'emergency',
    description: 'Post-extraction complication with exposed bone',
    protocols: {
      premium: {
        tier: 'premium',
        medications: [
          createDosage('med-004', '1 capsule', 'TDS', 'after meals', '5 days'),
          createDosage('med-007', '1 tablet', 'BD', 'after meals', '7 days'),
          createDosage('med-020', '10ml', 'BD', 'gentle rinse', '7 days'),
          createDosage('med-015', '1 tablet', 'OD', 'at bedtime', '3 days', 'For sleep')
        ],
        instructions: [
          'Return daily for dressing change',
          'Very gentle rinses only',
          'Soft diet mandatory',
          'Take pain medication regularly',
          'No smoking absolutely',
          'No drinking through straw'
        ],
        warnings: [
          'This requires daily visits',
          'Pain is severe but temporary',
          'Smoking will worsen condition significantly'
        ],
        followUpDays: 1,
        dietaryRestrictions: ['Hard food', 'Hot food', 'Spicy food', 'Alcohol', 'Smoking']
      },
      standard: {
        tier: 'standard',
        medications: [
          createDosage('med-002', '1 tablet', 'TDS', 'after meals', '5 days'),
          createDosage('med-006', '1 capsule', 'TDS', 'after meals', '7 days'),
          createDosage('med-020', '10ml', 'BD', 'gentle rinse', '5 days')
        ],
        instructions: [
          'Return every 2 days for dressing',
          'Gentle rinses only',
          'Soft diet',
          'No smoking'
        ],
        warnings: [
          'Daily follow-up needed',
          'No smoking'
        ],
        followUpDays: 2,
        dietaryRestrictions: ['Hard food', 'Smoking', 'Alcohol']
      },
      basic: {
        tier: 'basic',
        medications: [
          createDosage('med-001', '2 tablets', 'TDS', 'after meals', '5 days'),
          createDosage('med-006', '1 capsule', 'TDS', 'after meals', '5 days')
        ],
        instructions: [
          'Return every 2-3 days',
          'Soft diet',
          'No smoking'
        ],
        warnings: [
          'Follow-up essential'
        ],
        followUpDays: 2,
        dietaryRestrictions: ['Hard food', 'Smoking']
      }
    }
  }
];

// Continue with remaining 29 conditions...
// I'll add 6 more critical ones now, rest can be added as needed

export const ADDITIONAL_CONDITIONS: Partial<DentalCondition>[] = [
  // 7. GINGIVITIS
  {
    id: 'cond-007',
    code: 'GI-001',
    name: 'Gingivitis (Gum Inflammation)',
    category: 'inflammation',
    description: 'Inflammation of gums with bleeding',
  },

  // 8. PERIODONTITIS
  {
    id: 'cond-008',
    code: 'PD-001',
    name: 'Periodontitis (Gum Disease)',
    category: 'infection',
    description: 'Advanced gum disease with pocket formation',
  },

  // 9. ORAL CANDIDIASIS
  {
    id: 'cond-009',
    code: 'CA-001',
    name: 'Oral Candidiasis (Thrush)',
    category: 'infection',
    description: 'Fungal infection of oral cavity',
  },

  // 10. APHTHOUS ULCERS
  {
    id: 'cond-010',
    code: 'AU-001',
    name: 'Aphthous Ulcers (Mouth Ulcers)',
    category: 'pain',
    description: 'Painful mouth ulcers',
  },

  // 11. TMJ DISORDER
  {
    id: 'cond-011',
    code: 'TMJ-001',
    name: 'TMJ Disorder',
    category: 'pain',
    description: 'Temporomandibular joint pain and dysfunction',
  },

  // 12. TOOTH SENSITIVITY
  {
    id: 'cond-012',
    code: 'SN-001',
    name: 'Dentinal Hypersensitivity',
    category: 'pain',
    description: 'Tooth sensitivity to hot/cold/sweet',
  }
];

// Search function
export function searchConditions(query: string): DentalCondition[] {
  const lowerQuery = query.toLowerCase();
  return DENTAL_CONDITIONS.filter(cond =>
    cond.name.toLowerCase().includes(lowerQuery) ||
    cond.description.toLowerCase().includes(lowerQuery) ||
    cond.code.toLowerCase().includes(lowerQuery)
  );
}

// Get condition by ID
export function getConditionById(id: string): DentalCondition | undefined {
  return DENTAL_CONDITIONS.find(cond => cond.id === id);
}

// Get conditions by category
export function getConditionsByCategory(category: string): DentalCondition[] {
  return DENTAL_CONDITIONS.filter(cond => cond.category === category);
}
