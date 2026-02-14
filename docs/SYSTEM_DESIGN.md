# K-Fortune System Design Document

> Korean Four Pillars (사주) Fortune Reading Platform
> Last updated: 2026-02-14

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [System Architecture Diagram](#2-system-architecture-diagram)
3. [API Design](#3-api-design)
4. [Database Schema](#4-database-schema)
5. [Component Architecture](#5-component-architecture)
6. [Data Flow](#6-data-flow)
7. [Security Design](#7-security-design)
8. [Performance Strategy](#8-performance-strategy)

---

## 1. Architecture Overview

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Runtime | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Database | Supabase (PostgreSQL) | - |
| Auth | NextAuth.js (JWT) | 4.24.x |
| Payment | Polar | SDK 0.42.x |
| i18n | next-intl | 4.8.x |
| State | Zustand | 5.0.x |
| UI | Tailwind CSS v4 + Radix UI | - |
| Validation | Zod | 4.3.x |
| Testing | Vitest + Playwright | - |
| Hosting | Vercel | Edge |

### Core Principles

1. **Freemium Model**: Basic reading free, detailed reading paid ($2.99)
2. **i18n First**: Korean/English/Spanish from day one
3. **Serverless**: JWT auth + in-memory rate limiting, no persistent server state
4. **Client Calculation**: Saju calculation is deterministic and runs server-side per request (no DB caching needed)
5. **RLS Security**: Row-level security at database level, defense in depth

---

## 2. System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ BirthInput  │  │ ReadingPage  │  │ DestinyCardGenerator   │  │
│  │   Form      │  │ (결과 표시)   │  │ (카드 생성/다운로드)     │  │
│  └──────┬──────┘  └──────┬───────┘  └────────────┬───────────┘  │
│         │                │                        │              │
│  ┌──────┴────────────────┴────────────────────────┴───────────┐  │
│  │              useReadingStore (Zustand + sessionStorage)     │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────┴─────────────────────────────────┐  │
│  │           fortuneApi.ts (API Client Layer)                 │  │
│  │  fetchBasicReading() | fetchDetailedReading()              │  │
│  │  fetchCompatibilityReading() | fetchStarMatch()            │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
└─────────────────────────────┼────────────────────────────────────┘
                              │ HTTPS
┌─────────────────────────────┼────────────────────────────────────┐
│                     NEXT.JS SERVER (Vercel Edge)                 │
│                              │                                   │
│  ┌───────────────────────────┼───────────────────────────────┐   │
│  │                    middleware.ts                           │   │
│  │         i18n routing + Auth protection                    │   │
│  └───────────────────────────┼───────────────────────────────┘   │
│                              │                                   │
│  ┌────────────┐ ┌────────────┴───────────┐ ┌─────────────────┐   │
│  │   Public   │ │      Protected         │ │    Webhook      │   │
│  │   Routes   │ │       Routes           │ │    Routes       │   │
│  │            │ │                        │ │                 │   │
│  │ /basic     │ │ /detailed (Auth+Pay)   │ │ /webhook/polar  │   │
│  │ /compat    │ │ /user/profile          │ │   (Signature)   │   │
│  │ /star-match│ │ /user/readings         │ │                 │   │
│  │ /cards GET │ │ /user/purchases        │ │                 │   │
│  │            │ │ /cards POST/DELETE      │ │                 │   │
│  └──────┬─────┘ └────────────┬───────────┘ └────────┬────────┘   │
│         │                    │                       │           │
│  ┌──────┴────────────────────┴───────────────────────┴────────┐  │
│  │              Core Libraries (src/lib/)                     │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────┐  ┌──────────────────────┐ │  │
│  │  │  saju/       │  │rateLimit │  │ supabase.ts          │ │  │
│  │  │  pillars.ts  │  │  .ts     │  │ createServerClient() │ │  │
│  │  │  elements.ts │  └──────────┘  └──────────┬───────────┘ │  │
│  │  │  cycles.ts   │                           │             │  │
│  │  │  tenGods.ts  │  ┌──────────┐             │             │  │
│  │  │  compat.ts   │  │ polar.ts │             │             │  │
│  │  │  interpret.ts│  └──────────┘             │             │  │
│  │  └──────────────┘                           │             │  │
│  └─────────────────────────────────────────────┼─────────────┘  │
└─────────────────────────────────────────────────┼────────────────┘
                                                  │
                     ┌────────────────────────────┼────────────────┐
                     │              SUPABASE                       │
                     │                                             │
                     │  ┌──────────┐  ┌──────────────────────────┐ │
                     │  │  users   │  │  readings                │ │
                     │  │  (auth)  │  │  (history + JSONB result)│ │
                     │  └──────────┘  └──────────────────────────┘ │
                     │                                             │
                     │  ┌──────────┐  ┌──────────────────────────┐ │
                     │  │purchases │  │  subscriptions           │ │
                     │  │  (orders)│  │  (monthly plans)         │ │
                     │  └──────────┘  └──────────────────────────┘ │
                     │                                             │
                     │  ┌──────────────┐  ┌──────────────────────┐ │
                     │  │ user_profiles │  │  destiny_cards      │ │
                     │  │ (premium)     │  │  (public gallery)   │ │
                     │  └──────────────┘  └──────────────────────┘ │
                     │                                             │
                     │          RLS: Row Level Security             │
                     └─────────────────────────────────────────────┘

                     ┌─────────────────────────────────────────────┐
                     │              POLAR (Payment)                 │
                     │                                             │
                     │  Checkout → Webhook → DB Update             │
                     │  Products: detailed_reading ($2.99)         │
                     │            premium_sub ($9.99/mo)           │
                     │            card_premium ($0.99)             │
                     └─────────────────────────────────────────────┘
```

---

## 3. API Design

### 3.1 Endpoint Summary

| Method | Endpoint | Auth | Rate Limit | Purpose |
|--------|----------|------|------------|---------|
| POST | `/api/fortune/basic` | No | 10/min/IP | Free basic reading |
| POST | `/api/fortune/detailed` | JWT + Payment | 5/min/user | Paid detailed reading |
| POST | `/api/fortune/compatibility` | No | 5/min/IP | Two-person compatibility |
| POST | `/api/fortune/star-match` | No | 5/min/IP | Celebrity compatibility |
| GET | `/api/checkout` | No | - | Redirect to Polar checkout |
| POST | `/api/webhook/polar` | Signature | - | Payment webhook handler |
| GET | `/api/user/profile` | JWT | 30/min/user | Get user profile |
| PUT | `/api/user/profile` | JWT | 30/min/user | Update profile |
| GET | `/api/user/readings` | JWT | 30/min/user | Reading history |
| GET | `/api/user/purchases` | JWT | 30/min/user | Purchase history |
| POST | `/api/cards` | JWT | - | Create destiny card |
| GET | `/api/cards` | Optional | - | List cards (own/public) |
| GET | `/api/cards/[id]` | Optional | - | Get single card |
| DELETE | `/api/cards/[id]` | JWT (owner) | - | Delete own card |

### 3.2 Request/Response Contracts

#### POST /api/fortune/basic

**Request:**
```typescript
{
  birthDate: string;        // "YYYY-MM-DD"
  birthTime: string | null; // "HH:mm" or null
  timezone: string;         // "Asia/Seoul"
  gender: "male" | "female" | "other";
  locale: "ko" | "en" | "es";
}
```

**Response (200):**
```typescript
{
  id: string;
  fourPillars: {
    year | month | day | hour: {
      metaphor: StemMetaphor;
      animal: BranchAnimal;
      element: Element;
      yinYang: YinYang;
      display: { stemName, stemIcon, animalName, animalIcon };
    }
  };
  elementAnalysis: {
    wood: number; fire: number; earth: number;
    metal: number; water: number;
    dominant: Element; lacking: Element | null;
  };
  dayMaster: {
    element: Element;
    yinYang: YinYang;
    metaphor: StemMetaphor;
    metaphorInfo: StemMetaphorInfo;
    personality: string;
    strengths: string[];
    weaknesses: string[];
  };
  luckyInfo: { color: string; number: number; direction: string };
  preview: { career: string; teaser: string };
  shareUrl: string;
}
```

#### POST /api/fortune/detailed

**Additional Response Fields (extends basic):**
```typescript
{
  // ... all basic fields ...
  career: string;          // i18n key
  relationship: string;    // i18n key
  health: string;          // i18n key
  wealth: string;          // i18n key
  yearlyFortune: string;   // i18n key
  advice: string;          // i18n key
  majorCycles: Array<{
    startAge: number;
    endAge: number;
    pillar: FormattedPillar;
    description: string;
    rating: 1 | 2 | 3 | 4 | 5;
  }>;
  tenGods: {
    dayMaster: HeavenlyStem;
    entries: TenGodEntry[];
    dominant: TenGodRelation | null;
    summary: string;
  };
}
```

**Error Codes:**
```typescript
| Code              | Status | Description                        |
|-------------------|--------|------------------------------------|
| UNAUTHORIZED      | 401    | Not signed in                      |
| PAYMENT_REQUIRED  | 402    | No active purchase or subscription |
| RATE_LIMITED      | 429    | Too many requests                  |
| INVALID_BIRTH_DATE| 400    | Bad date format                    |
| INVALID_INPUT     | 400    | Other validation failure           |
| CALCULATION_ERROR | 500    | Server-side calculation failure    |
```

### 3.3 Error Response Format

All errors follow a consistent structure:
```typescript
{
  error: {
    code: string;       // Machine-readable error code
    message: string;    // Human-readable message
    retryAfter?: number; // Seconds (for rate limit)
  }
}
```

---

## 4. Database Schema

### 4.1 Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐
│    users     │───1:1──│  user_profiles   │
│              │       │                  │
│ id (UUID PK) │       │ id (UUID FK→users)│
│ auth_id (UQ) │       │ is_premium       │
│ email        │       │ birth_date       │
│ name         │       │ gender           │
│ avatar_url   │       │ locale           │
│ sub_tier     │       └──────────────────┘
│ sub_status   │
│ created_at   │
│ updated_at   │
└──────┬───────┘
       │
       ├───1:N───┌──────────────────┐
       │         │    readings      │
       │         │                  │
       │         │ id (UUID PK)     │
       │         │ user_id (TEXT)   │
       │         │ type (basic/     │
       │         │   detailed/      │
       │         │   compatibility) │
       │         │ result (JSONB)   │
       │         │ is_paid          │
       │         │ locale           │
       │         └──────────────────┘
       │
       ├───1:N───┌──────────────────┐
       │         │   purchases      │
       │         │                  │
       │         │ id (UUID PK)     │
       │         │ user_id (TEXT)   │
       │         │ reading_id (FK)  │
       │         │ polar_order_id   │
       │         │ product_type     │
       │         │ amount / currency│
       │         │ status           │
       │         └──────────────────┘
       │
       ├───1:N───┌──────────────────┐
       │         │  subscriptions   │
       │         │                  │
       │         │ id (UUID PK)     │
       │         │ user_id (TEXT)   │
       │         │ polar_sub_id     │
       │         │ plan / status    │
       │         │ period_start/end │
       │         └──────────────────┘
       │
       └───1:N───┌──────────────────┐
                 │  destiny_cards   │
                 │                  │
                 │ id (UUID PK)     │
                 │ user_id (TEXT)   │
                 │ style            │
                 │ reading_data(JSONB)│
                 │ is_public        │
                 │ view_count       │
                 └──────────────────┘
```

### 4.2 Table Details

#### users
```sql
CREATE TABLE users (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id     TEXT UNIQUE NOT NULL,           -- NextAuth user ID
  email       TEXT,
  name        TEXT,
  avatar_url  TEXT,
  subscription_tier   TEXT DEFAULT 'free',    -- free | premium
  subscription_status TEXT,                   -- active | canceled | null
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);
```

#### readings
```sql
CREATE TABLE readings (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             TEXT,                    -- nullable (anonymous)
  session_id          TEXT,
  type                TEXT CHECK (type IN ('basic','detailed','compatibility')),
  birth_date          DATE,
  birth_time          TIME,
  gender              TEXT,
  result              JSONB,                   -- full reading data
  day_master_metaphor TEXT,
  overall_score       INTEGER,
  is_paid             BOOLEAN DEFAULT false,
  locale              TEXT DEFAULT 'en',
  created_at          TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_readings_user ON readings(user_id);
CREATE INDEX idx_readings_created ON readings(created_at DESC);
```

#### purchases
```sql
CREATE TABLE purchases (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           TEXT,
  reading_id        UUID REFERENCES readings(id),
  polar_order_id    TEXT UNIQUE,
  polar_customer_id TEXT,
  product_type      TEXT,                      -- detailed_reading | card_premium | etc.
  amount            INTEGER,                   -- cents
  currency          TEXT DEFAULT 'usd',
  status            TEXT CHECK (status IN ('pending','completed','refunded','failed')),
  created_at        TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_order ON purchases(polar_order_id);
```

#### subscriptions
```sql
CREATE TABLE subscriptions (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               TEXT,
  polar_subscription_id TEXT UNIQUE,
  polar_customer_id     TEXT NOT NULL,
  plan                  TEXT DEFAULT 'premium',
  status                TEXT CHECK (status IN ('active','canceled','past_due','expired')),
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_subs_user ON subscriptions(user_id);
CREATE INDEX idx_subs_polar ON subscriptions(polar_subscription_id);
```

#### destiny_cards
```sql
CREATE TABLE destiny_cards (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      TEXT,
  style        TEXT CHECK (style IN ('classic','tarot','neon','ink','photo','seasonal')),
  reading_data JSONB,
  is_public    BOOLEAN DEFAULT false,
  view_count   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_cards_user ON destiny_cards(user_id);
CREATE INDEX idx_cards_public ON destiny_cards(is_public) WHERE is_public = true;
CREATE INDEX idx_cards_views ON destiny_cards(view_count DESC);
```

### 4.3 RLS Policy Summary

| Table | Authenticated User | Anonymous | Service Role |
|-------|-------------------|-----------|-------------|
| users | SELECT/UPDATE own | - | ALL |
| user_profiles | SELECT/UPDATE own | - | ALL |
| readings | SELECT own | INSERT | ALL |
| purchases | SELECT own | - | ALL |
| subscriptions | SELECT own | - | ALL |
| destiny_cards | CRUD own + SELECT public | SELECT public | ALL |

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
App Layout
├── NavBar (responsive + mobile menu)
│   └── LocaleSwitcher (ko/en/es)
│
├── Pages
│   ├── Landing (/)
│   │   ├── WebGLShader (dynamic import, ssr:false)
│   │   ├── ServiceHighlight
│   │   └── CardPreview
│   │
│   ├── Start (/start)
│   │   └── BirthInputForm
│   │       ├── CalendarPopup (date picker)
│   │       ├── StepProgress (2-step wizard)
│   │       ├── AnimalIcon (zodiac animal feedback)
│   │       └── Button (submit)
│   │
│   ├── Reading (/reading/[id])
│   │   ├── ReadingSummary (day master hero)
│   │   ├── Accordion (expandable sections)
│   │   │   ├── FourPillarsDisplay
│   │   │   │   └── FortunePillarCard x4
│   │   │   ├── Day Pillar Interpretation
│   │   │   │   └── MetaphorIcon + strengths/weaknesses
│   │   │   └── ElementPentagonChart / ElementChart
│   │   ├── GraphCard (element balance)
│   │   └── PaywallOverlay (CTA for detailed)
│   │
│   ├── Cards (/cards/create)
│   │   ├── DestinyCard (6 style variants)
│   │   └── DestinyCardGenerator
│   │       └── html-to-image capture
│   │
│   ├── Gallery (/gallery)
│   │   └── DestinyCard (public gallery)
│   │
│   ├── Compatibility (/compatibility)
│   │   └── CompatibilityMeter
│   │
│   └── Star Match (/star-match)
│       └── Celebrity selection + compatibility
│
├── Error Boundaries
│   ├── [locale]/error.tsx (global)
│   ├── reading/error.tsx
│   └── cards/error.tsx
│
└── Footer
```

### 5.2 Core UI Components

| Component | Variants | Purpose |
|-----------|----------|---------|
| `Button` | primary, secondary, ghost, gold / sm, md, lg | All interactive actions |
| `Card` | default (glass) | Content container |
| `Accordion` | defaultOpen, icon | Collapsible sections |
| `Input` | default | Form fields |
| `Skeleton` | - | Loading states |
| `CalendarPopup` | - | Date/time picker |
| `TiltCard` | - | 3D tilt interaction |
| `GraphCard` | - | Chart/graph wrapper |

### 5.3 Icon Systems

Three SVG icon systems, each with consistent API:

```typescript
// Usage pattern (all icon components)
<MetaphorIcon metaphor="sword" size={40} />
<AnimalIcon animal="dragon" size={24} />
<ElementIcon element="fire" size={20} />
```

| System | Count | Source |
|--------|-------|--------|
| MetaphorIcon | 10 icons | Heavenly stems (천간) |
| AnimalIcon | 12 icons | Earthly branches (지지) |
| ElementIcon | 5 icons | Five elements (오행) |

### 5.4 Card Style System

DestinyCard supports 6 visual themes:

| Style | Background | Accent | Use Case |
|-------|-----------|--------|----------|
| `classic` | Dark gradient (#131316) | Purple | Default |
| `tarot` | Dark gold (#141008) | Gold | Mystical feel |
| `neon` | Deep purple (#0A0015) | Purple neon | Modern |
| `ink` | Light parchment (#F5F0E8) | Gray | Minimalist |
| `photo` | Purple gradient | White | Social media |
| `seasonal` | Dark pink (#150810) | Pink | Seasonal themes |

---

## 6. Data Flow

### 6.1 Basic Reading Flow

```
User Input                API Server              Client Store
   │                         │                        │
   │ birthDate, birthTime    │                        │
   │ gender, locale          │                        │
   │─────────────────────────>                        │
   │                    Rate Limit Check              │
   │                    Zod Validation                │
   │                    calculateBasicReading()       │
   │                         │                        │
   │                    ┌────┴─────────┐              │
   │                    │ Calculation  │              │
   │                    │ pillars.ts   │              │
   │                    │ elements.ts  │              │
   │                    │ interpret.ts │              │
   │                    └────┬─────────┘              │
   │                         │                        │
   │    <── JSON Response ───┤                        │
   │                         │                        │
   │──────────────────────────────────────────────────>
   │                                   setReading(id, data)
   │                                   → sessionStorage
   │
   │── Navigate to /reading/{id} ──>
   │
   │                                   getReading(id)
   │    <── Render from store ─────────────────────────
```

### 6.2 Payment + Detailed Reading Flow

```
Client                  Server                  Polar               Supabase
  │                       │                       │                    │
  │ "Unlock Full Reading" │                       │                    │
  │───────────────────────>                       │                    │
  │                  GET /api/checkout             │                    │
  │                  ?products=prod_xxx            │                    │
  │                  &metadata={readingId,userId}  │                    │
  │                       │                       │                    │
  │                       │──── Create Session ───>                    │
  │   <── Redirect to Polar Checkout ─────────────                    │
  │                       │                       │                    │
  │── Complete Payment ──────────────────────────>│                    │
  │                       │                       │                    │
  │   <── Redirect to /checkout/success ──────────│                    │
  │                       │                       │                    │
  │                       │   <── order.paid ─────│                    │
  │                       │       webhook         │                    │
  │                       │                       │                    │
  │                       │── Validate metadata ──────────────────────>│
  │                       │── Insert purchase ────────────────────────>│
  │                       │── Update reading.is_paid ─────────────────>│
  │                       │                       │                    │
  │ POST /api/fortune/detailed                    │                    │
  │───────────────────────>                       │                    │
  │                  Auth check (JWT)             │                    │
  │                  Payment check ───────────────────────────────────>│
  │                       │                       │    purchases ✓     │
  │                  calculateDetailedReading()   │                    │
  │                  calculateTenGods()           │                    │
  │   <── Full Reading ───│                       │                    │
```

### 6.3 State Management

```
┌─────────────────────────────────────────────────┐
│              useReadingStore (Zustand)           │
│                                                 │
│  Storage: sessionStorage ("saju-readings")      │
│  Lifetime: Browser tab session                  │
│                                                 │
│  State:                                         │
│  {                                              │
│    readings: {                                  │
│      "read_abc": { id, fourPillars, dayMaster,  │
│                     elementAnalysis, luckyInfo } │
│      "read_xyz": { ... }                        │
│    }                                            │
│  }                                              │
│                                                 │
│  Actions:                                       │
│  - setReading(id, data)  // Add/update          │
│  - getReading(id)        // Retrieve            │
│                                                 │
│  Persistence:                                   │
│  - Survives back-navigation within tab          │
│  - Clears on tab close                          │
│  - No cross-tab sharing                         │
└─────────────────────────────────────────────────┘
```

---

## 7. Security Design

### 7.1 Authentication Layers

```
Layer 1: Middleware (middleware.ts)
├── i18n locale routing
├── Protected pages → redirect to /auth/signin
└── Protected APIs → 401 Unauthorized

Layer 2: API Route (getToken from next-auth/jwt)
├── Verify JWT signature
├── Extract user ID (token.sub)
└── Pass to business logic

Layer 3: Database (RLS Policies)
├── user_id = auth.uid()::text
├── Service role for server operations
└── Public access for is_public cards

Layer 4: Payment (Polar Webhook)
├── HMAC signature verification
├── Metadata cross-validation (user_id, reading_id)
└── Database state as source of truth
```

### 7.2 Input Validation

All API endpoints validate input with Zod schemas:

```typescript
// Every route follows this pattern:
const Schema = z.object({ ... });
const parsed = Schema.safeParse(body);
if (!parsed.success) return 400;
```

### 7.3 Rate Limiting

```
┌──────────────────────────────────────────┐
│         In-Memory Rate Limiter           │
│                                          │
│  Map<string, { count, resetTime }>       │
│  Sliding window counter per key          │
│  Cleanup interval: 5 minutes             │
│                                          │
│  Key format:                             │
│  - Anonymous: "basic:{ip-address}"       │
│  - Authenticated: "detailed:user:{id}"   │
│                                          │
│  Limits:                                 │
│  - basic:     10 req/min per IP          │
│  - detailed:   5 req/min per user        │
│  - compat:     5 req/min per IP          │
│  - user API:  30 req/min per user        │
└──────────────────────────────────────────┘
```

---

## 8. Performance Strategy

### 8.1 Bundle Optimization

| Strategy | Implementation | Impact |
|----------|---------------|--------|
| WebGL lazy load | `next/dynamic` + `ssr: false` | Three.js excluded from initial bundle |
| Three.js code split | `await import("three")` inside component | Only loaded when WebGL initializes |
| Image generation lazy | `await import("html-to-image")` | Only loaded on download/share |
| Session storage | Zustand persist + sessionStorage | No re-fetch on back navigation |

### 8.2 Rendering Strategy

| Route | Strategy | Reason |
|-------|----------|--------|
| `/` (Landing) | Server Component | SEO + fast initial paint |
| `/start` | Server + Client hybrid | Server shell, client form |
| `/reading/[id]` | Client Component | Dynamic data from store |
| `/cards/create` | Client Component | Interactive card builder |
| `/gallery` | Server Component | SEO + public cards |

### 8.3 Caching

| Data | Cache Location | TTL | Invalidation |
|------|---------------|-----|-------------|
| Reading result | sessionStorage | Tab lifetime | Tab close |
| i18n messages | Server (next-intl) | Build time | Redeploy |
| Saju calculations | None (deterministic) | - | Recalculated per request |
| Public cards | Supabase query | Per request | On card update |

### 8.4 Error Boundary Strategy

```
[locale]/error.tsx          ← Global catch-all
├── reading/error.tsx       ← Reading-specific recovery
├── cards/error.tsx         ← Cards-specific recovery
└── (other routes)          ← Falls through to global
```

Each boundary provides:
- User-friendly error message
- "Try Again" button (calls `reset()`)
- Navigation escape hatch (e.g., "New Reading", "Gallery")

---

## Appendix: File Structure Reference

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx            # Landing
│   │   ├── layout.tsx          # Locale layout
│   │   ├── error.tsx           # Error boundary
│   │   ├── start/page.tsx      # Birth input
│   │   ├── reading/
│   │   │   ├── [id]/page.tsx   # Reading results
│   │   │   └── error.tsx       # Reading error
│   │   ├── cards/
│   │   │   ├── create/page.tsx # Card creator
│   │   │   ├── [id]/           # Card view
│   │   │   └── error.tsx       # Cards error
│   │   ├── gallery/page.tsx    # Public gallery
│   │   ├── compatibility/      # Two-person compat
│   │   ├── star-match/         # Celebrity compat
│   │   ├── pricing/            # Pricing page
│   │   ├── dashboard/          # User dashboard
│   │   └── auth/signin/        # Sign in
│   └── api/
│       ├── fortune/
│       │   ├── basic/route.ts
│       │   ├── detailed/route.ts
│       │   ├── compatibility/route.ts
│       │   └── star-match/route.ts
│       ├── cards/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── user/
│       │   ├── profile/route.ts
│       │   ├── readings/route.ts
│       │   └── purchases/route.ts
│       ├── checkout/route.ts
│       ├── webhook/polar/route.ts
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── fortune/          # Reading display components
│   ├── forms/            # Input forms
│   ├── icons/            # SVG icon systems
│   ├── landing/          # Landing page components
│   ├── layout/           # NavBar, Footer
│   ├── payment/          # PricingTable
│   └── ui/               # Base UI primitives
├── features/
│   ├── auth/hooks/       # useAuth
│   ├── fortune/          # API client + hooks
│   └── payment/hooks/    # useCheckout, useSubscription
├── hooks/                # Shared hooks
├── i18n/                 # Internationalization
├── lib/
│   ├── saju/             # Core calculation engine
│   ├── supabase.ts       # DB client
│   ├── rateLimit.ts      # Rate limiter
│   ├── polar.ts          # Payment client
│   ├── env.ts            # Env validation
│   └── utils.ts          # Utilities
├── messages/             # Translation files (ko/en/es)
├── stores/               # Zustand stores
├── styles/               # Global CSS
└── types/                # Type declarations
```
