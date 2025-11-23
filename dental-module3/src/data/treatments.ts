// Module 3: Complete Treatment Database
// Abdullah Dental Care - 70 Treatments with USD-pegged pricing
// Exchange Rate: 1 USD = 278 PKR (rounded)

import { Treatment, TreatmentCategory } from '../types/treatment';

const USD_TO_PKR = 278;

const createTreatment = (
  code: string,
  name: string,
  category: TreatmentCategory,
  priceUSD: number,
  description?: string,
  duration?: number,
  requiresLab?: boolean,
  requiresAnesthesia?: boolean
): Treatment => ({
  id: code,
  code,
  name,
  category,
  priceUSD,
  pricePKR: Math.round(priceUSD * USD_TO_PKR),
  description,
  duration,
  requiresLab,
  requiresAnesthesia
});

export const TREATMENTS: Treatment[] = [
  // CONSULTATION & DIAGNOSIS (5 treatments)
  createTreatment(
    'CONS-001',
    'Initial Consultation',
    'Consultation & Diagnosis',
    10,
    'First visit examination and consultation',
    30
  ),
  createTreatment(
    'CONS-002',
    'Follow-up Consultation',
    'Consultation & Diagnosis',
    7,
    'Subsequent visit consultation',
    15
  ),
  createTreatment(
    'DIAG-001',
    'Intraoral X-ray (Single)',
    'Consultation & Diagnosis',
    5,
    'Single periapical or bitewing x-ray',
    10
  ),
  createTreatment(
    'DIAG-002',
    'OPG (Panoramic X-ray)',
    'Consultation & Diagnosis',
    18,
    'Full mouth panoramic radiograph',
    15
  ),
  createTreatment(
    'DIAG-003',
    'Cephalometric X-ray',
    'Consultation & Diagnosis',
    20,
    'Lateral skull x-ray for orthodontic planning',
    15
  ),

  // PREVENTIVE CARE (8 treatments)
  createTreatment(
    'PREV-001',
    'Oral Hygiene Instructions',
    'Preventive Care',
    5,
    'Brushing and flossing education',
    20
  ),
  createTreatment(
    'PREV-002',
    'Scaling (Light)',
    'Preventive Care',
    15,
    'Basic tartar removal - upper or lower arch',
    30
  ),
  createTreatment(
    'PREV-003',
    'Scaling (Full Mouth)',
    'Preventive Care',
    25,
    'Complete tartar removal both arches',
    45
  ),
  createTreatment(
    'PREV-004',
    'Polishing',
    'Preventive Care',
    8,
    'Teeth polishing after scaling',
    15
  ),
  createTreatment(
    'PREV-005',
    'Fluoride Treatment',
    'Preventive Care',
    10,
    'Professional fluoride application',
    15
  ),
  createTreatment(
    'PREV-006',
    'Pit & Fissure Sealant (per tooth)',
    'Preventive Care',
    8,
    'Preventive sealing of molars',
    15
  ),
  createTreatment(
    'PREV-007',
    'Mouth Guard (Sports)',
    'Preventive Care',
    35,
    'Custom sports mouth guard',
    30,
    true
  ),
  createTreatment(
    'PREV-008',
    'Night Guard (Bruxism)',
    'Preventive Care',
    50,
    'Custom night guard for teeth grinding',
    30,
    true
  ),

  // RESTORATIVE DENTISTRY (12 treatments)
  createTreatment(
    'REST-001',
    'Composite Filling (Small)',
    'Restorative Dentistry',
    15,
    'Single surface tooth-colored filling',
    30,
    false,
    true
  ),
  createTreatment(
    'REST-002',
    'Composite Filling (Medium)',
    'Restorative Dentistry',
    20,
    'Two surface tooth-colored filling',
    40,
    false,
    true
  ),
  createTreatment(
    'REST-003',
    'Composite Filling (Large)',
    'Restorative Dentistry',
    28,
    'Three or more surface filling',
    50,
    false,
    true
  ),
  createTreatment(
    'REST-004',
    'Amalgam Filling (Silver)',
    'Restorative Dentistry',
    12,
    'Silver filling for posterior teeth',
    30,
    false,
    true
  ),
  createTreatment(
    'REST-005',
    'GIC Filling',
    'Restorative Dentistry',
    10,
    'Glass ionomer cement filling',
    25,
    false,
    true
  ),
  createTreatment(
    'REST-006',
    'Indirect Pulp Capping',
    'Restorative Dentistry',
    18,
    'Deep cavity base protection',
    40,
    false,
    true
  ),
  createTreatment(
    'REST-007',
    'Direct Pulp Capping',
    'Restorative Dentistry',
    22,
    'Exposed pulp protection',
    45,
    false,
    true
  ),
  createTreatment(
    'REST-008',
    'Core Build-up',
    'Restorative Dentistry',
    25,
    'Tooth structure restoration before crown',
    35,
    false,
    true
  ),
  createTreatment(
    'REST-009',
    'Post & Core',
    'Restorative Dentistry',
    40,
    'Post placement with core build-up',
    50,
    false,
    true
  ),
  createTreatment(
    'REST-010',
    'Temporary Filling',
    'Restorative Dentistry',
    5,
    'Short-term filling material',
    15
  ),
  createTreatment(
    'REST-011',
    'Re-cementation (Crown/Bridge)',
    'Restorative Dentistry',
    8,
    'Re-cementing loose restoration',
    20
  ),
  createTreatment(
    'REST-012',
    'Repair (Filling/Crown)',
    'Restorative Dentistry',
    12,
    'Minor repair of existing restoration',
    30
  ),

  // ENDODONTICS (ROOT CANAL) (6 treatments)
  createTreatment(
    'ENDO-001',
    'Root Canal - Anterior',
    'Endodontics',
    80,
    'Single root canal treatment front teeth',
    90,
    false,
    true
  ),
  createTreatment(
    'ENDO-002',
    'Root Canal - Premolar',
    'Endodontics',
    100,
    'Root canal treatment premolar teeth',
    120,
    false,
    true
  ),
  createTreatment(
    'ENDO-003',
    'Root Canal - Molar',
    'Endodontics',
    130,
    'Multi-canal root canal treatment molar',
    150,
    false,
    true
  ),
  createTreatment(
    'ENDO-004',
    'Pulpotomy (Child)',
    'Endodontics',
    25,
    'Partial pulp removal primary teeth',
    40,
    false,
    true
  ),
  createTreatment(
    'ENDO-005',
    'Pulpectomy (Child)',
    'Endodontics',
    35,
    'Complete pulp removal primary teeth',
    50,
    false,
    true
  ),
  createTreatment(
    'ENDO-006',
    'Root Canal Retreatment',
    'Endodontics',
    150,
    'Redo previous root canal',
    180,
    false,
    true
  ),

  // PERIODONTICS (GUM TREATMENT) (5 treatments)
  createTreatment(
    'PERIO-001',
    'Deep Scaling (per quadrant)',
    'Periodontics',
    25,
    'Subgingival scaling one quadrant',
    45,
    false,
    true
  ),
  createTreatment(
    'PERIO-002',
    'Root Planing (per quadrant)',
    'Periodontics',
    30,
    'Root surface smoothing',
    50,
    false,
    true
  ),
  createTreatment(
    'PERIO-003',
    'Gum Surgery (Gingivectomy)',
    'Periodontics',
    120,
    'Gum tissue removal/reshaping',
    90,
    false,
    true
  ),
  createTreatment(
    'PERIO-004',
    'Crown Lengthening',
    'Periodontics',
    150,
    'Surgical crown exposure',
    120,
    false,
    true
  ),
  createTreatment(
    'PERIO-005',
    'Periodontal Maintenance',
    'Periodontics',
    20,
    'Regular gum disease follow-up cleaning',
    45
  ),

  // ORAL SURGERY (8 treatments)
  createTreatment(
    'SURG-001',
    'Simple Extraction',
    'Oral Surgery',
    15,
    'Routine tooth removal',
    20,
    false,
    true
  ),
  createTreatment(
    'SURG-002',
    'Surgical Extraction',
    'Oral Surgery',
    35,
    'Complex tooth removal with flap',
    45,
    false,
    true
  ),
  createTreatment(
    'SURG-003',
    'Wisdom Tooth Extraction (Simple)',
    'Oral Surgery',
    40,
    'Erupted wisdom tooth removal',
    30,
    false,
    true
  ),
  createTreatment(
    'SURG-004',
    'Wisdom Tooth Extraction (Impacted)',
    'Oral Surgery',
    80,
    'Impacted wisdom tooth surgical removal',
    60,
    false,
    true
  ),
  createTreatment(
    'SURG-005',
    'Alveoplasty',
    'Oral Surgery',
    50,
    'Bone recontouring after extraction',
    45,
    false,
    true
  ),
  createTreatment(
    'SURG-006',
    'Frenectomy',
    'Oral Surgery',
    60,
    'Frenum removal surgery',
    40,
    false,
    true
  ),
  createTreatment(
    'SURG-007',
    'Incision & Drainage',
    'Oral Surgery',
    25,
    'Abscess drainage procedure',
    30,
    false,
    true
  ),
  createTreatment(
    'SURG-008',
    'Biopsy',
    'Oral Surgery',
    70,
    'Tissue sample removal for analysis',
    40,
    true,
    true
  ),

  // PROSTHODONTICS (CROWNS & BRIDGES) (10 treatments)
  createTreatment(
    'PROST-001',
    'Porcelain Fused Metal Crown (PFM)',
    'Prosthodontics',
    120,
    'Metal ceramic crown',
    60,
    true
  ),
  createTreatment(
    'PROST-002',
    'Full Ceramic Crown (Zirconia)',
    'Prosthodontics',
    180,
    'All-ceramic zirconia crown',
    60,
    true
  ),
  createTreatment(
    'PROST-003',
    'Metal Crown (Gold/Alloy)',
    'Prosthodontics',
    100,
    'Full metal crown',
    60,
    true
  ),
  createTreatment(
    'PROST-004',
    'PFM Bridge (per unit)',
    'Prosthodontics',
    110,
    'Fixed bridge unit porcelain-metal',
    90,
    true
  ),
  createTreatment(
    'PROST-005',
    'Full Ceramic Bridge (per unit)',
    'Prosthodontics',
    170,
    'Fixed bridge unit all-ceramic',
    90,
    true
  ),
  createTreatment(
    'PROST-006',
    'Complete Denture (Upper or Lower)',
    'Prosthodontics',
    200,
    'Full removable denture one arch',
    120,
    true
  ),
  createTreatment(
    'PROST-007',
    'Partial Denture (Acrylic)',
    'Prosthodontics',
    120,
    'Removable partial denture',
    90,
    true
  ),
  createTreatment(
    'PROST-008',
    'Partial Denture (Metal Framework)',
    'Prosthodontics',
    180,
    'Cast metal partial denture',
    90,
    true
  ),
  createTreatment(
    'PROST-009',
    'Denture Reline',
    'Prosthodontics',
    40,
    'Denture base adjustment',
    60,
    true
  ),
  createTreatment(
    'PROST-010',
    'Denture Repair',
    'Prosthodontics',
    25,
    'Broken denture fix',
    45,
    true
  ),

  // COSMETIC DENTISTRY (6 treatments)
  createTreatment(
    'COSM-001',
    'Teeth Whitening (In-office)',
    'Cosmetic Dentistry',
    150,
    'Professional bleaching single session',
    90
  ),
  createTreatment(
    'COSM-002',
    'Teeth Whitening (Home Kit)',
    'Cosmetic Dentistry',
    80,
    'Custom trays with bleaching gel',
    60,
    true
  ),
  createTreatment(
    'COSM-003',
    'Composite Veneer (per tooth)',
    'Cosmetic Dentistry',
    60,
    'Direct composite veneer',
    60
  ),
  createTreatment(
    'COSM-004',
    'Porcelain Veneer (per tooth)',
    'Cosmetic Dentistry',
    250,
    'Ceramic veneer custom made',
    90,
    true
  ),
  createTreatment(
    'COSM-005',
    'Smile Makeover Consultation',
    'Cosmetic Dentistry',
    20,
    'Comprehensive cosmetic planning',
    60
  ),
  createTreatment(
    'COSM-006',
    'Tooth Reshaping/Contouring',
    'Cosmetic Dentistry',
    25,
    'Minor tooth shape adjustment',
    30
  ),

  // ORTHODONTICS (5 treatments)
  createTreatment(
    'ORTHO-001',
    'Orthodontic Consultation',
    'Orthodontics',
    15,
    'Braces evaluation and planning',
    45
  ),
  createTreatment(
    'ORTHO-002',
    'Metal Braces (per arch)',
    'Orthodontics',
    400,
    'Traditional metal braces',
    120,
    true
  ),
  createTreatment(
    'ORTHO-003',
    'Ceramic Braces (per arch)',
    'Orthodontics',
    500,
    'Tooth-colored braces',
    120,
    true
  ),
  createTreatment(
    'ORTHO-004',
    'Retainer (per arch)',
    'Orthodontics',
    80,
    'Post-braces retention appliance',
    45,
    true
  ),
  createTreatment(
    'ORTHO-005',
    'Orthodontic Adjustment',
    'Orthodontics',
    20,
    'Monthly braces adjustment',
    30
  ),

  // PEDIATRIC DENTISTRY (3 treatments)
  createTreatment(
    'PED-001',
    'Child Dental Check-up',
    'Pediatric Dentistry',
    8,
    'Routine child examination',
    30
  ),
  createTreatment(
    'PED-002',
    'Primary Tooth Extraction',
    'Pediatric Dentistry',
    10,
    'Baby tooth removal',
    20,
    false,
    true
  ),
  createTreatment(
    'PED-003',
    'Space Maintainer',
    'Pediatric Dentistry',
    60,
    'Device to hold space after early loss',
    45,
    true
  ),

  // EMERGENCY CARE (2 treatments)
  createTreatment(
    'EMRG-001',
    'Emergency Examination',
    'Emergency Care',
    15,
    'Urgent pain/trauma assessment',
    20
  ),
  createTreatment(
    'EMRG-002',
    'Emergency Pain Relief',
    'Emergency Care',
    20,
    'Immediate pain management treatment',
    30,
    false,
    true
  ),
];

// Helper functions
export const getTreatmentByCode = (code: string): Treatment | undefined => {
  return TREATMENTS.find(t => t.code === code);
};

export const getTreatmentsByCategory = (category: TreatmentCategory): Treatment[] => {
  return TREATMENTS.filter(t => t.category === category);
};

export const getAllCategories = (): TreatmentCategory[] => {
  return Array.from(new Set(TREATMENTS.map(t => t.category)));
};

export const searchTreatments = (query: string): Treatment[] => {
  const lowerQuery = query.toLowerCase();
  return TREATMENTS.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.code.toLowerCase().includes(lowerQuery) ||
    t.category.toLowerCase().includes(lowerQuery) ||
    (t.description && t.description.toLowerCase().includes(lowerQuery))
  );
};

export const calculateTreatmentTotal = (
  treatment: Treatment,
  quantity: number,
  discount: number = 0
): number => {
  const subtotal = treatment.pricePKR * quantity;
  const discountAmount = (subtotal * discount) / 100;
  return Math.round(subtotal - discountAmount);
};
