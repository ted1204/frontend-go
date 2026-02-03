---
name: frontend-appearance-optimization
description: Optimize frontend UI/UX with dark/light theme support and internationalization (i18n). Ensures consistent theme switching with localStorage persistence, proper dark mode color schemes, and default Chinese language configuration for the AI platform.
---

# Frontend Appearance Optimization Skill

## Purpose

This skill helps optimize the frontend application's visual appearance and user experience by implementing proper theme management, dark/light mode support, and internationalization features. The AI platform supports both dark (default) and light themes with seamless switching and persisted preferences.

## When to Use

- Implementing theme switching functionality
- Optimizing dark mode color schemes for accessibility
- Setting default Chinese language configuration
- Ensuring theme persistence across sessions
- Improving UI consistency across components
- Updating color variables for light/dark modes

## Content Rules

- Do not use emoji in code, logs, or documentation.
- Do not use Chinese characters in code or documentation.
- Chinese is allowed only in UI display strings under `packages/utils/src/i18n/locales/zh/`.
- Keep comments minimal and in English.

## Step-by-Step Instructions

### 1. Theme Configuration

The application uses React Context for theme management. All theme-related code is centralized in the `src/core/context/` directory.

**Key Files:**

- `ThemeContext.tsx` - Theme provider and context definition
- `useTheme.ts` - Hook for consuming theme context
- `ThemeToggleButton.tsx` - UI component for theme switching

**Implementation Checklist:**

- [ ] Verify theme context is properly configured with 'dark' as default
- [ ] Ensure localStorage key is set to 'theme-preference'
- [ ] Confirm ThemeToggleButton is integrated in the header
- [ ] Validate dark mode classes use Tailwind's `dark:` prefix
- [ ] Test theme persistence on page reload

### 2. Dark/Light Mode Color Schemes

Use Tailwind CSS dark mode configuration with semantic color naming.

**Best Practices:**

```tsx
// Correct: Using dark: prefix
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// Avoid: Hardcoded colors
<div style={{backgroundColor: '#FFFFFF'}}>
```

**Color Palette Guidelines:**

- **Light Mode:**
  - Background: `bg-white`
  - Text: `text-gray-900`
  - Borders: `border-gray-200`
  - Accents: `bg-blue-50`

- **Dark Mode:**
  - Background: `dark:bg-gray-900`
  - Text: `dark:text-white`
  - Borders: `dark:border-gray-700`
  - Accents: `dark:bg-gray-800`

### 3. Internationalization (i18n) Setup

Language configuration is managed through the utils package with Chinese as default.

**Key Files:**

- `packages/utils/src/i18n/index.ts` - i18n configuration
- `packages/utils/src/i18n/locales/` - Translation files
- `packages/utils/src/hooks/useTranslation.ts` - Translation hook
- `src/core/context/LanguageContext.tsx` - Language context provider

**Default Language Configuration:**

```typescript
// In LanguageContext.tsx
const DEFAULT_LANGUAGE = 'zh'; // Chinese is default

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  zh: 'Chinese',
};
```

**Translation File Structure:**

```
packages/utils/src/i18n/locales/
├── en/
│   ├── navigation.ts
│   ├── pages.ts
│   ├── projects.ts
│   ├── forms.ts
│   ├── misc.ts
│   └── index.ts
└── zh/
    ├── navigation.ts
    ├── pages.ts
    ├── projects.ts
    ├── forms.ts
    ├── misc.ts
    └── index.ts
```

### 4. Component Integration

Every component must use the theme and translation hooks correctly.

**Required Imports:**

```typescript
import { useTheme } from '@nthucscc/utils';
import { useTranslation } from '@nthucscc/utils';

export function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useTranslation();

  return (
    <div className="dark:bg-gray-900">
      <button onClick={toggleTheme}>
        {t('misc.language.switchLabel')}
      </button>
    </div>
  );
}
```

## Expected Input/Output

### Input

- Component files that need theme support
- Text strings that require translation

### Output

- Components with proper `dark:` Tailwind classes
- All user-facing text using translation keys (t('key'))
- Theme and language preferences persisted in localStorage
- Consistent dark/light mode appearance across app

## Validation Checklist

- [ ] Theme toggle button appears in header
- [ ] Switching theme updates all component backgrounds
- [ ] Theme preference persists after page reload
- [ ] Default language is Chinese ('zh')
- [ ] All hardcoded text strings use translation keys
- [ ] No hardcoded colors in CSS/inline styles
- [ ] Dark mode contrast meets WCAG AA standards
- [ ] Language switcher works correctly
- [ ] LocalStorage contains 'theme-preference' and 'language' keys

## Common Issues & Solutions

### Issue: Theme not persisting

**Solution:** Ensure `localStorage` is properly set in `ThemeContext.tsx`:

```typescript
useEffect(() => {
  localStorage.setItem('theme-preference', theme);
}, [theme]);
```

### Issue: Dark mode not applying

**Solution:** Check `tailwind.config.js` has `darkMode: 'class'` configured

### Issue: Translation keys not working

**Solution:** Verify the key path matches the i18n file structure: `t('section.subsection.key')`

## Related Resources

- [Tailwind CSS Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode)
- [React Context API](https://react.dev/reference/react/useContext)
- [i18n Best Practices](https://www.i18next.com/)
- Project's LanguageContext.tsx implementation
- Project's ThemeContext.tsx implementation
