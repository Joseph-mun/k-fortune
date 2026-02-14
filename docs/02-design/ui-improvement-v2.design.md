# UI Improvement v2 — 전체 디자인 개선안

> 참조 Figma: [Typography](https://figma.com/design/4gqoxoQwU2umAorWGOPyvO?node-id=17-484) · [Inline Card](https://figma.com/design/4gqoxoQwU2umAorWGOPyvO?node-id=81-720)

---

## 1. 현재 상태 분석

### 기술 스택
- **Framework**: Next.js (App Router) + next-intl (i18n)
- **Styling**: Tailwind CSS v4 + Custom CSS (globals.css)
- **Font**: Pretendard Variable (self-hosted, 300-900)
- **Theme**: Dark-first (bg: #09090B), Purple/Gold accent
- **Components**: Card, Button, TiltCard, Accordion, NavBar, Footer 등

### 현재 문제점

| 영역 | 문제 | 심각도 |
|------|------|--------|
| Typography | heading/body 간 weight 계층이 불명확. `font-bold`만 사용 | 높음 |
| Card 시스템 | Card 컴포넌트가 단순 래퍼. 콘텐츠 유형별 변형 없음 | 높음 |
| Loading 상태 | 전역 로딩 = 단순 spinner. 콘텐츠별 스켈레톤 없음 | 중간 |
| Data Visualization | ElementChart/PentagonChart만 존재. 그래프 카드 패턴 없음 | 중간 |
| Light/Dark 모드 | Dark 모드만 지원. Light 모드 미구현 | 낮음 |
| 인터랙션 | hover/glow 효과만 존재. confirmation/toast 패턴 없음 | 중간 |
| 모바일 UX | 하단 CTA 고정 바만 있음. 카드 swipe/carousel 없음 | 중간 |

---

## 2. Figma 참조 디자인에서 추출한 패턴

### 2.1 Typography System (node 17:484)

Anthropic의 타이포그래피 시스템에서 차용할 계층 구조:

```
Display  — 96px / Extrabold / tracking-tight / heading font
H1       — 48px / Bold / leading-[1.1]
H2       — 32px / Bold / leading-[1.2]
H3       — 24px / Semibold / leading-[1.3]
Body-lg  — 18px / Regular / leading-relaxed
Body     — 16px / Regular / leading-relaxed
Body-sm  — 14px / Regular / leading-relaxed
Caption  — 12px / Regular / text-muted
Overline — 10px / Medium / uppercase tracking-[0.2em]
```

### 2.2 Inline Card 패턴 (node 81:720)

6가지 카드 유형과 적용 방안:

| Figma 패턴 | 설명 | 프로젝트 적용 대상 |
|-------------|------|-------------------|
| **Loading** | 스켈레톤 + 프로그레스 인라인 카드 | Reading 결과 로딩, Form 제출 중 |
| **List views** | Avatar + Content + Date 리스트 | Dashboard 과거 Reading 목록 |
| **Confirmation** | 액션 버튼 + 설명 인라인 카드 | 결제 확인, Reading 공유 확인 |
| **Graph card** | 인라인 차트 (라인그래프 + 축) | 운세 트렌드, 오행 밸런스 |
| **Distribution** | 분포 차트 + 범례 | 오행 분포 시각화 |
| **Carousel** | 이미지/카드 수평 스크롤 | Destiny Card 갤러리, Star Match 결과 |

---

## 3. 개선안 상세

### 3.1 Typography 체계 강화

**현재:**
```tsx
// 모든 heading이 동일한 패턴
<h2 className="text-2xl md:text-3xl font-bold text-text-primary font-[family-name:var(--font-heading)]">
```

**개선안:** Tailwind 유틸리티 클래스로 통일

```css
/* globals.css 추가 */
.typo-display { @apply text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.05]; }
.typo-h1      { @apply text-3xl md:text-5xl font-bold leading-[1.1]; }
.typo-h2      { @apply text-2xl md:text-3xl font-bold leading-[1.2]; }
.typo-h3      { @apply text-xl md:text-2xl font-semibold leading-[1.3]; }
.typo-body-lg { @apply text-base md:text-lg leading-relaxed; }
.typo-body    { @apply text-sm md:text-base leading-relaxed; }
.typo-caption { @apply text-xs text-text-muted; }
.typo-overline { @apply text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted; }
```

**적용 대상:**
- `page.tsx` (Landing) — Hero heading을 `typo-display`로 변경
- 모든 섹션 heading — `typo-h2`로 통일
- `DayMasterHero.tsx` — metaphor name을 `typo-h1`로 변경

### 3.2 Card 컴포넌트 확장

**현재:** 단일 Card 컴포넌트 (bg + border + hover)

**개선안:** 목적별 카드 변형 추가

```
src/components/ui/
├── Card.tsx              (기존 — base card)
├── InlineCard.tsx        (NEW — 인라인 콘텐츠 카드)
├── ListCard.tsx          (NEW — 리스트 아이템 카드)
├── GraphCard.tsx         (NEW — 차트/그래프 래퍼)
└── ConfirmationCard.tsx  (NEW — 액션 확인 카드)
```

#### InlineCard — 핵심 새 컴포넌트

```tsx
interface InlineCardProps {
  header?: { title: string; subtitle?: string; action?: ReactNode };
  footer?: ReactNode;
  variant?: "default" | "loading" | "list" | "graph" | "carousel";
  children: ReactNode;
}
```

**Loading 변형:**
```tsx
<InlineCard variant="loading">
  <SkeletonLine width="60%" />
  <SkeletonLine width="80%" />
  <SkeletonLine width="40%" />
  <ProgressBar value={65} />
</InlineCard>
```

**List 변형:**
```tsx
<InlineCard variant="list" header={{ title: "Past Readings" }}>
  {readings.map(r => (
    <ListItem
      avatar={<MetaphorIcon metaphor={r.metaphor} size={32} />}
      title={r.metaphorName}
      subtitle={r.date}
      tag={r.element}
    />
  ))}
</InlineCard>
```

### 3.3 Skeleton Loading 시스템

**현재:** 단순 spinner만 존재 (reading 페이지)

**개선안:**

```
src/components/ui/
├── Skeleton.tsx          (NEW — 기본 스켈레톤)
├── SkeletonCard.tsx      (NEW — 카드형 스켈레톤)
└── SkeletonReading.tsx   (NEW — Reading 결과 전용 스켈레톤)
```

```tsx
// Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "animate-skeleton rounded bg-white/[0.06]",
      className
    )} />
  );
}

// SkeletonReading.tsx — Reading 페이지 로딩 상태
export function SkeletonReading() {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
      {/* Hero skeleton */}
      <div className="flex flex-col items-center gap-3 pt-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="w-32 h-3" />
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-24 h-4" />
      </div>
      {/* Accordion skeletons */}
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
}
```

### 3.4 Graph Card — 데이터 시각화 개선

**현재:** ElementChart (바 차트) + ElementPentagonChart (레이더)

**개선안:** Figma의 Graph card / Distribution 패턴 적용

```tsx
// GraphCard.tsx — 차트를 감싸는 인라인 카드
interface GraphCardProps {
  title: string;
  subtitle?: string;
  legend?: { label: string; color: string }[];
  children: ReactNode;  // Chart 컴포넌트
}
```

적용 대상:
- **ElementChart** → `GraphCard`로 래핑, Distribution 패턴 적용
- **ElementPentagonChart** → `GraphCard`로 래핑, 범례 추가
- **LifeCycleTimeline** → `GraphCard`로 래핑, 인라인 그래프 스타일

### 3.5 Confirmation Card — 인터랙션 패턴

**현재:** 결제 확인, 공유 등에 별도 UI 없음

**개선안:**

```tsx
// ConfirmationCard.tsx
interface ConfirmationCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}
```

적용 대상:
- `PaywallOverlay` — 결제 유도 카드를 Confirmation 패턴으로 개선
- Share 기능 — 공유 성공/실패 피드백
- Reading 삭제/저장 확인

### 3.6 Carousel 컴포넌트

**현재:** Card Preview 섹션에서 정적 3장 카드 나열

**개선안:**

```tsx
// Carousel.tsx
interface CarouselProps {
  items: ReactNode[];
  autoPlay?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
}
```

적용 대상:
- **Landing** — Card Preview 섹션을 Carousel로 교체
- **Gallery** — Destiny Card 갤러리 모바일 뷰
- **Star Match** — 연예인 매칭 결과 스와이프

### 3.7 Dashboard 리스트 뷰 개선

**현재 Dashboard:** 기존 구조 확인 필요

**개선안:** Figma List views 패턴 적용

```
Past Readings 목록:
┌─────────────────────────────────────────┐
│ [Icon] The Sun        #fire    Nov 12  │
│        Yang Fire — Leadership, Passion   │
├─────────────────────────────────────────┤
│ [Icon] The Ocean      #water   Oct 28  │
│        Yang Water — Wisdom, Flow         │
└─────────────────────────────────────────┘
```

---

## 4. 구현 우선순위

### Phase 1 — Foundation (고영향, 저노력)
1. **Typography 유틸리티 클래스 추가** → globals.css에 8개 클래스 추가
2. **기존 heading 마이그레이션** → Landing, Reading, Start 페이지 적용
3. **Skeleton 기본 컴포넌트** → Skeleton.tsx 생성

### Phase 2 — Card System (고영향, 중노력)
4. **InlineCard 컴포넌트** → header/footer/variant 시스템
5. **SkeletonReading** → Reading 페이지 로딩 상태 교체
6. **GraphCard 래퍼** → ElementChart/PentagonChart 래핑

### Phase 3 — Interaction (중영향, 중노력)
7. **ConfirmationCard** → PaywallOverlay, Share 기능 개선
8. **ListCard** → Dashboard past readings 개선
9. **Carousel** → Landing Card Preview, Gallery 모바일

### Phase 4 — Polish (중영향, 고노력)
10. **Light 모드 지원** → :root 변수 + dark variant 전환
11. **Micro-interactions** → 카드 transition, loading state 개선
12. **접근성** → aria-label, focus-visible, reduced-motion

---

## 5. 디자인 토큰 추가

```css
/* globals.css — 추가할 토큰 */
:root {
  /* Card variants */
  --card-padding: 24px;
  --card-padding-sm: 16px;
  --card-radius: 12px;
  --card-border: rgba(255, 255, 255, 0.06);
  --card-border-hover: rgba(255, 255, 255, 0.12);

  /* Inline card specific */
  --inline-card-header-height: 52px;
  --inline-card-footer-height: 48px;

  /* Skeleton */
  --skeleton-bg: rgba(255, 255, 255, 0.06);
  --skeleton-highlight: rgba(255, 255, 255, 0.1);

  /* Typography scale */
  --typo-display: 4rem;    /* 64px */
  --typo-h1: 2.5rem;       /* 40px */
  --typo-h2: 1.75rem;      /* 28px */
  --typo-h3: 1.25rem;      /* 20px */
}
```

---

## 6. 파일 변경 맵

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `globals.css` | EDIT | Typography 클래스, 디자인 토큰, Skeleton 애니메이션 추가 |
| `Card.tsx` | EDIT | variant prop 추가 (default/inline/elevated) |
| `InlineCard.tsx` | NEW | header/content/footer 구조 카드 |
| `Skeleton.tsx` | NEW | 기본 스켈레톤 라인/원형/직사각형 |
| `SkeletonReading.tsx` | NEW | Reading 전용 스켈레톤 |
| `GraphCard.tsx` | NEW | 차트 래퍼 카드 |
| `ConfirmationCard.tsx` | NEW | 액션 확인 카드 |
| `Carousel.tsx` | NEW | 수평 스크롤/스와이프 카드 |
| `ListCard.tsx` | NEW | 리스트 아이템 카드 |
| `page.tsx` (Landing) | EDIT | Typography 클래스 적용, Card Preview → Carousel |
| `page.tsx` (Reading) | EDIT | 스켈레톤 로딩, GraphCard 래핑 |
| `DayMasterHero.tsx` | EDIT | Typography 클래스 적용 |
| `dashboard/page.tsx` | EDIT | ListCard 패턴 적용 |

---

## 7. 비적용 결정

| 항목 | 이유 |
|------|------|
| Anthropic Sans 폰트 | 라이선스 불명. Pretendard 유지 — 한국어 최적 |
| Claude 앱 Sidebar | 사주 서비스와 무관한 Claude UI 고유 요소 |
| Light 모드 (Phase 4) | Dark-first 디자인 정체성 유지 우선. 향후 검토 |
| Chat Input UI | 사주 서비스는 대화형이 아닌 폼 기반 |
