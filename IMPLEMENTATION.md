# CampusCode Merge Implementation Plan (`campuscode copy`)

> **Target Workspace:** `/Users/anushikakapoor/Documents/campuscode copy`  
> **Reference Theme & Animation Source:** `/Users/anushikakapoor/Documents/campus-code`  
> **Skills Applied:** `frontend-developer`, `ui-ux-designer`, `tailwind-shadcn-architect`

---

## 1. Objective & Scope

Merge the functional elements, interactive demo, authentication flows, and dashboard content layout from **`campuscode copy`** with the **Console Graphite UI theme, JetBrains Mono typography, design tokens, and Three.js / micro-interaction animation style** from **`campus-code`**—all inside **`campuscode copy`**.

### Key Architectural Decisions
1. **Exactly Two Pages (via `react-router-dom`):**
   - `/` — **Landing Page** (`Landing.tsx`): Retains `campuscode copy`'s content sections (`Navbar`, `HeroSection`, `CampusCodePipeline`, `Features`, `FAQ`, `Footer`) plus `DemoModal`, `AuthModal`, and `GithubAuthModal`, restyled into `campus-code`'s Console Graphite dark UI theme and enhanced with `campus-code`'s Three.js `RainbowPrismWave` hero shader, `StaticDotGrid` backdrop, and `cubic-bezier(0.16, 1, 0.3, 1)` motion language.
   - `/dashboard` — **Dashboard Page** (`Dashboard.tsx` / `Scorecard.tsx` route): Follows `campuscode copy`'s dashboard/ingestion/scorecard content layout (`AnalyzeBar`, `ActiveTask`, `ProgressSteps`, `ConsoleLogs`, `NotificationNotice`, `ProjectCard`, `ProfileHeader`, `SkillsRadar`, `AIFindingCard`, `ArchitectureGraph`) styled 100% in `campus-code`'s Console Graphite UI theme.
2. **All edits strictly inside `campuscode copy`:** `/Users/anushikakapoor/Documents/campus-code` remains untouched as the read-only reference.
3. **Auth-Gated Dashboard & Demo Navigation Flow:**
   - Unauthenticated users can explore `/` and `DemoModal`, or sign in via `AuthModal` (Email / Demo Fill `demo@campuscode.ai` / Sign Up) or `GithubAuthModal` (`@octodev` or custom handle).
   - **Dashboard (`/dashboard`) opens after sign-in:** Completing `login`, `signup`, or `loginWithGithub` automatically navigates the user to `/dashboard`.
   - Direct navigation to `/dashboard` while signed out redirects to `/` and opens `AuthModal` (with a toast prompt to sign in).
   - Once signed in, clicking **"Dashboard"** in `Navbar` / user dropdown or **"Open Dashboard"** in `HeroSection` navigates to `/dashboard`.

---

## 2. Current-State Inventory

### Reference (`campus-code`)
- **Theme & Tokens:** `src/styles/tokens.css`, `src/styles/base.css`, `src/app/globals.css`
  - Surfaces: `--color-ground` (`oklch(17% 0.008 250)`), `--color-surface` (`oklch(21% 0.009 250)`), `--color-source` (`oklch(13.5% 0.007 250)`)
  - Text: `--color-ink`, `--color-ink-soft`, `--color-muted`
  - Borders: `--color-rule`, `--color-rule-strong`
  - Accents: `--color-recruiter` (amber/gold primary CTA), `--color-instrument` (cool cyan/blue), `--color-ok` (emerald), `--color-warning`
  - Font: `JetBrains Mono` (`@fontsource/jetbrains-mono`), tight negative display tracking (`-0.07em` / `-0.065em`), `tabular-nums slashed-zero` for metrics
  - Utility classes: `.cc-shell`, `.cc-container`, `.cc-section`, `.cc-section--band`, `.cc-panel`, `.cc-source`, `.cc-seamed`, `.cc-button`, `.cc-button--primary`, `.cc-button--quiet`, `.cc-input`, `.cc-link`
- **Animations:**
  - `src/components/ui/rainbow-prism-wave.tsx` (Three.js WebGL chromatic-aberration sine wave shader with `prefers-reduced-motion` guard)
  - `src/components/ui/static-dot-grid.tsx` (fixed subtle radial dot grid background)
  - Smooth transitions (`--dur-short: 160ms`, `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`)

### Target (`campuscode copy`)
- **Active Modules:**
  - Contexts: `src/context/AuthContext.tsx`, `src/context/useAuth.ts`, `src/context/ToastContext.tsx`, `src/context/useToast.ts`, `src/types/auth.ts`
  - Modals: `src/components/demo/DemoModal.tsx`, `src/components/auth/AuthModal.tsx`, `src/components/auth/GithubAuthModal.tsx`
  - Landing: `src/pages/Landing.tsx`, `src/components/landing/{Navbar,HeroSection,Features,FAQ,Footer}.tsx`, `src/components/landing/pipeline/{CampusCodePipeline,RepositoryView,KnowledgeGraph,EvidenceView}.tsx`
- **Empty (0-byte) Scaffolded Dashboard Modules (to be implemented):**
  - `src/pages/Scorecard.tsx` (or `src/pages/Dashboard.tsx` + re-export)
  - `src/components/dashboard/{AnalyzeBar,ActiveTask,ProjectCard}.tsx`
  - `src/components/ingestion/{ProgressSteps,ConsoleLogs,NotificationNotice}.tsx`
  - `src/components/scorecard/{ProfileHeader,SkillsRadar,AIFindingCard,ArchitectureGraph}.tsx`

---

## 3. Rollback & Safety Strategy

> **Important:** `campuscode copy` currently does **not** have a `.git` repository (`dist/` and `node_modules/` exist, no `.git` folder).

Before touching any source file:
1. **Phase 0 Baseline Snapshot:**
   - Initialize Git inside `/Users/anushikakapoor/Documents/campuscode copy` (`git init`).
   - Ensure `node_modules/` and `dist/` are in `.gitignore`.
   - Create an initial commit + tag `baseline-pre-merge` (`git commit -m "chore: baseline snapshot of campuscode copy before merge"` and `git tag baseline-pre-merge`).
2. **Per-Phase Commits:**
   - Commit after every completed phase (`phase-1-theme-deps`, `phase-2-auth-demo`, `phase-3-landing`, `phase-4-dashboard`, `phase-5-polish`).
3. **Instant Rollback Commands:**
   - Roll back a single broken file: `git checkout -- <path>`
   - Roll back to previous phase: `git reset --hard <phase-commit>`
   - Full reset to original untouched state: `git reset --hard baseline-pre-merge`

---

## 4. Phased Implementation Plan

### Phase 0 — Git Baseline & Dependencies
- [x] Initialize `.git` in `campuscode copy`, verify `.gitignore` excludes `node_modules` and `dist`, create `baseline-pre-merge` commit & tag.
- [x] Install required packages in `campuscode copy`:
  - `react-router-dom` (routing between `/` and `/dashboard`)
  - `three` + `@types/three` (for `RainbowPrismWave` Three.js shader)
  - `@fontsource/jetbrains-mono` (consistent JetBrains Mono typography)
  - `clsx` + `tailwind-merge` (clean `cn()` utility per `tailwind-shadcn-architect` skill)
- [x] Copy `logo.png` / `logo.svg` from `campus-code/public/assets/` to `campuscode copy/public/assets/` and update `index.html` (`class="dark"`, `#000000` theme-color, title, favicon).
- **Checkpoint:** `npm run build` passes on baseline + deps.

---

### Phase 1 — Design Tokens, Theme & Shared Animation Primitives
- [x] Add `src/styles/tokens.css` and `src/styles/base.css` (from `campus-code`), defining Console Graphite OKLCH tokens, `.cc-*` layout/surface/typography classes, focus-visible rings, and `prefers-reduced-motion` support.
- [x] Update `src/index.css` to import `tokens.css`, `base.css`, `@import "tailwindcss";`, and keep keyframe animations (`modalSlideUp`, `toastIn`, `fadeIn`, `drawPath`, `popIn`, `pulseRing`, `breathe`) tuned to `--ease-out`.
- [x] Update `src/main.tsx` to import `@fontsource/jetbrains-mono/latin-{400,500,600}.css`.
- [x] Create `src/lib/utils.ts` (`cn` helper) and `src/lib/mockProjects.ts` + `src/lib/types.ts` (combining `campuscode copy`'s `spring-boot-ecommerce` / `MultiThreaded Queue` / `campus-store` datasets with line-level citations and graph nodes).
- [x] Port animation background components into `src/components/ui/`:
  - `src/components/ui/RainbowPrismWave.tsx`
  - `src/components/ui/StaticDotGrid.tsx`
- **Checkpoint:** Tokens & shaders compile cleanly with `npm run build`.

---

### Phase 2 — Routing, Toast, Auth & Interactive Demo (Console Graphite Theme)
- [x] Configure `src/App.tsx` with `BrowserRouter` and **2 routes**:
  - `/` → `Landing`
  - `/dashboard` → **Auth-protected `Dashboard` (`Scorecard`)**: redirects unauthenticated visitors to `/` and opens `AuthModal` (with a toast prompt).
  - `*` fallback → redirects or links cleanly back to `/`
- [x] Restyle `ToastContext.tsx` to Console Graphite (`--color-surface`, `--color-rule-strong`, `--color-ok`, `--color-warning`, `--color-instrument`, JetBrains Mono).
- [x] Restyle `AuthModal.tsx` & `GithubAuthModal.tsx`:
  - Preserve **all** functionality: Sign In / Create Account tabs, GitHub OAuth button, Demo Fill (`demo@campuscode.ai` / `password123`), password visibility toggles, password strength bar, terms checkbox, GitHub handle input + live avatar preview, ESC-to-close, `aria-modal`.
  - Apply Console Graphite surfaces (`--color-surface`, `--color-source`, `--color-rule`, `.cc-input`, `.cc-button--primary`, `--color-recruiter`, `--color-instrument`, `--color-ok`).
  - **Post-login navigation:** Completing `login`, `signup`, or `loginWithGithub` automatically navigates to `/dashboard`.
- [x] Restyle `DemoModal.tsx`:
  - Preserve **all** 3 auto-playing walkthrough steps (`01 Ingestion`, `02 Graph AI`, `03 Verified Proof`), Play/Pause, progress bars, Visual/Proof tabs, interactive SVG graph, line proof badge, keyboard arrow/ESC navigation, and **"Try With Your Repo (Free)"** action.
  - Apply Console Graphite theme + `campus-code` token colors (`--color-ground`, `--color-surface`, `--color-source`, `--color-instrument`, `--color-ok`, `--color-recruiter`).
- **Checkpoint:** `npm run build` + verified modal & auth routing logic.

---

### Phase 3 — Landing Page (`/`) Merge & Animation Alignment
- [x] `Navbar.tsx` (sticky Console Graphite header):
  - Links: `How it works` (`#how-it-works`), `Features` (`#features`), `FAQ` (`#faq`), `Interactive Demo` button, **`Dashboard`** link (`/dashboard` when signed in).
  - Auth controls: `Sign In`, `Sign Up`, `Sign in with GitHub`, or authenticated user pill + dropdown (with `Open Dashboard`, `View Demo Tour`, `Sign Out`) and responsive mobile drawer.
- [x] `HeroSection.tsx`:
  - Full-bleed hero wrapper matching `campus-code`'s animation style: `RainbowPrismWave` WebGL canvas (`opacity-55`) + `StaticDotGrid` + subtle gradient/ground veil.
  - Preserves `campuscode copy`'s content & elements: status badge (`100% Local Graph AI Evaluation`), headline (`Resumes lie. Code doesn't.`), CTA buttons (`Sign in with GitHub` / `Open Dashboard` when signed in + `View a Demo`), and the interactive **Sample Scorecard Preview** card (toggleable between `Spring Boot Store` and `MultiThreaded Queue`, showing `ScoreBar` + `AIFindingCard` code excerpt) in Console Graphite styling.
- [x] `CampusCodePipeline.tsx` + `RepositoryView.tsx`, `KnowledgeGraph.tsx`, `EvidenceView.tsx`:
  - Restyle into `.cc-section--band`, `.cc-panel`, `.cc-source`, using `--color-instrument` / `--color-ok` / `--color-recruiter` accents.
- [x] `Features.tsx`:
  - Keep the interactive SVG node-hub diagram (`CampusCode Orchestrator` center node, 6 detection/trust cards, animated `drawPath` & `animateMotion` glowing paths, hover popups) adapted to Console Graphite (`--color-surface`, `--color-source`, `--color-rule`, `--color-instrument`, `--color-ok`) + responsive mobile fallback grid (`lg:hidden`).
- [x] `FAQ.tsx` & `Footer.tsx`:
  - Restyle FAQ accordion and Footer in Console Graphite (`--color-source`, `--color-surface`, `--color-rule`, `.cc-link`, `.cc-button`).
- **Checkpoint:** `/` builds cleanly with WebGL wave + interactive Demo + Auth modals.

---

### Phase 4 — Dashboard Page (`/dashboard`) Build (Layout from `campuscode copy`, Theme from `campus-code`)
Populated all 0-byte dashboard/ingestion/scorecard files in `campuscode copy` into a cohesive, interactive Engineering Dashboard:

1. [x] **`src/components/dashboard/AnalyzeBar.tsx`**
2. [x] **`src/components/ingestion/` (`ProgressSteps.tsx`, `ConsoleLogs.tsx`, `NotificationNotice.tsx`) & `src/components/dashboard/ActiveTask.tsx`**
3. [x] **`src/components/dashboard/ProjectCard.tsx`**
4. [x] **`src/components/scorecard/ProfileHeader.tsx`**
5. [x] **`src/components/scorecard/SkillsRadar.tsx`**
6. [x] **`src/components/scorecard/AIFindingCard.tsx`**
7. [x] **`src/components/scorecard/ArchitectureGraph.tsx`**
8. [x] **`src/pages/Scorecard.tsx` (Dashboard Page)**

---

### Phase 5 — Verification, Linting & Accessibility Audit
- [x] Run `npm run build` (`tsc -b && vite build`) — zero TypeScript or Vite bundle errors.
- [x] Run `npm run lint` (`eslint .`) — zero lint errors.
- [x] Code-level accessibility & reduced-motion support implemented (`focus-visible` rings, `Escape` handlers, `aria-modal` / `aria-expanded`, `prefers-reduced-motion` guard in `base.css` and `RainbowPrismWave.tsx`, mobile responsive `Features` grid).
- [x] Final Git commit & `phase-5-verified` tag so rollback points remain clean.
