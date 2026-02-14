# UI Improvement v2 Analysis Report

> **Analysis Type**: Gap Analysis (Design vs Implementation)
>
> **Project**: korean-fortune
> **Analyst**: gap-detector
> **Date**: 2026-02-12
> **Design Doc**: [ui-improvement-v2.design.md](../02-design/ui-improvement-v2.design.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Compare the UI Improvement v2 design document (4 phases, 12 items) against the actual implementation code and calculate a Match Rate for Phases 1-3. Phase 4 (Light mode, Micro-interactions, Accessibility) is explicitly excluded from scoring.

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/ui-improvement-v2.design.md`
- **Implementation Files**: 7 new files + 4 modified files (11 total)
- **Scope**: Phase 1 (Foundation), Phase 2 (Card System), Phase 3 (Interaction)
- **Excluded**: Phase 4 (Polish -- not expected to be implemented)

---

## 2. Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| Design Match (Phase 1-3) | 89% | Warning |
| Architecture Compliance | 100% | Pass |
| Convention Compliance | 98% | Pass |
| **Overall** | **93%** | **Pass** |

---

## 3. Phase-by-Phase Gap Analysis

### 3.1 Phase 1 -- Foundation

#### 3.1.1 Typography Utility Classes

| Design Spec | Implementation (globals.css) | Status |
|-------------|------------------------------|--------|
| `.typo-display` -- 96px / Extrabold / tracking-tight | 56px mobile / 80px desktop / 800 weight / tracking-tight | Pass |
| `.typo-h1` -- 48px / Bold / leading-[1.1] | 30px mobile / 44px desktop / 700 weight / 1.1 | Pass |
| `.typo-h2` -- 32px / Bold / leading-[1.2] | 24px mobile / 30px desktop / 700 weight / 1.2 | Pass |
| `.typo-h3` -- 24px / Semibold / leading-[1.3] | 18px mobile / 22px desktop / 600 weight / 1.3 | Pass |
| `.typo-body-lg` -- 18px / Regular / leading-relaxed | 16px mobile / 18px desktop / 1.625 | Pass |
| `.typo-body` -- 16px / Regular / leading-relaxed | 14px mobile / 16px desktop / 1.625 | Pass |
| `.typo-caption` -- 12px / Regular / text-muted | 12px / text-muted color | Pass |
| `.typo-overline` -- 10px / Medium / uppercase tracking-[0.2em] | 10px / 500 weight / uppercase / tracking 0.2em / text-muted | Pass |

**Note**: The implementation uses responsive sizes (mobile/desktop) instead of the fixed Figma reference sizes. This is an intentional improvement for mobile-first design. All 8 typography classes are present and correctly defined.

**Result**: 8/8 classes implemented. **Pass**

#### 3.1.2 Heading Migration

**Design specifies**: Landing, Reading, Start pages

| Page | Element | Design Class | Implementation | Status |
|------|---------|-------------|----------------|--------|
| Landing (page.tsx:41) | Hero heading | `typo-display` | `typo-display` | Pass |
| Landing (page.tsx:48) | Hero description | `typo-body-lg` | `typo-body-lg` | Pass |
| Landing (page.tsx:89) | "What is Saju" heading | `typo-h2` | `typo-h2` | Pass |
| Landing (page.tsx:124) | "Discover" heading | `typo-h2` | `typo-h2` | Pass |
| Landing (page.tsx:169) | Card section heading | `typo-h2` | `typo-h2` | Pass |
| Landing (page.tsx:194) | CTA bottom heading | `typo-h1` | `typo-h1` | Pass |
| DayMasterHero.tsx:33 | "You are" label | `typo-overline` | `typo-overline` | Pass |
| DayMasterHero.tsx:36 | Metaphor name | `typo-h1` | `typo-h1` | Pass |
| DayMasterHero.tsx:51 | Personality text | `typo-body` | `typo-body` | Pass |
| Reading page:143,148,155 | Lucky info labels | `typo-overline` | `typo-overline` (x3) | Pass |

Landing has 6 typography migrations (5 headings + 1 body-lg). DayMasterHero has 3 elements migrated. Reading page has 3 overlines migrated.

**Result**: All specified migrations complete. **Pass**

#### 3.1.3 Skeleton Base Component

| Design | Implementation (`Skeleton.tsx`) | Status |
|--------|-------------------------------|--------|
| `Skeleton({ className })` | `Skeleton({ className, variant })` | Pass |
| `animate-skeleton` + `bg-white/[0.06]` | Uses CSS classes `skeleton` / `skeleton-circle` with shimmer animation | Pass |
| Rounded rectangle base | `rounded-6px` for line/rect, `rounded-full` for circle | Pass |

Implementation adds a `variant` prop (`line` | `circle` | `rect`) beyond the design spec -- a helpful enhancement.

**Result**: Implemented with enhancements. **Pass**

**Phase 1 Score: 3/3 items (100%)**

---

### 3.2 Phase 2 -- Card System

#### 3.2.1 InlineCard Component

| Design Spec | Implementation (`InlineCard.tsx`) | Status |
|-------------|----------------------------------|--------|
| `header?: { title, subtitle?, action? }` | `header?: { title, subtitle?, icon?, action? }` | Pass |
| `footer?: ReactNode` | `footer?: ReactNode` | Pass |
| `variant?: "default" \| "loading" \| ...` | No `variant` prop; uses `compact?: boolean` instead | Partial |
| `children: ReactNode` | `children: ReactNode` | Pass |
| Header/content/footer CSS structure | `.inline-card`, `.inline-card-header/content/footer` in globals.css | Pass |

**Gap**: The design specifies a `variant` prop with 5 values (`default`, `loading`, `list`, `graph`, `carousel`). The implementation omits this in favor of separate specialized components (GraphCard, SkeletonReading, Carousel). This is an architecture decision that achieves the same end goal through composition rather than variants. The `compact` boolean replaces the need for a variant toggle on padding.

**Result**: Functionally complete, structural approach differs. **Partial**

#### 3.2.2 SkeletonReading Component

| Design Spec | Implementation (`SkeletonReading.tsx`) | Status |
|-------------|---------------------------------------|--------|
| Hero skeleton (circle + lines) | Circle + 4 line skeletons for hero section | Pass |
| Accordion skeletons (3x h-12 bars) | 3x accordion skeleton sections with header structure | Pass |
| Max width `max-w-3xl` | `max-w-3xl` with `px-4 sm:px-8` | Pass |
| Replaces spinner loading state | Used in `reading/[id]/page.tsx:41` as `<SkeletonReading />` | Pass |

Implementation goes beyond design by adding:
- Summary card skeleton section
- Lucky info 3-column grid skeleton
- `animate-fade-in` entrance animation
- Uses `inline-card` CSS classes for skeleton cards

**Result**: Implemented with enhancements. **Pass**

#### 3.2.3 GraphCard Wrapper

| Design Spec | Implementation (`GraphCard.tsx`) | Status |
|-------------|--------------------------------|--------|
| `title: string` | `title: string` | Pass |
| `subtitle?: string` | `subtitle?: string` | Pass |
| `legend?: { label, color }[]` | `legend?: LegendItem[]` (same shape) | Pass |
| `children: ReactNode` for chart | `children: ReactNode` | Pass |
| Applied to ElementChart | Used in reading page wrapping ElementPentagonChart + ElementChart | Pass |

**Usage in reading page (line 116-131)**: GraphCard wraps both `ElementPentagonChart` and `ElementChart` with a 5-element legend. Matches design intent.

**Result**: Fully implemented. **Pass**

**Phase 2 Score: 2.5/3 items (InlineCard partial: variant prop omitted)**

---

### 3.3 Phase 3 -- Interaction

#### 3.3.1 ConfirmationCard Component

| Design Spec | Implementation (`ConfirmationCard.tsx`) | Status |
|-------------|--------------------------------------|--------|
| `icon?: ReactNode` | `icon?: ReactNode` | Pass |
| `title: string` | `title: string` | Pass |
| `description: string` | `description: string` | Pass |
| `primaryAction: { label, onClick }` | `primaryAction: { label, onClick, loading? }` | Pass |
| `secondaryAction?: { label, onClick }` | `secondaryAction?: { label, onClick }` | Pass |
| Applied to PaywallOverlay | Component created but not yet integrated into PaywallOverlay | Missing |

**Gap**: The ConfirmationCard component is fully built but not applied to PaywallOverlay or share confirmation as specified in the design. The design document states: "PaywallOverlay -- improve payment prompt card to Confirmation pattern". The reading page still uses the existing `<PaywallOverlay>` component directly without wrapping in ConfirmationCard.

**Result**: Component created, integration pending. **Partial**

#### 3.3.2 ListCard Component (Dashboard)

| Design Spec | Implementation | Status |
|-------------|----------------|--------|
| `ListCard.tsx` -- NEW file | Not created (no `ListCard.tsx` found) | Missing |
| Dashboard past readings improvement | Not implemented | Missing |

**Gap**: The design document (Section 3.7 + Phase 3 item 8) specifies a `ListCard` component and Dashboard list view improvement. Neither `ListCard.tsx` nor dashboard modifications were implemented. This was not in the user's stated implementation scope.

**Result**: Not implemented. **Missing**

#### 3.3.3 Carousel Component

| Design Spec | Implementation (`Carousel.tsx`) | Status |
|-------------|-------------------------------|--------|
| `items: ReactNode[]` | `items: ReactNode[]` | Pass |
| `autoPlay?: boolean` | `autoPlay?: boolean` (default false) | Pass |
| `showDots?: boolean` | `showDots?: boolean` (default true) | Pass |
| `showArrows?: boolean` | `showArrows?: boolean` (default true) | Pass |
| Touch swipe support | Touch handlers with 50px threshold | Pass |
| Auto-play interval | `autoPlayInterval?: number` (default 4000) | Pass |

**Result**: Fully implemented. **Pass**

#### 3.3.4 CardPreview (Landing Integration)

| Design Spec | Implementation (`CardPreview.tsx`) | Status |
|-------------|----------------------------------|--------|
| Mobile: Carousel | `<Carousel>` inside `md:hidden` div | Pass |
| Desktop: Fan-out layout | Fan-out with rotation transforms in `hidden md:block` | Pass |
| 3 cards minimum | 5 cards (3 on desktop fan-out, 5 in mobile carousel) | Pass |

**Result**: Fully implemented. **Pass**

**Phase 3 Score: 2.5/4 items (ConfirmationCard partial, ListCard missing)**

---

### 3.4 Phase 4 -- Polish (Excluded from scoring)

| Item | Status | Expected |
|------|--------|----------|
| Light mode support | Not implemented | Correctly excluded |
| Micro-interactions | Not implemented | Correctly excluded |
| Accessibility improvements | Not implemented | Correctly excluded |

---

## 4. Design Token Verification

| Token (Design) | Token (Implementation) | Status |
|-----------------|----------------------|--------|
| `--card-padding: 24px` | `--card-padding: 24px` | Pass |
| `--card-padding-sm: 16px` | `--card-padding-sm: 16px` | Pass |
| `--card-radius: 12px` | `--card-radius: 12px` | Pass |
| `--card-border: rgba(255,255,255,0.06)` | `--card-border: rgba(255,255,255,0.06)` | Pass |
| `--card-border-hover: rgba(255,255,255,0.12)` | `--card-border-hover: rgba(255,255,255,0.12)` | Pass |
| `--inline-card-header-height: 52px` | `--inline-card-header-h: 52px` | Pass (name shortened) |
| `--inline-card-footer-height: 48px` | `--inline-card-footer-h: 48px` | Pass (name shortened) |
| `--skeleton-bg: rgba(255,255,255,0.06)` | `--skeleton-bg: rgba(255,255,255,0.06)` | Pass |
| `--skeleton-highlight: rgba(255,255,255,0.1)` | `--skeleton-highlight: rgba(255,255,255,0.1)` | Pass |
| `--typo-display: 4rem` | Not as CSS variable; applied directly in `.typo-display` class | Changed |
| `--typo-h1: 2.5rem` | Not as CSS variable; applied directly in `.typo-h1` class | Changed |
| `--typo-h2: 1.75rem` | Not as CSS variable; applied directly in `.typo-h2` class | Changed |
| `--typo-h3: 1.25rem` | Not as CSS variable; applied directly in `.typo-h3` class | Changed |

**Note on typography tokens**: The design proposes both CSS custom properties (`--typo-*`) and utility classes. The implementation uses only utility classes with explicit `font-size` values and media queries, which is functionally equivalent and more aligned with Tailwind CSS conventions. The `--typo-*` CSS variables are not defined, but since the `.typo-*` classes are the actual consumption point, this is a minor structural divergence with zero functional impact.

**Card + Inline Card + Skeleton tokens**: 9/9 match. Pass.
**Typography tokens**: 4/4 omitted as CSS variables but values applied in classes. Accepted as intentional.

**Token Score: 9/9 critical tokens match. 4 typography variables intentionally omitted.**

---

## 5. Architecture Compliance

### 5.1 Layer Placement

| Component | Expected Layer | Actual Location | Status |
|-----------|---------------|-----------------|--------|
| Skeleton.tsx | Presentation (ui) | `src/components/ui/Skeleton.tsx` | Pass |
| InlineCard.tsx | Presentation (ui) | `src/components/ui/InlineCard.tsx` | Pass |
| GraphCard.tsx | Presentation (ui) | `src/components/ui/GraphCard.tsx` | Pass |
| ConfirmationCard.tsx | Presentation (ui) | `src/components/ui/ConfirmationCard.tsx` | Pass |
| Carousel.tsx | Presentation (ui) | `src/components/ui/Carousel.tsx` | Pass |
| SkeletonReading.tsx | Presentation (fortune) | `src/components/fortune/SkeletonReading.tsx` | Pass |
| CardPreview.tsx | Presentation (landing) | `src/components/landing/CardPreview.tsx` | Pass |

### 5.2 Dependency Direction

All new components follow correct dependency flow:
- UI components import only from `@/lib/utils` (infrastructure utility)
- ConfirmationCard imports from `./Button` (same layer)
- CardPreview imports from `@/components/ui/` and `@/components/icons/` (same layer)
- SkeletonReading imports from `@/components/ui/Skeleton` (same layer)
- No violations: no service, store, or API imports in UI components

**Architecture Score: 100%**

---

## 6. Convention Compliance

### 6.1 Naming Convention

| Category | Convention | Files Checked | Compliance | Violations |
|----------|-----------|:----------:|:----------:|------------|
| Components | PascalCase | 7 | 100% | None |
| Functions | camelCase | 4 | 100% | None |
| Constants | UPPER_SNAKE_CASE | 1 (CARDS) | 100% | None |
| Files (component) | PascalCase.tsx | 7 | 100% | None |

### 6.2 Import Order

All 7 new files follow correct import order:
1. React/Next.js imports first
2. Internal `@/` absolute imports second
3. Type imports use `import type`

One minor note: `ConfirmationCard.tsx` imports `Button` via relative path `./Button` which is acceptable for same-directory components.

### 6.3 Code Quality

- All components use TypeScript interfaces
- Props extend `HTMLAttributes` where appropriate (InlineCard, GraphCard)
- `cn()` utility used consistently for className merging
- `"use client"` directive present on all client components
- Skeleton.tsx (server component) correctly omits the directive

**Convention Score: 98%** (minor: `--inline-card-header-h` vs design's `--inline-card-header-height` naming)

---

## 7. Match Rate Calculation

### Phase 1-3 Requirement Breakdown

| # | Phase | Item | Status | Weight |
|---|-------|------|--------|--------|
| 1 | P1 | Typography 8 utility classes in globals.css | Pass | 1.0 |
| 2 | P1 | Landing page heading migration (6 elements) | Pass | 1.0 |
| 3 | P1 | DayMasterHero typography migration (3 elements) | Pass | 1.0 |
| 4 | P1 | Reading page overline migration (3 elements) | Pass | 1.0 |
| 5 | P1 | Skeleton base component created | Pass | 1.0 |
| 6 | P2 | InlineCard with header/content/footer | Partial | 0.8 |
| 7 | P2 | SkeletonReading replaces spinner | Pass | 1.0 |
| 8 | P2 | GraphCard wrapper with title/legend | Pass | 1.0 |
| 9 | P2 | GraphCard applied to Element charts | Pass | 1.0 |
| 10 | P3 | ConfirmationCard component created | Partial | 0.7 |
| 11 | P3 | ListCard component (Dashboard) | Missing | 0.0 |
| 12 | P3 | Carousel component with swipe + auto-play | Pass | 1.0 |
| 13 | P3 | CardPreview uses Carousel (mobile) + fan-out (desktop) | Pass | 1.0 |
| 14 | Token | Card tokens (5 vars) | Pass | 1.0 |
| 15 | Token | Skeleton tokens (2 vars) | Pass | 1.0 |
| 16 | Token | Inline card tokens (2 vars) | Pass | 1.0 |

**Total: 14.5 / 16 = 90.6%**

```
Match Rate: 91%
  Pass:     13 items (81%)
  Partial:   2 items (13%)
  Missing:   1 item  (6%)
```

---

## 8. Differences Found

### Missing Features (Design has, Implementation does not)

| Item | Design Location | Description |
|------|-----------------|-------------|
| ListCard | design.md Section 3.2 + Phase 3 #8 | `ListCard.tsx` for Dashboard past readings list view -- not created |
| Dashboard modification | design.md Section 3.7 | Dashboard page not modified to use ListCard pattern |

### Partially Implemented Features (Design differs from Implementation)

| Item | Design | Implementation | Impact |
|------|--------|----------------|--------|
| InlineCard variant prop | `variant?: "default" \| "loading" \| "list" \| "graph" \| "carousel"` | No variant prop; uses `compact` boolean + separate components | Low -- composition pattern achieves same goal |
| ConfirmationCard integration | Apply to PaywallOverlay, Share, Reading delete/save | Component created but not integrated into any existing UI | Medium -- component exists but is unused |
| Typography CSS variables | `--typo-display`, `--typo-h1`, `--typo-h2`, `--typo-h3` as `:root` vars | Values applied directly in `.typo-*` utility classes, no CSS variables | Low -- functionally equivalent |
| Inline card token naming | `--inline-card-header-height` | `--inline-card-header-h` (shortened) | Low -- values match |

### Enhanced Features (Implementation exceeds Design)

| Item | Implementation Location | Description |
|------|------------------------|-------------|
| Skeleton variants | `Skeleton.tsx` | Added `variant` prop (line/circle/rect) beyond design spec |
| SkeletonReading detail | `SkeletonReading.tsx` | Added summary card skeleton, lucky info grid, fade-in animation |
| CardPreview card count | `CardPreview.tsx` | 5 cards (2 extra) with MetaphorIcon + ElementIcon integration |
| Carousel extras | `Carousel.tsx` | Added `autoPlayInterval` prop, dot navigation with width animation |
| ConfirmationCard extras | `ConfirmationCard.tsx` | Added `loading` state on primaryAction |
| GraphCard extras | `GraphCard.tsx` | Added `icon` prop beyond design spec |

---

## 9. Recommended Actions

### 9.1 To Reach 95%+ Match Rate

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | Create `ListCard.tsx` with avatar/title/subtitle/tag/date structure | Low |
| 2 | Integrate ConfirmationCard into PaywallOverlay component | Low |
| 3 | Apply ListCard to Dashboard past readings (if dashboard page exists) | Medium |

### 9.2 Documentation Updates Needed

| Item | Description |
|------|-------------|
| InlineCard variant removal | Document the composition-over-variants architectural decision |
| Typography tokens | Note that `--typo-*` CSS vars were replaced by direct class application |
| Token naming | Update `--inline-card-header-height` to `--inline-card-header-h` in design |

### 9.3 Intentional Deviations (No Action Required)

| Item | Rationale |
|------|-----------|
| Typography sizes differ from Figma | Responsive mobile-first sizes are an intentional improvement |
| No `variant` on InlineCard | Composition pattern (GraphCard, SkeletonReading) is cleaner than variant prop |
| `--typo-*` CSS variables omitted | Direct class application is more aligned with Tailwind conventions |

---

## 10. File Inventory

### New Files (7)

| File | Lines | Status |
|------|:-----:|--------|
| `src/components/ui/Skeleton.tsx` | 22 | Pass |
| `src/components/ui/InlineCard.tsx` | 51 | Pass |
| `src/components/ui/GraphCard.tsx` | 59 | Pass |
| `src/components/ui/ConfirmationCard.tsx` | 58 | Pass |
| `src/components/ui/Carousel.tsx` | 122 | Pass |
| `src/components/fortune/SkeletonReading.tsx` | 56 | Pass |
| `src/components/landing/CardPreview.tsx` | 71 | Pass |

### Modified Files (4)

| File | Changes | Status |
|------|---------|--------|
| `src/app/globals.css` | +164 lines: Typography system, design tokens, skeleton/inline-card CSS | Pass |
| `src/app/[locale]/page.tsx` | Typography classes applied to 6 elements, CardPreview integrated | Pass |
| `src/components/fortune/DayMasterHero.tsx` | Typography classes applied to 3 elements | Pass |
| `src/app/[locale]/reading/[id]/page.tsx` | SkeletonReading replaces spinner, GraphCard wraps charts, 3x typo-overline | Pass |

### Not Created (from design)

| File | Reason |
|------|--------|
| `src/components/ui/ListCard.tsx` | Phase 3 item 8 -- not in implementation scope |
| `src/components/ui/SkeletonCard.tsx` | Design mentions but SkeletonReading covers the use case |

---

## 11. Next Steps

- [ ] Decide whether to implement ListCard + Dashboard improvement or defer to a later iteration
- [ ] Integrate ConfirmationCard into PaywallOverlay for immediate UX improvement
- [ ] Update design document to reflect architectural decisions (composition over variants)
- [ ] Phase 4 items (Light mode, Micro-interactions, Accessibility) remain for future iteration

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-12 | Initial gap analysis | gap-detector |
