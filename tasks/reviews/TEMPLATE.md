# Review Template

## 파일명 규칙
`tasks/reviews/YYYY-MM-DD_<태스크명>.md`
예: `tasks/reviews/2024-01-15_federal-tax-calc.md`

---

## 리뷰 기록 형식

```markdown
# Review: [태스크명]
**날짜**: YYYY-MM-DD
**이터레이션**: 1 / 3
**작업 주체**: Coder
**변경 파일**: src/utils/federal-tax.js, tests/utils/federal-tax.test.js

---

## Designer Review
**판정**: PASS
### 발견 사항
- 없음

---

## Coder Review
**판정**: —  *(본인 작업)*

---

## Security Review
**판정**: REVISE
**최고 위험도**: MEDIUM

### 발견 사항
| 위험도 | 항목 | 위치 | 권고 조치 |
|--------|------|------|----------|
| MEDIUM | src/data/ 파일에 IRS 출처 URL 주석 없음 | federal-tax-2024.js:1 | 출처 URL 추가 |

---

## Marketing Review
**판정**: PASS
### SEO 영향: 없음

---

## Orchestrator 최종 판정
**결과**: REVISE
**지시**: Security REVISE 항목 수정 후 이터레이션 2 시작
**다음 담당**: Coder
```
