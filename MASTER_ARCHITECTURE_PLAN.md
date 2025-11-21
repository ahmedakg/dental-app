# 🦷 ABDULLAH DENTAL CARE - COMPLETE ARCHITECTURE MASTER PLAN

**Version:** 2.0 Production Ready  
**Date:** November 21, 2025  
**Doctor:** Dr. Ahmed Abdullah  
**Clinic:** Abdullah Dental Care, Hayatabad, Peshawar  

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Feature Specifications](#feature-specifications)
6. [API Integration](#api-integration)
7. [Frontend Architecture](#frontend-architecture)
8. [Backend Architecture](#backend-architecture)
9. [Deployment Strategy](#deployment-strategy)
10. [Testing Guidelines](#testing-guidelines)
11. [Security & Compliance](#security--compliance)
12. [Maintenance & Updates](#maintenance--updates)

---

## 1. EXECUTIVE SUMMARY

### Purpose
Complete dental clinic management system for Abdullah Dental Care to replace manual paper-based workflows with a digital solution accessible on mobile and desktop.

### Key Users
- **Primary:** Naveed (Assistant) - 90% usage
- **Secondary:** Dr. Ahmed Abdullah - Review and oversight
- **Tertiary:** Visiting Orthodontist - Patient management

### Core Requirements
- Patient management with medical history
- Dual appointment calendars (General + Orthodontist)
- Treatment planning with FDI tooth charts
- Billing with flexible discounts
- Lab work tracking
- Automated reminders (WhatsApp)
- Financial reporting
- Real-time Google Drive backup

---

## 2. SYSTEM ARCHITECTURE

### Architecture Pattern
**Progressive Web App (PWA)** with offline-first capability (100% Client-Side)

```
┌─────────────────────────────────────────────────────┐
│              FRONTEND LAYER (React)                  │
│  - Patient Management UI                            │
│  - Appointment Calendars                            │
│  - Treatment Planning                               │
│  - Billing & Payments                               │
│  - Reports Dashboard                                │
└─────────────────┬───────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───────┐   ┌─▼────────┐   ┌──▼─────┐
│ IndexedDB │   │  Google  │   │  OS    │
│ (Primary  │   │  Drive   │   │ Share  │
│  Storage) │   │ (Backup) │   │  API   │
└───────────┘   └──────────┘   └────────┘
```

### Data Flow
1. **User Action** → Frontend (React Component)
2. **State Update** → React State + IndexedDB (primary storage)
3. **Backup** → Manual/Auto export to Google Drive (JSON files)
4. **Share/Remind** → OS Share API (opens WhatsApp/SMS with pre-filled message)
5. **Response** → Update UI + IndexedDB

---

## 3. TECHNOLOGY STACK

### Frontend
```json
{
  "framework": "React 18.2+",
  "styling": "TailwindCSS 3.4+",
  "stateManagement": "React Context API + useReducer",
  "localDB": "Dexie.js (IndexedDB wrapper)",
  "routing": "React Router v6",
  "forms": "React Hook Form + Yup validation",
  "datePicker": "React DatePicker",
  "charts": "Recharts",
  "pdfGeneration": "jsPDF + html2canvas",
  "notifications": "React Hot Toast"
}
```

### Backend
```json
{
  "runtime": "Browser-based (No server required)",
  "database": "IndexedDB (Browser local storage)",
  "storage": "Google Drive API v3 (Free)",
  "authentication": "Google OAuth (Free)",
  "backup": "Manual Google Drive export/import",
  "messaging": "OS Share API (Native - Free)"
}
```

### Hosting & Deployment
```json
{
  "frontend": "Vercel (Free tier - unlimited)",
  "backend": "None (Client-side only)",
  "database": "IndexedDB (Browser - Free)",
  "storage": "Google Drive (15GB free)",
  "domain": "Free Vercel subdomain (.vercel.app)",
  "ssl": "Auto SSL via Vercel (Free)"
}
```

### Development Tools
```json
{
  "packageManager": "npm 10+",
  "bundler": "Vite 5+",
  "linter": "ESLint 8+",
  "formatter": "Prettier",
  "testing": "Vitest + React Testing Library",
  "versionControl": "Git + GitHub"
}
```

---

## 4. DATABASE SCHEMA

### IndexedDB Collections Structure (Browser-Based Storage)

All data is stored locally in the browser using IndexedDB (Dexie.js wrapper). No external database required.

#### 4.1 **patients** Store
```javascript
{
  id: "uuid",
  name: "string",
  age: "number",
  gender: "male|female|other",
  phone: "string",
  address: "string",
  medicalHistory: {
    bloodThinners: "boolean",
    diabetes: "boolean",
    heartConditions: "boolean",
    allergies: "string",
    communicableDiseases: "string",
    notes: "string"
  },
  createdAt: "timestamp",
  updatedAt: "timestamp",
  lastVisit: "timestamp",
  totalPaid: "number",
  totalOwed: "number",
  status: "active|inactive|archived"
}
```

#### 4.2 **appointments** Collection
```javascript
{
  id: "uuid",
  patientId: "string (ref)",
  patientName: "string", // Denormalized for quick access
  phone: "string",
  type: "general|orthodontic",
  date: "timestamp",
  time: "string (HH:MM)",
  reason: "string",
  status: "scheduled|completed|cancelled|no-show",
  notes: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### 4.3 **visits** Collection (Treatment History)
```javascript
{
  id: "uuid",
  patientId: "string (ref)",
  visitDate: "timestamp",
  chiefComplaints: "string",
  clinicalNotes: "string",
  treatmentsPlanned: [
    {
      id: "uuid",
      name: "string",
      category: "string",
      baseUSD: "number",
      basePKR: "number",
      currentPKR: "number",
      teeth: ["11", "12"], // FDI notation
      quantity: "number",
      totalCost: "number",
      status: "planned|in-progress|completed|cancelled",
      completedDate: "timestamp"
    }
  ],
  treatmentsCompleted: ["uuid"], // IDs of completed treatments
  totalCost: "number",
  discountPercent: "number",
  discountAmount: "number",
  finalAmount: "number",
  amountPaid: "number",
  amountOwed: "number",
  paymentStatus: "unpaid|partial|paid",
  nextAppointment: "timestamp",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### 4.4 **treatments** Collection (Master Menu)
```javascript
{
  id: "uuid",
  name: "string",
  category: "consultation|preventive|fillings|endodontics|surgery|prosthesis|orthodontics|pediatric|periodontics|other",
  baseUSD: "number",
  basePKR: "number", // At Rs. 280 rate
  pricingType: "fixed|per-tooth|per-jaw",
  description: "string",
  isActive: "boolean",
  displayOrder: "number",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### 4.5 **payments** Collection
```javascript
{
  id: "uuid",
  patientId: "string (ref)",
  visitId: "string (ref)",
  amount: "number",
  method: "cash|card|bank-transfer|online",
  notes: "string",
  receiptNumber: "string",
  issuedBy: "string", // Naveed/Dr. Ahmed
  paymentDate: "timestamp",
  createdAt: "timestamp"
}
```

#### 4.6 **labWork** Collection
```javascript
{
  id: "uuid",
  patientId: "string (ref)",
  patientName: "string",
  visitId: "string (ref)",
  jobDescription: "string",
  labName: "string",
  charges: "number",
  pricingType: "per-tooth|per-jaw",
  quantity: "number",
  totalCost: "number",
  dateSent: "timestamp",
  expectedReturn: "timestamp",
  dateReceived: "timestamp",
  status: "sent|ready|received|delayed",
  notes: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### 4.7 **orthodontic** Collection
```javascript
{
  id: "uuid",
  patientId: "string (ref)",
  orthodontistName: "string",
  startDate: "timestamp",
  totalCost: "number",
  advancePayment: "number",
  installments: [
    {
      amount: "number",
      dueDate: "timestamp",
      paidDate: "timestamp",
      status: "pending|paid|overdue"
    }
  ],
  materialsCost: "number",
  profitSplit: "number", // 50%
  doctorShare: "number",
  orthodontistShare: "number",
  status: "active|completed|discontinued",
  notes: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### 4.8 **reminders** Collection
```javascript
{
  id: "uuid",
  patientId: "string (ref)",
  type: "incomplete-treatment|checkup|orthodontic-followup|payment",
  message: "string",
  scheduledDate: "timestamp",
  sentDate: "timestamp",
  status: "pending|sent|failed",
  method: "whatsapp|sms|call",
  createdAt: "timestamp"
}
```

#### 4.9 **expenses** Collection
```javascript
{
  id: "uuid",
  category: "materials|lab|salaries|rent|utilities|other",
  description: "string",
  amount: "number",
  date: "timestamp",
  month: "string (YYYY-MM)",
  notes: "string",
  createdAt: "timestamp"
}
```

#### 4.10 **settings** Collection
```javascript
{
  id: "clinic-settings",
  clinicName: "string",
  doctorName: "string",
  pmcNumber: "string",
  qualifications: "string",
  address: "string",
  phone: "string",
  email: "string",
  usdPkrRate: "number",
  lastRateUpdate: "timestamp",
  nextBiannualUpdate: "timestamp",
  whatsappBusinessNumber: "string",
  receiptPrefix: "string",
  updatedAt: "timestamp"
}
```

### IndexedDB Schema (Offline Storage)
```javascript
// Same structure as Firestore for offline-first capability
// Syncs bidirectionally when online
const db = {
  patients: "++id, name, phone",
  appointments: "++id, date, patientId",
  visits: "++id, patientId, visitDate",
  treatments: "++id, category",
  payments: "++id, patientId, paymentDate",
  labWork: "++id, patientId, dateSent",
  orthodontic: "++id, patientId",
  expenses: "++id, category, month",
  syncQueue: "++id, action, timestamp"
}
```

---

## 5. FEATURE SPECIFICATIONS

### 5.1 Patient Management

**Search & Filter**
- Search by name (fuzzy search)
- Search by phone number
- Filter by status (active/inactive)
- Sort by last visit, name, amount owed

**Patient Profile**
- Personal Information Section
  - Name, Age, Gender
  - Phone, Address
  - Profile photo (optional)
- Medical History Section
  - Checkboxes: Blood thinners, Diabetes, Heart conditions
  - Text fields: Allergies, Communicable diseases
  - Additional notes area
- Treatment History Tab
  - List of all visits with dates
  - Expandable view for each visit
  - Status indicators (completed/pending)
- Payment History Tab
  - All payments received
  - Balance owed
  - Download receipt option
- Quick Actions
  - Schedule appointment
  - Add new visit
  - Send reminder
  - Generate report

### 5.2 Appointment System

**Dual Calendar System**
```
┌─────────────────────────────────┐
│  [General] [Orthodontic]        │
│                                 │
│  View: [Today] [Week] [Month]  │
│                                 │
│  [< Previous]    [Next >]      │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 9:00 AM                  │  │
│  │ Patient: Ahmed Khan      │  │
│  │ Phone: 0334-5822622      │  │
│  │ Reason: RCT Follow-up    │  │
│  └──────────────────────────┘  │
│                                 │
│  [+ Add Appointment]            │
└─────────────────────────────────┘
```

**Add Appointment Flow**
1. Select calendar type (General/Orthodontic)
2. Choose date and time
3. Search existing patient OR create new
4. Enter reason for visit
5. Save → Auto-reminder scheduled

**Appointment Actions**
- Mark as completed
- Reschedule
- Cancel with reason
- Mark as no-show
- Send reminder (WhatsApp)

### 5.3 Treatment Planning

**FDI Tooth Chart Integration**

**Adult Permanent (32 teeth)**
```
  18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28
  ----------------------------------------
  48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38
```

**Primary Deciduous (20 teeth)**
```
  55 54 53 52 51 | 61 62 63 64 65
  ---------------------------------
  85 84 83 82 81 | 71 72 73 74 75
```

**Interaction**
- Click tooth to select (highlighted in blue)
- Multi-select with Ctrl/Cmd + Click
- Hover shows tooth number + name
- Selected teeth auto-populate in treatment form

**Treatment Planning Workflow**

1. **Chief Complaints Section**
   - Free text area for patient's main concerns
   - Voice-to-text option (browser API)

2. **Treatment Selection**
   - Category dropdown (10 categories)
   - Search autocomplete
   - Select treatment from menu
   - Shows: Name, Base USD, Current PKR

3. **Tooth Selection (if applicable)**
   - Click tooth chart
   - OR manually enter tooth numbers
   - Shows selected teeth count

4. **Quantity Input**
   - Auto-filled based on teeth selected
   - Can manually override

5. **Cost Calculation**
   - Per-tooth: Price × Quantity
   - Per-jaw: Fixed price
   - Shows subtotal per treatment

6. **Treatment Plan Summary**
```
┌────────────────────────────────────────┐
│ TREATMENT PLAN                         │
├────────────────────────────────────────┤
│ ✓ RCT (Tooth 11)        Rs. 15,000    │
│ ✓ Crown PFM (Tooth 11)  Rs. 10,000    │
│ ☐ Filling (Teeth 16,17) Rs. 16,000    │
│                         ─────────────   │
│ Subtotal:              Rs. 41,000      │
│ Discount (10%):        Rs. 4,100       │
│                         ─────────────   │
│ Total:                 Rs. 36,900      │
│                                         │
│ [Save Plan] [Print Estimate]           │
└────────────────────────────────────────┘
```

7. **Discount Application**
   - Quick buttons: 10%, 20%, 50%
   - Custom percentage input
   - Auto-recalculates total

8. **Treatment Status Tracking**
   - Planned (default)
   - In Progress (during treatment)
   - Completed (with date)
   - Cancelled (with reason)

### 5.4 Billing & Payments

**Payment Collection Screen**
```
┌─────────────────────────────────────┐
│ PAYMENT COLLECTION                  │
├─────────────────────────────────────┤
│ Patient: Ahmed Khan                 │
│ Visit Date: Nov 21, 2025           │
│                                     │
│ Total Amount: Rs. 36,900           │
│ Previous Paid: Rs. 15,000          │
│ Balance Due:   Rs. 21,900          │
│                                     │
│ Amount Receiving: [___________]    │
│                                     │
│ Payment Method:                    │
│ ◉ Cash  ○ Card  ○ Bank Transfer   │
│                                     │
│ Notes: [___________________]       │
│                                     │
│ [Generate Receipt & Save]          │
└─────────────────────────────────────┘
```

**Receipt Generation**
- Auto-generated receipt number (ADCR-2025-001)
- PDF format with clinic branding
- Shows:
  - Clinic info (name, address, phone)
  - Dr. Ahmed details + PMC number
  - Patient info
  - Treatments completed
  - Amount paid
  - Balance (if any)
  - Date and time
  - Issued by (Naveed/Dr. Ahmed)

**Multi-Visit Payment Tracking**
- Shows payment history
- Balance calculator
- Partial payment support
- Payment reminders for pending amounts

### 5.5 Lab Work Management

**Add Lab Work Screen**
```
┌─────────────────────────────────────┐
│ LAB WORK TRACKING                   │
├─────────────────────────────────────┤
│ Patient: [Search...]                │
│                                     │
│ Job Description: [Crown PFM]       │
│ Lab Name: [XYZ Dental Lab]         │
│                                     │
│ Pricing: ◉ Per Tooth  ○ Per Jaw   │
│ Quantity: [1]                       │
│ Cost per Unit: [5000]               │
│ Total Cost: Rs. 5,000               │
│                                     │
│ Date Sent: [Nov 21, 2025]          │
│ Expected Return: [Nov 28, 2025]    │
│                                     │
│ Notes: [_____________________]     │
│                                     │
│ [Save Lab Work]                     │
└─────────────────────────────────────┘
```

**Lab Work List View**
```
┌────────────────────────────────────────────────┐
│ Status: [All] [Sent] [Ready] [Received]       │
├────────────────────────────────────────────────┤
│ Nov 21 | Ahmed Khan | Crown PFM               │
│        | Lab: XYZ   | Rs. 5,000  [Sent]       │
│        | Due: Nov 28                           │
├────────────────────────────────────────────────┤
│ Nov 20 | Sara Ali   | Bridge 3-unit           │
│        | Lab: ABC   | Rs. 15,000 [Ready]      │
│        | ⚠️ Overdue by 2 days                  │
└────────────────────────────────────────────────┘
```

**Status Updates**
- Sent → Ready → Received
- Overdue alerts (red flag icon)
- Quick status update buttons

### 5.6 Orthodontic Module

**Orthodontic Patient Profile**
```
┌──────────────────────────────────────┐
│ ORTHODONTIC TREATMENT                │
├──────────────────────────────────────┤
│ Patient: Ayesha Khan                 │
│ Orthodontist: Dr. Sarah Ahmed        │
│ Start Date: Sep 15, 2025            │
│                                      │
│ Financial Summary:                   │
│ Total Cost:        Rs. 120,000      │
│ Advance Payment:   Rs. 30,000       │
│ Monthly Installment: Rs. 15,000     │
│                                      │
│ Payment Schedule:                    │
│ ✓ Oct 2025  Rs. 15,000 [Paid]       │
│ ✓ Nov 2025  Rs. 15,000 [Paid]       │
│ ☐ Dec 2025  Rs. 15,000 [Due]        │
│ ☐ Jan 2026  Rs. 15,000 [Upcoming]   │
│                                      │
│ Materials Cost: Rs. 20,000           │
│ Profit: Rs. 100,000                  │
│ Dr. Ahmed Share: Rs. 50,000          │
│ Dr. Sarah Share: Rs. 50,000          │
│                                      │
│ [Record Payment] [Split Payment]     │
└──────────────────────────────────────┘
```

**Monthly Appointment Scheduling**
- Auto-suggest date (30 days from last visit)
- Filter orthodontic calendar by orthodontist
- Send automatic reminders 3 days before

**Payment Split Calculator**
- Deduct materials cost first
- 50-50 split on remaining profit
- Track individual shares
- Generate split report for orthodontist

### 5.7 Automated Reminders

**Reminder Types & Triggers**

1. **Incomplete Treatment Reminder**
   - Trigger: Visit with pending treatments
   - Timing: 7 days after visit, then monthly
   - Message: "Hi [Name], you have pending treatments at Abdullah Dental Care. Please call to schedule: [Treatments list]. Ph: 0334-5822622"

2. **6-Month Checkup Reminder**
   - Trigger: 6 months after last completed visit
   - Message: "Hi [Name], it's time for your routine checkup at Abdullah Dental Care. Schedule your scaling and polishing today! Ph: 0334-5822622"

3. **Orthodontic Follow-up**
   - Trigger: 27 days after last ortho visit
   - Message: "Hi [Name], your monthly orthodontic adjustment is due soon. Please confirm your appointment. Ph: 0334-5822622"

4. **Payment Reminder**
   - Trigger: Unpaid balance after visit
   - Timing: 3 days, 7 days, 14 days
   - Message: "Hi [Name], you have a pending balance of Rs. [Amount] at Abdullah Dental Care. Please clear at your earliest convenience. Ph: 0334-5822622"

**WhatsApp Integration**
- Uses WhatsApp Business API
- Fallback to Twilio SMS if WhatsApp fails
- Manual send button for immediate reminders
- Reminder log with delivery status

### 5.8 Reporting & Analytics

**Dashboard Overview**
```
┌────────────────────────────────────────────────┐
│ DASHBOARD - November 2025                      │
├────────────────────────────────────────────────┤
│                                                │
│ 💰 REVENUE                                     │
│ This Month: Rs. 575,000 (↑ 12% from Oct)      │
│ Today: Rs. 28,500                              │
│                                                │
│ 👥 PATIENTS                                    │
│ Total Active: 1,247                            │
│ New This Month: 43                             │
│ Appointments Today: 8                          │
│                                                │
│ 💵 PAYMENTS                                    │
│ Collected: Rs. 550,000                         │
│ Pending: Rs. 125,000 (from 32 patients)       │
│                                                │
│ 🔬 LAB WORK                                    │
│ Cases Sent: 24                                 │
│ Pending Return: 6                              │
│ Total Lab Expenses: Rs. 60,000                 │
│                                                │
│ 📊 TOP TREATMENTS                              │
│ 1. RCT - 18 cases                              │
│ 2. Crown PFM - 15 cases                        │
│ 3. Extraction - 12 cases                       │
│                                                │
└────────────────────────────────────────────────┘
```

**Detailed Reports**

1. **Revenue Report**
   - Daily/Weekly/Monthly/Yearly
   - Category-wise breakdown
   - Payment method breakdown
   - Export to PDF/Excel

2. **Expense Report**
   - Category: Materials, Lab, Salaries, Rent, Utilities, Other
   - Monthly comparison
   - Profit margin calculation

3. **Treatment Analytics**
   - Most performed treatments
   - Average revenue per treatment
   - Completion rate

4. **Patient Analytics**
   - New vs returning patients
   - Patient retention rate
   - Average revenue per patient

5. **Outstanding Payments**
   - List of patients with pending balances
   - Aging analysis (0-30, 31-60, 60+ days)
   - Send bulk reminders

### 5.9 Settings & Configuration

**Clinic Settings**
- Clinic name, address, phone, email
- Doctor details (name, PMC, qualifications)
- Logo upload
- Operating hours

**Pricing Settings**
- Current USD/PKR exchange rate
- Last updated date
- Manual update option
- Next biannual auto-update date
- Treatment menu editor (add/edit/disable)

**WhatsApp Settings**
- Business number configuration
- API credentials
- Message templates

**User Management**
- Add/remove users (Naveed, Dr. Ahmed, Orthodontist)
- Role-based permissions
- Activity log

**Backup Settings**
- Google Drive folder selection
- Auto-backup frequency
- Manual backup trigger
- Last backup timestamp

**Advanced Settings**
- Receipt number prefix
- Default discount percentages
- Appointment slot duration
- Reminder intervals

---

## 6. API INTEGRATION

### 6.1 Google Drive API (Backup Only - Free)

**Setup Requirements**
```javascript
// Google Cloud Console Setup
1. Create Project: "Abdullah Dental Care"
2. Enable Google Drive API
3. Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: https://your-app.vercel.app
4. Download credentials (client ID and secret)
```

**Implementation (Client-Side)**
```javascript
// /src/services/googleDriveService.js
export const authenticateGoogleDrive = async () => {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = window.location.origin;
  const SCOPE = 'https://www.googleapis.com/auth/drive.file';
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${REDIRECT_URI}&` +
    `response_type=token&` +
    `scope=${SCOPE}`;
  
  window.location.href = authUrl;
};

export const backupToGoogleDrive = async (data, filename) => {
  const accessToken = localStorage.getItem('gdrive_token');
  
  const metadata = {
    name: filename,
    mimeType: 'application/json'
  };
  
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { 
    type: 'application/json' 
  }));
  form.append('file', new Blob([JSON.stringify(data)], { 
    type: 'application/json' 
  }));
  
  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: form
    }
  );
  
  return await response.json();
};

export const restoreFromGoogleDrive = async (fileId) => {
  const accessToken = localStorage.getItem('gdrive_token');
  
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  return await response.json();
};

// Manual backup function
export const exportBackup = async () => {
  const db = await openIndexedDB();
  
  const backup = {
    timestamp: new Date().toISOString(),
    patients: await db.patients.toArray(),
    appointments: await db.appointments.toArray(),
    visits: await db.visits.toArray(),
    treatments: await db.treatments.toArray(),
    payments: await db.payments.toArray(),
    labWork: await db.labWork.toArray(),
    orthodontic: await db.orthodontic.toArray(),
    expenses: await db.expenses.toArray(),
    settings: await db.settings.toArray()
  };
  
  const filename = `dental_backup_${Date.now()}.json`;
  
  // Option 1: Upload to Google Drive
  await backupToGoogleDrive(backup, filename);
  
  // Option 2: Download locally
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};
```

### 6.2 OS Share API (WhatsApp/SMS - Free)

**Implementation**
```javascript
// /src/services/shareService.js

export const shareViaWhatsApp = async (phone, message) => {
  // Format phone number (remove spaces, add country code if missing)
  const formattedPhone = phone.replace(/\s/g, '');
  const phoneWithCode = formattedPhone.startsWith('+') ? 
    formattedPhone : `+92${formattedPhone}`;
  
  // WhatsApp URL scheme
  const whatsappUrl = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`;
  
  // Check if Web Share API is available
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Abdullah Dental Care',
        text: message,
        url: '' // Empty to only share text
      });
      return { success: true };
    } catch (error) {
      // User cancelled or share failed, fallback to WhatsApp link
      window.open(whatsappUrl, '_blank');
      return { success: true };
    }
  } else {
    // Fallback: Direct WhatsApp link
    window.open(whatsappUrl, '_blank');
    return { success: true };
  }
};

export const shareViaSMS = (phone, message) => {
  const formattedPhone = phone.replace(/\s/g, '');
  const smsUrl = `sms:${formattedPhone}?body=${encodeURIComponent(message)}`;
  window.location.href = smsUrl;
  return { success: true };
};

export const shareViaEmail = (email, subject, body) => {
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
  return { success: true };
};

// Generic share function that lets user choose app
export const shareMessage = async (message, patient) => {
  const text = `${message}\n\nAbdullah Dental Care\nPhone: 0334-5822622`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Reminder from Abdullah Dental Care',
        text: text
      });
      return { success: true, method: 'os_share' };
    } catch (error) {
      console.log('Share cancelled or failed');
      return { success: false, error: error.message };
    }
  } else {
    // Fallback: Copy to clipboard
    await navigator.clipboard.writeText(text);
    alert('Message copied to clipboard! You can paste it in WhatsApp manually.');
    return { success: true, method: 'clipboard' };
  }
};

// Send reminder with share options
export const sendReminder = async (reminder) => {
  const patient = await getPatientById(reminder.patientId);
  
  // Show modal with share options
  const choice = await showShareOptionsModal({
    whatsapp: true,
    sms: true,
    email: false,
    copy: true
  });
  
  switch (choice) {
    case 'whatsapp':
      return await shareViaWhatsApp(patient.phone, reminder.message);
    case 'sms':
      return shareViaSMS(patient.phone, reminder.message);
    case 'copy':
      await navigator.clipboard.writeText(reminder.message);
      return { success: true, method: 'clipboard' };
    default:
      return await shareMessage(reminder.message, patient);
  }
};
```

**UI Component for Sending Reminders**
```javascript
// /src/components/reminders/SendReminderModal.jsx
export default function SendReminderModal({ patient, message, onClose }) {
  const handleShare = async (method) => {
    switch (method) {
      case 'whatsapp':
        await shareViaWhatsApp(patient.phone, message);
        break;
      case 'sms':
        shareViaSMS(patient.phone, message);
        break;
      case 'share':
        await shareMessage(message, patient);
        break;
    }
    onClose();
  };
  
  return (
    <div className="modal">
      <h3>Send Reminder to {patient.name}</h3>
      <p className="message-preview">{message}</p>
      
      <div className="share-options">
        <button onClick={() => handleShare('whatsapp')} className="btn-whatsapp">
          📱 Open WhatsApp
        </button>
        
        <button onClick={() => handleShare('sms')} className="btn-sms">
          💬 Send SMS
        </button>
        
        <button onClick={() => handleShare('share')} className="btn-share">
          📤 Share (Choose App)
        </button>
        
        <button onClick={async () => {
          await navigator.clipboard.writeText(message);
          alert('Message copied! Paste in WhatsApp.');
          onClose();
        }} className="btn-copy">
          📋 Copy Message
        </button>
      </div>
    </div>
  );
}
```

### 6.3 Currency Exchange Rate API (Free)

**Free API: ExchangeRate-API**
```javascript
// /src/services/currencyService.js

export const updateExchangeRate = async () => {
  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD'
    );
    const data = await response.json();
    const pkrRate = data.rates.PKR;
    
    // Update in IndexedDB
    const db = await openIndexedDB();
    await db.settings.put({
      id: 'clinic-settings',
      usdPkrRate: pkrRate,
      lastRateUpdate: new Date(),
      nextBiannualUpdate: calculateNextUpdate()
    });
    
    return { success: true, rate: pkrRate };
  } catch (error) {
    console.error('Failed to update exchange rate:', error);
    return { success: false, error: error.message };
  }
};

// Check and update rate biannually
export const checkBiannualUpdate = async () => {
  const db = await openIndexedDB();
  const settings = await db.settings.get('clinic-settings');
  
  const now = new Date();
  const nextUpdate = new Date(settings.nextBiannualUpdate);
  
  if (now >= nextUpdate) {
    return await updateExchangeRate();
  }
  
  return { success: false, message: 'No update needed yet' };
};

function calculateNextUpdate() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Next update is May 1 or Nov 1
  if (currentMonth < 4) {
    return new Date(currentYear, 4, 1); // May 1
  } else if (currentMonth < 10) {
    return new Date(currentYear, 10, 1); // Nov 1
  } else {
    return new Date(currentYear + 1, 4, 1); // Next May 1
  }
}
```

### 6.4 No Firebase Required!

**All data stored in IndexedDB (Browser)**
```javascript
// /src/db/indexedDB.js
import Dexie from 'dexie';

const db = new Dexie('AbdullahDentalDB');

db.version(1).stores({
  patients: '++id, name, phone, &uniqueId',
  appointments: '++id, date, patientId, type',
  visits: '++id, patientId, visitDate',
  treatments: '++id, category, name',
  payments: '++id, patientId, paymentDate',
  labWork: '++id, patientId, dateSent, status',
  orthodontic: '++id, patientId, status',
  reminders: '++id, patientId, scheduledDate, status',
  expenses: '++id, category, date, month',
  settings: 'id'
});

export default db;

// Initialize default data
export const initializeDefaultData = async () => {
  const settings = await db.settings.get('clinic-settings');
  
  if (!settings) {
    await db.settings.add({
      id: 'clinic-settings',
      clinicName: 'Abdullah Dental Care',
      doctorName: 'Dr. Ahmed Abdullah',
      pmcNumber: '',
      qualifications: 'BDS',
      address: '37-G4, Qasim Ave., Phase 2, Hayatabad, Peshawar',
      phone: '+92-334-5822-622',
      email: '',
      usdPkrRate: 280,
      lastRateUpdate: new Date(),
      nextBiannualUpdate: calculateNextUpdate(),
      receiptPrefix: 'ADCR',
      createdAt: new Date()
    });
  }
  
  // Load default treatment menu
  const treatmentCount = await db.treatments.count();
  if (treatmentCount === 0) {
    await loadDefaultTreatments();
  }
};

const loadDefaultTreatments = async () => {
  const treatments = [
    // Consultation & Diagnostics
    { category: 'consultation', name: 'Consultation', baseUSD: 7.14, basePKR: 2000, pricingType: 'fixed' },
    { category: 'consultation', name: 'Periapical X-Ray', baseUSD: 3.57, basePKR: 1000, pricingType: 'per-tooth' },
    // ... rest of 70 treatments
  ];
  
  await db.treatments.bulkAdd(treatments);
};
```

---

## 7. FRONTEND ARCHITECTURE

### 7.1 Folder Structure
```
/src
├── /components
│   ├── /common
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   └── Loader.jsx
│   ├── /layout
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── /patients
│   │   ├── PatientList.jsx
│   │   ├── PatientProfile.jsx
│   │   ├── PatientForm.jsx
│   │   └── MedicalHistory.jsx
│   ├── /appointments
│   │   ├── AppointmentCalendar.jsx
│   │   ├── AppointmentForm.jsx
│   │   └── AppointmentCard.jsx
│   ├── /treatments
│   │   ├── ToothChart.jsx
│   │   ├── TreatmentPlan.jsx
│   │   ├── TreatmentMenu.jsx
│   │   └── TreatmentHistory.jsx
│   ├── /billing
│   │   ├── PaymentForm.jsx
│   │   ├── Receipt.jsx
│   │   └── PaymentHistory.jsx
│   ├── /lab
│   │   ├── LabWorkForm.jsx
│   │   ├── LabWorkList.jsx
│   │   └── LabWorkCard.jsx
│   ├── /orthodontic
│   │   ├── OrthoPatientProfile.jsx
│   │   ├── InstallmentTracker.jsx
│   │   └── SplitCalculator.jsx
│   ├── /reports
│   │   ├── Dashboard.jsx
│   │   ├── RevenueReport.jsx
│   │   ├── ExpenseReport.jsx
│   │   └── TreatmentAnalytics.jsx
│   └── /settings
│       ├── ClinicSettings.jsx
│       ├── PricingSettings.jsx
│       └── BackupSettings.jsx
├── /pages
│   ├── Home.jsx
│   ├── Patients.jsx
│   ├── Appointments.jsx
│   ├── Treatments.jsx
│   ├── Billing.jsx
│   ├── LabWork.jsx
│   ├── Orthodontic.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── /context
│   ├── AppContext.jsx
│   ├── PatientContext.jsx
│   ├── AppointmentContext.jsx
│   └── TreatmentContext.jsx
├── /hooks
│   ├── usePatients.js
│   ├── useAppointments.js
│   ├── useTreatments.js
│   ├── usePayments.js
│   └── useOfflineSync.js
├── /services
│   ├── patientService.js
│   ├── appointmentService.js
│   ├── treatmentService.js
│   ├── paymentService.js
│   ├── labService.js
│   ├── reminderService.js
│   └── backupService.js
├── /utils
│   ├── dateUtils.js
│   ├── currencyUtils.js
│   ├── validationUtils.js
│   └── pdfUtils.js
├── /config
│   ├── firebase.js
│   └── constants.js
├── /db
│   └── indexedDB.js
├── App.jsx
├── main.jsx
└── index.css
```

### 7.2 State Management Architecture

**Global State (Context API)**
```javascript
// /src/context/AppContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  patients: [],
  appointments: [],
  treatments: [],
  payments: [],
  settings: {},
  isOnline: navigator.onLine,
  isSyncing: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PATIENTS':
      return { ...state, patients: action.payload };
    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, action.payload] };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(p =>
          p.id === action.payload.id ? action.payload : p
        )
      };
    // ... more actions
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Sync offline changes when back online
  useEffect(() => {
    const handleOnline = () => {
      dispatch({ type: 'SET_ONLINE', payload: true });
      syncOfflineChanges();
    };
    
    const handleOffline = () => {
      dispatch({ type: 'SET_ONLINE', payload: false });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
```

### 7.3 Component Patterns

**Example: PatientList Component**
```javascript
// /src/components/patients/PatientList.jsx
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getPatients, searchPatients } from '../../services/patientService';

export default function PatientList() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  
  useEffect(() => {
    loadPatients();
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const results = searchPatients(state.patients, searchQuery);
      setFilteredPatients(results);
    } else {
      setFilteredPatients(state.patients);
    }
  }, [searchQuery, state.patients]);
  
  const loadPatients = async () => {
    const patients = await getPatients();
    dispatch({ type: 'SET_PATIENTS', payload: patients });
  };
  
  return (
    <div className="patient-list">
      <input
        type="text"
        placeholder="Search patients..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      
      <div className="patient-grid">
        {filteredPatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
```

### 7.4 Offline-First Strategy

**IndexedDB Implementation**
```javascript
// /src/db/indexedDB.js
import Dexie from 'dexie';

const db = new Dexie('AbdullahDentalDB');

db.version(1).stores({
  patients: '++id, name, phone',
  appointments: '++id, date, patientId',
  visits: '++id, patientId, visitDate',
  treatments: '++id, category',
  payments: '++id, patientId, paymentDate',
  labWork: '++id, patientId, dateSent',
  syncQueue: '++id, action, timestamp'
});

export default db;
```

**Sync Queue Pattern**
```javascript
// /src/services/syncService.js
import db from '../db/indexedDB';
import { db as firestore } from '../config/firebase';

export const queueAction = async (action, data) => {
  await db.syncQueue.add({
    action,
    data,
    timestamp: new Date()
  });
};

export const syncOfflineChanges = async () => {
  const queue = await db.syncQueue.toArray();
  
  for (const item of queue) {
    try {
      switch (item.action) {
        case 'ADD_PATIENT':
          await firestore.collection('patients').add(item.data);
          break;
        case 'UPDATE_PATIENT':
          await firestore.collection('patients')
            .doc(item.data.id)
            .update(item.data);
          break;
        // ... handle other actions
      }
      
      // Remove from queue after successful sync
      await db.syncQueue.delete(item.id);
    } catch (error) {
      console.error('Sync failed for item:', item, error);
    }
  }
};
```

---

## 8. BACKEND ARCHITECTURE

### 8.1 Vercel Serverless Functions Structure

```
/api
├── /patients
│   ├── get-all.js
│   ├── get-by-id.js
│   ├── create.js
│   ├── update.js
│   └── delete.js
├── /appointments
│   ├── get-by-date.js
│   ├── create.js
│   ├── update.js
│   └── cancel.js
├── /treatments
│   ├── get-menu.js
│   ├── create-plan.js
│   ├── update-status.js
│   └── get-history.js
├── /payments
│   ├── create.js
│   ├── get-history.js
│   └── generate-receipt.js
├── /lab
│   ├── create.js
│   ├── get-all.js
│   └── update-status.js
├── /reminders
│   ├── schedule.js
│   ├── send.js
│   └── get-pending.js
├── /reports
│   ├── dashboard.js
│   ├── revenue.js
│   ├── expenses.js
│   └── treatments.js
├── /google-drive
│   ├── auth.js
│   ├── upload.js
│   └── restore.js
├── /whatsapp
│   ├── send.js
│   └── webhook.js
└── /currency
    └── update-rate.js
```

### 8.2 Example API Functions

**Get All Patients**
```javascript
// /api/patients/get-all.js
import { db } from '../../src/config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    
    const patients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return res.status(200).json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return res.status(500).json({ error: 'Failed to fetch patients' });
  }
}
```

**Create Patient**
```javascript
// /api/patients/create.js
import { db } from '../../src/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const patientData = req.body;
    
    // Validation
    if (!patientData.name || !patientData.phone) {
      return res.status(400).json({ 
        error: 'Name and phone are required' 
      });
    }
    
    // Add timestamps
    const newPatient = {
      ...patientData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active'
    };
    
    const docRef = await addDoc(collection(db, 'patients'), newPatient);
    
    // Backup to Google Drive
    await fetch(`${process.env.VERCEL_URL}/api/google-drive/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: `patient_${docRef.id}.json`,
        data: newPatient
      })
    });
    
    return res.status(201).json({ 
      success: true, 
      id: docRef.id,
      patient: newPatient
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    return res.status(500).json({ error: 'Failed to create patient' });
  }
}
```

**Schedule Reminder (Cron Job)**
```javascript
// /api/reminders/schedule.js
import { db } from '../../src/config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc 
} from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
    
    // Find visits with incomplete treatments from 7 days ago
    const visitsRef = collection(db, 'visits');
    const q = query(
      visitsRef,
      where('visitDate', '>=', sevenDaysAgo),
      where('visitDate', '<=', sevenDaysAgo),
      where('paymentStatus', '!=', 'paid')
    );
    
    const snapshot = await getDocs(q);
    
    for (const doc of snapshot.docs) {
      const visit = doc.data();
      const incompleteTreatments = visit.treatmentsPlanned
        .filter(t => t.status !== 'completed');
      
      if (incompleteTreatments.length > 0) {
        // Create reminder
        await addDoc(collection(db, 'reminders'), {
          patientId: visit.patientId,
          type: 'incomplete-treatment',
          message: `Hi, you have pending treatments: ${
            incompleteTreatments.map(t => t.name).join(', ')
          }. Please schedule your appointment.`,
          scheduledDate: today,
          status: 'pending',
          createdAt: today
        });
      }
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error scheduling reminders:', error);
    return res.status(500).json({ error: 'Failed to schedule reminders' });
  }
}
```

### 8.3 Environment Variables

```bash
# .env.local (Frontend Only - No Backend!)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
# That's it! Only Google Drive for backup (optional)
```

---

## 9. DEPLOYMENT STRATEGY

### 9.1 Prerequisites Setup

**Step 1: Google Drive API Setup (Optional - for cloud backup)**
1. Go to https://console.cloud.google.com
2. Create project: "Dental App Backup"  
3. Enable Google Drive API
4. Create OAuth 2.0 credentials:
   - Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Add authorized redirect URI (your Vercel URL)
5. Copy Client ID (you only need this!)

**That's it! No Firebase, no WhatsApp API, no paid services needed!**

### 9.2 Local Development Setup

```bash
# Clone repository  
git clone https://github.com/your-repo/dental-app.git
cd dental-app

# Install dependencies
npm install

# Create .env.local file (optional - only for Google Drive backup)
echo "VITE_GOOGLE_CLIENT_ID=your_client_id_here" > .env.local

# Run development server
npm run dev

# Open browser
# http://localhost:5173

# That's it! App works 100% offline in browser!
```

### 9.3 Vercel Deployment (Free Forever!)

**Method 1: Vercel CLI** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: abdullah-dental-care
# - Directory: ./
# - Build command: npm run build
# - Output directory: dist

# Set environment variable (optional - only if using Google Drive backup)
vercel env add VITE_GOOGLE_CLIENT_ID production
# Paste your Google Client ID

# Deploy to production
vercel --prod

# Done! Your app is live at: https://abdullah-dental-care.vercel.app
```

**Method 2: GitHub Integration** (Auto-deploy on push)
```bash
# 1. Push code to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to https://vercel.com
# 3. Click "Add New" → "Project"
# 4. Import from GitHub
# 5. Select repository
# 6. Configure:
#    - Framework Preset: Vite
#    - Build Command: npm run build
#    - Output Directory: dist
# 7. (Optional) Add environment variable VITE_GOOGLE_CLIENT_ID
# 8. Click "Deploy"

# Vercel will auto-deploy on every push to main branch
# Your app URL: https://your-project.vercel.app
```

**No backend setup needed! No cron jobs! No serverless functions!**

### 9.4 Custom Domain Setup (Optional)

```bash
# In Vercel dashboard:
# 1. Go to Project Settings → Domains
# 2. Add domain: dentalcare.com
# 3. Add DNS records (provided by Vercel):
#    - Type: A, Name: @, Value: 76.76.21.21
#    - Type: CNAME, Name: www, Value: cname.vercel-dns.com
# 4. Wait for DNS propagation (up to 48 hours)
# 5. SSL certificate auto-generated by Vercel (free)
```

### 9.5 Progressive Web App (PWA) Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Abdullah Dental Care',
        short_name: 'Dental Care',
        description: 'Complete dental clinic management system',
        theme_color: '#ff6b35',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      }
    })
  ]
});
```

**Install PWA on Android:**
1. Open app in Chrome
2. Click "Add to Home Screen"
3. App icon appears on home screen
4. Opens in fullscreen (no browser UI)

---

## 10. TESTING GUIDELINES

### 10.1 Testing Checklist

**Unit Testing**
```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test

# Coverage report
npm run test:coverage
```

**Example Unit Test**
```javascript
// /src/utils/__tests__/currencyUtils.test.js
import { describe, it, expect } from 'vitest';
import { convertUSDToPKR, formatCurrency } from '../currencyUtils';

describe('Currency Utils', () => {
  it('should convert USD to PKR correctly', () => {
    const result = convertUSDToPKR(100, 280);
    expect(result).toBe(28000);
  });
  
  it('should format currency with Rs. prefix', () => {
    const result = formatCurrency(15000);
    expect(result).toBe('Rs. 15,000');
  });
});
```

### 10.2 Manual Testing Scenarios

**Patient Management**
- [ ] Add new patient with all fields
- [ ] Search patient by name
- [ ] Search patient by phone
- [ ] Edit patient information
- [ ] View patient treatment history
- [ ] Delete patient (soft delete)

**Appointments**
- [ ] Create appointment for existing patient
- [ ] Create appointment for new patient
- [ ] View today's appointments
- [ ] View week calendar
- [ ] View month calendar
- [ ] Switch between general and orthodontic calendars
- [ ] Mark appointment as completed
- [ ] Reschedule appointment
- [ ] Cancel appointment

**Treatment Planning**
- [ ] Add chief complaints
- [ ] Select treatments from menu
- [ ] Use tooth chart to select teeth
- [ ] Calculate per-tooth pricing
- [ ] Apply 10% discount
- [ ] Apply 20% discount
- [ ] Apply 50% discount
- [ ] Apply custom discount
- [ ] Save treatment plan
- [ ] Update treatment status (planned → completed)

**Billing & Payments**
- [ ] Record full payment
- [ ] Record partial payment
- [ ] Generate PDF receipt
- [ ] View payment history
- [ ] Calculate balance owed

**Lab Work**
- [ ] Add new lab work
- [ ] View all lab work
- [ ] Filter by status (sent/ready/received)
- [ ] Update lab work status
- [ ] Mark as overdue

**Orthodontic**
- [ ] Add orthodontic patient
- [ ] Record advance payment
- [ ] Add monthly installment
- [ ] Mark installment as paid
- [ ] Calculate profit split
- [ ] Generate split report

**Reminders**
- [ ] Schedule manual reminder
- [ ] View pending reminders
- [ ] Sen