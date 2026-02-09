// Single-source `fetchWithAuth` implementation lives in `src/pkg/utils/api.ts`.
// Keep this module as a thin re-export so code importing from
// `@/shared/utils/api` continues to work while avoiding duplicate logic.
export * from '@/pkg/utils/api';
