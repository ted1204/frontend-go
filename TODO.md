# Frontend TODO

Overview: consolidate API call logic, ensure config centralization, support cookie and header auth, and replace direct fetch usage with `fetchWithAuth`.

1. Config

- [x] Review `src/core/config/config.ts` for needed env keys (VITE_API_BASE_URL, VITE_API_KEY, VITE_BASE_URL).
- [ ] Ensure build pipeline exposes `VITE_API_KEY` only for trusted builds. Add docs on secure usage.
- [ ] For k8s dev, set `VITE_USE_K8S_SVC=true` to default `API_BASE_URL` to `http://backend:30080` so the frontend talks to the backend service DNS within the cluster.

2. API helpers

- [x] Centralize API key read to `src/core/config/config.ts`.
- [x] Ensure `fetchWithAuth` injects headers and sets `credentials: 'include'`.
- [ ] Add unit tests for `fetchWithAuth` covering: API key present, token present, cookie-only auth, network error, 204 handling.

3. Replace direct fetch usage

- [ ] Find all `fetch(` calls and ensure they use `fetchWithAuth` unless intentionally unauthenticated.
- [ ] For public endpoints (e.g., login/register), explicitly pass `{ credentials: 'include' }` when relying on cookie auth.

4. Token & cookie handling

- [ ] Audit login flow: if backend sets `token` cookie, confirm frontend does not expose token unnecessarily to JS (prefer cookie-only flow).
- [ ] If storing token in `localStorage` for Authorization header, ensure it stays in sync with cookie behavior; avoid double-sending both header and cookie for same request when not needed.

5. Docs

- [x] Added API Key Integration section in `.github/skills/README.md`.
- [ ] Add `src/core/config/README.md` documenting env variables and recommended secrets handling.

6. Build & Test

- [ ] Run `npm run type-check` and `npm run lint`, fix any type/lint issues.
- [ ] Run `npm run build` and smoke-test key flows (login, fetch protected resource).

Notes:

- Prefer server-set `HttpOnly` cookies for web sessions; only use `Authorization` header for API-to-service calls or when cookieless flows are required.
