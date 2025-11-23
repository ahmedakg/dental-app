import Dexie from 'dexie';

export const db = new Dexie('AbdullahDentalCare');

db.version(1).stores({
  patients: '++id, name, phone, age, gender, address, behaviorTag, createdAt',
  appointments: '++id, patientId, date, time, type, status, createdAt',
  treatments: '++id, patientId, appointmentId, date, items, total, discount, paid, balance, status',
  prescriptions: '++id, patientId, date, condition, medications, instructions',
  labWork: '++id, patientId, date, description, labCharges, status, returnDate',
  orthodontics: '++id, patientId, startDate, totalCost, advancePayment, installments, status',
  expenses: '++id, date, category, amount, description',
  settings: 'key, value'
});

// ALL 70 TREATMENTS - USD PEGGED
export const ALL_TREATMENTS = [
  // CONSULTATION & DIAGNOSTICS
  { id: 1, name: 'Consultation', usd: 7, pkr: 2000, category: 'Consultation' },
  { id: 2, name: 'Periapical X-Ray', usd: 4, pkr: 1000, category: 'Diagnostics' },
  { id: 3, name: 'Post-Op Follow-up', usd: 4, pkr: 1000, category: 'Consultation' },
  
  // PREVENTIVE
  { id: 4, name: 'Pits & Fissure Sealants', usd: 18, pkr: 5000, category: 'Preventive', perTooth: true },
  { id: 5, name: 'Fluoride Application (Children)', usd: 7, pkr: 2000, category: 'Preventive' },
  { id: 6, name: 'Night Guard Single Arch', usd: 35, pkr: 10000, category: 'Preventive' },
  { id: 7, name: 'Athletic Mouthguards', usd: 30, pkr: 8500, category: 'Preventive' },
  
  // FILLINGS
  { id: 8, name: 'Temporary Filling', usd: 15, pkr: 4000, category: 'Fillings', perTooth: true },
  { id: 9, name: 'Glass Ionomer Fluoride', usd: 18, pkr: 5000, category: 'Fillings', perTooth: true },
  { id: 10, name: 'Light Cure Composite (A) Class I & V', usd: 30, pkr: 8500, category: 'Fillings', perTooth: true },
  { id: 11, name: 'Light Cure Composite (B) Class II, III, IV', usd: 30, pkr: 8500, category: 'Fillings', perTooth: true },
  { id: 12, name: 'Amalgam/Cermet Silver', usd: 18, pkr: 5000, category: 'Fillings', perTooth: true },
  { id: 13, name: 'Inlays/Onlays Composite', usd: 45, pkr: 12500, category: 'Fillings', perTooth: true },
  
  // ENDODONTICS
  { id: 14, name: 'Fibre Post & Core Buildup', usd: 35, pkr: 10000, category: 'Endodontics', perTooth: true },
  { id: 15, name: 'Metal Post & Core', usd: 30, pkr: 8500, category: 'Endodontics', perTooth: true },
  { id: 16, name: 'RCT Single Root', usd: 55, pkr: 15000, category: 'Endodontics', perTooth: true },
  { id: 17, name: 'RCT 2 Root', usd: 65, pkr: 18000, category: 'Endodontics', perTooth: true },
  { id: 18, name: 'RCT 3 Root', usd: 75, pkr: 21000, category: 'Endodontics', perTooth: true },
  { id: 19, name: 'RCT 4 Root', usd: 90, pkr: 25000, category: 'Endodontics', perTooth: true },
  { id: 20, name: 'Re-RCT Single Root', usd: 65, pkr: 18000, category: 'Endodontics', perTooth: true },
  { id: 21, name: 'Re-RCT Multi Root', usd: 90, pkr: 25000, category: 'Endodontics', perTooth: true },
  { id: 22, name: 'Pulpotomy Primary Teeth', usd: 20, pkr: 5500, category: 'Pediatric', perTooth: true },
  { id: 23, name: 'Pulpectomy Primary Teeth', usd: 30, pkr: 8500, category: 'Pediatric', perTooth: true },
  
  // PROSTHODONTICS - CROWNS & BRIDGES
  { id: 24, name: 'Metal Crown', usd: 90, pkr: 25000, category: 'Prosthodontics', perTooth: true },
  { id: 25, name: 'Porcelain Fused to Metal (PFM) Crown', usd: 110, pkr: 30000, category: 'Prosthodontics', perTooth: true },
  { id: 26, name: 'Zirconia Crown', usd: 180, pkr: 50000, category: 'Prosthodontics', perTooth: true },
  { id: 27, name: 'E-max Crown', usd: 215, pkr: 60000, category: 'Prosthodontics', perTooth: true },
  { id: 28, name: 'Veneers Composite', usd: 90, pkr: 25000, category: 'Cosmetic', perTooth: true },
  { id: 29, name: 'Veneers Porcelain', usd: 180, pkr: 50000, category: 'Cosmetic', perTooth: true },
  { id: 30, name: 'Maryland Bridge', usd: 180, pkr: 50000, category: 'Prosthodontics' },
  { id: 31, name: 'PFM Bridge (3 Units)', usd: 270, pkr: 75000, category: 'Prosthodontics' },
  { id: 32, name: 'Zirconia Bridge (3 Units)', usd: 430, pkr: 120000, category: 'Prosthodontics' },
  
  // PROSTHODONTICS - DENTURES
  { id: 33, name: 'Complete Denture (Single Arch)', usd: 180, pkr: 50000, category: 'Prosthodontics' },
  { id: 34, name: 'Complete Denture (Both Arches)', usd: 320, pkr: 90000, category: 'Prosthodontics' },
  { id: 35, name: 'Flexible Denture (Valplast)', usd: 215, pkr: 60000, category: 'Prosthodontics' },
  { id: 36, name: 'Cast Partial Denture', usd: 180, pkr: 50000, category: 'Prosthodontics' },
  { id: 37, name: 'Acrylic Partial Denture', usd: 90, pkr: 25000, category: 'Prosthodontics' },
  { id: 38, name: 'Immediate Denture', usd: 215, pkr: 60000, category: 'Prosthodontics' },
  { id: 39, name: 'Overdenture', usd: 250, pkr: 70000, category: 'Prosthodontics' },
  
  // SURGERY & EXTRACTIONS
  { id: 40, name: 'Simple Extraction', usd: 18, pkr: 5000, category: 'Surgery', perTooth: true },
  { id: 41, name: 'Surgical Extraction', usd: 35, pkr: 10000, category: 'Surgery', perTooth: true },
  { id: 42, name: 'Impacted Wisdom Tooth (Simple)', usd: 55, pkr: 15000, category: 'Surgery', perTooth: true },
  { id: 43, name: 'Impacted Wisdom Tooth (Complicated)', usd: 90, pkr: 25000, category: 'Surgery', perTooth: true },
  { id: 44, name: 'Primary Tooth Extraction', usd: 11, pkr: 3000, category: 'Pediatric', perTooth: true },
  
  // PERIODONTICS
  { id: 45, name: 'Scaling & Polishing', usd: 25, pkr: 7000, category: 'Periodontics' },
  { id: 46, name: 'Deep Scaling (Per Quadrant)', usd: 35, pkr: 10000, category: 'Periodontics' },
  { id: 47, name: 'Root Planning (Per Quadrant)', usd: 35, pkr: 10000, category: 'Periodontics' },
  { id: 48, name: 'Gingivectomy (Per Quadrant)', usd: 55, pkr: 15000, category: 'Periodontics' },
  { id: 49, name: 'Gum Graft', usd: 180, pkr: 50000, category: 'Periodontics' },
  { id: 50, name: 'Crown Lengthening', usd: 90, pkr: 25000, category: 'Periodontics', perTooth: true },
  
  // IMPLANTS
  { id: 51, name: 'Dental Implant (Fixture Only)', usd: 360, pkr: 100000, category: 'Implants', perTooth: true },
  { id: 52, name: 'Implant with Crown (PFM)', usd: 540, pkr: 150000, category: 'Implants', perTooth: true },
  { id: 53, name: 'Implant with Crown (Zirconia)', usd: 720, pkr: 200000, category: 'Implants', perTooth: true },
  { id: 54, name: 'Bone Grafting', usd: 180, pkr: 50000, category: 'Implants' },
  { id: 55, name: 'Sinus Lift', usd: 270, pkr: 75000, category: 'Implants' },
  { id: 56, name: 'Guided Tissue Regeneration (GTR)', usd: 90, pkr: 25000, category: 'Implants' },
  
  // ORTHODONTICS
  { id: 57, name: 'Fixed Braces (Simple Case)', usd: 540, pkr: 150000, category: 'Orthodontics' },
  { id: 58, name: 'Fixed Braces (Complicated Case)', usd: 900, pkr: 250000, category: 'Orthodontics' },
  { id: 59, name: 'Fixed Braces (Ceramic Brackets)', usd: 1080, pkr: 300000, category: 'Orthodontics' },
  { id: 60, name: 'Removable Braces Clearpath', usd: 1200, pkr: 335000, category: 'Orthodontics' },
  { id: 61, name: 'Retainers (Removable) Upper & Lower', usd: 55, pkr: 15000, category: 'Orthodontics' },
  { id: 62, name: 'Retainers (Fixed) Upper & Lower', usd: 72, pkr: 20000, category: 'Orthodontics' },
  
  // COSMETIC & LASER
  { id: 63, name: 'Laser Teeth Whitening (Half Strength)', usd: 90, pkr: 25000, category: 'Cosmetic' },
  { id: 64, name: 'Laser Teeth Whitening (Full Strength)', usd: 108, pkr: 30000, category: 'Cosmetic' },
  { id: 65, name: 'Soft Tissue Laser/Cautry per Quadrant', usd: 36, pkr: 10000, category: 'Cosmetic' },
  
  // EMERGENCY & MISCELLANEOUS
  { id: 66, name: 'Emergency Consultation', usd: 18, pkr: 5000, category: 'Emergency' },
  { id: 67, name: 'Desensitizing Treatment', usd: 25, pkr: 7000, category: 'Preventive' },
  { id: 68, name: 'Space Maintainer', usd: 55, pkr: 15000, category: 'Pediatric' },
  { id: 69, name: 'Splinting (Per Tooth)', usd: 35, pkr: 10000, category: 'Periodontics', perTooth: true },
  { id: 70, name: 'Custom Service', usd: 0, pkr: 0, category: 'Other' }
];

// FDI TOOTH NOTATION
export const ADULT_TEETH = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
  lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
  lowerRight: [41, 42, 43, 44, 45, 46, 47, 48]
};

export const PRIMARY_TEETH = {
  upperRight: [55, 54, 53, 52, 51],
  upperLeft: [61, 62, 63, 64, 65],
  lowerLeft: [71, 72, 73, 74, 75],
  lowerRight: [81, 82, 83, 84, 85]
};

// Initialize database with default data
export async function initializeDefaultData() {
  const count = await db.settings.count();
  if (count === 0) {
    await db.settings.add({ key: 'treatments', value: ALL_TREATMENTS });
    await db.settings.add({ 
      key: 'clinicInfo', 
      value: {
        name: 'Abdullah Dental Care',
        doctor: 'Dr. Ahmed Abdullah Khan',
        qualifications: 'BDS, MPH',
        pmcNumber: '7071-D',
        address: '37-G4, Qasim Ave., Phase 2, Hayatabad, Peshawar, Pakistan',
        phone: '+92-334-5822-622',
        email: 'info@abdullahdentalcare.com'
      }
    });
    await db.settings.add({ key: 'gamification', value: { points: 0, streak: 0, lastGoalDate: null } });
    console.log('✅ Database initialized with 70 treatments');
  }
}

// Initialize on load
initializeDefaultData().catch(console.error);

