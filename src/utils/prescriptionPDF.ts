// Module 4: Prescription PDF Generator
// Generates professional, legally compliant prescription PDFs

import { Prescription, DosageInstruction } from '../types/prescription';

export class PrescriptionPDFGenerator {
  
  /**
   * Generate prescription PDF content (HTML for printing)
   */
  static generateHTML(prescription: Prescription): string {
    const currentDate = new Date(prescription.issuedAt);
    const followUpDate = new Date(prescription.followUpDate);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Prescription - ${prescription.patientName}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.4;
      color: #000;
    }
    
    .prescription-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border: 2px solid #2c5282;
    }
    
    .header {
      text-align: center;
      border-bottom: 3px double #2c5282;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    
    .clinic-name {
      font-size: 24pt;
      font-weight: bold;
      color: #2c5282;
      margin-bottom: 5px;
      letter-spacing: 1px;
    }
    
    .doctor-info {
      font-size: 11pt;
      color: #333;
      margin: 3px 0;
    }
    
    .contact-info {
      font-size: 10pt;
      color: #666;
      margin-top: 5px;
    }
    
    .patient-info {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      padding: 10px;
      background: #f7fafc;
      border-left: 4px solid #2c5282;
    }
    
    .patient-details {
      font-size: 11pt;
    }
    
    .patient-details strong {
      color: #2c5282;
    }
    
    .diagnosis-section {
      margin: 20px 0;
      padding: 10px;
      background: #fff5f5;
      border-left: 4px solid #e53e3e;
    }
    
    .diagnosis-label {
      font-weight: bold;
      color: #e53e3e;
      font-size: 12pt;
    }
    
    .diagnosis-text {
      margin-top: 5px;
      font-size: 11pt;
    }
    
    .rx-symbol {
      font-size: 36pt;
      font-weight: bold;
      color: #2c5282;
      margin: 20px 0 10px 0;
      font-family: 'Lucida Handwriting', cursive;
    }
    
    .medications-list {
      margin: 20px 0;
      padding-left: 20px;
    }
    
    .medication-item {
      margin: 15px 0;
      padding: 10px;
      border-left: 3px solid #48bb78;
      background: #f0fff4;
    }
    
    .med-name {
      font-weight: bold;
      font-size: 12pt;
      color: #22543d;
    }
    
    .med-dosage {
      margin-top: 5px;
      font-size: 11pt;
      line-height: 1.6;
    }
    
    .instructions-section {
      margin: 25px 0;
      padding: 15px;
      background: #ebf8ff;
      border-left: 4px solid #3182ce;
    }
    
    .section-title {
      font-weight: bold;
      font-size: 12pt;
      color: #2c5282;
      margin-bottom: 10px;
    }
    
    .instruction-list {
      list-style-position: inside;
      margin: 5px 0;
    }
    
    .instruction-list li {
      margin: 5px 0;
      font-size: 11pt;
    }
    
    .warnings-section {
      margin: 20px 0;
      padding: 15px;
      background: #fffaf0;
      border-left: 4px solid #ed8936;
    }
    
    .warning-item {
      margin: 5px 0;
      font-size: 11pt;
      color: #7c2d12;
    }
    
    .followup-section {
      margin: 20px 0;
      padding: 10px;
      background: #f7fafc;
      text-align: center;
      border: 2px dashed #2c5282;
    }
    
    .followup-text {
      font-size: 12pt;
      font-weight: bold;
      color: #2c5282;
    }
    
    .signature-section {
      margin-top: 40px;
      text-align: right;
    }
    
    .signature-line {
      border-top: 2px solid #000;
      width: 250px;
      margin: 30px 0 5px auto;
    }
    
    .signature-name {
      font-weight: bold;
      font-size: 11pt;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 2px solid #2c5282;
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
    
    .legal-text {
      font-size: 8pt;
      color: #999;
      margin-top: 10px;
      font-style: italic;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      .prescription-container {
        border: none;
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="prescription-container">
    
    <!-- Header -->
    <div class="header">
      <div class="clinic-name">ABDULLAH DENTAL CARE</div>
      <div class="doctor-info">Dr. Ahmed Abdullah Khan Gandapur</div>
      <div class="doctor-info">BDS (Pakistan), MPH (Public Health)</div>
      <div class="doctor-info">Pakistan Medical Commission Registration: PMC-7071-D</div>
      <div class="contact-info">
        📍 Hayatabad, Peshawar, Pakistan<br>
        📞 +92-334-5822-622 | ✉️ info@abdullahdentalcare.pk
      </div>
    </div>
    
    <!-- Patient Information -->
    <div class="patient-info">
      <div class="patient-details">
        <div><strong>Patient:</strong> ${prescription.patientName}</div>
        <div><strong>Age/Gender:</strong> ${prescription.patientAge} years, ${prescription.patientGender === 'male' ? 'Male' : 'Female'}</div>
        <div><strong>Contact:</strong> ${prescription.patientPhone}</div>
      </div>
      <div class="patient-details">
        <div><strong>Date:</strong> ${this.formatDate(currentDate)}</div>
        <div><strong>Rx ID:</strong> ${prescription.id.slice(-8).toUpperCase()}</div>
      </div>
    </div>
    
    <!-- Diagnosis -->
    <div class="diagnosis-section">
      <div class="diagnosis-label">Diagnosis:</div>
      <div class="diagnosis-text">
        ${prescription.diagnosis}
        ${prescription.toothNumbers && prescription.toothNumbers.length > 0 
          ? ` (Tooth #${prescription.toothNumbers.join(', #')})`
          : ''}
      </div>
    </div>
    
    <!-- Rx Symbol -->
    <div class="rx-symbol">℞</div>
    
    <!-- Medications -->
    <div class="medications-list">
      ${prescription.medications.map((med, index) => this.generateMedicationHTML(med, index + 1)).join('\n')}
    </div>
    
    <!-- Instructions -->
    ${prescription.instructions.length > 0 ? `
    <div class="instructions-section">
      <div class="section-title">📋 Instructions:</div>
      <ul class="instruction-list">
        ${prescription.instructions.map(inst => `<li>${inst}</li>`).join('\n')}
      </ul>
    </div>
    ` : ''}
    
    <!-- Warnings -->
    ${prescription.warnings.length > 0 ? `
    <div class="warnings-section">
      <div class="section-title">⚠️ Important Warnings:</div>
      ${prescription.warnings.map(warn => `<div class="warning-item">• ${warn}</div>`).join('\n')}
    </div>
    ` : ''}
    
    <!-- Dietary Restrictions -->
    ${prescription.dietaryRestrictions.length > 0 ? `
    <div class="instructions-section">
      <div class="section-title">🍽️ Dietary Restrictions:</div>
      <div style="font-size: 11pt; margin-top: 5px;">
        Avoid: ${prescription.dietaryRestrictions.join(', ')}
      </div>
    </div>
    ` : ''}
    
    <!-- Follow-up -->
    <div class="followup-section">
      <div class="followup-text">
        Follow-up Appointment: ${this.formatDate(followUpDate)}
      </div>
      <div style="font-size: 10pt; margin-top: 5px; color: #666;">
        Please return if symptoms worsen or do not improve
      </div>
    </div>
    
    <!-- Signature -->
    <div class="signature-section">
      <div class="signature-line"></div>
      <div class="signature-name">Dr. Ahmed Abdullah Khan</div>
      <div style="font-size: 10pt; color: #666;">BDS, MPH | PMC: 7071-D</div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div>This prescription is valid for 7 days from date of issue</div>
      <div class="legal-text">
        This prescription is issued by a registered dental surgeon and must be dispensed by a licensed pharmacist.
        Prescription medications should only be used as directed. Keep all medications out of reach of children.
      </div>
    </div>
    
  </div>
  
  <script>
    // Auto-print when loaded (optional)
    // window.onload = () => window.print();
  </script>
</body>
</html>
    `;
  }

  /**
   * Generate HTML for individual medication
   */
  private static generateMedicationHTML(dosage: DosageInstruction, index: number): string {
    const med = dosage.medication;
    
    return `
      <div class="medication-item">
        <div class="med-name">
          ${index}. ${med.form === 'tablet' ? 'Tab' : med.form === 'capsule' ? 'Cap' : med.form === 'syrup' ? 'Syp' : ''} 
          ${med.brandName} ${med.strength}
          ${med.genericName !== med.brandName ? `<span style="color: #666; font-size: 10pt;">(${med.genericName})</span>` : ''}
        </div>
        <div class="med-dosage">
          <strong>Sig:</strong> ${dosage.dose} ${this.formatFrequency(dosage.frequency)} ${dosage.timing}
          ${dosage.duration ? ` × ${dosage.duration}` : ''}
          ${dosage.specialInstructions ? `<br><em style="color: #e53e3e;">⚠ ${dosage.specialInstructions}</em>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Format frequency for prescription
   */
  private static formatFrequency(freq: string): string {
    const freqMap: Record<string, string> = {
      'OD': 'once daily',
      'BD': 'twice daily',
      'TDS': 'three times daily',
      'QID': 'four times daily',
      'SOS': 'when needed'
    };
    return freqMap[freq] || freq;
  }

  /**
   * Format date for prescription
   */
  private static formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  /**
   * Generate print-ready prescription
   * Returns HTML string that can be opened in new window for printing
   */
  static generatePrintable(prescription: Prescription): string {
    return this.generateHTML(prescription);
  }

  /**
   * Create downloadable prescription file
   */
  static createDownloadableFile(prescription: Prescription): Blob {
    const html = this.generateHTML(prescription);
    return new Blob([html], { type: 'text/html' });
  }

  /**
   * Get prescription filename
   */
  static getFilename(prescription: Prescription): string {
    const date = new Date(prescription.issuedAt);
    const dateStr = date.toISOString().split('T')[0];
    const patientName = prescription.patientName.replace(/\s+/g, '_');
    return `Rx_${patientName}_${dateStr}_${prescription.id.slice(-6)}.html`;
  }
}

/**
 * Helper function to print prescription
 */
export function printPrescription(prescription: Prescription): void {
  const html = PrescriptionPDFGenerator.generatePrintable(prescription);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  }
}

/**
 * Helper function to download prescription
 */
export function downloadPrescription(prescription: Prescription): void {
  const blob = PrescriptionPDFGenerator.createDownloadableFile(prescription);
  const filename = PrescriptionPDFGenerator.getFilename(prescription);
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
