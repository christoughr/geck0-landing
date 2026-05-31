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

1. **Turnstile** → Add Widget
2. Name: `geck0-landing`
3. Hostnames: `geck0.ai`, `www.geck0.ai`, `app.geck0.ai`
4. Create → Site Key / Secret Key → Vercel env

---

## Mailchimp SPF/DKIM (Cloudflare DNS에 추가)

Mailchimp → Domains → Verify `geck0.ai` → 안내하는 레코드를 Cloudflare DNS에 **Add record**로 추가.

---

## 체크리스트

- [ ] Cloudflare DNS: `@`, `www`, `app` → Vercel
- [ ] SSL: Full (strict)
- [ ] https://geck0.ai → 200
- [ ] https://www.geck0.ai → geck0.ai 리다이렉트
- [ ] https://app.geck0.ai → 앱 셸
- [ ] Turnstile widget 생성 + Vercel keys
- [ ] Mailchimp domain verify records
