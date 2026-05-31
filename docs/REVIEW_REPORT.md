# geck0 Landing Page — Review & Changes Report
> 작업일: 2026-05-31 | 검토 버전: commit e90cabf

---

## 1. SynapseCanvas v4 (`SynapseCanvas.tsx`)

### 핵심 문제 (v3)
| 문제 | 원인 |
|------|------|
| 180프레임마다 그래프 재빌드 → 엣지 깜빡임 | `buildGraph` 반복 호출 |
| 평면적, generic particle 느낌 | 모든 노드가 동일 tier |
| 허브 노드 구분 약함 | halo/glow 수치 낮음 |
| 펄스가 랜덤 점프 | BFS 없이 random edge 선택 |

### v4 변경 사항

**그래프 아키텍처**
- 그래프를 **한 번만 빌드** (rebuild 없음) → 깜빡임 완전 제거
- 베지에 제어점도 **stable offset**으로 저장 (매 프레임 재계산 X)
- 노드를 3 tier로 분리: `far-bg (0)` / `mid (1)` / `hub (2)`
  - far-bg는 dim하게, hub는 밝고 크게 → 실제 깊이감
- Hub ↔ mid ↔ far 연결 규칙으로 tier-0끼리 연결 방지 (clean topology)

**시각 개선**
- Hub 노드: 이중 halo + ring + 밝은 코어 → "시냅스 소마(soma)" 느낌
- Mid 노드: 중간 크기 halo + 흰색 코어
- Far-bg 노드: 작고 dim → 배경 깊이
- 시냅스 bulb: hub-connected 엣지 중간점에 흰 점 (기존 유지, 크기 개선)
- 엣지 opacity: tier에 따라 계층화 (`depthFactor`)

**펄스 시스템**
- 도착 시 **인접 엣지를 따라 연속 이동** (BFS-style rerouting)
  - `adjList` 빌드 후 `reroute()` 함수로 처리
  - 네트워크를 따라 전파하는 시냅스 신호 느낌
- **comet trail**: 6단계 샘플로 부드러운 꼬리 구현
- 펄스 head: 외부 glow + 밝은 dot + 흰 코어 (3단계)

**물리**
- 노드마다 `baseX/baseY` (초기 위치) → spring으로 복귀
  - 드리프트 방지, graph rebuild 불필요의 근거
- damping: tier별 차등 (`hub: 0.997`, `mid: 0.996`, `far: 0.999`)
- hub 마우스 attraction range 160px, mid 90px

**성능/접근성**
- `prefers-reduced-motion`: pulse 0개, halo/ring 생략
- mobile: node/signal 수 감소 유지
- 타입 안전: `tier: 0 | 1 | 2` union type

---

## 2. 전체 프로젝트 리뷰 & Quick Wins

### 🔴 버그 수정

#### `src/app/api/health/route.ts`
```
// Before (버그): startedAt이 항상 Date.now() → 분기 의미 없음
const startedAt = process.env.VERCEL_DEPLOYMENT_ID ? Date.now() : Date.now();

// After: module-level 상수로 실제 uptime 추적
const BOOT_TIME = Date.now();
```

#### `middleware.ts`
- 리다이렉트 응답에도 보안 헤더 적용 (기존은 일부 누락)
- `applySecurityHeaders()` 함수로 DRY 처리

### 🟡 보안/컴플라이언스

#### `CookieConsent.tsx`
- **Decline 버튼 추가** — GDPR/PIPL 상 "opt-in"이 되려면 거부 옵션 필수
- `role="dialog"` + `aria-live="polite"` 추가
- 거부 시 `declined` 값 localStorage에 저장 (재표시 방지)

#### `vercel.json`
- `app.geck0.ai` redirect `permanent: false → true` (301로 SEO 이점)

#### `next.config.mjs`
- `X-DNS-Prefetch-Control` 헤더 추가
- 보안 헤더 블록 추가 (middleware 보완용)

### 🟢 DX / 접근성

#### `ContactForm.tsx`
- `autoComplete="name"/"email"` 추가
- 버튼 `aria-busy` 속성
- status 메시지 `aria-live="polite"` 감싸기
- loading 텍스트 `"..."` → semantic span (스크린리더 오발음 방지)

#### `src/lib/rate-limit.ts`
- in-memory 특성 + 서버리스 cold start 동작 주석 추가
- KV store 마이그레이션 경로 안내

#### `Hero.tsx`
- Blur orb opacity 소폭 증가 (`0.08→0.12`, `0.06→0.09`)
  - v4 캔버스와 시너지, 헤드라인 배경 깊이감 향상

---

## 3. 추가 권장 사항 — ✅ 구현 완료 (commit after 249eef6)

| # | 항목 | 처리 |
|---|------|------|
| 1 | GET `/api/subscribe` config 노출 | admin 인증 시 `{ ok: true }`만 반환 |
| 2 | OG 이미지 절대 경로 | `getOgImageUrl()` → metadata + blog |
| 3 | hreflang 무의미 duplicate | `?lang=ko` / `?lang=en` alternates + x-default |
| 4 | contact-store race condition | submission별 unique blob (`contacts/{day}/{id}.json`) |
| 5 | JsonLd logo | `ImageObject` + `favicon.svg` 절대 URL |
| 6 | sitemap lastModified | 빌드 타임 고정 (`VERCEL_GIT_COMMIT_DATE` fallback) |
| 7 | globals.css `.synapse-node` | 미사용 keyframe 제거 |
| 8 | Navbar scroll lock | `body.nav-scroll-lock` on mobile menu |
| 9 | ESLint version mismatch | eslint@8 + eslint-config-next@14.2.35 |

---

## 4. 파일 배치 가이드

수정된 파일을 프로젝트에 적용하는 방법:

```
SynapseCanvas.tsx  → src/components/SynapseCanvas.tsx
CookieConsent.tsx  → src/components/CookieConsent.tsx
ContactForm.tsx    → src/components/ContactForm.tsx
Hero.tsx           → src/components/Hero.tsx
health_route.ts    → src/app/api/health/route.ts
middleware.ts      → middleware.ts
next.config.mjs    → next.config.mjs
rate-limit.ts      → src/lib/rate-limit.ts
translations.ts    → src/lib/i18n/translations.ts
vercel.json        → vercel.json
```

빌드 확인:
```bash
npm run build
# Google Fonts 접근 가능 환경에서 통과 확인
# TypeScript 에러: 0개 (tsc --noEmit --skipLibCheck 기준)
```
