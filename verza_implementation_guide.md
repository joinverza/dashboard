# Verza Implementation Guide

This guide outlines the professional, step-by-step implementation plan for the Verza platform, following a **Feature-Based Architecture** and **Role-Based Access Control (RBAC)**.

## 1. Project Architecture & Structure

We have adopted a scalable Feature-Based Architecture to maintain separation of concerns and modularity.

### Directory Structure
```
src/
├── features/
│   ├── auth/           # Authentication logic (Context, Providers, Hooks)
│   ├── user/           # User Dashboard feature
│   ├── verifier/       # Verifier Dashboard feature
│   ├── enterprise/     # Enterprise Dashboard feature
│   └── admin/          # Admin Dashboard feature
├── components/
│   ├── layout/         # Shared layout components (Sidebar, Header)
│   ├── ui/             # Reusable UI components (Shadcn/UI)
│   └── shared/         # Shared business components
├── config/
│   └── navigation.ts   # Centralized navigation configuration
├── hooks/              # Shared hooks
├── lib/                # Utility libraries (axios, queryClient)
└── App.tsx             # Main Router and Provider setup
```

## 2. Core Features Implementation

### Phase 1: Authentication & Routing (Completed)
- **AuthContext**: Implemented in `src/features/auth/AuthContext.tsx`. Manages user state and roles (`user`, `verifier`, `enterprise`, `admin`).
- **Role-Based Routing**: `App.tsx` is configured with `wouter` to handle distinct routes:
  - `/app/*`: User Dashboard
  - `/verifier/*`: Verifier Dashboard
  - `/enterprise/*`: Enterprise Dashboard
  - `/admin/*`: Admin Dashboard
- **Dynamic Layout**: `Layout.tsx` dynamically renders the Sidebar based on the current active route/role.

### Phase 2: Dashboard Implementation (Next Steps)

#### User Dashboard (`/app`)
- **Focus**: Identity management, wallet, marketplace.
- **Key Components**:
  - `MetricCard`: Display token balance, credentials count.
  - `OverviewSection`: Charting user activity.
  - `ProductsSection`: Marketplace items.
- **Action**: Expand `src/features/user/pages/` with specific views for `Wallet`, `Credentials`, `Marketplace`.

#### Verifier Dashboard (`/verifier`)
- **Focus**: Credential verification, request management.
- **Key Components**:
  - `VerificationQueue`: List of pending verifications.
  - `Scanner`: QR code scanner for verifying credentials.
- **Action**: Build `src/features/verifier/pages/VerificationQueue.tsx`.

#### Enterprise Dashboard (`/enterprise`)
- **Focus**: Employee management, credential issuance.
- **Key Components**:
  - `EmployeeTable`: Manage staff.
  - `IssuanceForm`: Form to issue new credentials.
- **Action**: Build `src/features/enterprise/pages/EmployeeManagement.tsx`.

#### Admin Dashboard (`/admin`)
- **Focus**: Platform oversight, user management, system settings.
- **Key Components**:
  - `UserTable`: Master user list.
  - `SystemHealth`: Server status monitoring.
- **Action**: Build `src/features/admin/pages/UserManagement.tsx`.

## 3. UI/UX Guidelines

- **Theme**: Dark mode default, using "Verza Emerald" (#059669) as the primary accent color.
- **Components**: Use `Shadcn/UI` for consistent, accessible components.
- **Animations**: Use `Framer Motion` for page transitions and micro-interactions.
- **Responsiveness**: Ensure all layouts work on Mobile (hamburger menu) and Desktop (collapsible sidebar).

## 4. Development Workflow

1. **Select Role**: Use the "Role Switcher" in the Header to toggle between roles during development.
2. **Develop Feature**: Create new pages inside `src/features/<role>/pages/`.
3. **Register Route**: Add the new route in `src/App.tsx`.
4. **Update Navigation**: Add the link to `src/config/navigation.ts`.

## 5. Next Immediate Tasks

1. **Implement Role Specific Pages**: Replace placeholders in Verifier, Enterprise, and Admin dashboards with actual functional components.
2. **Connect to Backend**: Replace `MockDataContext` with real API calls using `TanStack Query`.
3. **Refine Mobile Experience**: Test complex tables and charts on mobile viewports.

---

