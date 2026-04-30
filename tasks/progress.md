# Tasks — Progress

## 상태 범례
- ✅ 완료  🔄 진행 중  ⏳ 대기  ❌ 블로킹

---

## Phase 1: 하네스 구조 설정 ✅
- [x] CLAUDE.md (프로젝트 규칙 + 에이전트 구조)
- [x] .claude/settings.json (권한 설정)
- [x] .claude/agents/ (orchestrator, designer, coder, security, marketing)
- [x] .claude/skills/ (implement, tax-logic, test, seo)
- [x] src/data/federal-tax-2024.js (IRS 2024 구간/공제)
- [x] src/data/fica-2024.js (SS/Medicare 한도)
- [x] src/data/state-tax-2024.js (50개 주 + DC)
- [x] src/utils/federal-tax.js (순수 함수)
- [x] src/utils/fica.js (순수 함수)
- [x] src/utils/state-tax.js (순수 함수)
- [x] src/utils/deductions.js (순수 함수)
- [x] src/utils/format.js (통화/퍼센트 포맷)
- [x] tests/utils/ (federal, fica, state, deductions)
- [x] tasks/reviews/TEMPLATE.md

## Phase 1-b: 소득 분위 기능 ✅
- [x] src/data/income-percentiles-us.js (IRS/Census 2024, 22개 구간)
- [x] src/data/income-percentiles-global.js (World Bank 2024, 18개 구간 + Fun Facts)
- [x] src/utils/percentile.js (선형 보간 순수 함수)
- [x] tests/utils/percentile.test.js (21개 테스트 — 전체 61개 통과)

## Phase 2: 테스트 실행 & 검증 ✅
- [x] npm install
- [x] npm test — 전체 61개 통과 확인
- [x] 샘플 케이스 수동 검증 ($100k CA Single → Federal $13,841 / State $5,469 / SS $6,200 / Medicare $1,450)

## Phase 3: UI 구현 ✅
- [x] public/style.css (CSS 변수 기반, Inter 구글 폰트, 다크 glassmorphism, 반응형)
- [x] public/index.html (SEO 메타, OG 태그, LD+JSON 구조화 데이터, AdSense 슬롯)
- [x] src/components/SalaryForm.js (입력 폼, 401k 실시간 경고)
- [x] src/components/ResultPanel.js (Net Pay Hero, 세금 흐름 바, 소득 분위 위젯)
- [x] src/components/TaxBreakdown.js (항목별 금액+실효세율 테이블)
- [x] src/components/PaySchedule.js (연/월/격주/주 실수령액 카드)
- [x] src/app.js (진입점, 계산 오케스트레이터, 이벤트 연결)

## Phase 4: 광고 & 배포 준비 ✅
- [x] sitemap.xml
- [x] robots.txt
- [x] vercel.json (rewrites 추가, CSP에 Google Fonts 허용)
- [x] AdSense 클라이언트 ID 삽입 (ca-pub-6744073304383561)
- [ ] Lighthouse Performance >= 90 (배포 후 확인)
- [x] Vercel 배포 (도메인 확정 후)

---

## 미해결 사항
- AdSense 클라이언트 ID: 미정 (승인 후 삽입)
- 도메인: 미정
- ~~MA 주세: $1M 초과 4% 추가 세율~~ ✅ **수정 완료** — progressive 구조로 재구현
- MO 주세: 최고세율 4.95% 수정 완료 ✅
- MT 주세: 누진세 역전 버그 수정 완료 ✅
- NJ 주세: 로컬 세금(county tax) 미포함

## 다음 세션 시작 지점
Phase 4 — AdSense 승인 후 ID 삽입 & Vercel 배포
