# Quick Start Guide - Module 2
## Get Running in 5 Minutes

### 1. Prerequisites ✅
- Node.js installed
- React app set up
- Module 1 (Patient Management) completed (optional but recommended)

### 2. Installation 📦

```bash
# If you haven't already from Module 1:
npm install dexie
```

### 3. Quick Copy-Paste Setup 🚀

**Step A: Copy all folders**
```
Copy these folders to your src/ directory:
- components/appointments/
- types/ (merge with existing)
- utils/ (merge with existing)
- styles/
```

**Step B: Update database.ts**

Find this line in your `src/utils/database.ts`:
```typescript
db.version(1).stores({
```

Change to:
```typescript
db.version(2).stores({
  // Module 1
  patients: 'id, phone, name, createdAt',
  
  // Module 2
  appointments: 'id, patientId, date, time, type, status, createdAt',
  waitlist: 'id, patientId, priority, addedAt'
});
```

**Step C: Import CSS**

In your `src/App.tsx` or `src/index.tsx`, add:
```typescript
import './styles/appointments.css';
```

**Step D: Use the component**

```typescript
import AppointmentCalendar from './components/appointments/AppointmentCalendar';

function App() {
  return (
    <AppointmentCalendar 
      userRole="assistant"
      userName="Naveed"
    />
  );
}
```

### 4. Test It! ✨

```bash
npm start
```

You should see:
- Calendar header with General/Orthodontist toggle
- Today/Week/Month view switcher
- Time slots from 3 PM to 10 PM
- Smart Gap Filler button

### 5. Create Your First Appointment

1. Click any empty time slot
2. Enter patient name and phone (or search if you have Module 1)
3. Add reason (optional)
4. Click "Book Appointment"
5. ✅ Done!

---

## 🎯 What Works Right Now

✅ Create appointments
✅ View appointments (3 views)
✅ Edit appointment details
✅ Change appointment status
✅ Delete appointments
✅ WhatsApp integration
✅ Smart gap filler (with mock data)
✅ Statistics tracking
✅ Dual calendar system

---

## 🔗 To Connect Module 1 (Optional)

In `QuickBooking.tsx`, replace line 32:

```typescript
// BEFORE (placeholder):
const handlePatientSearch = async (term: string) => {
  setSearchTerm(term);
  // TODO: Integrate with Module 1
};

// AFTER (real search):
import { searchPatients } from '../../utils/database'; // from Module 1

const handlePatientSearch = async (term: string) => {
  setSearchTerm(term);
  const results = await searchPatients(term);
  setSearchResults(results); // you'll need to add this state
};
```

---

## 🆘 Quick Fixes

**Problem:** Database error on first load
**Fix:** Open DevTools → Application → IndexedDB → Delete "AbdullahDentalCare" → Refresh

**Problem:** Styles look weird
**Fix:** Make sure you imported appointments.css in your main file

**Problem:** Can't create appointment
**Fix:** Check browser console for errors. Database version must be 2.

---

## 🎉 You're All Set!

Your appointment system is now live and ready to use. 

**Next:** Start using it to book appointments, or continue with Module 3 (Treatment Planning).

---

**Tips for Naveed:**
- Use "Today View" as default
- Click "Smart Fill" when you have empty slots
- One-click WhatsApp reminders work on mobile
- Mark completed after patient leaves
