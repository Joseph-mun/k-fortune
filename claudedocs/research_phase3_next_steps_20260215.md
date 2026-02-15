# K-Fortune Phase 3 리서치 리포트

> 작성일: 2026-02-15 | 신뢰도: HIGH | 소스: 50+ 웹소스 + 코드베이스 분석

---

## Executive Summary

Phase 1(UX) + Phase 2(AI 통합) 완료 후, 프로젝트의 핵심 기능은 모두 동작 상태.
다음 단계는 **수익 극대화 + 리텐션 강화 + 법적 리스크 해소**에 집중해야 함.

**최우선 과제**:
1. Star Match 법적 리스크 해소 (퍼블리시티권 위반 가능성 HIGH)
2. 전환율 최적화 (이벤트 트래킹, 프리미엄 트라이얼)
3. 리텐션 시스템 (일일 운세, 스트릭)

---

## 1. Star Match 법적 리스크 분석

### 현재 구현 상태
- `src/lib/saju/celebrities.ts`: 25명 셀럽 (BTS, BLACKPINK, NewJeans 등)
- 사용 데이터: 스테이지명 + 공개 생년월일 + 이모지 (사진 없음)
- BTS를 "Beyond The Scene"으로 우회 표기
- 주석: "No photos or likeness-right-infringing content"

### 법적 리스크 평가

| 위험 요소 | 한국 | 미국 | EU |
|----------|------|------|-----|
| 실명 사용 | EXTREME | HIGH | MEDIUM |
| 생년월일+이름 | EXTREME | HIGH | MEDIUM |
| 생년월일만 (이름 없이) | MEDIUM | LOW | LOW |
| 유저 입력 방식 | HIGH | MEDIUM | MEDIUM |
| 가상 캐릭터 | NONE | NONE | NONE |

### 핵심 법적 근거
- **2022년 부정경쟁방지법 2조1항(ㅊ)**: 유명인의 이름, 초상 등을 상업적으로 무단 사용 = 부정경쟁행위
- **Big 4 기획사** (HYBE, SM, JYP, YG): 아이돌 이름 상표 등록 + 적극적 법적 대응
- **2024-2025 강화 추세**: HYBE 딥페이크 8건 체포, JYP 팬 앱 법적 조치

### 권장 대응 방안

**Option A: 생년월일 기반으로 전환 (권장)**
- 셀럽 이름/그룹명 제거
- "이 날 태어난 유명인과의 궁합" 형태로 변환
- 유저가 직접 생년월일 입력하는 방식
- 마케팅에서 특정 아이돌 언급 금지

**Option B: 가상 캐릭터 대체**
- 실제 아이돌 대신 가상 K-pop 페르소나 생성
- 법적 리스크 0, 비즈니스 매력도 낮음

**Option C: 유저 입력 방식**
- 사전 데이터베이스 제거
- 유저가 직접 셀럽 이름+생년월일 입력
- 한국법상 플랫폼 책임 여전히 있음 (HIGH 리스크)

---

## 2. 프로젝트 갭 분석

### 전환 퍼널
- PaywallOverlay 1개소만 존재 (리딩 페이지 하단)
- 구매 후 확인 페이지/흐름 없음
- 전환 이벤트 트래킹 0건
- A/B 테스트 인프라 없음

### 리텐션
- 재방문 유도 메커니즘 0 (푸시, 이메일, 스트릭 없음)
- 일일/주간 콘텐츠 없음
- 게이미피케이션 없음

### 소셜/바이럴
- 기본 공유 (Web Share API + 클립보드) 존재
- 소셜 미디어별 최적화 없음
- 레퍼럴 시스템 없음
- 갤러리 좋아요/댓글 없음

### SEO
- 사이트맵: 메인 페이지만 포함 (개별 리딩/카드 미포함)
- JSON-LD 구조화 데이터 0
- 페이지별 메타 설명 부족

### 인증
- Google + Email Magic Link만 지원
- **카카오/네이버 로그인 없음** (한국 시장 필수)

---

## 3. 시장 트렌드 (2025-2026)

### 시장 규모
- 글로벌 점성술 앱: 2024년 $30억 → 2030년 $90억 (CAGR 20%)
- 아시아태평양 최고 성장률

### 수익 핵심 기능
- 궁합 도구: 프리미엄 콘텐츠 소비의 40-55%
- AI 개인화: 전환율 20-35% 향상
- 일일 운세: 전체 사용자 참여의 68%

### 리텐션 전략
- 스트릭 + 마일스톤: DAU 40-60% 향상
- 7일 스트릭 달성 시 일일 참여 2.3배 증가
- 30일 이탈률 35% 감소

### 한국 시장 필수 기능
- 부적(탈리스만) 생성기
- 해몽 (꿈 해석)
- 관상 (AI 얼굴 분석)
- 절기별 운세
- 만세력 차트

---

## 4. Phase 3 우선순위 제안

### Tier 1: 긴급 (법적 + 수익)
1. **Star Match 법적 리스크 해소** — 셀럽 이름 제거/우회
2. **전환 이벤트 트래킹** — Vercel Analytics 커스텀 이벤트
3. **프리미엄 7일 무료 트라이얼** — 전환율 30-60% 향상
4. **연간 구독 플랜 추가** — 이탈률 감소

### Tier 2: 리텐션 (1-2개월)
5. **일일 운세 기능** — 재방문 핵심 동력
6. **스트릭 시스템** — DAU 40-60% 향상
7. **카카오 로그인** — 한국 시장 필수
8. **갤러리 검색/필터** — UX 개선

### Tier 3: 성장 (2-3개월)
9. **소셜 공유 최적화** — 플랫폼별 공유 버튼
10. **JSON-LD + SEO 강화** — 오가닉 트래픽
11. **부적 생성기** — 한국 시장 차별화
12. **AI 대화 인터페이스** — "사주에게 물어보세요"

---

## Sources

### 법적 리서치
- [Korea UCPA Article 2(1)(l) - Publicity Rights](https://www.ip.kimchang.com/en/insights/detail.kc?sch_section=4&idx=24300)
- [Korean Publicity Rights - The Korean Law Blog](https://www.thekoreanlawblog.com/2017/10/publicity-rights-in-korea.html)
- [HYBE Deepfake Arrests 2024](https://www.allkpop.com)
- [JYP Legal Measures Against Artists' Rights Infringement](https://www.allkpop.com/article/2024/03/jyp-entertainment-releases-statements-regarding-legal-measures-against-the-infringement-of-artists-rights)
- [WIPO: K-pop Fandoms & IP](https://www.wipo.int/web/wipo-magazine/articles/beyond-music-rights-how-kpop-fandoms-rally-around-intellectual-property-73531)

### 시장 리서치
- [Astrology App Market Size 2026-2032](https://www.360iresearch.com/library/intelligence/horoscope-astrology-apps)
- [Global Astrology App Market Growth](https://finance.yahoo.com/news/global-astrology-app-market-triple-103800115.html)
- [App Gamification & Streaks](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps)
- [App Monetization Trends 2025](https://www.revenuecat.com/blog/growth/2025-app-monetization-trends/)
- [ASO Guide 2025](https://asomobile.net/en/blog/aso-in-2025-the-complete-guide-to-app-optimization/)
