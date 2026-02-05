---
name: frontend-production-readiness
description: Ensure frontend changes meet production readiness with reliable build checks, error handling, performance, accessibility, and secure configuration practices.
---

# Frontend Production Readiness Skill

## Purpose

This skill ensures frontend changes are safe, stable, and production-ready. It focuses on validation, error handling, performance, accessibility, and secure configuration, while maintaining clean, reusable code.

## When to Use

- Before merging features to main
- After refactors that affect routing, data fetching, or state
- When adding new pages, storage workflows, or permissions
- When integrating APIs or feature flags
- When fixing regressions or UI errors

## Content Rules

- Do not use emoji in code, logs, or documentation.
- Do not use Chinese characters in code or documentation.
- Chinese is allowed only in UI display strings under `packages/utils/src/i18n/locales/zh/`.
- Keep comments minimal and in English.

## Production Readiness Checklist

### 1. Build and Type Safety

- [ ] Run TypeScript build and ensure no errors.
- [ ] Resolve all type mismatches and unused imports.
- [ ] Avoid `any` unless strictly necessary.

### 2. Error Handling

- [ ] Handle API failures with user-friendly error states.
- [ ] Avoid silent failures in async flows.
- [ ] Use loading states to prevent duplicate actions.

### 3. Performance and UX

- [ ] Avoid unnecessary re-renders (memoize or split components).
- [ ] Keep component files under 200 lines using extraction patterns.
- [ ] Ensure empty and loading states are consistent.

### 4. Accessibility

- [ ] All buttons have clear labels or aria attributes.
- [ ] Color contrast remains readable in dark and light themes.
- [ ] Modals trap focus and are keyboard accessible.

### 5. Security and Configuration

- [ ] Never hardcode secrets or tokens.
- [ ] Use environment-based config for URLs.
- [ ] Validate user permissions on UI actions.

### 6. Reusability and Clean Code

- [ ] Extract shared UI into reusable components.
- [ ] Extract data logic into hooks or services.
- [ ] Keep consistent naming and file structure.

## Validation Guidance

- Use linting and build checks before marking a change complete.
- Re-run checks after refactors that move logic into hooks or services.
- Verify permission-dependent UI from both admin and non-admin views.

## Recommended File Structure

```
src/features/<feature>/
  components/
  hooks/
  services/
  pages/
```

## Example Pattern

```tsx
// Use a hook for data
const { data, loading, error } = useFeatureData();

if (loading) return <LoadingState />;
if (error) return <ErrorState message={error} />;

return <FeatureView data={data} />;
```
