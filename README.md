# HireSmart – Diverse Team Selection (React + Next.js + Tailwind)

HireSmart is a recruiting assistant that helps hiring managers quickly build a balanced team of 5 candidates from a large applicant pool (900+). It focuses on skills coverage, diversity, and complementary experience — with fast filtering, smart scoring, role coverage, and a polished Finalize experience.


## ✨ Core Capabilities

- Smart candidate scoring (0–100) that considers:
  - Skills relevance (+40)
  - Experience (+30)
  - Diversity across gender and location (+20)
  - Unique-skill bonus vs current selection (+10)
- Large-pool friendly filters and search
  - Search by name
  - Filter by skills, gender, location, and experience range
  - Skills and Locations include live search with instant results
  - Sorting: by Score, Experience (asc/desc), and #Skills (asc/desc)
- Candidate experience
  - Rich, detailed profile modal (work experience, education, skills, salary expectations, availability)
  - Bookmark candidates before selection
  - Compare up to 3 candidates side-by-side
  - Inline score and inferred primary role shown on every card
- Finalize Team page
  - Dynamic summary: gender breakdown, locations, experience range, roles covered
  - Skills Coverage (unique skills across the team)
  - Diversity and Role Coverage cards (what’s covered, what’s missing)
  - AI justification paragraph and one-click Export to PDF/Print


## 🧠 Scoring & Role Inference (lib/scoring.ts)

- `computeCandidateScore(candidate, selectedTeam)`
  - Skills Relevance: proportion of required skills (default: React, Node.js, TypeScript, Python, AWS, Docker, Figma, Kubernetes) mapped to 0–40.
  - Experience: normalized 0–10 years → 0–30 points.
  - Diversity: +10 if candidate adds a new gender to the team, +10 if adds a new location.
  - Unique Skill Bonus: +10 if the candidate brings a skill not yet represented in the selected team.
- `inferPrimaryRole(skills)` maps skills to one of: Frontend, Backend, Designer, DevOps, Product Manager.
- `summarizeSkills(candidates)` and `summarizeRoles(candidates)` power coverage visualizations.


## 🧭 Project Structure

```
app/
  layout.tsx              # App shell + ThemeProvider
  page.tsx                # Home: filters, sorting, listing, compare modal wiring
  finalize/page.tsx       # Finalize Team: analysis, coverage, export
components/
  candidate-card.tsx      # Card with score, role, actions, detail modal
  compare-modal.tsx       # Side-by-side comparison (≤3 candidates)
  filters-sidebar.tsx     # Filters + searchable skills/locations + preview
  header.tsx              # Top bar with selected counter and theme toggle
  selection-stats.tsx     # Live stats on selection progress
  theme-provider.tsx      # next-themes wrapper with SSR-safe mount
  ui/*                    # Shadcn/Radix UI primitives (cards, inputs, dialog, etc.)
data/
  candidates.ts           # Maps form-submissions.json → Candidate[] and utilities
hooks/
  use-team-selection.ts   # Selection, bookmarks, persistence, stats
lib/
  scoring.ts              # Role inference and scoring helpers
public/
  placeholder-*           # Placeholder assets
styles/
  globals.css             # Tailwind base styles
types/
  candidate.ts            # Candidate and filter types
```


## 🚀 Getting Started

Prerequisites:
- Node.js 18+ (or 20+ recommended)
- pnpm or npm or yarn (project includes both pnpm-lock.yaml and package-lock.json; use one)

Install & run (pnpm shown; you can use npm/yarn):
```bash
pnpm install
pnpm dev
# http://localhost:3000
```

Build & start:
```bash
pnpm build
pnpm start
```

Lint (optional):
```bash
pnpm lint
```


## 🔎 Using the App

1. Browse candidates
   - Use the left sidebar to filter by skills, gender, location, and experience range.
   - Search within skills and locations using the built-in search boxes.
   - Sort results by Score, Experience, or #Skills.

2. Shortlist and compare
   - Click Select to add a candidate to the team (max 5).
   - Use ★ to bookmark candidates (stored locally).
   - Use ⇄ to add up to 3 candidates to the Compare modal.
   - Click a card to open a detailed profile modal.

3. Finalize the team
   - Once 5 are selected, click Finalize Team (header button).
   - Review gender/location diversity, experience range, skills coverage, and role coverage.
   - Read the AI justification and export to PDF/print.


## 🧩 Data & Types

- The app consumes `form-submissions.json` and maps each entry into the internal `Candidate` type in `data/candidates.ts`.
- We retain rich fields (education, work experience, salary expectations, availability) and surface them in the detail modal.


## 🛡️ SSR & Hydration

- The app uses `next-themes` with an SSR-safe `ThemeProvider` to avoid hydration mismatches.
- The theme only mounts on the client to ensure the `<html class="dark">` attributes stay consistent.


## ⚡ Performance Notes

- Filtering uses `useDeferredValue` to keep typing smooth with large lists.
- Skills/Locations search runs client-side; lists are virtual-light but capped in height with scrolling.
- Scoring is memoized per visible candidate and computed against the current selection state.


## ♿ Accessibility

- Keyboard navigation and focus states derive from Radix primitives.
- Badges and icons include text alternatives; modals use accessible Dialog patterns.


## 🗺️ Roadmap Ideas

- Server-backed persistence (user accounts, saved shortlists)
- Advanced analytics (overlap warnings, compensation bands)
- Custom scoring weights and role taxonomy editor
- Branded PDF export (jsPDF/React-PDF with print-specific layout)
- Virtualized candidate grid for extremely large datasets


## 🧪 Scripts

- `pnpm dev` – run the development server
- `pnpm build` – production build
- `pnpm start` – start production server
- `pnpm lint` – run Next.js lint


## 📄 License

This project is provided for hiring assessment/demo purposes. Adapt freely for internal evaluation.