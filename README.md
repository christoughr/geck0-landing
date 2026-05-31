# geck0 — Landing Page

## 빠른 시작 (Cursor에서)

```bash
npm install
npm run dev
```

→ `http://localhost:3000` 에서 확인

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx        # 메타데이터, 폰트 (Inter)
│   ├── page.tsx          # 메인 페이지 (모든 섹션 조합)
│   └── globals.css       # 기본 스타일, CSS 변수
│
└── components/
    ├── Navbar.tsx         # 고정 네비게이션 바 (스크롤 감지)
    ├── Hero.tsx           # 히어로 섹션 + 시냅스 캔버스 애니메이션
    ├── Problem.tsx        # 문제 제시 (지식 사일로, 유실, 반복 실수)
    ├── Features.tsx       # 3가지 핵심 기능 카드
    ├── HowItWorks.tsx     # 작동 원리 3단계 + 연동 서비스 목록
    ├── SocialProof.tsx    # 지표 4개 + 고객 후기 3개
    ├── Pricing.tsx        # 3단계 가격 플랜
    └── CtaFooter.tsx      # 이메일 CTA + 푸터
```

---

## 브랜드 컬러 (tailwind.config.ts)

| 토큰 | 색상 | 용도 |
|------|------|------|
| `purple-400` | `#7F77DD` | 주색 — 로고, CTA, 링크 |
| `teal-400`   | `#1D9E75` | 성장/성공 상태 |
| `coral-400`  | `#D85A30` | 변화/에너지/경고 |
| `navy-900`   | `#1A1A2E` | 주 배경 |

---

## 커스터마이징 체크리스트

### 텍스트 교체
- `src/components/Hero.tsx` — 메인 헤드라인, 서브 카피
- `src/components/SocialProof.tsx` — 실제 고객 후기로 교체
- `src/components/Pricing.tsx` — 실제 가격으로 업데이트
- `src/app/layout.tsx` — 메타 description, OG 이미지

### 기능 추가 권장
- `framer-motion` 이미 설치됨 — 섹션 등장 애니메이션 추가 가능
- `src/components/Hero.tsx`의 `SynapseCanvas` — 노드 수, 색상, 속도 조정 가능
- CTA 폼 → 실제 이메일 수집 서비스 연동 (Mailchimp, ConvertKit 등)
- Navbar CTA → 실제 회원가입 페이지 링크 연결

### 이미지 추가
- `/public` 폴더에 OG 이미지 (`og-image.png`, 1200×630) 추가
- 로고 SVG → `src/components/Navbar.tsx`의 텍스트 로고를 `<Image>`로 교체 가능

---

## 배포 (Vercel 권장)

```bash
npx vercel --prod
```

또는 Vercel 대시보드에서 GitHub 레포 연결

---

## 브랜드 가이드라인

전체 브랜드 가이드라인은 `../geck0_brand_guidelines.docx` 참고

**핵심 원칙:**
- 이름은 항상 소문자 `geck0` (절대 대문자 금지)
- 태그라인: `지식이 연결될 때, 회사가 진화합니다`
- 톤: 지적이되 가볍게, 기술 언어 최소화

---

*geck0 Landing v1.0 · 2024*
