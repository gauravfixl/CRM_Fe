# COMPLETE CRM DASHBOARD ARCHITECTURE - FULL BACKUP

This document captures the entire state of the CRM Solution Dashboard as of Jan 13, 2026. This setup includes the Layout, Navigation, and all implemented Modules.

## 🏛️ 1. Core Framework & Layout
The dashboard uses a unified "Microsoft Entra" inspired design system.
- **Main Sidebar:** `src/shared/components/app-sidebar.tsx` (Supports multi-module drill-downs).
- **Core Layout:** `src/shared/components/app-layout.tsx` (Handles responsiveness and sticky headers).
- **Global Header:** `src/shared/components/app-header.tsx` (Search, User Profile, Notifications).
- **Styling:** Tailwind CSS + Custom Design Tokens (Blue-Hero Gradients).

## 📊 2. Main Dashboard (Overview)
- **Primary Dashboard:** `src/app/[orgName]/dashboard/page.tsx`
- **Features:** Metric cards, Security panels, Activity streams, and Fixed-background design.

## 📦 3. Integrated Modules

### A. Project Management (Refined)
- **Workspaces:** `/modules/workspaces/manage` (CRUD operations).
- **Global Projects:** `/modules/workspaces` (Aggregated project view).
- **Project Boards:** `/modules/workspaces/boards` (Kanban visualization).
- **Creation Dialog:** `src/shared/components/project-creation-dialog.tsx` (Workspace-aware).

### B. CRM System
- **Leads:** `/modules/crm/leads` (Management and tracking).
- **Deals / Opportunities:** `/modules/crm/deals-opportunities` (Sales pipeline).
- **Client Management:** `/modules/crm/clients-accounts`.

### C. HRM System
- **HRM Cubicle:** Integrated via direct routing to avoid org-prefix issues.
- **Access:** `/hrmcubicle`.

### D. Billing & Finance
- **Invoices:** `/modules/invoice/create` (Smart invoice generation).
- **Firms & Taxes:** Organization-level financial settings.

## ⚙️ 4. Shared Components & Hooks
- **Custom UI:** `src/shared/components/custom/` (Accordion, Table, Dialog, Buttons).
- **API Layers:** `src/modules/.../hooks/` (Modular axios-based data fetching).
- **Global State:** `src/lib/loaderStore.ts`, `src/lib/useAuthStore.ts`.

## 💾 5. How to Restore/Re-use
All code is physically located in the `src/` directory. To replicate this dashboard in another project:
1. Copty the `src/shared/components` directory for the UI.
2. Copy the `src/app/[orgName]/` directory for the module logic and routing.
3. Copy `tailwind.config.js` for the design system tokens.

---
*Snapshot captured successfully.*
