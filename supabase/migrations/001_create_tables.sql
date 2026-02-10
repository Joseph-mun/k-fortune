-- K-Destiny: Supabase 테이블 생성 스크립트
-- Supabase Dashboard > SQL Editor 에서 실행

-- ============================================
-- 1. users 테이블 (프로필 + 구독 정보)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 2. user_profiles 테이블 (프리미엄 + 생년월일)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT,
  locale TEXT DEFAULT 'en',
  birth_date DATE,
  birth_time TIME,
  birth_timezone TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. readings 테이블 (운세 분석 이력)
-- ============================================
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  session_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('basic', 'detailed', 'compatibility')),
  birth_date DATE,
  birth_time TIME,
  gender TEXT,
  result JSONB,
  day_master_metaphor TEXT,
  overall_score INTEGER,
  is_paid BOOLEAN DEFAULT false,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_readings_user_id ON readings(user_id);
CREATE INDEX idx_readings_created_at ON readings(created_at DESC);

-- ============================================
-- 4. purchases 테이블 (구매 이력)
-- ============================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  reading_id UUID REFERENCES readings(id) ON DELETE SET NULL,
  polar_order_id TEXT UNIQUE,
  polar_customer_id TEXT,
  product_type TEXT,
  type TEXT,
  product_name TEXT,
  amount INTEGER,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_polar_order_id ON purchases(polar_order_id);

-- ============================================
-- 5. subscriptions 테이블 (구독 관리)
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  polar_subscription_id TEXT UNIQUE,
  polar_customer_id TEXT NOT NULL,
  plan TEXT DEFAULT 'premium',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'expired')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_polar_id ON subscriptions(polar_subscription_id);

-- ============================================
-- 6. destiny_cards 테이블 (운명 카드)
-- ============================================
CREATE TABLE IF NOT EXISTS destiny_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  style TEXT NOT NULL CHECK (style IN ('classic', 'tarot', 'neon', 'ink', 'photo', 'seasonal')),
  reading_data JSONB,
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_destiny_cards_user_id ON destiny_cards(user_id);
CREATE INDEX idx_destiny_cards_public ON destiny_cards(is_public) WHERE is_public = true;
CREATE INDEX idx_destiny_cards_view_count ON destiny_cards(view_count DESC);
