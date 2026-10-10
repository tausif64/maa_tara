this is what i used to ctrete hte laravel project  
 laravel new MaaTara

 ██╗       █████╗  ██████╗   █████╗  ██╗   ██╗ ███████╗ ██╗
 ██║      ██╔══██╗ ██╔══██╗ ██╔══██╗ ██║   ██║ ██╔════╝ ██║
 ██║      ███████║ ██████╔╝ ███████║ ██║   ██║ █████╗   ██║
 ██║      ██╔══██║ ██╔══██╗ ██╔══██║ ╚██╗ ██╔╝ ██╔══╝   ██║
 ███████╗ ██║  ██║ ██║  ██║ ██║  ██║  ╚████╔╝  ███████╗ ███████╗
 ╚══════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝   ╚═══╝   ╚══════╝ ╚══════╝

 Do you want to use a starter kit? (yes/no) [no]:
 > yes


 Which frontend stack should your starter kit use? [React]:
  [react   ] React
  [svelte  ] Svelte
  [vue     ] Vue
  [livewire] Livewire
 > react


 Which authentication provider do you prefer? [Laravel's built-in authentication]:
  [laravel] Laravel's built-in authentication
  [workos ] WorkOS (Requires WorkOS account)
 > laravel


 Would you like to add teams support to your application? (yes/no) [no]:
 > no



 this this is the what you have to do here 
 ### System Role & Objective
You are a senior full-stack Laravel architect and UI/UX engineer. Build a full-featured Rehabilitation / Nasha Mukti Kendra web platform and administrative CMS inspired by the design and structure of Punahsthapanaa Foundation Trust (clean wellness aesthetic, card-based clinical layouts, prominent contact CTAs, and clear recovery service tiers). 

The platform will be branded for **"Maa Tara Freedom Trust"** (Tagline: *"Breaking Chains, Building Lives"*).

---

### Tech Stack Specifications
- **Backend Framework:** Laravel 11 (PHP 8.2+)
- **Frontend Stack:** Blade Templates + Tailwind CSS + Alpine.js (or Livewire for dynamic interactive components)
- **Database:** MySQL / PostgreSQL
- **Admin Panel:** FilamentPHP v3 or a custom Blade/Tailwind admin dashboard
- **Authentication:** Laravel Breeze / Filament Auth with Role-Based Access Control (`Admin`, `Counselor`, `Staff`)

---

### Design System & Theme Engine

#### 1. Color Palette (Extracted from Maa Tara Freedom Trust Logo)
- **Primary (Deep Trust Navy):** `#0A2E66` (Hover/Dark: `#061D42`, Tint: `#EEF3FA`)
- **Secondary (Freedom Orange):** `#E85D04` (Hover/Dark: `#C84C00`, Tint: `#FFF2EB`)
- **Tertiary / Accent (Sunburst Warm Gold):** `#F4A213` (Hover/Dark: `#D48805`, Tint: `#FEF7EB`)
- **Neutral & Base:** 
  - Slate Dark: `#1E293B`
  - Body Text: `#475569`
  - Background Neutral: `#F8FAFC`
  - Pure White: `#FFFFFF`

#### 2. Dynamic Theme Switching Feature
- Implement a theme-switcher component in the header/navbar allowing users to toggle between:
  1. **Trust Navy Theme:** Primary `#0A2E66`, Accent `#E85D04`
  2. **Vibrant Orange Theme:** Primary `#E85D04`, Accent `#0A2E66`
  3. **High-Contrast / Dark Mode:** Background `#0F172A`, Surface `#1E293B`, Text `#F8FAFC`, Accent `#F4A213`
- Persist user theme choice using `localStorage` and Tailwind CSS variables/root variables (`--color-primary`, `--color-secondary`, `--color-accent`).

---

### Core Architecture & Page-Wise Requirements

#### 1. Global Components & Layout
- **Top Announcement Bar:** Emergency helpline number, email address, operating hours, and Quick WhatsApp chat button.
- **Navigation Bar:**
  - Logo branding: "Maa Tara Freedom Trust" with the provided emblem.
  - Links: Home, About Us, Treatment Programs, Facilities, Success Stories, FAQ, Contact.
  - Interactive Action: "Book Appointment" CTA button + Theme switcher dropdown.
- **Floating Call/WhatsApp Widget:** Persistent bottom-right floating button for quick emergency admission inquiries.
- **Footer:** Organization address, quick links, emergency disclaimer, copyright notice, and social media links.

---

#### 2. Public Pages Breakdown

##### Page 1: Home (`/`)
- **Hero Section:**
  - Dynamic sliding/rotating headline: *"Get Your Life Back From Addiction!"* (*From Alcohol, Cocaine, Drugs, Tobacco*).
  - Primary CTA: "Call for Immediate Help" and "Book Confidential Appointment".
- **Emergency Callout Banner:** 24/7 de-addiction helpline card with 1-click dialing.
- **Care Programs Grid (4 Cards):**
  1. *Inpatient Care:* Dedicated primary counselors and customized recovery roadmaps.
  2. *Outpatient Care:* Structured, flexible non-residential rehabilitation.
  3. *Family Support:* Coping strategies, counseling, and systemic healing.
  4. *Aftercare & Relapse Prevention:* Trigger management, routine checkups, and alumni support.
- **"Why Choose Us" / Trust Pillars:**
  - Experienced medical team and clinical psychologists.
  - Modern, secure, and serene recovery environment.
  - Tailored multi-step therapeutic plans.
- **Live Counter / Milestones:** Animated stats (Recovered Lives, Expert Doctors, Success Rate, Years of Service).
- **Facilities Showcase:** Visual cards with icons covering comfortable accommodations, 24/7 medical supervision, nutritious meal plans, therapy rooms, yoga/fitness, and recreational activities.
- **Quick Consultation Lead Form:** Direct embedded form (`Name`, `Phone`, `Email`, `Addiction Type`, `Message`).
- **Interactive FAQ Accordion:** Common questions about rehabilitation admissions, costs, confidentiality, and family visits.

##### Page 2: About Us (`/about`)
- Mission, vision, and core values of Maa Tara Freedom Trust.
- Clinical approach, detox protocols, and psychiatric support overview.
- Founder & Medical Director profiles with accreditation badges.

##### Page 3: Treatments & Programs (`/treatments`)
- Categorized recovery paths: Alcoholism, Substance Abuse, Prescription Drugs, Dual Diagnosis (Mental Health + Addiction).
- Step-by-step recovery methodology: Medical Detox $\rightarrow$ Counseling & Therapy $\rightarrow$ Behavioral Modification $\rightarrow$ Reintegration & Aftercare.

##### Page 4: Facilities & Infrastructure (`/facilities`)
- High-resolution gallery showing patient rooms, garden/recreation spaces, dining areas, and therapy rooms.
- Hygiene and 24/7 patient security guidelines.

##### Page 5: Appointment Booking Flow (`/appointment`)
Provide an intuitive multi-step booking engine allowing users to select:
1. **Service Type:** Inpatient Consultation, Outpatient Session, Family Counseling, Emergency Detox Admission.
2. **Consultation Mode:** In-Person (at Ranchi facility) vs. Online / Tele-Consultation.
3. **Date & Available Slot:** Interactive calendar showing open slots.
4. **Patient / Guardian Details:** Full Name, Contact Number, Relation to Patient, Optional Note/Severity of Case.
5. **Confirmation & Status:** Generates an appointment reference code with SMS/Email confirmation and an "Add to Google Calendar" option.

##### Page 6: Contact & Emergency Admissions (`/contact`)
- Sahera Road / Ranchi facility address with interactive Google Map embed.
- Direct contact numbers, emergency ambulance dispatch info, and an inquiry contact form.

---

### Admin Dashboard Requirements (`/admin`)

Implement an administrative portal with the following modules:

1. **Dashboard Analytics:**
   - Real-time counters: Total leads, upcoming appointments, active inpatients, monthly inquiry trends.
2. **Appointment Manager:**
   - Calendar & table views for incoming appointments.
   - Status transitions: `Pending`, `Confirmed`, `Rescheduled`, `Completed`, `Cancelled`.
   - Ability to assign an in-house counselor or doctor to a booking.
3. **Lead & Inquiry CRM:**
   - Complete capture of all website forms with source tracking and status flags (`New`, `Contacted`, `Admitted`, `Archived`).
4. **Content & Service CMS:**
   - Manage programs, doctors/counselors, facilities, testimonials, and FAQs without touching code.
5. **System Settings & Notifications:**
   - Configure working hours, appointment buffer times, holiday blackouts, notification emails, and SMS gateways.

---

### Implementation Instructions for the Agent
1. Generate standard Laravel migrations for `appointments`, `leads`, `services`, and `faqs`.
2. Configure Tailwind CSS with the extracted primary, secondary, and accent colors, mapping them to CSS variables for dynamic theme toggling.
3. Write clean, modular Blade views using reusable component partials (`x-navbar`, `x-footer`, `x-card`, `x-appointment-stepper`).
4. Ensure full responsive design across desktop, tablet, and mobile breakpoints.
5. Include form request validation, anti-spam Honeypot/CSRF safeguards, and database seeders with realistic rehabilitation center demo data.


### Reference website
1. https://punahsthapanaafoundationtrust.in/

