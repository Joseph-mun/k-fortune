-- K-Destiny: RLS (Row Level Security) 정책
-- 001_create_tables.sql 실행 후 이 파일 실행

-- ============================================
-- RLS 활성화
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE destiny_cards ENABLE ROW LEVEL SECURITY;

-- ============================================
-- users 정책
-- ============================================
-- 본인 프로필 조회
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth_id = auth.uid()::text);

-- 본인 프로필 수정
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth_id = auth.uid()::text);

-- 서비스 역할: 모든 작업 허용 (서버에서 service_role key 사용)
CREATE POLICY "users_service_all" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- user_profiles 정책
-- ============================================
CREATE POLICY "profiles_select_own" ON user_profiles
  FOR SELECT USING (id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text));

CREATE POLICY "profiles_update_own" ON user_profiles
  FOR UPDATE USING (id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text));

CREATE POLICY "profiles_service_all" ON user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- readings 정책
-- ============================================
-- 본인 이력 조회
CREATE POLICY "readings_select_own" ON readings
  FOR SELECT USING (user_id = auth.uid()::text);

-- 누구나 생성 가능 (비로그인 사용자 포함 - user_id = null)
CREATE POLICY "readings_insert_any" ON readings
  FOR INSERT WITH CHECK (true);

-- 서비스 역할: 모든 작업
CREATE POLICY "readings_service_all" ON readings
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- purchases 정책
-- ============================================
CREATE POLICY "purchases_select_own" ON purchases
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "purchases_service_all" ON purchases
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- subscriptions 정책
-- ============================================
CREATE POLICY "subscriptions_select_own" ON subscriptions
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "subscriptions_service_all" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- destiny_cards 정책
-- ============================================
-- 공개 카드: 누구나 조회
CREATE POLICY "cards_select_public" ON destiny_cards
  FOR SELECT USING (is_public = true);

-- 본인 카드: 조회
CREATE POLICY "cards_select_own" ON destiny_cards
  FOR SELECT USING (user_id = auth.uid()::text);

-- 본인: 생성
CREATE POLICY "cards_insert_own" ON destiny_cards
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- 본인: 수정
CREATE POLICY "cards_update_own" ON destiny_cards
  FOR UPDATE USING (user_id = auth.uid()::text);

-- 본인: 삭제
CREATE POLICY "cards_delete_own" ON destiny_cards
  FOR DELETE USING (user_id = auth.uid()::text);

-- 서비스 역할: 모든 작업
CREATE POLICY "cards_service_all" ON destiny_cards
  FOR ALL USING (auth.role() = 'service_role');
