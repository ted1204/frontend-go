---
name: frontend-code-standards
description: Enforce frontend code quality standards for the AI platform. Ensures all files follow the 200-line limit, proper component structure, and production-ready code organization. Includes file splitting strategies, code organization patterns, and refactoring guidelines.
---

# Frontend Code Standards Skill

## Purpose

This skill ensures high code quality and maintainability by enforcing strict code standards. Every component and utility file must follow the 200-line limit to improve readability, testability, and code reusability. This promotes a clean, production-ready codebase.

## When to Use

- Creating new components or services
- Refactoring existing code
- Code reviews and quality checks
- Splitting large files
- Organizing file structure
- Ensuring consistent code patterns

## Code Standards

### Content Rules

- Do not use emoji in code, logs, documentation, or commit messages.
- Do not use Chinese characters in code or documentation.
- Chinese is allowed only in UI display strings under `packages/utils/src/i18n/locales/zh/`.
- Comments must be minimal, clear, and in English.

### 1. File Size Limits

**Requirement:** No file should exceed 200 lines

**Why This Matters:**

- Improves code readability and maintainability
- Makes testing easier
- Encourages single responsibility principle
- Reduces cognitive load when reviewing code
- Enables better component reusability

**Line Counting Rules:**

```typescript
// Count as follows:
// - Import statements: 1 line each
// - Interface/Type definitions: full count
// - Component/Function body: full count
// - Blank lines: DO NOT count
// - Comments: count only content comments (not doc blocks over 3 lines)

// Blank lines and multi-line doc comments don't count
/*
  This is a multi-line comment
  It helps document the code
  But doesn't count toward the 200 line limit
*/

export function MyComponent() {
  // This line counts
  return <div>Content</div>; // This line counts
}
```

### 2. Component Structure Pattern

**File Organization (follow this order):**

```typescript
// 1. Imports (limit to necessary imports only)
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@nthucscc/utils';

// 2. Type/Interface definitions
interface ComponentProps {
  // props definition
}

// 3. Component Implementation
const MyComponent: React.FC<ComponentProps> = ({ props }) => {
  // hooks
  const { t } = useTranslation();
  const [state, setState] = useState();

  // logic
  useEffect(() => {
    // effect logic
  }, []);

  // handlers
  const handleClick = () => {
    // handler logic
  };

  // render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 4. Export statement
export default MyComponent;
```

### 3. File Splitting Strategies

**When a file exceeds 200 lines, use these strategies:**

#### Strategy A: Extract Custom Hooks

```typescript
// hooks/useFormData.ts (extract logic)
export function useFormData(projectId: string) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch data
  }, [projectId]);

  return { data, loading };
}

// components/FormComponent.tsx (use the hook)
const FormComponent = ({ projectId }) => {
  const { data, loading } = useFormData(projectId);
  return <div>{/* UI */}</div>;
};
```

#### Strategy B: Extract Sub-Components

```typescript
// components/FormHeader.tsx
const FormHeader = ({ title }) => (
  <div>{title}</div>
);

// components/FormBody.tsx
const FormBody = ({ items }) => (
  <div>{items.map(...)}</div>
);

// components/Form.tsx (compose them)
const Form = ({ title, items }) => (
  <>
    <FormHeader title={title} />
    <FormBody items={items} />
  </>
);
```

#### Strategy C: Extract Business Logic to Services

```typescript
// services/formService.ts
export async function submitForm(data) {
  return fetch(`${API_BASE_URL}/forms`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// components/FormComponent.tsx
const FormComponent = () => {
  const handleSubmit = async (data) => {
    const result = await submitForm(data);
  };
  return <form onSubmit={handleSubmit}>{/* */}</form>;
};
```

#### Strategy D: Extract UI Components

```typescript
// components/FormField.tsx
const FormField = ({ label, value, onChange }) => (
  <div>
    <label>{label}</label>
    <input value={value} onChange={onChange} />
  </div>
);

// components/Form.tsx
const Form = () => (
  <form>
    <FormField label="Name" value={name} onChange={setName} />
    <FormField label="Email" value={email} onChange={setEmail} />
  </form>
);
```

### 4. Directory Structure Standards

**Organize files by feature/type:**

```
src/features/projects/
├── components/
│   ├── ProjectCard.tsx          (single component)
│   ├── ProjectListTable.tsx     (single component)
│   ├── configfile/
│   │   ├── ServiceForm.tsx      (single component)
│   │   ├── ConfigFileList.tsx   (single component)
│   │   └── ConfigFileModal.tsx  (single component)
│   └── project/
│       ├── ProjectHeader.tsx
│       ├── ProjectTabs.tsx
│       └── ConfigFilesTab.tsx
├── pages/
│   ├── Projects.tsx             (page component)
│   ├── ProjectDetail.tsx        (page component)
│   └── index.ts                 (exports)
├── services/                    (optional, if feature-specific)
│   └── projectService.ts
├── hooks/                       (optional, if feature-specific)
│   └── useProjectData.ts
└── types/                       (optional, if feature-specific)
    └── project.ts
```

### 5. Code Organization Principles

**Single Responsibility Principle:**

```typescript
// Good: Each component has one job
const UserAvatar = ({ user }) => <img src={user.avatar} />;
const UserInfo = ({ user }) => <div>{user.name}</div>;
const UserCard = ({ user }) => (
  <>
    <UserAvatar user={user} />
    <UserInfo user={user} />
  </>
);

// Bad: Mixing concerns
const UserCard = ({ user, onEdit, onDelete, onShare, onArchive }) => {
  // 50+ lines of mixed logic
};
```

**Reusability First:**

```typescript
// Good: Extract reusable logic
const useAsync = (asyncFunction) => {
  const [status, setStatus] = useState('pending');
  const [data, setData] = useState(null);

  useEffect(() => {
    asyncFunction().then(setData);
  }, []);

  return { status, data };
};

// Use it anywhere
const { status, data } = useAsync(() => fetchUsers());
```

### 6. Import Organization

Keep imports organized and minimal:

```typescript
// 1. External libraries (React, npm packages)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Project packages
import { useTranslation, useTheme } from '@nthucscc/utils';
import { Button } from '@nthucscc/ui';

// 3. Core project imports (starting with @/)
import { getProjects } from '@/core/services/projectService';
import { Project } from '@/core/interfaces/project';

// 4. Shared imports (relative)
import { SomeComponent } from '@/shared/components';

// 5. Local relative imports (last)
import ChildComponent from './ChildComponent';
import { helper } from '../utils/helpers';

// 6. CSS imports (last)
import './styles.css';
```

## Step-by-Step Refactoring Guide

### Step 1: Analyze Current File

- [ ] Count total lines (excluding blanks)
- [ ] Identify distinct responsibilities
- [ ] List methods and components

### Step 2: Plan Extraction

- [ ] Decide split strategy (hooks, sub-components, services)
- [ ] Create new file structure
- [ ] Plan imports and exports

### Step 3: Extract Code

- [ ] Create new files with extracted code
- [ ] Update imports in original file
- [ ] Test that everything still works

### Step 4: Clean Up

- [ ] Remove old code
- [ ] Update file exports (index.ts)
- [ ] Update documentation

### Step 5: Verify

- [ ] All imports resolve correctly
- [ ] No circular dependencies
- [ ] All tests pass
- [ ] File is now under 200 lines

## Common Refactoring Patterns

### Pattern 1: Extract Render Logic

```typescript
// BEFORE: 250+ lines
const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => { /* load projects */ }, []);

  return (
    <div>
      <div className="grid">
        {projects.map(p => (
          <div key={p.id}>{/* 50 lines of JSX */}</div>
        ))}
      </div>
    </div>
  );
};

// AFTER: Split into 2 files under 200 lines each
// components/ProjectCard.tsx
const ProjectCard = ({ project }) => (
  <div>{/* 30 lines of JSX */}</div>
);

// components/Dashboard.tsx
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => { /* load */ }, []);
  return (
    <div className="grid">
      {projects.map(p => <ProjectCard key={p.id} project={p} />)}
    </div>
  );
};
```

## Validation Checklist

- [ ] All files are under 200 lines (excluding blank lines)
- [ ] Each file has a single primary responsibility
- [ ] Imports are organized correctly
- [ ] No circular dependencies exist
- [ ] Components follow the standard structure pattern
- [ ] Reusable logic is extracted to hooks or services
- [ ] CSS is separated from logic
- [ ] All exports are documented
- [ ] Code passes linting checks
- [ ] Tests are updated for refactored code

## Files to Check

1. Run the analysis script to identify violations:
   - See [check-line-count.js](./check-line-count.js)
2. Files to prioritize refactoring:
   - src/features/\*_/pages/_.tsx
   - src/features/**/components/**/\*.tsx
   - src/core/services/\*.ts

## Related Resources

- [React Component Best Practices](https://react.dev/learn)
- [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
- [Custom Hooks Patterns](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [File Naming Conventions](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)
