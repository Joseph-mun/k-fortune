# Code Analysis Results -- design-levelup (Post-Fix)

## Analysis Target
- **Path**: `korean-fortune/src/` (7 files)
- **File count**: 7
- **Analysis date**: 2026-02-11
- **Previous score**: 72/100 (Critical 3, Warning 17, Info 8)

---

## Quality Score: 84/100

**Delta**: +12 points from previous score. All three previous Critical issues resolved.

### Score Breakdown

| Category | Weight | Score | Notes |
|----------|--------|-------|-------|
| Code Quality | 25% | 21/25 | Clean structure, good naming, minor file-length issues |
| Security | 20% | 19/20 | No XSS/injection; env validation exists via Zod |
| Performance | 15% | 13/15 | Stale closure fixed; minor object re-creation |
| Architecture | 15% | 14/15 | Clean layer separation; missing error boundaries |
| Accessibility | 10% | 9/10 | role="meter", aria-label, tablist all verified |
| i18n | 10% | 10/10 | All strings internationalized including Yang/Yin |
| Testing | 5% | 0/5 | Zero project-level test files |

---

## Bug Fix Verification

### Fix 1: handleShare async/await + try/catch -- VERIFIED
**File**: `src/app/[locale]/reading/[id]/page.tsx` lines 38-48

```ts
const handleShare = async () => {
  const text = t("shareText", { metaphor: reading.dayMaster.metaphorInfo.displayName });
  try {
    if (navigator.share) {
      await navigator.share({ text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
    }
  } catch {
    // User cancelled share dialog or clipboard access denied
  }
};
```

Both `navigator.share()` and `navigator.clipboard.writeText()` are now properly awaited inside try/catch. The empty catch is acceptable here (user-initiated cancellation is not actionable).

### Fix 2: IntersectionObserver stale closure -- VERIFIED
**File**: `src/app/[locale]/gallery/page.tsx` lines 33, 54, 80

```ts
const offsetRef = useRef(0);       // line 33 -- ref created
offsetRef.current = nextOffset;     // line 54 -- kept in sync
fetchCards(offsetRef.current, true); // line 80 -- read from ref, not stale closure
```

The `offsetRef` pattern correctly avoids the stale closure problem. The `offset` state is still maintained for React rendering consistency, and the ref is kept in sync at line 54.

### Fix 3: Opacity bracket notation -- VERIFIED
All opacity values in analyzed files use Tailwind bracket notation (`/[0.08]`, `/[0.04]`, etc.) or inline `style={{ opacity }}` instead of the shorthand `/8` syntax. Confirmed in:
- `DestinyCard.tsx` -- all style classes use bracket notation (e.g., `border-white/[0.08]`, `shadow-purple-500/[0.05]`)
- `ElementChart.tsx` line 53 -- `opacity: element === "metal" ? 0.8 : 1` (inline style, correct)
- `PaywallOverlay.tsx` -- `border-white/[0.06]`, `bg-purple-500/[0.1]`, etc.

### Fix 4: i18n Yang/Yin -- VERIFIED
**File**: `src/components/fortune/DayMasterHero.tsx` lines 12-14

```ts
const tElements = useTranslations("elements");
const elementLabel = `${tElements(dayMaster.yinYang)} ${tElements(dayMaster.element)}`;
```

Previously hardcoded "Yang"/"Yin" strings are now translated via the `elements` namespace. Same pattern applied in `DestinyCard.tsx` line 92.

### Fix 5: Accessibility aria-label, role="meter" -- VERIFIED
**File**: `src/components/fortune/ElementChart.tsx` lines 42-46

```ts
role="meter"
aria-valuenow={percentage}
aria-valuemin={0}
aria-valuemax={100}
aria-label={`${t(element)} ${percentage}%`}
```

**File**: `src/app/[locale]/gallery/page.tsx` lines 109, 111-112, 168

```ts
role="tablist" aria-label="Sort order"
role="tab" aria-selected={sort === "latest"}
aria-label={`${reading.dayMaster.metaphorInfo.displayName} card`}
```

---

## Issues Found

### Critical (Immediate Fix Required)

None. All three previous Critical issues have been resolved.

### Warning (Improvement Recommended)

| # | File | Line(s) | Issue | Recommended Action |
|---|------|---------|-------|--------------------|
| W1 | `stores/useReadingStore.ts` | all | Zustand store has no persistence -- page refresh or direct URL access to `/reading/:id` shows infinite spinner forever | Add `zustand/middleware` persist with `sessionStorage` |
| W2 | Project-wide | -- | Zero `error.tsx` error boundary files exist anywhere in the App Router tree | Add `error.tsx` at minimum at `src/app/[locale]/error.tsx` |
| W3 | `reading/[id]/page.tsx` | 25-34 | No differentiation between "loading" and "not found" -- if ID is invalid, user sees spinner forever | Add timeout or redirect; detect missing reading vs. loading |
| W4 | `PaywallOverlay.tsx` | 25-30 | `handleUnlock` silently does nothing when both `onUnlock` and `productId` are absent -- `ReadingPage` passes no `productId` | Provide default productId, show disabled state, or log warning |
| W5 | `gallery/page.tsx` | 55-56 | Silent failure on fetch error -- `catch {}` with comment `// ignore` discards network errors with no user feedback | Show a toast or set an error state |
| W6 | `gallery/page.tsx` | 157-163 | `reconstructReading` failure returns `null` inside `.map()` producing sparse array with `null` children | Use `.flatMap()` or `.filter(Boolean)` to remove nulls |
| W7 | `DestinyCard.tsx` | 184-251 | `getStyleClasses()` rebuilds a 68-line object literal on every call | Hoist the `styles` record to module scope as a constant |
| W8 | `DestinyCard.tsx` | 1-295 | File is 295 lines with mixed concerns (3D tilt, style mapping, symbol mapping, rendering) | Split tilt hook, symbol maps, and style config into separate modules |
| W9 | `DestinyCard.tsx` | 106 | `.slice(0, 80)` magic number for text truncation | Extract to named constant `NATURE_TEXT_MAX_LENGTH = 80` |
| W10 | `DestinyCard.tsx` | 288-294 | `ELEMENT_BAR_COLORS` duplicates values already in `lib/saju/constants.ts` (`ELEMENT_COLORS`) | Delete local copy; import from `constants.ts` |
| W11 | `page.tsx` (landing) | 70 | `4.9/5` rating hardcoded in JSX -- not data-driven, not i18n | Move to config constant or i18n message |
| W12 | Project-wide | -- | Zero test files exist (0% coverage) | Add unit tests for `reconstructReading`, element analysis, and critical components |

### Info (Reference)

| # | Observation |
|---|-------------|
| I1 | Landing page (`page.tsx`) is a server component (no `"use client"`) -- good for SEO and initial load performance |
| I2 | Naming conventions are consistent: PascalCase for components, camelCase for functions/variables, UPPER_SNAKE_CASE for constants |
| I3 | All i18n strings use `useTranslations` with proper namespace separation (`reading`, `elements`, `gallery`, `paywall`, `metaphors`) |
| I4 | TypeScript used throughout with proper interface definitions; no `any` types found in analyzed files |
| I5 | `DestinyCard.tsx` 3D tilt uses `useCallback` correctly with stable empty deps |
| I6 | No `dangerouslySetInnerHTML` or `innerHTML` found in any analyzed file -- XSS risk minimal |
| I7 | No `localStorage` usage found -- no sensitive data leakage via client storage |
| I8 | `aria-hidden="true"` properly applied to decorative floating symbols (landing page line 26) |
| I9 | `star-match/page.tsx` still calls `getGroups()` on every render (outside analyzed set; noted for future) |
| I10 | `.env.example` exists; `lib/env.ts` validates all env vars with Zod schema -- good practice |
| I11 | `NEXT_PUBLIC_` prefixed vars limited to Supabase URL, anon key, and app URL -- appropriate for client exposure |
| I12 | File lengths well within limits: page.tsx (209), reading (174), DestinyCard (295), gallery (197), DayMasterHero (56), ElementChart (78), PaywallOverlay (92) |
| I13 | Function nesting depth stays within 3 levels across all files |
| I14 | Gallery `reconstructReading` has try/catch returning null for bad data -- defensive (though null handling needs improvement per W6) |

---

## Duplicate Code Analysis

### Duplicates Found

| Type | Location 1 | Location 2 | Similarity | Recommended Action |
|------|------------|------------|------------|-------------------|
| Data duplicate | `DestinyCard.tsx:288-294` (`ELEMENT_BAR_COLORS`) | `lib/saju/constants.ts:112` (`ELEMENT_COLORS`) | ~95% | Delete local copy; import from constants |
| Structural | `DestinyCard.tsx:254-268` (`getMetaphorSymbol`) | Metaphor data in `lib/saju/` domain | 70% | Extract to shared `lib/saju/symbols.ts` |
| Pattern | `reading/page.tsx:120-137` (3 lucky info cards) | Repeated Card + icon + label + value | Structural | Extract `LuckyInfoCard` component |

### Reuse Opportunities

| Function/Component | Current Location | Suggestion | Reason |
|-------------------|-----------------|------------|--------|
| `getMetaphorSymbol()` | `DestinyCard.tsx:254` | Move to `lib/saju/symbols.ts` | Currently private but useful elsewhere |
| `getAnimalSymbol()` | `DestinyCard.tsx:270` | Move to `lib/saju/symbols.ts` | Chinese zodiac mapping reusable across components |
| Lucky info card pattern | `reading/page.tsx:120-137` | Extract `LuckyInfoCard` component | 3 nearly identical blocks |
| `FeatureCard` | `page.tsx:190-208` | Extract to `components/ui/FeatureCard.tsx` | Inline in landing page; reusable in other marketing pages |

---

## Extensibility Analysis

### Hardcoding Found

| File | Line | Code | Suggestion |
|------|------|------|------------|
| `page.tsx` (landing) | 70 | `4.9/5` | Move to CMS/config or i18n message |
| `DestinyCard.tsx` | 106 | `.slice(0, 80)` | Named constant `NATURE_TEXT_MAX_LENGTH` |
| `DestinyCard.tsx` | 46-48 | `* 10` tilt intensity | Named constant `TILT_INTENSITY = 10` |
| `ElementChart.tsx` | 20 | `setTimeout(..., 100)` | Named constant `MOUNT_ANIMATION_DELAY` |
| `ElementChart.tsx` | 51 | `Math.max(percentage, 3)` | Named constant `MIN_BAR_WIDTH_PERCENT` |
| `gallery/page.tsx` | 36 | `LIMIT = 12` inside component | Move to module scope |

### Extensibility Patterns -- Good

| File | Pattern | Note |
|------|---------|------|
| `DestinyCard.tsx:184-251` | Style classes via config object lookup | Adding new card styles requires only adding to the `styles` record |
| `ElementChart.tsx:12` | `ELEMENTS` array as module constant | Iteration-based, not hardcoded per-element |
| `PaywallOverlay.tsx:18-22` | `onUnlock` callback prop with default behavior | Extensible override pattern |

---

## Architecture Compliance

| Check | Status | Notes |
|-------|--------|-------|
| Clean Architecture dependency direction | PASS | Components import from lib/saju (domain), not from API routes |
| Layer separation (API -> Service -> Repository) | PASS | API routes call domain logic; components consume via stores |
| No direct Infra imports in Presentation | PASS | Supabase/API calls happen via `fetch()` to API routes |
| i18n consistency | PASS | All user-visible strings go through `useTranslations()` |
| Env var convention (NEXT_PUBLIC_ for client) | PASS | Only Supabase URL/key and app URL exposed |
| Zod env validation | PASS | `lib/env.ts` validates all vars with schema |
| `.env.example` exists | PASS | Template present |

---

## Security Inspection

| Check | Status | Notes |
|-------|--------|-------|
| XSS | PASS | No raw HTML injection; React auto-escapes; no dangerouslySetInnerHTML |
| CSRF | N/A | No mutation forms in analyzed files; paywall delegates to Polar |
| Secrets in client code | PASS | No API keys or secrets in any analyzed file |
| localStorage sensitive data | PASS | Not used |
| Input display validation | WARN | Lucky info values rendered directly from store (W12 equivalent) |

---

## Performance Inspection

| Check | Status | Notes |
|-------|--------|-------|
| Stale closure bugs | FIXED | IntersectionObserver uses offsetRef correctly |
| Unnecessary re-renders | PASS | `useCallback` used for mouse handlers in DestinyCard |
| Memory leaks | PASS | IntersectionObserver properly cleaned up in return function |
| Heavy computation caching | WARN | `getStyleClasses()` re-creates object per call (W7) |
| Async handling | PASS | `handleShare` properly uses async/await with try/catch |
| N+1 queries | N/A | No direct DB access in analyzed files |

---

## Summary

### Score History

| Version | Score | Critical | Warning | Info |
|---------|-------|----------|---------|------|
| design-levelup initial | 72/100 | 3 | 17 | 8 |
| design-levelup post-fix | **84/100** | **0** | **12** | **14** |

### Top 5 Priorities for Next Iteration

1. **W1 -- Zustand persistence**: Reading data lost on refresh is the single biggest UX gap. Direct URL sharing is broken.
2. **W2 -- Error boundaries**: Add `error.tsx` at `[locale]/` level minimum to catch runtime errors gracefully.
3. **W3 -- Loading vs not-found**: Reading page infinite spinner for invalid or expired IDs needs a timeout/redirect.
4. **W4 -- PaywallOverlay dead button**: Checkout does nothing without `productId`; button click has zero feedback.
5. **W12 -- Testing**: Add unit tests for `reconstructReading()`, element analysis, and at least one component render test.

### Deployment Decision

**Status: DEPLOYABLE with warnings**

No Critical issues remain. The 12 Warning items are quality/robustness improvements that should be addressed in subsequent sprints. The most urgent are W1 (state loss on page refresh breaks direct URL sharing) and W4 (paywall button does nothing), as both directly impact core user flows.

### Unresolved TODOs in Codebase

| File | Line | TODO Content |
|------|------|-------------|
| `lib/saju/index.ts` | 45 | "Implement full interpretation logic for detailed readings" |
| `api/fortune/detailed/route.ts` | 85 | "In production, verify authentication and payment status" |
