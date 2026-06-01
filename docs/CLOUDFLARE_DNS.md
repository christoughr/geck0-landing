# Cloudflare DNS 설정 (name.com → Cloudflare 이전 후)

## 사이트가 안 보일 때 — 먼저 확인

**전 세계 기준 geck0.ai는 살아있을 수 있습니다.** DNS 전파는 최대 24–48시간 걸립니다.

```bash
# 터미널에서
curl -I https://geck0.ai
nslookup geck0.ai 8.8.8.8
```

- `8.8.8.8` 결과 NS가 `*.ns.cloudflare.com` → Cloudflare 전환 **완료**
- HTTP `200` → 사이트 **정상**

로컬 PC만 안 되면: `ipconfig /flushdns` (Windows) 후 재시도.

---

## Cloudflare DNS 레코드 (Vercel)

Cloudflare Dashboard → **geck0.ai** → **DNS** → **Records**

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| `A` | `@` | `76.76.21.21` | DNS only (회색) 권장 |
| `CNAME` | `www` | `cname.vercel-dns.com` | DNS only |
| `CNAME` | `app` | `cname.vercel-dns.com` | DNS only |

> Vercel 프로젝트에 도메인이 이미 연결되어 있으면 위 값으로 맞추면 됩니다.

### SSL/TLS (Cloudflare)

**SSL/TLS** → **Overview** → **Full (strict)** 권장

---

## name.com에서 한 일

Registrar에서 nameserver를 Cloudflare로 바꿨다면:

```
penny.ns.cloudflare.com
ajay.ns.cloudflare.com
```

(name.com 패널의 NS 목록과 Cloudflare가 준 NS가 **일치**해야 함)

이후 DNS는 **name.com이 아니라 Cloudflare**에서만 수정합니다.

---

## Turnstile (같은 Cloudflare 계정)

1. **Turnstile** → Add Widget → Name: `geck0-landing`
2. Hostname 입력 후 **「+ Add a hostname」** 클릭 (목록에 들어가야 함)
3. `geck0.ai`, `www.geck0.ai`, `app.geck0.ai` 각각 Add
4. 빨간 **「At least 1 hostname must be added」** 없어지면 **Create**
5. Site Key + Secret Key → Vercel env → redeploy

---

## Mailchimp DKIM (Cloudflare)

**Authentication in progress** 일 때 Cloudflare DNS:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `k1._domainkey` | `dkim1.mcsv.net` | **DNS only (회색)** |
| CNAME | `k2._domainkey` | `dkim2.mcsv.net` | DNS only |
| CNAME | `k3._domainkey` | `dkim3.mcsv.net` | DNS only |

> ⚠️ `k1._domainkey`가 **Proxied(주황)** 이면 인증 실패. DKIM/MX/TXT는 DNS only.

Mailchimp에서 **Restart Authentication** 또는 24h 대기.

---

## Mailchimp SPF (선택)

Google Workspace SPF는 이미 있음: `v=spf1 include:_spf.google.com ~all`  
Mailchimp 발송도 쓰려면 Mailchimp 안내에 따라 SPF에 `include:servers.mcsv.net` 추가.

---

## 체크리스트

- [ ] Cloudflare DNS: `@`, `www`, `app` → Vercel
- [ ] SSL: Full (strict)
- [ ] https://geck0.ai → 200
- [ ] https://www.geck0.ai → geck0.ai 리다이렉트
- [ ] https://app.geck0.ai → 앱 셸
- [ ] Turnstile widget 생성 + Vercel keys
- [ ] Mailchimp domain verify records

---

## Cloudflare vs Turnstile (봇·스팸 방지)

**DNS를 Cloudflare(오렌지 구름)로 두는 것만으로는 접속 시 CAPTCHA/challenge 페이지가 자동으로 뜨지 않습니다.**  
프록시는 트래픽을 Vercel로 넘기고 SSL·캐시·DDoS 보호을 제공합니다.

| 방식 | 역할 | geck0 적용 |
|------|------|------------|
| **Turnstile** | 폼 제출 시 봇 검증 (CAPTCHA 대체) | 웨이트리스트·문의 폼 + API 서버 검증 ✅ |
| **Bot Fight Mode** | Cloudflare 대시보드에서 켜는 저비용 봇 차단 | 선택 (대시보드 설정) |
| **Under Attack Mode** | 전체 사이트 challenge (접속 시 interstitial) | DDoS/어뷰징 급증 시에만 권장 |

**권장:** 폼은 Turnstile(이미 구현), DNS는 Cloudflare 프록시 유지.  
전역 challenge가 필요하면 Cloudflare → **Security → Settings → Bot Fight Mode** 또는 **Under Attack Mode**를 켜세요.  
코드 변경 없이 대시보드에서만 설정 가능합니다.
