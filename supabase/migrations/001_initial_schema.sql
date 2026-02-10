-- =====================================================
-- K-Destiny Initial Schema Migration
-- Design Doc: korean-fortune.design.md (Section 3.2)
-- =====================================================

-- ===== Users (NextAuth managed, extended) =====
-- NextAuth creates: users, accounts, sessions, verification_tokens
-- We extend with profile data:

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'es')),
  birth_date DATE,
  birth_time TIME,
  birth_timezone TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== Readings (saju analysis history) =====
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('basic', 'detailed', 'compatibility', 'monthly', 'yearly')),
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_timezone TEXT DEFAULT 'UTC',
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  result JSONB NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_readings_user ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_session ON readings(session_id);

-- ===== Compatibility Readings =====
CREATE TABLE IF NOT EXISTS compatibility_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  person1_birth_date DATE NOT NULL,
  person1_birth_time TIME,
  person1_gender TEXT,
  person2_birth_date DATE NOT NULL,
  person2_birth_time TIME,
  person2_gender TEXT,
  result JSONB NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== Purchases (order history) =====
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_id UUID,
  polar_order_id TEXT UNIQUE NOT NULL,
  polar_customer_id TEXT,
  product_type TEXT NOT NULL CHECK (product_type IN (
    'detailed_reading', 'compatibility', 'monthly_fortune', 'yearly_fortune', 'premium_subscription'
  )),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_polar ON purchases(polar_order_id);

-- ===== Subscriptions =====
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  polar_subscription_id TEXT UNIQUE NOT NULL,
  polar_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('monthly_fortune', 'premium')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'expired')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- ===== Destiny Cards =====
CREATE TABLE IF NOT EXISTS destiny_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_id UUID NOT NULL REFERENCES readings(id),
  style TEXT NOT NULL DEFAULT 'classic',
  custom_photo_url TEXT,
  photo_filter TEXT,
  photo_crop JSONB,
  generated_image_url TEXT,
  hashtag TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_destiny_cards_user ON destiny_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_destiny_cards_public ON destiny_cards(is_public) WHERE is_public = TRUE;

-- ===== RLS Policies =====

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE destiny_cards ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY "Users read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can read their own readings; anonymous readings use session_id
CREATE POLICY "Users read own readings" ON readings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service insert readings" ON readings
  FOR INSERT WITH CHECK (true);

-- Users can read their own compatibility readings
CREATE POLICY "Users read own compatibility" ON compatibility_readings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service insert compatibility" ON compatibility_readings
  FOR INSERT WITH CHECK (true);

-- Users can read their own purchases
CREATE POLICY "Users read own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service insert purchases" ON purchases
  FOR INSERT WITH CHECK (true);

-- Users can read their own subscriptions
CREATE POLICY "Users read own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manage subscriptions" ON subscriptions
  FOR ALL USING (true);

-- Users can read their own cards; public cards are visible to all
CREATE POLICY "Users read own cards" ON destiny_cards
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);
CREATE POLICY "Users insert own cards" ON destiny_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own cards" ON destiny_cards
  FOR UPDATE USING (auth.uid() = user_id);

-- ===== Updated At Trigger =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
