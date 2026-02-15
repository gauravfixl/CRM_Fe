# HRM Lifecycle Workflow: "Rohan Sharma's Journey"

Yeh document poore **10-Step Lifecycle** ko explain karta hai jo humne implement kiya hai. Hum ek example lenge: **Rohan Sharma** (Candidate) jo **Frontend Developer** role ke liye hire ho raha hai.

---

## **PHASE 1: ENTRY (Aana)**

### **Step 1: Pre-Onboarding (Stage 1)**
*   **Scenario:** Rohan ka interview clear ho gaya hai.
*   **Admin Action:** Admin `Pre-Onboarding` page par jaata hai aur **"Create Offer"** click karta hai.
    *   *Details:* Name: Rohan, Role: Frontend Dev, Dept: Engineering.
*   **Flow:**
    1.  **Offer Pending:** Rohan ko email jaata hai.
    2.  **Offer Accepted:** Admin mark karta hai ki Rohan ne offer accept kar liya.
    3.  **Start BGV:** Admin "Start BGV" dabata hai. Status -> `BGV In-Progress`.
    4.  **BGV Verified:** Verification report aati hai, Admin "Verify" dabata hai.
    5.  **Ready to Join:** Ab Rohan Day 1 ke liye taiyaar hai.
    6.  **Move to Stage 2:** Admin "Move to Onboarding" click karta hai.

### **Step 2: Onboarding (Stage 2)**
*   **Scenario:** Aaj Rohan ka **Day 1** hai.
*   **System Action:** Rohan pre-onboarding list se gayab hokar `Onboarding List` mein aa jata hai. Ek temporary Employee ID create hoti hai.
*   **Admin Action (Verification):**
    *   Admin check karta hai: *"Kya Rohan ne Aadhaar diya?"* -> **Mark Verified**.
    *   Admin check karta hai: *"Kya GitHub Access mila?"* -> **Mark Verified**.
    *   Admin naya task add karta hai: *"Assign Parking Slot"* aur usse bhi verify karta hai.
*   **Completion:** Jab saare tasks green (Verified) ho jate hain, Admin **"Complete Onboarding"** click karta hai.
*   **Result:** Rohan ka status `Probation` ban jata hai.

### **Step 3: Asset Allocation (Stage 3 - Parallel)**
*   **Scenario:** Rohan ko kaam karne ke liye Laptop chahiye.
*   **Admin Action:** `Assets` page par jaakar Admin **"MacBook Pro (Available)"** select karta hai aur Rohan ko assign kar deta hai.
*   **Result:** Inventory mein Laptop "Assigned" dikhta hai.

---

## **PHASE 2: WORK LIFE (Kaam Karna)**

### **Step 4: Probation Confirmation (Stage 5)**
*   **Scenario:** 6 mahine baad. Rohan ka performance achha hai.
*   **Admin Action:** `Probation` page par Rohan ka naam dikhta hai. Admin **"Confirm"** button dabata hai.
*   **Result:** Rohan ka status `Active` ho jata hai. Ab wo permanent employee hai.

### **Step 5: Compliance (Stage 6)**
*   **Scenario:** Company ne naya IT Policy nikala hai.
*   **Admin Action:** `Compliance` page par Admin check karta hai ki Rohan ne policy sign ki ya nahi. Agar nahi, toh **"Nudge"** (Reminder) bhejta hai. Sign hone par **"Mark Signed"** karta hai.

### **Step 6: Lifecycle Actions (Stage 4)**
*   **Scenario:** 1 saal baad Rohan promote hota hai "Senior Developer" banne ke liye.
*   **Admin Action:** `Lifecycle Actions` page par Admin "Promotion" select karta hai.
*   **Result:** Rohan ka Role update hota hai aur ye event History mein log ho jata hai.

---

## **PHASE 3: EXIT (Jaana)**

### **Step 7: Initiate Exit (Stage 7)**
*   **Scenario:** Rohan resign karta hai kyunki usse better offer mila.
*   **Admin Action:** `Exit Management` page par Admin "Initiate Exit" click karta hai.
*   **Result:** Rohan ka status `Notice Period` ho jata hai.

### **Step 8: Clearance Checklist (Stage 8)**
*   **Scenario:** Rohan ka aakhri din (Last Working Day).
*   **Admin Action:** `Clearance` page par alag-alag departments (IT, Finance, Admin) check karte hain:
    *   *IT:* Laptop wapas mila? -> Yes.
    *   *Finance:* Koi loan baki hai? -> No.
*   **Completion:** Jab sab clear hota hai, Admin **"Finalize Separation"** dabata hai.
*   **Result:** Rohan ka status `Exited` ho jata hai.

### **Step 9: Full & Final Settlement (Stage 9)**
*   **Scenario:** Hisaab-kitaab.
*   **Admin Action:** `Settlement` page par Admin final payout calculate karta hai (Salary + Bonus - Dues).
*   **Result:** "Generate Payslip" aur "Experience Letter" download hota hai.

---

## **PHASE 4: LEGACY (Record)**

### **Step 10: Employee History (Stage 10)**
*   **Scenario:** 2 saal baad koi HR aakar Rohan ka record dekhna chahta hai.
*   **Admin Action:** `History` page par Rohan ko search karte hain.
*   **Result:** Ek poori timeline dikhti hai:
    *   🟢 *Jan 2024:* Joined as Frontend Dev.
    *   🔵 *Feb 2024:* MacBook Assigned.
    *   🟣 *Jun 2024:* Confirmed (Active).
    *   📈 *Jan 2025:* Promoted to Senior Dev.
    *   🔴 *Jan 2026:* Exited.

---

**Summary:**
Humne bilkul yahi flow banaya hai jo interconnected hai. Ek stage ka action doosre stage ko trigger karta hai (Status change ke through).
