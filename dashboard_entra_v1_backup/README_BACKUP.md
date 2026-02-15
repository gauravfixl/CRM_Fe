# Dashboard Entra Implementation Backup

This folder contains a snapshot of the dashboard implementation as of 2026-01-13, before transitioning to the Admin/User role-based architecture.

## Included Files:
- `src/app/[orgName]/dashboard`: The main Entra-style dashboard pages.
- `src/app/[orgName]/modules`: Module pages (CRM, HRM, etc.) which currently show the user-perspective content.
- `src/modules`: Business logic, hooks, and stores for CRM, PM, etc.
- `src/shared/components/app-sidebar.tsx`: The double-sidebar implementation.
- `src/shared/components/app-header.tsx` & `app-layout.tsx`: Layout and header components.
- `src/shared/components/dashboard`: Specific dashboard components (cards, stats, etc.).

## Purpose:
To preserve the current visual and functional state (User Perspective) while we implement the Admin Perspective which will eventually create and manage these views for users.
