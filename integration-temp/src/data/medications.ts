// Module 4: Pakistani Medication Database
// All medications available in Pakistan with proper branding

import { Medication } from '../types/prescription';

export const PAKISTANI_MEDICATIONS: Medication[] = [
  // ANALGESICS (Pain Relief)
  {
    id: 'med-001',
    genericName: 'Paracetamol',
    brandName: 'Panadol',
    strength: '500mg',
    form: 'tablet',
    route: 'oral',
    price: 2,
    manufacturer: 'GSK',
    contraindications: ['severe liver disease'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: []
  },
  {
    id: 'med-002',
    genericName: 'Ibuprofen',
    brandName: 'Brufen',
    strength: '400mg',
    form: 'tablet',
    route: 'oral',
    price: 4,
    manufacturer: 'Abbott',
    contraindications: ['stomach ulcers', 'severe kidney disease', 'third trimester pregnancy'],
    pregnancy: 'avoid',
    breastfeeding: 'caution',
    interactions: ['warfarin', 'aspirin', 'corticosteroids']
  },
  {
    id: 'med-003',
    genericName: 'Diclofenac Sodium',
    brandName: 'Volini',
    strength: '50mg',
    form: 'tablet',
    route: 'oral',
    price: 5,
    manufacturer: 'Novartis',
    contraindications: ['active stomach ulcers', 'severe heart disease'],
    pregnancy: 'avoid',
    breastfeeding: 'avoid',
    interactions: ['warfarin', 'aspirin', 'lithium']
  },
  {
    id: 'med-004',
    genericName: 'Tramadol',
    brandName: 'Tramal',
    strength: '50mg',
    form: 'capsule',
    route: 'oral',
    price: 12,
    manufacturer: 'Grunenthal',
    contraindications: ['seizure disorders', 'respiratory depression'],
    pregnancy: 'avoid',
    breastfeeding: 'avoid',
    interactions: ['MAO inhibitors', 'SSRIs', 'alcohol']
  },
  {
    id: 'med-005',
    genericName: 'Aspirin',
    brandName: 'Disprin',
    strength: '300mg',
    form: 'tablet',
    route: 'oral',
    price: 1.5,
    manufacturer: 'Reckitt Benckiser',
    contraindications: ['children under 16', 'bleeding disorders', 'active ulcers'],
    pregnancy: 'avoid',
    breastfeeding: 'caution',
    interactions: ['warfarin', 'NSAIDs', 'corticosteroids']
  },

  // ANTIBIOTICS
  {
    id: 'med-006',
    genericName: 'Amoxicillin',
    brandName: 'Augmentin',
    strength: '500mg',
    form: 'capsule',
    route: 'oral',
    price: 15,
    manufacturer: 'GSK',
    contraindications: ['penicillin allergy'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: ['methotrexate', 'oral contraceptives']
  },
  {
    id: 'med-007',
    genericName: 'Amoxicillin + Clavulanic Acid',
    brandName: 'Augmentin Duo',
    strength: '625mg',
    form: 'tablet',
    route: 'oral',
    price: 25,
    manufacturer: 'GSK',
    contraindications: ['penicillin allergy', 'severe liver disease'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: ['warfarin', 'allopurinol']
  },
  {
    id: 'med-008',
    genericName: 'Azithromycin',
    brandName: 'Zithromax',
    strength: '500mg',
    form: 'tablet',
    route: 'oral',
    price: 45,
    manufacturer: 'Pfizer',
    contraindications: ['macrolide allergy', 'severe liver disease'],
    pregnancy: 'caution',
    breastfeeding: 'caution',
    interactions: ['warfarin', 'digoxin', 'antacids']
  },
  {
    id: 'med-009',
    genericName: 'Metronidazole',
    brandName: 'Flagyl',
    strength: '400mg',
    form: 'tablet',
    route: 'oral',
    price: 8,
    manufacturer: 'Sanofi',
    contraindications: ['first trimester pregnancy', 'alcohol consumption'],
    pregnancy: 'caution',
    breastfeeding: 'caution',
    interactions: ['warfarin', 'lithium', 'alcohol']
  },
  {
    id: 'med-010',
    genericName: 'Clindamycin',
    brandName: 'Dalacin C',
    strength: '300mg',
    form: 'capsule',
    route: 'oral',
    price: 35,
    manufacturer: 'Pfizer',
    contraindications: ['history of colitis'],
    pregnancy: 'caution',
    breastfeeding: 'caution',
    interactions: ['erythromycin', 'muscle relaxants']
  },
  {
    id: 'med-011',
    genericName: 'Ciprofloxacin',
    brandName: 'Cipro',
    strength: '500mg',
    form: 'tablet',
    route: 'oral',
    price: 18,
    manufacturer: 'Bayer',
    contraindications: ['children', 'pregnancy', 'tendon disorders'],
    pregnancy: 'avoid',
    breastfeeding: 'avoid',
    interactions: ['theophylline', 'warfarin', 'NSAIDs']
  },

  // ANTI-INFLAMMATORY
  {
    id: 'med-012',
    genericName: 'Prednisolone',
    brandName: 'Wysolone',
    strength: '5mg',
    form: 'tablet',
    route: 'oral',
    price: 3,
    manufacturer: 'Wyeth',
    contraindications: ['active infections', 'live vaccines'],
    pregnancy: 'caution',
    breastfeeding: 'caution',
    interactions: ['NSAIDs', 'warfarin', 'diabetes medications']
  },
  {
    id: 'med-013',
    genericName: 'Dexamethasone',
    brandName: 'Decadron',
    strength: '0.5mg',
    form: 'tablet',
    route: 'oral',
    price: 2.5,
    manufacturer: 'MSD',
    contraindications: ['systemic fungal infections'],
    pregnancy: 'caution',
    breastfeeding: 'caution',
    interactions: ['NSAIDs', 'anticoagulants', 'antidiabetics']
  },

  // ANTIHISTAMINES
  {
    id: 'med-014',
    genericName: 'Chlorpheniramine',
    brandName: 'Piriton',
    strength: '4mg',
    form: 'tablet',
    route: 'oral',
    price: 2,
    manufacturer: 'GSK',
    contraindications: ['glaucoma', 'prostate enlargement'],
    pregnancy: 'safe',
    breastfeeding: 'caution',
    interactions: ['sedatives', 'alcohol', 'MAO inhibitors']
  },
  {
    id: 'med-015',
    genericName: 'Cetirizine',
    brandName: 'Zyrtec',
    strength: '10mg',
    form: 'tablet',
    route: 'oral',
    price: 4,
    manufacturer: 'GSK',
    contraindications: ['severe kidney disease'],
    pregnancy: 'caution',
    breastfeeding: 'caution',
    interactions: ['sedatives', 'alcohol']
  },

  // ANTIFUNGALS
  {
    id: 'med-016',
    genericName: 'Fluconazole',
    brandName: 'Diflucan',
    strength: '150mg',
    form: 'capsule',
    route: 'oral',
    price: 55,
    manufacturer: 'Pfizer',
    contraindications: ['severe liver disease'],
    pregnancy: 'avoid',
    breastfeeding: 'caution',
    interactions: ['warfarin', 'statins', 'phenytoin']
  },
  {
    id: 'med-017',
    genericName: 'Nystatin',
    brandName: 'Mycostatin',
    strength: '100,000 IU/ml',
    form: 'oral suspension',
    route: 'oral',
    price: 85,
    manufacturer: 'Bristol-Myers Squibb',
    contraindications: ['nystatin allergy'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: []
  },

  // TOPICAL MEDICATIONS
  {
    id: 'med-018',
    genericName: 'Benzocaine',
    brandName: 'Mucopain',
    strength: '20%',
    form: 'gel',
    route: 'topical',
    price: 95,
    manufacturer: 'Paras Pharma',
    contraindications: ['methemoglobinemia'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: []
  },
  {
    id: 'med-019',
    genericName: 'Lidocaine',
    brandName: 'Xylocaine Gel',
    strength: '2%',
    form: 'gel',
    route: 'topical',
    price: 120,
    manufacturer: 'AstraZeneca',
    contraindications: ['lidocaine allergy', 'heart block'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: []
  },
  {
    id: 'med-020',
    genericName: 'Chlorhexidine Gluconate',
    brandName: 'Hexidine',
    strength: '0.2%',
    form: 'mouthwash',
    route: 'rinse',
    price: 180,
    manufacturer: 'Abbott',
    contraindications: ['chlorhexidine allergy'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: []
  },

  // ANTACIDS & GI PROTECTION
  {
    id: 'med-021',
    genericName: 'Omeprazole',
    brandName: 'Risek',
    strength: '20mg',
    form: 'capsule',
    route: 'oral',
    price: 8,
    manufacturer: 'Getz Pharma',
    contraindications: ['omeprazole allergy'],
    pregnancy: 'caution',
    breastfeeding: 'caution',
    interactions: ['clopidogrel', 'warfarin', 'iron supplements']
  },
  {
    id: 'med-022',
    genericName: 'Ranitidine',
    brandName: 'Zantac',
    strength: '150mg',
    form: 'tablet',
    route: 'oral',
    price: 5,
    manufacturer: 'GSK',
    contraindications: ['porphyria'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: ['ketoconazole', 'atazanavir']
  },

  // ANTIEMETICS
  {
    id: 'med-023',
    genericName: 'Metoclopramide',
    brandName: 'Maxolon',
    strength: '10mg',
    form: 'tablet',
    route: 'oral',
    price: 3,
    manufacturer: 'Sanofi',
    contraindications: ['GI obstruction', 'Parkinson disease'],
    pregnancy: 'caution',
    breastfeeding: 'caution',
    interactions: ['sedatives', 'antipsychotics']
  },
  {
    id: 'med-024',
    genericName: 'Domperidone',
    brandName: 'Motilium',
    strength: '10mg',
    form: 'tablet',
    route: 'oral',
    price: 4,
    manufacturer: 'Janssen',
    contraindications: ['GI bleeding', 'prolactinoma'],
    pregnancy: 'caution',
    breastfeeding: 'caution',
    interactions: ['ketoconazole', 'erythromycin']
  },

  // MUSCLE RELAXANTS
  {
    id: 'med-025',
    genericName: 'Orphenadrine',
    brandName: 'Norflex',
    strength: '100mg',
    form: 'tablet',
    route: 'oral',
    price: 6,
    manufacturer: '3M',
    contraindications: ['glaucoma', 'myasthenia gravis'],
    pregnancy: 'caution',
    breastfeeding: 'avoid',
    interactions: ['anticholinergics', 'alcohol']
  },

  // VITAMINS & SUPPLEMENTS
  {
    id: 'med-026',
    genericName: 'Calcium Carbonate',
    brandName: 'Caltrate',
    strength: '600mg',
    form: 'tablet',
    route: 'oral',
    price: 7,
    manufacturer: 'Pfizer',
    contraindications: ['hypercalcemia', 'kidney stones'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: ['tetracyclines', 'fluoroquinolones', 'iron']
  },
  {
    id: 'med-027',
    genericName: 'Vitamin B Complex',
    brandName: 'Neurobion',
    strength: 'B1+B6+B12',
    form: 'tablet',
    route: 'oral',
    price: 5,
    manufacturer: 'Merck',
    contraindications: [],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: []
  },
  {
    id: 'med-028',
    genericName: 'Vitamin C',
    brandName: 'Redoxon',
    strength: '500mg',
    form: 'tablet',
    route: 'oral',
    price: 3,
    manufacturer: 'Bayer',
    contraindications: ['kidney stones history'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: ['warfarin']
  },

  // HEMOSTATIC AGENTS
  {
    id: 'med-029',
    genericName: 'Tranexamic Acid',
    brandName: 'Transamin',
    strength: '500mg',
    form: 'tablet',
    route: 'oral',
    price: 15,
    manufacturer: 'Daiichi Sankyo',
    contraindications: ['thrombosis history', 'color vision defects'],
    pregnancy: 'caution',
    breastfeeding: 'caution',
    interactions: ['oral contraceptives', 'factor IX complex']
  },

  // LOCAL HEMOSTATIC
  {
    id: 'med-030',
    genericName: 'Oxidized Cellulose',
    brandName: 'Surgicel',
    strength: 'N/A',
    form: 'gauze',
    route: 'topical',
    price: 450,
    manufacturer: 'Ethicon',
    contraindications: ['arterial bleeding'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: []
  },

  // ANTISEPTICS
  {
    id: 'med-031',
    genericName: 'Povidone Iodine',
    brandName: 'Betadine',
    strength: '10%',
    form: 'solution',
    route: 'topical',
    price: 125,
    manufacturer: 'Mundipharma',
    contraindications: ['iodine allergy', 'thyroid disorders'],
    pregnancy: 'avoid',
    breastfeeding: 'avoid',
    interactions: ['lithium']
  },
  {
    id: 'med-032',
    genericName: 'Hydrogen Peroxide',
    brandName: 'H2O2',
    strength: '3%',
    form: 'solution',
    route: 'rinse',
    price: 45,
    manufacturer: 'Various',
    contraindications: [],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: []
  },

  // ANESTHETICS (INJECTION)
  {
    id: 'med-033',
    genericName: 'Lidocaine + Adrenaline',
    brandName: 'Xylocaine with Adrenaline',
    strength: '2% + 1:80,000',
    form: 'injection',
    route: 'injection',
    price: 85,
    manufacturer: 'AstraZeneca',
    contraindications: ['heart disease', 'uncontrolled hypertension'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: ['beta blockers', 'MAO inhibitors']
  },
  {
    id: 'med-034',
    genericName: 'Articaine + Adrenaline',
    brandName: 'Septocaine',
    strength: '4% + 1:100,000',
    form: 'injection',
    route: 'injection',
    price: 120,
    manufacturer: 'Septodont',
    contraindications: ['methemoglobinemia', 'severe cardiovascular disease'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: ['beta blockers']
  },

  // PEDIATRIC FORMULATIONS
  {
    id: 'med-035',
    genericName: 'Paracetamol Suspension',
    brandName: 'Calpol',
    strength: '120mg/5ml',
    form: 'syrup',
    route: 'oral',
    price: 85,
    manufacturer: 'GSK',
    contraindications: ['severe liver disease'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: []
  },
  {
    id: 'med-036',
    genericName: 'Amoxicillin Suspension',
    brandName: 'Augmentin Syrup',
    strength: '125mg/5ml',
    form: 'syrup',
    route: 'oral',
    price: 145,
    manufacturer: 'GSK',
    contraindications: ['penicillin allergy'],
    pregnancy: 'safe',
    breastfeeding: 'safe',
    interactions: []
  }
];

// Helper function to search medications
export function searchMedications(query: string): Medication[] {
  const lowerQuery = query.toLowerCase();
  return PAKISTANI_MEDICATIONS.filter(med =>
    med.genericName.toLowerCase().includes(lowerQuery) ||
    med.brandName.toLowerCase().includes(lowerQuery)
  );
}

// Get medication by ID
export function getMedicationById(id: string): Medication | undefined {
  return PAKISTANI_MEDICATIONS.find(med => med.id === id);
}

// Get medications by category
export function getMedicationsByType(type: string): Medication[] {
  const typeMap: Record<string, string[]> = {
    analgesic: ['Paracetamol', 'Ibuprofen', 'Diclofenac', 'Tramadol', 'Aspirin'],
    antibiotic: ['Amoxicillin', 'Azithromycin', 'Metronidazole', 'Clindamycin', 'Ciprofloxacin'],
    antiinflammatory: ['Prednisolone', 'Dexamethasone', 'Ibuprofen', 'Diclofenac'],
    antifungal: ['Fluconazole', 'Nystatin'],
    topical: ['Benzocaine', 'Lidocaine', 'Chlorhexidine', 'Povidone Iodine'],
    pediatric: ['Calpol', 'Augmentin Syrup']
  };

  const generics = typeMap[type.toLowerCase()] || [];
  return PAKISTANI_MEDICATIONS.filter(med =>
    generics.some(g => med.genericName.includes(g) || med.brandName.includes(g))
  );
}
