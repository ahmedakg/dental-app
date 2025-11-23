// Module 4: Medical History Safety Checker
// Automatically screens prescriptions against patient medical history

import { PatientMedicalHistory, Medication, DosageInstruction, MedicalAlert, TreatmentProtocol } from '../types/prescription';

export class MedicalSafetyChecker {
  
  /**
   * Main function: Check entire protocol against patient history
   * Returns alerts and modified protocol
   */
  static checkProtocol(
    protocol: TreatmentProtocol,
    history: PatientMedicalHistory
  ): { alerts: MedicalAlert[]; safeProtocol: TreatmentProtocol } {
    
    const alerts: MedicalAlert[] = [];
    const safeMedications: DosageInstruction[] = [];

    // Check each medication
    for (const dosage of protocol.medications) {
      const medAlerts = this.checkMedication(dosage.medication, history);
      
      if (medAlerts.length === 0) {
        // Safe medication
        safeMedications.push(dosage);
      } else {
        // Has contraindications
        alerts.push(...medAlerts);
        
        // Only include if it's just a warning (not error)
        const hasError = medAlerts.some(a => a.type === 'error');
        if (!hasError) {
          safeMedications.push(dosage);
        }
      }
    }

    // Add protocol-level warnings
    const protocolAlerts = this.checkProtocolWarnings(protocol, history);
    alerts.push(...protocolAlerts);

    return {
      alerts,
      safeProtocol: {
        ...protocol,
        medications: safeMedications
      }
    };
  }

  /**
   * Check individual medication against patient history
   */
  static checkMedication(
    medication: Medication,
    history: PatientMedicalHistory
  ): MedicalAlert[] {
    
    const alerts: MedicalAlert[] = [];

    // 1. PREGNANCY CHECK
    if (history.isPregnant) {
      if (medication.pregnancy === 'avoid') {
        alerts.push({
          type: 'error',
          message: `⛔ ${medication.brandName} (${medication.genericName}) is CONTRAINDICATED in pregnancy`,
          affectedMedications: [medication.brandName],
          action: 'remove'
        });
      } else if (medication.pregnancy === 'caution') {
        alerts.push({
          type: 'warning',
          message: `⚠️ ${medication.brandName} - Use with caution in pregnancy. Inform patient of risks.`,
          affectedMedications: [medication.brandName],
          action: 'monitor'
        });
      }
    }

    // 2. BREASTFEEDING CHECK
    if (history.isBreastfeeding) {
      if (medication.breastfeeding === 'avoid') {
        alerts.push({
          type: 'error',
          message: `⛔ ${medication.brandName} (${medication.genericName}) is CONTRAINDICATED during breastfeeding`,
          affectedMedications: [medication.brandName],
          action: 'remove'
        });
      } else if (medication.breastfeeding === 'caution') {
        alerts.push({
          type: 'warning',
          message: `⚠️ ${medication.brandName} - Use with caution during breastfeeding. Monitor infant.`,
          affectedMedications: [medication.brandName],
          action: 'monitor'
        });
      }
    }

    // 3. ALLERGY CHECK
    for (const allergy of history.allergies) {
      const allergyLower = allergy.toLowerCase();
      const genericLower = medication.genericName.toLowerCase();
      const brandLower = medication.brandName.toLowerCase();

      if (genericLower.includes(allergyLower) || 
          allergyLower.includes(genericLower) ||
          brandLower.includes(allergyLower)) {
        alerts.push({
          type: 'error',
          message: `🚨 ALLERGY ALERT: Patient is allergic to ${allergy}. ${medication.brandName} MUST NOT be prescribed!`,
          affectedMedications: [medication.brandName],
          action: 'remove'
        });
      }

      // Check for related allergies (e.g., penicillin allergy)
      if (allergyLower.includes('penicillin') && 
          (genericLower.includes('amoxicillin') || genericLower.includes('ampicillin'))) {
        alerts.push({
          type: 'error',
          message: `🚨 CROSS-ALLERGY: Patient allergic to penicillin. ${medication.brandName} contains ${medication.genericName}.`,
          affectedMedications: [medication.brandName],
          action: 'remove'
        });
      }
    }

    // 4. BLOOD THINNERS CHECK
    if (history.bloodThinners) {
      const interactions = medication.interactions.filter(int => 
        int.toLowerCase().includes('warfarin') || 
        int.toLowerCase().includes('anticoagulant')
      );
      
      if (interactions.length > 0) {
        alerts.push({
          type: 'warning',
          message: `⚠️ ${medication.brandName} interacts with blood thinners. Monitor for increased bleeding risk. May need dose adjustment.`,
          affectedMedications: [medication.brandName],
          action: 'adjust'
        });
      }

      // NSAIDs are particularly risky with blood thinners
      if (['Ibuprofen', 'Diclofenac', 'Aspirin'].some(name => 
          medication.genericName.includes(name))) {
        alerts.push({
          type: 'warning',
          message: `⚠️ CAUTION: ${medication.brandName} is an NSAID. Increased bleeding risk with blood thinners. Consider using Paracetamol instead.`,
          affectedMedications: [medication.brandName],
          action: 'replace'
        });
      }
    }

    // 5. DIABETES CHECK
    if (history.diabetic) {
      // Corticosteroids affect blood sugar
      if (medication.genericName.includes('Prednisolone') || 
          medication.genericName.includes('Dexamethasone')) {
        alerts.push({
          type: 'warning',
          message: `⚠️ ${medication.brandName} may increase blood sugar. Advise patient to monitor glucose levels closely.`,
          affectedMedications: [medication.brandName],
          action: 'monitor'
        });
      }
    }

    // 6. HYPERTENSION CHECK
    if (history.hypertensive) {
      // NSAIDs can raise blood pressure
      if (['Ibuprofen', 'Diclofenac'].some(name => 
          medication.genericName.includes(name))) {
        alerts.push({
          type: 'warning',
          message: `⚠️ ${medication.brandName} may increase blood pressure. Monitor BP and consider shorter course.`,
          affectedMedications: [medication.brandName],
          action: 'monitor'
        });
      }

      // Adrenaline in anesthetics
      if (medication.genericName.includes('Adrenaline')) {
        alerts.push({
          type: 'warning',
          message: `⚠️ Local anesthetic contains adrenaline. Use cautiously in hypertensive patients. Monitor vital signs.`,
          affectedMedications: [medication.brandName],
          action: 'monitor'
        });
      }
    }

    // 7. ASTHMA CHECK
    if (history.asthmatic) {
      // NSAIDs can trigger bronchospasm in some asthmatics
      if (medication.genericName.includes('Aspirin') || 
          medication.genericName.includes('Ibuprofen')) {
        alerts.push({
          type: 'warning',
          message: `⚠️ ${medication.brandName} may trigger asthma in sensitive individuals. Ask about NSAID sensitivity. Have bronchodilator ready.`,
          affectedMedications: [medication.brandName],
          action: 'monitor'
        });
      }
    }

    // 8. LIVER DISEASE CHECK
    if (history.liverDisease) {
      if (medication.contraindications.some(c => c.toLowerCase().includes('liver'))) {
        alerts.push({
          type: 'error',
          message: `⛔ ${medication.brandName} is contraindicated in severe liver disease. Consider alternative.`,
          affectedMedications: [medication.brandName],
          action: 'remove'
        });
      }

      // Paracetamol needs dose reduction
      if (medication.genericName.includes('Paracetamol')) {
        alerts.push({
          type: 'warning',
          message: `⚠️ ${medication.brandName}: Reduce dose in liver disease. Maximum 2g/day instead of 4g/day.`,
          affectedMedications: [medication.brandName],
          action: 'adjust'
        });
      }
    }

    // 9. KIDNEY DISEASE CHECK
    if (history.kidneyDisease) {
      if (medication.contraindications.some(c => c.toLowerCase().includes('kidney') || c.toLowerCase().includes('renal'))) {
        alerts.push({
          type: 'error',
          message: `⛔ ${medication.brandName} is contraindicated in severe kidney disease.`,
          affectedMedications: [medication.brandName],
          action: 'remove'
        });
      }

      // NSAIDs are particularly nephrotoxic
      if (['Ibuprofen', 'Diclofenac'].some(name => 
          medication.genericName.includes(name))) {
        alerts.push({
          type: 'warning',
          message: `⚠️ ${medication.brandName} may worsen kidney function. Use lowest effective dose for shortest time.`,
          affectedMedications: [medication.brandName],
          action: 'adjust'
        });
      }
    }

    // 10. CURRENT MEDICATIONS CHECK
    for (const currentMed of history.currentMedications) {
      const currentMedLower = currentMed.toLowerCase();
      
      for (const interaction of medication.interactions) {
        if (currentMedLower.includes(interaction.toLowerCase()) ||
            interaction.toLowerCase().includes(currentMedLower)) {
          alerts.push({
            type: 'warning',
            message: `⚠️ DRUG INTERACTION: ${medication.brandName} interacts with ${currentMed}. Monitor patient closely.`,
            affectedMedications: [medication.brandName],
            action: 'monitor'
          });
        }
      }
    }

    return alerts;
  }

  /**
   * Check protocol-level warnings (not medication-specific)
   */
  static checkProtocolWarnings(
    protocol: TreatmentProtocol,
    history: PatientMedicalHistory
  ): MedicalAlert[] {
    
    const alerts: MedicalAlert[] = [];

    // Check for dietary restrictions conflicts
    if (history.diabetic && protocol.dietaryRestrictions.length > 0) {
      alerts.push({
        type: 'info',
        message: `ℹ️ Patient is diabetic. Ensure dietary restrictions don't interfere with meal schedule for medications.`,
        affectedMedications: [],
        action: 'monitor'
      });
    }

    // Check if patient is on multiple medications
    if (history.currentMedications.length > 3) {
      alerts.push({
        type: 'info',
        message: `ℹ️ Patient is on ${history.currentMedications.length} medications. Monitor for polypharmacy effects and drug interactions.`,
        affectedMedications: [],
        action: 'monitor'
      });
    }

    // Pregnancy + antibiotics
    if (history.isPregnant) {
      const hasMetronidazole = protocol.medications.some(m => 
        m.medication.genericName.includes('Metronidazole')
      );
      if (hasMetronidazole) {
        alerts.push({
          type: 'warning',
          message: `⚠️ Metronidazole in first trimester requires careful risk-benefit analysis. Consider alternative if possible.`,
          affectedMedications: ['Flagyl'],
          action: 'monitor'
        });
      }
    }

    // Blood thinners + extraction
    if (history.bloodThinners) {
      alerts.push({
        type: 'warning',
        message: `⚠️ Patient on blood thinners. Ensure local hemostatic measures ready (Transamin, Surgicel). May need INR check. Consider GP consultation for warfarin adjustment.`,
        affectedMedications: [],
        action: 'monitor'
      });
    }

    return alerts;
  }

  /**
   * Suggest alternative medications when primary choices are contraindicated
   */
  static suggestAlternatives(
    removedMedication: Medication,
    history: PatientMedicalHistory
  ): string[] {
    
    const suggestions: string[] = [];

    // Paracetamol is usually safe alternative to NSAIDs
    if (['Ibuprofen', 'Diclofenac', 'Aspirin'].some(name => 
        removedMedication.genericName.includes(name))) {
      suggestions.push('Consider Panadol (Paracetamol 500mg) instead - safer in pregnancy, blood thinners, kidney disease');
    }

    // Alternatives for penicillin allergy
    if (removedMedication.genericName.includes('Amoxicillin')) {
      suggestions.push('Consider Zithromax (Azithromycin) or Dalacin C (Clindamycin) for penicillin-allergic patients');
    }

    // Metronidazole in pregnancy
    if (removedMedication.genericName.includes('Metronidazole') && history.isPregnant) {
      suggestions.push('For anaerobic coverage: Consider Clindamycin after first trimester, or delay treatment if possible');
    }

    return suggestions;
  }

  /**
   * Generate safety summary for prescription
   */
  static generateSafetySummary(alerts: MedicalAlert[]): string {
    const errors = alerts.filter(a => a.type === 'error');
    const warnings = alerts.filter(a => a.type === 'warning');
    const infos = alerts.filter(a => a.type === 'info');

    if (errors.length === 0 && warnings.length === 0) {
      return '✅ No contraindications detected. Prescription is safe for this patient.';
    }

    let summary = '';
    
    if (errors.length > 0) {
      summary += `🚨 ${errors.length} CRITICAL CONTRAINDICATION(S) - Prescription modified\n\n`;
    }
    
    if (warnings.length > 0) {
      summary += `⚠️ ${warnings.length} warning(s) - Monitor patient closely\n\n`;
    }

    if (infos.length > 0) {
      summary += `ℹ️ ${infos.length} advisory note(s)\n\n`;
    }

    return summary;
  }
}

/**
 * Helper function to get safe protocol for patient
 */
export function getSafeProtocol(
  protocol: TreatmentProtocol,
  history: PatientMedicalHistory
): { safeProtocol: TreatmentProtocol; alerts: MedicalAlert[]; summary: string } {
  
  const { alerts, safeProtocol } = MedicalSafetyChecker.checkProtocol(protocol, history);
  const summary = MedicalSafetyChecker.generateSafetySummary(alerts);

  return {
    safeProtocol,
    alerts,
    summary
  };
}
