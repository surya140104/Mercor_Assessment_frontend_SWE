# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository overview
- Stack: Next.js (App Router) with React, TypeScript, Tailwind CSS v4, PostCSS
- Package manager: pnpm (pnpm-lock.yaml present)
- Deployment/docs: Repo is synced from v0.app and deployed on Vercel (see README.md)

Common commands
- Install dependencies
```bash path=null start=null
pnpm install
```
- Run local dev server
```bash path=null start=null
pnpm dev
```
- Build production bundle
```bash path=null start=null
pnpm build
```
- Start production server (after build)
```bash path=null start=null
pnpm start
```
- Lint (Next.js ESLint)
```bash path=null start=null
pnpm lint
```
Notes
- next.config.mjs sets eslint.ignoreDuringBuilds and typescript.ignoreBuildErrors to true. Builds will not fail on ESLint or TypeScript errors; run pnpm lint locally to surface issues.
- No test framework is configured in this repo. There are no test scripts or configs, so “run tests” or “run a single test” is not applicable.

High‑level architecture
- Routing and pages (Next.js App Router)
  - app/page.tsx: Main selection UI. Client component that renders filters, candidate grid, and selection stats. Uses a custom hook for selection state and next/navigation for routing.
  - app/finalize/page.tsx: Finalization/summary view. Client component that reads the selected team from localStorage, generates diversity/skills analysis, and offers Share/Export actions. Redirects to "/" if no valid team.
  - app/layout.tsx: Root layout applies fonts and wraps children in a ThemeProvider. Global styles imported via app/globals.css.

- State and data flow
  - hooks/use-team-selection.ts: Centralized selection state with persistence in localStorage under key "hiresmart-selected-team". Enforces MAX_TEAM_SIZE=5 and exposes helpers: add/remove, clear, canFinalize, isSelected/isDisabled, and getSelectionStats (gender/skills/location/experience).
  - app/page.tsx controls filters via local state; candidate list is derived from mock data with memoized filtering.
  - app/finalize/page.tsx re-derives a more detailed analysis (categorizes skills, gender breakdown, experience range, locations) for presentation and export.

- UI system and styling
  - Tailwind CSS v4 via PostCSS plugin (@tailwindcss/postcss) configured in postcss.config.mjs; no separate tailwind.config.* file is used. Global design tokens and color/radius variables defined in app/globals.css using CSS custom properties and @theme.
  - Component primitives under components/ui (Button, Card, Badge, etc.) follow a shadcn/ui-like pattern using class-variance-authority and a cn() utility (lib/utils.ts) for class merging.
  - Theme toggling provided by next-themes via components/theme-provider.tsx; Header includes a light/dark toggle. Fonts from geist are applied in layout.tsx.

- Data, types, and utilities
  - data/candidates.ts: In-repo mock dataset used for filtering/selection. Also provides helpers getAllSkills, getAllLocations, getExperienceRange used by FiltersSidebar and initial state.
  - types/candidate.ts: Core domain types (Candidate, TeamSelection, FilterState).
  - lib/utils.ts: cn helper for className merging.

- Notable implementation details and gotchas
  - Selection limit is exactly 5. Header shows a “Finalize Team” CTA only at 5; finalize page also validates the count and redirects otherwise.
  - LocalStorage is the single source of truth between pages; clearing it during development will reset selection. All selection logic is client-side.
  - Images are configured as unoptimized in next.config.mjs (images.unoptimized = true), which can affect Next Image behavior and performance trade-offs.
  - Path alias @/* maps to project root (tsconfig.json). Import modules accordingly.

External sync and deployment
- README.md indicates this repository mirrors changes deployed from v0.app and is deployed on Vercel. If you are making local changes while also iterating in v0.app, be aware that updates from v0.app can push into this repo; plan your workflow (branches/merges) accordingly.

