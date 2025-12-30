import en from './locales/en';
import zh from './locales/zh';

// Define the resource map
const resources = { en, zh };

/**
 * Recursive type helper to convert nested objects into dot-notation paths.
 * Example: { project: { create: { title: '...' } } } -> 'project.create.title'
 */
type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? (T[K] extends string ? K : `${K}.${Path<T[K]>}`) : never;
    }[keyof T]
  : never;

// Automatically derive all valid keys from the English source file
export type LocaleKey = Path<typeof en>;

/**
 * Helper function to resolve a dot-notation path in a nested object.
 * @param obj The translation object (e.g., en or zh)
 * @param path The dot-notation string (e.g., 'project.create.title')
 * @returns The translated string or undefined if not found
 */
const resolvePath = (obj: unknown, path: string): string | undefined => {
  if (typeof obj !== 'object' || obj === null) return undefined;
  const parts = path.split('.');
  let acc: unknown = obj;
  for (const part of parts) {
    if (typeof acc !== 'object' || acc === null) return undefined;
    acc = (acc as Record<string, unknown>)[part];
    if (acc === undefined) return undefined;
  }
  return typeof acc === 'string' ? acc : undefined;
};

/**
 * Main translation function.
 * @param lang Target language code ('zh' | 'en')
 * @param key The strong-typed key path
 * @param vars Optional variables for interpolation (e.g., { name: 'John' })
 */
export const t = (
  lang: 'zh' | 'en',
  key: LocaleKey,
  vars?: Record<string, string | number>,
): string => {
  // 1. Get the dictionary for the requested language, default to English if missing
  const dictionary = resources[lang] ?? resources.en;

  // 2. Resolve the value from the nested object
  let text = resolvePath(dictionary, key);

  // 3. Fallback mechanism: If translation is missing in the target language, use English
  if (!text) {
    console.warn(`[i18n] Missing translation for key: "${key}" in language: "${lang}"`);
    text = resolvePath(resources.en, key);
  }

  // 4. Last resort: Return the key itself if even English is missing
  if (!text) return key;

  // 5. Handle variable interpolation (e.g., "Hello {name}" -> "Hello World")
  if (vars) {
    return Object.keys(vars).reduce((acc, k) => {
      const value = String(vars[k]);
      // Use global regex to replace all occurrences of the variable
      return acc.replace(new RegExp(`{${k}}`, 'g'), value);
    }, text);
  }

  return text;
};

export default resources;
