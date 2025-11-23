# TESTING CHECKLIST - Patient Management Module

## 🧪 COMPREHENSIVE TESTING GUIDE

Test each feature thoroughly before moving to Module 2.

---

## 1. PATIENT LIST TESTING

### ✅ Initial Load
- [ ] App loads without console errors
- [ ] Empty state shows when no patients
- [ ] "No patients yet" message displays
- [ ] "Add First Patient" button visible

### ✅ Search Functionality
- [ ] Search bar visible at top
- [ ] Type patient name → filters list (debounced, 300ms delay)
- [ ] Type phone number → filters list
- [ ] Partial matches work (e.g., "Ali" finds "Ali Khan")
- [ ] Clear button (X) appears when typing
- [ ] Click X clears search
- [ ] "No patients found" shows when search has no results

### ✅ Sort Controls
- [ ] Sort dropdown visible
- [ ] Sort by Name (A-Z) works
- [ ] Sort by Recent First works
- [ ] Sort by Balance (High to Low) works

### ✅ Patient Cards Display
- [ ] Patient name shows correctly
- [ ] Phone formatted as 0334-5822-622
- [ ] Age and gender display
- [ ] Behavior tag shows with correct color
- [ ] Last visit shows (or "Never visited")
- [ ] Outstanding balance alert appears (if balance > 0)
- [ ] Hover effect works (card lifts slightly)

### ✅ FAB Button
- [ ] Floating Add button in bottom right
- [ ] Orange/tangerine color
- [ ] Hover effect (grows slightly)
- [ ] Click opens add patient form

---

## 2. PATIENT FORM TESTING

### ✅ Basic Form (Quick Mode)

**Open Form:**
- [ ] Click "Add New Patient" button
- [ ] Modal appears with overlay
- [ ] Title says "Add New Patient"
- [ ] Quick mode fields visible: Name, Phone, Age, Gender

**Name Validation:**
- [ ] Leave blank → Error: "Name is required"
- [ ] Enter 1 character → Error: "Name must be at least 2 characters"
- [ ] Enter "Ali123" → Error: "Name can only contain letters and spaces"
- [ ] Enter "Ali Khan" → No error ✅

**Phone Validation:**
- [ ] Leave blank → Error: "Phone is required"
- [ ] Enter "12345" → Error: "Phone must be 11 digits..."
- [ ] Enter "03345822622" → No error ✅
- [ ] Non-digits automatically removed

**Age Validation:**
- [ ] Leave blank → Error: "Age is required"
- [ ] Enter 0 → Error: "Age must be between 1 and 120"
- [ ] Enter 150 → Error: "Age must be between 1 and 120"
- [ ] Enter 30 → No error ✅

**Gender Selection:**
- [ ] Default is "Male"
- [ ] Can select Female
- [ ] Can select Other

**Duplicate Detection:**
- [ ] Add patient with phone 03345822622
- [ ] Try to add another with same phone
- [ ] Warning appears: "This phone number already exists"
- [ ] Save button disabled

### ✅ Extended Form

**Toggle Extended Mode:**
- [ ] "Show Extended Information" button visible
- [ ] Click → Expands to show more fields
- [ ] Button changes to "Hide Extended Information"
- [ ] Click again → Collapses back

**Additional Fields:**
- [ ] Address (textarea)
- [ ] Occupation (text input)
- [ ] Behavior Tag (dropdown with 9 options)
- [ ] Default behavior tag is "Regular"

**Medical History:**
- [ ] Blood Thinners checkbox
- [ ] Diabetes checkbox
- [ ] Heart Conditions checkbox
- [ ] Communicable Diseases checkbox
- [ ] Pregnancy checkbox (only shows for Female gender)
- [ ] Allergies text input
- [ ] Other Conditions textarea

**Private Notes:**
- [ ] Notes textarea visible
- [ ] Can enter multi-line text

### ✅ Form Actions

**Save Button:**
- [ ] Disabled when validation errors exist
- [ ] Enabled when all fields valid
- [ ] Click saves to database
- [ ] Form closes
- [ ] Returns to patient list
- [ ] New patient appears in list

**Cancel Button:**
- [ ] Click closes form without saving
- [ ] Returns to patient list
- [ ] No data saved

**X Button (Top Right):**
- [ ] Same as Cancel button

---

## 3. PATIENT PROFILE TESTING

### ✅ Profile Display

**Open Profile:**
- [ ] Click any patient card
- [ ] Profile view opens
- [ ] Back button visible (top left)
- [ ] Edit button visible (top right)

**Header Information:**
- [ ] Patient name (large)
- [ ] Behavior tag badge (colored)
- [ ] Phone number (formatted)
- [ ] Age and gender
- [ ] Address (if entered)
- [ ] Occupation (if entered)

**Medical Alerts:**
- [ ] If blood thinners → Red alert box appears
- [ ] If diabetes → Listed in alert
- [ ] If heart conditions → Listed in alert
- [ ] If communicable diseases → Listed in alert
- [ ] If pregnancy → Listed in alert
- [ ] If allergies → Yellow alert box appears separately

**Outstanding Balance:**
- [ ] If balance > 0 → Yellow alert box shows
- [ ] Balance amount displayed
- [ ] "Send Payment Reminder" button visible

### ✅ Quick Actions

**Action Buttons:**
- [ ] Book Appointment button
- [ ] Add Treatment button
- [ ] Prescription button
- [ ] WhatsApp button
- [ ] All buttons have icons
- [ ] Hover effect works

**Button Clicks:**
- [ ] Book Appointment → Alert (Module 2 placeholder)
- [ ] Add Treatment → Alert (Module 3 placeholder)
- [ ] Prescription → Alert (Module 4 placeholder)
- [ ] WhatsApp → Opens share menu OR shows alert

### ✅ Tabs

**Tab Navigation:**
- [ ] Overview tab (default active)
- [ ] Treatments tab
- [ ] Appointments tab
- [ ] Medical History tab
- [ ] Active tab highlighted (orange underline)
- [ ] Click switches tabs

**Overview Tab:**
- [ ] 4 stat cards showing:
  - Total Spent
  - Total Visits
  - Last Visit
  - Outstanding Balance
- [ ] Cards have gradient background
- [ ] If notes exist → Notes section appears

**Treatments Tab:**
- [ ] If no treatments → "No treatments recorded yet"
- [ ] If treatments exist → List shows:
  - Date
  - Total amount
  - Status badge (colored)
  - Balance (if > 0)

**Appointments Tab:**
- [ ] If no appointments → "No appointments yet"
- [ ] If appointments exist → List shows:
  - Date and time
  - Reason
  - Status badge

**Medical History Tab:**
- [ ] All conditions listed (Yes/No)
- [ ] Pregnancy only shows if Female
- [ ] Allergies section (if entered)
- [ ] Other Conditions section (if entered)

### ✅ Edit Patient

**Edit Button:**
- [ ] Click Edit button
- [ ] Form opens in edit mode
- [ ] All fields pre-populated with existing data
- [ ] Extended mode shows by default (if data exists)
- [ ] Title says "Edit Patient"
- [ ] Can modify fields
- [ ] Save updates patient
- [ ] Returns to profile with updated data

---

## 4. DATA PERSISTENCE TESTING

### ✅ IndexedDB

**Data Storage:**
- [ ] Add patient → Refresh page → Patient still there ✅
- [ ] Edit patient → Refresh page → Changes saved ✅
- [ ] Data survives browser restart

**Live Updates:**
- [ ] Add patient in one view
- [ ] List updates immediately (no manual refresh needed)
- [ ] Edit patient → List updates
- [ ] Delete patient (if implemented) → List updates

---

## 5. MOBILE RESPONSIVENESS TESTING

### ✅ Phone View (< 768px)

**Layout:**
- [ ] Patient grid switches to single column
- [ ] Search bar full width
- [ ] Form fields stack vertically
- [ ] Profile tabs scrollable horizontally
- [ ] Stat cards in 2x2 grid
- [ ] Quick actions in 2x2 grid
- [ ] All text readable
- [ ] Buttons easy to tap (min 44x44px)

**Test on:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)

**Interactions:**
- [ ] Scroll works smoothly
- [ ] Form inputs trigger correct mobile keyboards
- [ ] Phone input shows numeric keyboard
- [ ] Dropdowns work on mobile
- [ ] Checkboxes easy to tap

---

## 6. EDGE CASES TESTING

### ✅ Empty States
- [ ] No patients → Shows empty state
- [ ] No search results → Shows "No patients found"
- [ ] No treatments in profile → Shows "No treatments recorded yet"
- [ ] No appointments → Shows "No appointments yet"

### ✅ Long Content
- [ ] Very long patient name → Wraps correctly
- [ ] Very long address → Wraps correctly
- [ ] Many allergies → Displays properly
- [ ] Many patients → List scrolls smoothly

### ✅ Special Characters
- [ ] Name with apostrophe (e.g., "O'Brien")
- [ ] Name with hyphen (e.g., "Ali-Khan")
- [ ] Address with special chars

### ✅ Boundary Values
- [ ] Age 1 → Accepts
- [ ] Age 120 → Accepts
- [ ] Phone exactly 11 digits → Accepts
- [ ] Phone 10 digits → Rejects
- [ ] Phone 12 digits → Rejects

---

## 7. PERFORMANCE TESTING

### ✅ Speed
- [ ] List loads in < 1 second
- [ ] Search filters in < 300ms (after debounce)
- [ ] Form opens instantly
- [ ] Profile loads instantly
- [ ] No lag when typing

### ✅ Many Records
- [ ] Add 50+ patients → List still fast
- [ ] Search still works quickly
- [ ] Sorting still fast

---

## 8. BROWSER COMPATIBILITY

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 9. ACCESSIBILITY TESTING

### ✅ Keyboard Navigation
- [ ] Tab through form fields
- [ ] Enter submits form
- [ ] Escape closes modals
- [ ] All interactive elements reachable

### ✅ Screen Readers (Optional)
- [ ] Labels read correctly
- [ ] Error messages announced
- [ ] Buttons have proper ARIA labels

---

## 10. ERROR HANDLING

### ✅ Database Errors
- [ ] If IndexedDB fails → Console shows error (gracefully)
- [ ] Form shows user-friendly error message

### ✅ Invalid Data
- [ ] Corrupt data in database → Doesn't crash app
- [ ] Missing fields → Shows with defaults

---

## 🎯 SIGN-OFF CRITERIA

Module 1 is ready for production when:

✅ All critical tests pass  
✅ No console errors  
✅ Works on mobile and desktop  
✅ Data persists across page refreshes  
✅ Forms validate correctly  
✅ Search and filter work  
✅ Edit functionality works  

---

## 📊 TEST RESULTS

Date Tested: _______________
Tested By: _______________

Critical Issues Found: _______________
Minor Issues Found: _______________

Ready for Module 2? ☐ Yes ☐ No

---

**Once all tests pass, you're ready to build Module 2!** 🚀
