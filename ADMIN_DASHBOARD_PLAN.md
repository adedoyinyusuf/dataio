# Admin Dashboard Implementation Plan

## 1. Overview
A secure, dedicated Admin Dashboard (`/admin`) to manage the Data.io platform's content, modules, and system status without directly querying the database.

## 2. Infrastructure & Security
*   **Authentication**: Implement **NextAuth.js (Auth.js)** v5.
    *   **Strategy**: Credentials Provider (Email/Password).
    *   **Storage**: Store Admin users in a new `users` table or use Environment Variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) for the MVP.
*   **Protection**: Middleware to block `/admin/*` routes for non-authenticated users.

## 3. Core Features (MVP)
### A. Dashboard Home (`/admin`)
*   **System Health**: Database connection status, Row counts (Total Indicators, Total Data Points).
*   **Quick Actions**: Links to manage Modules, Surveys.

### B. Module Management (`/admin/modules`)
*   **List View**: Show NDHS, NAIIS, NEDS, NMIS.
*   **Actions**: 
    *   Toggle `Enabled/Disabled` status (Hide from frontend).
    *   Edit Description/Label.

### C. Data Auditor (`/admin/audit`)
*   **Automated Checks**: Run the "Sanitization" logic via UI.
    *   Identify Empty Categories.
    *   Identify Indicators with 0 data points.
    *   Identify Duplicate Titles.
*   **Actions**: "Clean Up" button to delete empty artifacts.

### D. Indicator Manager (`/admin/indicators`)
*   **Search**: Find indicators by title.
*   **Edit**: Rename titles (e.g., fix typos), Move to different Category.
*   **Delete**: Remove incorrect indicators.

## 4. Technical Architecture
*   **Layout**: `app/admin/layout.tsx` - Distinct Sidebar (Dark Theme?) to differentiate from User App.
*   **Components**: 
    *   `AdminSidebar`: Navigation for admin routes.
    *   `StatCard`: Reusable metric display.
    *   `DataTable`: Reusable table with actions (Edit/Delete).
*   **API**:
    *   Refactor existing `api/admin/*` to use NextAuth session validation instead of `x-admin-key`.
    *   Create `api/admin/audit`, `api/admin/indicators`, etc.

## 5. Implementation Steps
1.  **Setup Auth**: Install `next-auth`, configure `auth.ts`, create Login page.
2.  **Create Layout**: Build the Admin Shell (Sidebar/Header).
3.  **Build Dashboard**: Implement the Overview page with stats.
4.  **Build Module Manager**: CRUD for `modules` table.
5.  **Build Indicator Search**: UI to find and edit indicators.
