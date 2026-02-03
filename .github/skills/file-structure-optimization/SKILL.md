---
name: file-structure-optimization
description: Optimize project file structure to improve maintainability and scalability. Reorganizes feature-based architecture, improves component organization, consolidates duplicated utilities, and aligns with production best practices for monorepo projects.
---

# File Structure Optimization Skill

## Purpose

This skill guides the reorganization of the project file structure to improve code organization, maintainability, and scalability. It eliminates chaos and establishes clear separation of concerns following industry best practices.

## When to Use

- Project organization is unclear or scattered
- Moving files between features or packages
- Creating new features or modules
- Improving component discovery and reusability
- Establishing consistent file naming conventions
- Consolidating duplicate code
- Setting up for team collaboration

## Content Rules

- Do not use emoji in code or documentation.
- Do not use Chinese characters in code or documentation.
- Chinese is allowed only in UI display strings under `packages/utils/src/i18n/locales/zh/`.
- Keep comments minimal and in English.

## Current Architecture Analysis

### Existing Structure

```
frontend-go/
├── src/                       # Main app source
│   ├── App.tsx
│   ├── main.tsx
│   ├── core/                  # Core infrastructure
│   │   ├── config/
│   │   ├── context/
│   │   ├── interfaces/
│   │   ├── services/
│   │   ├── layout/
│   │   └── response/
│   ├── features/              # Feature modules
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── forms/
│   │   ├── groups/
│   │   ├── projects/
│   │   ├── storage/
│   │   └── monitoring/
│   ├── shared/                # Shared code
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── icons/
│   │   └── utils/
│   └── index.css
│
├── packages/                  # Reusable packages
│   ├── components-shared/     # Shared React components
│   ├── ui/                    # UI library
│   ├── utils/                 # Utils and i18n
│   └── tsconfig.base.json
│
├── public/                    # Static assets
│   ├── fonts/
│   ├── images/
│   └── ...
│
├── .github/
│   └── workflows/            # CI/CD workflows
│
└── deploy/                    # Deployment config
```

## Optimization Strategy

### 1. Core Module Organization

**Target Structure:**

```
src/core/
├── api/                       # API client setup
│   ├── client.ts             # Axios/fetch instance
│   ├── interceptors.ts       # Request/response interceptors
│   └── errorHandler.ts       # Error handling
│
├── config/                    # Configuration
│   ├── constants.ts
│   ├── environment.ts
│   ├── url.ts
│   └── k8s.ts
│
├── context/                   # React contexts
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   ├── SidebarContext.tsx
│   ├── ThemeContext.tsx
│   ├── WebSocketContext.tsx
│   └── hooks/
│       ├── useAuth.ts
│       ├── useLanguage.ts
│       ├── useSidebar.ts
│       └── useTheme.ts
│
├── interfaces/                # TypeScript types
│   ├── api.ts
│   ├── auth.ts
│   ├── common.ts
│   ├── config.ts
│   ├── domain.ts
│   ├── form.ts
│   ├── group.ts
│   ├── project.ts
│   ├── resource.ts
│   ├── user.ts
│   └── storage.ts
│
├── services/                  # API service layer
│   ├── auth/
│   │   ├── authService.ts
│   │   └── forgotPasswordService.ts
│   ├── data/
│   │   ├── formService.ts
│   │   ├── groupService.ts
│   │   ├── projectService.ts
│   │   └── userGroupService.ts
│   ├── resource/
│   │   ├── imageService.ts
│   │   ├── pvcService.ts
│   │   └── configFileService.ts
│   ├── system/
│   │   ├── auditService.ts
│   │   ├── podService.ts
│   │   └── websocketService.ts
│   └── index.ts
│
└── layout/
    ├── AppHeader.tsx
    ├── AppLayout.tsx
    ├── AppSidebar.tsx
    └── Backdrop.tsx
```

**Rationale:**

- Group services by domain (auth, data, resource, system)
- Move context hooks into dedicated hooks folder
- Organize interfaces by domain
- Centralize API client setup
- Improve discoverability

### 2. Features Module Organization

**Target Structure for Each Feature:**

```
src/features/[feature-name]/
├── components/
│   ├── [subfeature]/
│   │   ├── index.ts           # Barrel export
│   │   ├── Component.tsx       # Main component
│   │   ├── Component.types.ts  # Types
│   │   └── Component.utils.ts  # Helpers
│   ├── common/                 # Shared components within feature
│   │   ├── FormField.tsx
│   │   └── StatusBadge.tsx
│   └── index.ts                # Feature exports
│
├── hooks/                      # Feature-specific hooks
│   ├── useFormData.ts
│   ├── useFormSubmission.ts
│   └── index.ts
│
├── services/                   # Feature-specific services
│   ├── formDataService.ts
│   └── index.ts
│
├── types/                      # Feature-specific types
│   ├── form.ts
│   └── index.ts
│
├── pages/
│   ├── FormDashboard.tsx
│   ├── FormDetail.tsx
│   └── index.ts
│
├── constants.ts                # Feature constants
├── README.md                   # Feature documentation
└── index.ts                    # Feature barrel export
```

**Example: Forms Feature**

```
src/features/forms/
├── components/
│   ├── form/
│   │   ├── UserFormApply.tsx
│   │   ├── UserFormHistory.tsx
│   │   ├── TabSwitcher.tsx
│   │   └── index.ts
│   ├── modal/
│   │   ├── FormDetailModal.tsx
│   │   ├── CreateFormModal.tsx
│   │   └── index.ts
│   └── index.ts
├── pages/
│   ├── UserFormDashboard.tsx
│   └── index.ts
├── hooks/
│   ├── useFormData.ts
│   ├── useFormSubmission.ts
│   └── index.ts
├── constants.ts
└── README.md
```

### 3. Shared Module Organization

**Target Structure:**

```
src/shared/
├── components/
│   ├── header/
│   │   ├── Header.tsx
│   │   ├── HeaderMenu.tsx
│   │   └── index.ts
│   ├── footer/
│   │   ├── Footer.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   └── index.ts
│   └── index.ts
│
├── hooks/
│   ├── useAsync.ts
│   ├── useGroupPermissions.ts
│   ├── useLocalStorage.ts
│   ├── usePagination.ts
│   └── index.ts
│
├── utils/
│   ├── api.ts
│   ├── array.ts
│   ├── date.ts
│   ├── format.ts
│   ├── storage.ts
│   ├── string.ts
│   ├── validation.ts
│   └── index.ts
│
├── icons/
│   ├── IconComponent.tsx
│   └── index.ts
│
├── constants/
│   ├── api.ts
│   ├── messages.ts
│   ├── validation.ts
│   └── index.ts
│
└── types/
    ├── common.ts
    └── index.ts
```

### 4. Packages Organization

**Target Structure:**

```
packages/
├── tsconfig.base.json
│
├── ui/                        # UI Component Library
│   ├── src/
│   │   ├── components/
│   │   │   ├── button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.types.ts
│   │   │   ├── modal/
│   │   │   │   ├── BaseModal.tsx
│   │   │   │   └── DeleteModal.tsx
│   │   │   ├── dropdown/
│   │   │   ├── icon/
│   │   │   ├── pagination/
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── components-shared/         # Shared Components
│   ├── src/
│   │   ├── components/
│   │   │   ├── PageMeta.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── ThemeToggleButton.tsx
│   │   │   └── index.ts
│   │   ├── auth/
│   │   │   ├── SignInForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── index.ts
│   │   ├── routes/
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── PublicRoute.tsx
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── utils/                     # Utils and i18n
│   ├── src/
│   │   ├── components/
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── icons/
│   │   │   └── index.ts
│   │   ├── context/
│   │   │   ├── LanguageContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useTranslation.ts
│   │   │   ├── useWebSocket.ts
│   │   │   ├── useTheme.ts
│   │   │   └── index.ts
│   │   ├── i18n/
│   │   │   ├── locales/
│   │   │   │   ├── en/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── navigation.ts
│   │   │   │   │   ├── pages.ts
│   │   │   │   │   └── ...
│   │   │   │   └── zh/
│   │   │   │       └── ...
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── k8sHelpers.ts
│   │   │   ├── validators.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── frontend-app/              # Main app package
    ├── package.json
    └── tsconfig.json
```

## File Naming Conventions

### Component Files

```
# Page components
src/features/projects/pages/ProjectsPage.tsx

# Feature components
src/features/projects/components/ProjectCard.tsx
src/features/projects/components/project/ConfigFilesTab.tsx

# Shared components
src/shared/components/Header.tsx
src/shared/components/footer/Footer.tsx

# Small, single-purpose components
Button.tsx
Modal.tsx
Card.tsx
```

### Type Definition Files

```
# Collocated with component
MyComponent.types.ts

# Shared types
src/shared/types/index.ts
src/core/interfaces/index.ts

# Feature-specific types
src/features/forms/types/form.ts
```

### Hook Files

```
# Feature hook
src/features/forms/hooks/useFormData.ts

# Shared hook
src/shared/hooks/usePagination.ts

# Colocated with context
src/core/context/hooks/useAuth.ts
```

### Service Files

```
# Core API services
src/core/services/auth/authService.ts
src/core/services/data/formService.ts
src/core/services/resource/imageService.ts

# Feature-specific service
src/features/forms/services/formDataService.ts
```

### Constants Files

```
# Global constants
src/core/config/constants.ts

# Feature constants
src/features/projects/constants.ts

# Shared constants
src/shared/constants/api.ts
src/shared/constants/messages.ts
```

## Import Path Standards

**Use this order:**

```typescript
// 1. React imports
import React, { useState } from 'react';

// 2. External packages
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 3. Monorepo packages
import { useTranslation } from '@nthucscc/utils';
import { Button } from '@nthucscc/ui';
import { PrivateRoute } from '@nthucscc/components-shared';

// 4. Core imports
import { API_BASE_URL } from '@/core/config/url';
import { Project } from '@/core/interfaces/project';
import { getProjects } from '@/core/services/projectService';

// 5. Feature imports
import { useProjectData } from '@/features/projects/hooks/useProjectData';

// 6. Shared imports
import { useAsync } from '@/shared/hooks/useAsync';

// 7. Local imports
import { ProjectCard } from './ProjectCard';
import { helpers } from '../utils/helpers';

// 8. Styles (last)
import './styles.css';
```

## Migration Checklist

### Phase 1: Assessment

- [ ] Audit all existing files
- [ ] Identify duplicates and orphaned code
- [ ] Document current import paths
- [ ] Create migration plan

### Phase 2: Core Infrastructure

- [ ] Reorganize core/services into subfolders
- [ ] Move context hooks to dedicated folder
- [ ] Reorganize interfaces by domain
- [ ] Create barrel exports (index.ts)

### Phase 3: Features

- [ ] Audit each feature for structure
- [ ] Create components/pages/hooks folders
- [ ] Add index.ts barrel exports
- [ ] Update import paths

### Phase 4: Shared

- [ ] Consolidate shared utilities
- [ ] Remove duplicates
- [ ] Create organized constants
- [ ] Add shared types folder

### Phase 5: Validation

- [ ] Update all import paths
- [ ] Run type checking (tsc)
- [ ] Run ESLint
- [ ] Test application

## Common Refactoring Patterns

### Pattern: Consolidate Duplicate Utils

```typescript
// BEFORE: Scattered utilities
src / features / projects / utils / helpers.ts;
src / features / forms / utils / helpers.ts;

// AFTER: Centralized
src / shared / utils / helpers.ts;
src / shared / utils / validation.ts;
src / shared / utils / format.ts;
```

### Pattern: Extract Hooks

```typescript
// BEFORE: Logic in component
const MyComponent = () => {
  const [data, setData] = useState();
  useEffect(() => { /* fetch logic */ }, []);
  return <div>{data}</div>;
};

// AFTER: Hook extracted
const useData = () => {
  const [data, setData] = useState();
  useEffect(() => { /* fetch logic */ }, []);
  return data;
};

const MyComponent = () => {
  const data = useData();
  return <div>{data}</div>;
};
```

### Pattern: Create Barrel Exports

```typescript
// src/features/forms/components/index.ts
export { default as FormDetailModal } from './modal/FormDetailModal';
export { default as UserFormApply } from './form/UserFormApply';
export { default as UserFormHistory } from './form/UserFormHistory';
export { TabSwitcher } from './form/TabSwitcher';

// Now you can import like:
import { FormDetailModal, UserFormApply } from '@/features/forms/components';
```

## Expected Structure Benefits

**Improved Maintainability**

- Clear separation of concerns
- Easier to find related files
- Better code organization

**Better Scalability**

- New features can follow established patterns
- Team can work independently on features
- Reduced import path confusion

**Enhanced Reusability**

- Shared code is centralized
- Packages are properly organized
- Utilities can be easily located

**Performance**

- Easier to code-split
- Better tree-shaking opportunities
- Optimized bundle sizes

## Related Resources

- [Monorepo Best Practices](https://monorepo.tools/)
- [Feature-Based Architecture](https://www.patterns.dev/posts/layered/)
- [TypeScript Path Aliases](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
