# CLAUDE.md — Dimitris Meliopoulos Portfolio

Personal portfolio / CV website for Dimitris Meliopoulos (.NET Software Engineer, Thessaloniki, Greece).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 4 (static site) |
| UI components | React 18 islands (`client:load`) |
| Styling | Tailwind CSS 3 + CSS custom properties |
| Animations | Framer Motion 11 (CommandPalette), CSS keyframes + IntersectionObserver (rest) |
| Language | TypeScript |
| Dev server | `npm run dev` (Astro dev) |
| Build | `npm run build` |
| Preview | `npm run preview` |

---

## Project Structure

```
src/
  layouts/
    Layout.astro          # Root shell: fonts, CSS tokens, theme toggle, page loader,
                          # scroll-reveal IntersectionObserver, scroll-behavior deferred to load
  pages/
    index.astro           # Single page — composes all section components
  components/
    Nav.astro             # Sticky nav bar, section links, theme toggle, Ctrl+K hint
    Hero.astro            # Bento grid intro, dot-grid background, tilt cards, magnetic buttons
    About.astro           # Bio, stats counters, interests
    Experience.astro      # Timeline with draw animation (scaleY), staggered job cards
    Skills.astro          # Skill pill grid, staggered reveal
    Projects.astro        # Horizontal scroll track (native overflow-x + wheel→horizontal JS),
                          # custom 2px scrollbar indicator confined to max-w-6xl
    Contact.astro         # Clipboard copy email button with confirmation hint
    Footer.astro          # Simple footer
    CommandPalette.tsx    # Ctrl+K palette (Framer Motion), all site actions
    TypedText.tsx         # Typewriter effect, IntersectionObserver-gated
    LiveClock.tsx         # Live clock showing Thessaloniki local time
    ThemeToggle.tsx       # Dark/light toggle button

public/
  cv.pdf                  # CV file (replace to update)
  favicon.svg
```

---

## Design Tokens (CSS variables)

Defined in `Layout.astro` on `:root` (light) and `.dark`. Tailwind aliases map to these.

| Token | Tailwind class | Purpose |
|---|---|---|
| `--color-bg` | `bg-bg` | Page background |
| `--color-surface` | `bg-surface` | Card backgrounds |
| `--color-border` | `border-border` | Card/divider borders |
| `--color-text` | `text-text` | Primary text |
| `--color-muted` | `text-muted` | Secondary/dimmed text |
| `--color-accent` | `text-accent` | Teal highlight (`#5eead4` dark, `#0d9488` light) |

Dark mode is driven by a `.dark` class on `<html>`. Persisted to `localStorage` as `'theme'`.

---

## Key Patterns

### Scroll-reveal animation
Elements with class `reveal` start invisible (`opacity: 0, translateY: 16px`) and gain class `visible` when they enter the viewport (IntersectionObserver in `Layout.astro`). The transition is defined in global CSS.

### Staggered reveals
Wrap reveal children in a `stagger-container` div. CSS nth-child rules in `Layout.astro` add `transition-delay` of 0–700ms to up to 8 children.

### Timeline draw (Experience)
The vertical line (`#timeline-line`) uses `transform: scaleY(0)` → `scaleY(1)` with `transform-origin: top`. An IntersectionObserver in `Experience.astro` adds class `.drawn` when the section is visible.

### Hero dot grid
Absolute-positioned `div.hero-dot-grid` uses `radial-gradient` dot pattern with a `mask-image` radial fade and `@keyframes dot-drift` animating `background-position`.

### `scroll-behavior: smooth`
NOT set in CSS. Applied via JS after `window load` to prevent smooth scroll restoration on page reload (which caused TypedText to animate while off-screen).

### Projects horizontal scroll
`#h-scroll-track` uses native `overflow-x: auto` with all scrollbars hidden via CSS. A wheel event listener on the track converts vertical `deltaY` to horizontal scroll via a RAF lerp loop. `e.preventDefault()` is only called when `newTarget !== targetX` to avoid scroll-stuck at boundaries. A custom 2px scrollbar indicator (`#h-scrollbar-thumb`) is updated by `updateThumb()` on each scroll/tick.

### CommandPalette (Ctrl+K)
Built as a React island with Framer Motion. Categories: Navigate, External, Download, Clipboard, Appearance. Actions: scroll to section, open GitHub/LinkedIn, view CV (new tab), download CV (programmatic `<a download>`), copy email, toggle theme.

---

## Personal Details

| Field | Value |
|---|---|
| Name | Dimitris Meliopoulos |
| Email | dmeliopoulos95@gmail.com |
| Location | Thessaloniki, Greece |
| GitHub | https://github.com/Romylus95 |
| LinkedIn | https://www.linkedin.com/in/dimitris-meliopoulos-00107a168/ |
| Current role | .NET Software Engineer at Chubb (Sep 2023–Present) |
| Previous role | Software Engineer at Masoutis S.A. (Aug 2019–Aug 2023) |
| Site URL | https://dimitrismeliopoulos.dev |

---

## Deployment

| Item | Value |
|---|---|
| Domain | https://dmeliopoulos.dev |
| Registrar | Cloudflare |
| Hosting | Cloudflare Pages |
| GitHub repo | https://github.com/Romylus95/MyWebsite.git |
| Auto-deploy | Every push to `main` triggers a Cloudflare Pages build |

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — live on dmeliopoulos.dev |
| `feature/projects` | Projects section development (real projects replacing placeholder data) |

Workflow: develop on feature branches → merge to `main` via PR → Cloudflare auto-deploys.

---

## Changes Made

### About.astro
- Hobbies added to `Passions` code card: Basketball, Padel, Movies, Games, Trips
- `"Cloud & DevOps"` passion replaced with `"Performance Optimization"`
- Prose paragraph updated with real hobbies

### Hero.astro
- `"cloud infrastructure"` replaced with `"API & system design"` in main intro
- `"backend & cloud-native .NET development"` simplified to `"backend .NET development"` in stack card
- `TypeScript` removed from tech stack pills
- `SOAP APIs` added to tech stack pills
- Hero CTA buttons changed from `flex-wrap` to `flex-col sm:flex-row` — fixes misalignment on mobile (iPhone 11 Pro tested)

### Projects.astro (`main` branch)
- Replaced with "Coming Soon" placeholder — real projects pending
- Full original design (horizontal scroll, heatmap, cards) preserved on `feature/projects` branch

---

## Still To Do

- Add real project names, descriptions, and GitHub URLs in **Projects.astro** (work on `feature/projects`)
- Add a real photo to the name hover tooltip in **Hero.astro** (replace the `DM` avatar initials — see comment in `.name-avatar` CSS)

---

## CV

The CV file lives at `public/cv.pdf`. Replace the file to update it — the filename must stay `cv.pdf` or update all references in `Hero.astro`, `CommandPalette.tsx`, and `Nav.astro` (if applicable).
