# US Salary Take-Home Calculator — CLAUDE.md

## Project Overview
미국 연봉 실수령액 계산기 정적 웹 도구.
Google AdSense 광고 수익을 목적으로 하며, 무료 호스팅(Vercel)에 배포한다.
외부 API 없이 순수 Vanilla JS만 사용한다. 세금 데이터는 `src/data/`에 정적으로 관리한다.

## Tech Stack
- **언어**: Vanilla HTML / CSS / JavaScript (ES2020+)
- **빌드 도구**: 없음 (순수 정적 파일)
- **테스트**: Jest + jsdom
- **호스팅**: Vercel (`vercel.json` 포함)
- **광고**: Google AdSense — ID는 `public/index.html`의 `__ADSENSE_CLIENT__` 플레이스홀더로 관리

## Directory Structure
```
us-salary-calculator/
├── CLAUDE.md                        ← 이 파일 (항상 먼저 읽을 것)
├── .claude/
│   ├── settings.json                ← 권한 허용/거부 목록
│   ├── agents/
│   │   ├── orchestrator.md          ← 루프 조율 / 판정
│   │   ├── designer.md              ← UI/UX 작업 + 리뷰
│   │   ├── coder.md                 ← 구현/테스트 + 리뷰
│   │   ├── security.md              ← 보안 전담 + BLOCK 권한
│   │   └── marketing.md             ← SEO/AdSense + 리뷰
│   └── skills/
│       ├── implement.md             ← 기능 구현 가이드
│       ├── tax-logic.md             ← 세금 계산 로직 레퍼런스
│       ├── test.md                  ← 테스트 작성 가이드
│       └── seo.md                   ← SEO/AdSense 가이드
├── src/
│   ├── data/
│   │   ├── federal-tax-2024.js      ← 연방세 구간 (2024)
│   │   ├── state-tax-2024.js        ← 주세 데이터 (50개 주 + DC)
│   │   ├── fica-2024.js             ← FICA 한도/세율 (2024)
│   │   ├── income-percentiles-us.js ← 미국 소득 분위 (IRS/Census 2024)
│   │   └── income-percentiles-global.js ← 전세계 소득 분위 (World Bank 2024)
│   ├── utils/
│   │   ├── federal-tax.js           ← 연방세 계산 순수 함수
│   │   ├── state-tax.js             ← 주세 계산 순수 함수
│   │   ├── fica.js                  ← FICA 계산 순수 함수
│   │   ├── deductions.js            ← 공제 계산 순수 함수
│   │   ├── percentile.js            ← 소득 분위 계산 순수 함수
│   │   └── format.js                ← 숫자/통화 포맷 유틸
│   └── components/
│       ├── SalaryForm.js            ← 입력 폼 컴포넌트
│       ├── ResultPanel.js           ← 결과 패널 컴포넌트
│       ├── TaxBreakdown.js          ← 세금 항목별 breakdown 테이블
│       └── PaySchedule.js           ← 연/월/격주/주 단위 실수령액
├── public/
│   ├── index.html                   ← 진입점 (SEO 메타 포함)
│   └── style.css                    ← 전역 스타일 (CSS 변수 기반)
├── tests/
│   └── utils/
│       ├── federal-tax.test.js
│       ├── state-tax.test.js
│       ├── fica.test.js
│       ├── deductions.test.js
│       └── percentile.test.js
├── tasks/
│   ├── progress.md                  ← 세션 핸드오프 기록
│   └── reviews/
│       └── TEMPLATE.md              ← 리뷰 결과 양식
├── package.json
└── vercel.json
```

## Core Rules (반드시 준수)

### DO
- 모든 세금 계산 함수는 **순수 함수** — 같은 입력 → 같은 출력
- CSS 변수(`--color-*`, `--spacing-*`)로 테마 관리
- 시맨틱 HTML (`<form>`, `<output>`, `<section>`, `aria-label` 등)
- 모바일 퍼스트 반응형 (`min-width` 미디어 쿼리)
- 세금 계산 함수는 반드시 단위 테스트 작성 후 `npm test` 통과

### DON'T
- 외부 세금 API 호출 금지 — 모든 세율 데이터는 `src/data/`에 정적 관리
- `eval()`, `innerHTML`에 사용자 입력 삽입 금지
- 인라인 스타일 (`style=""`) 직접 작성 금지 — CSS 클래스 사용
  - 예외: AdSense `<ins>` 태그의 `style="display:block"`
- AdSense ID 하드코딩 금지 — `__ADSENSE_CLIENT__` 플레이스홀더 유지
- 세금 데이터 파일(`src/data/`) 임의 수정 금지 — 반드시 IRS 공식 수치 근거 명시

## Key Features (구현 목표)
1. **연봉 입력**: gross salary, 지급 주기 선택 (annual/monthly/biweekly/weekly/hourly)
2. **Filing Status**: Single / Married Filing Jointly / Married Filing Separately / Head of Household
3. **주(State) 선택**: 50개 주 + DC (무세 주 포함)
4. **Pre-tax 공제**: 401(k), Traditional IRA, HSA, FSA, Health Insurance Premium
5. **결과 표시**:
   - 연방세 / 주세 / Social Security / Medicare 항목별 금액 + 실효세율
   - Gross → Net 흐름 (폭포수 차트 또는 바 차트)
   - 연/월/격주/주 단위 실수령액 테이블
6. **광고 슬롯**: 상단 배너, 결과 섹션 하단 (인피드)
7. **🎯 소득 분위 위젯** *(흥미 요소)*:
   - 미국 내 상위 몇 %인지 (IRS/Census 2024 기준)
   - 전 세계 상위 몇 %인지 (World Bank 2024 기준)
   - 라벨 (Top 1%, Top 10% 등) + 이모지 + 맥락 문장
   - 전세계 비교 Fun Fact 1줄 (참여 유도)
   - 데이터: `src/data/income-percentiles-us.js`, `src/data/income-percentiles-global.js`
   - 계산: `src/utils/percentile.js` — 선형 보간 순수 함수

## Tax Logic Summary (2024 기준)
- **연방 표준공제**: Single $14,600 / MFJ $29,200 / MFS $14,600 / HOH $21,900
- **FICA SS 한도**: $168,600 (6.2%), Medicare 1.45% (전 소득), Additional 0.9% (>$200k Single / >$250k MFJ)
- **주세**: `src/data/state-tax-2024.js` 참조 — 무세 9개 주, 정률제 주, 누진세 주 혼재
- **401(k) 한도**: $23,000 (50세 미만), $30,500 (50세 이상)
- **IRA 한도**: $7,000 (50세 미만), $8,000 (50세 이상)

## Verification Contract
모든 커밋 전 아래 조건을 충족해야 한다:
- [ ] `npm test` — 전체 통과
- [ ] 알려진 샘플 케이스로 수동 검증 (IRS Tax Withholding Estimator 결과와 5% 이내 오차)
- [ ] 키보드만으로 입력/결과 확인 가능 (접근성)
- [ ] 모바일(375px) 레이아웃 깨지지 않음

## Agent Team Structure
5개 에이전트가 협업하는 Review Loop로 운영된다.

```
                    ┌──────────────────┐
                    │   ORCHESTRATOR   │
                    │  (조율 / 판정)    │
                    └────────┬─────────┘
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
  │   DESIGNER   │  │    CODER     │  │    SECURITY     │
  │ UI/UX/접근성 │  │ 구현/테스트  │  │ XSS/CSP/정책   │
  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘
         └─────────────────┼───────────────────┘
                           ▼
                  ┌────────────────┐
                  │   MARKETING    │
                  │ SEO/AdSense    │
                  └────────────────┘
```

### Cross-Review 매트릭스
|            | Designer 작업 | Coder 작업 | Security 작업 | Marketing 작업 |
|------------|:---:|:---:|:---:|:---:|
| **Designer**   | —  | ✅  | ⬜  | ✅  |
| **Coder**      | ✅  | —  | ✅  | ⬜  |
| **Security**   | ⬜  | ✅  | —  | ✅  |
| **Marketing**  | ✅  | ⬜  | ⬜  | —  |

- BLOCK 권한: Security 에이전트만
- 이터레이션 제한: 동일 태스크 최대 3회 루프

## Context Loading Order
1. `CLAUDE.md` (이 파일) — 항상
2. `.claude/agents/orchestrator.md`
3. 담당 에이전트 파일 (`.claude/agents/<role>.md`)
4. 해당 작업의 skill 파일 (`.claude/skills/`)
5. 수정 대상 소스 파일
6. 관련 테스트 파일

## Session Handoff
세션 중단 시 `tasks/progress.md`에 기록:
- 완료된 기능 / 현재 작업 파일 / 다음 해야 할 일 / 미해결 버그
