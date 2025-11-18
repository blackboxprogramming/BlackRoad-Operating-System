# Cloudflare DNS Blueprint
## Complete DNS Configuration for BlackRoad Universe

**Version:** 1.0
**Date:** 2025-11-18
**Purpose:** Canonical DNS configuration for all BlackRoad domains via Cloudflare

---

## Overview

This document provides the complete DNS setup for migrating all BlackRoad domains from GoDaddy DNS to Cloudflare DNS.

**Why Cloudflare?**
- Free tier includes: DNS, SSL, CDN, DDoS protection, Web Analytics
- Global anycast network (faster DNS resolution)
- CNAME flattening (allows root domain CNAMEs to Railway)
- Better security (WAF, rate limiting available)
- Future-ready for Workers, Zero Trust, edge functions

---

## Migration Process

### Step 1: Add Domain to Cloudflare

For each domain:

1. **Log in to Cloudflare dashboard**
2. Click **"Add a site"**
3. Enter domain (e.g., `blackroad.systems`)
4. Select **Free plan**
5. Cloudflare auto-scans existing DNS records from GoDaddy
6. Review scanned records, make adjustments (see configurations below)
7. Cloudflare provides 2 nameservers (e.g., `aaaa.ns.cloudflare.com`, `bbbb.ns.cloudflare.com`)

### Step 2: Update Nameservers at GoDaddy

For each domain:

1. **Log in to GoDaddy**
2. Go to **My Domains** → select domain → **Manage DNS**
3. Scroll to **Nameservers** section
4. Click **Change** → Select **Custom**
5. Enter Cloudflare nameservers (from Step 1)
6. Click **Save**
7. **Wait 5-60 minutes** for DNS propagation

### Step 3: Verify & Configure SSL

1. Return to Cloudflare dashboard
2. Wait for status to change from "Pending" to **"Active"**
3. Go to **SSL/TLS** → Set encryption mode to **"Full (strict)"**
4. Go to **SSL/TLS** → **Edge Certificates** → Enable **"Always Use HTTPS"**
5. Enable **"Automatic HTTPS Rewrites"**
6. Enable **"HTTP Strict Transport Security (HSTS)"** (optional, but recommended)

### Step 4: Optimize Performance

1. Go to **Speed** → **Optimization**
2. Enable **Auto Minify** (HTML, CSS, JS)
3. Enable **Brotli** compression
4. Enable **Rocket Loader** (optional - test first)
5. Go to **Caching** → Set **Browser Cache TTL** to "Respect Existing Headers"

---

## DNS Records Configuration

### Domain: blackroad.systems

**Purpose**: Flagship corporate site + OS application

| Type | Name | Target | TTL | Proxy | Notes |
|------|------|--------|-----|-------|-------|
| CNAME | @ | `blackroad-os-production.up.railway.app` | Auto | ✅ Proxied | Root domain → Railway (CNAME flattening) |
| CNAME | www | `blackroad.systems` | Auto | ✅ Proxied | www redirects to apex |
| CNAME | os | `blackroad.systems` | Auto | ✅ Proxied | Alternative OS alias |
| CNAME | api | `blackroad-os-production.up.railway.app` | Auto | ✅ Proxied | Explicit API subdomain |
| CNAME | prism | `blackroad-os-production.up.railway.app` | Auto | ✅ Proxied | Prism Console subdomain |
| CNAME | docs | `blackboxprogramming.github.io` | Auto | ✅ Proxied | GitHub Pages for docs |
| CNAME | cdn | `blackroad.systems` | Auto | ✅ Proxied | CDN alias (for future asset delivery) |
| TXT | @ | `v=spf1 include:_spf.google.com ~all` | Auto | - | SPF record (if using Google Workspace) |
| MX | @ | `1 aspmx.l.google.com` | Auto | - | Gmail MX (priority 1) |
| MX | @ | `5 alt1.aspmx.l.google.com` | Auto | - | Gmail MX (priority 5) |
| MX | @ | `5 alt2.aspmx.l.google.com` | Auto | - | Gmail MX (priority 5) |

**Page Rules** (Optional):
- `www.blackroad.systems/*` → Forwarding URL (301) → `https://blackroad.systems/$1`

---

### Domain: blackroad.ai

**Purpose**: Product console, admin interface

| Type | Name | Target | TTL | Proxy | Notes |
|------|------|--------|-----|-------|-------|
| CNAME | @ | `os.blackroad.systems` | Auto | ✅ Proxied | Alias to main OS |
| CNAME | www | `blackroad.ai` | Auto | ✅ Proxied | www → apex redirect |
| CNAME | console | `os.blackroad.systems` | Auto | ✅ Proxied | Explicit console subdomain |

**Page Rules**:
- `www.blackroad.ai/*` → Forwarding URL (301) → `https://blackroad.ai/$1`

---

### Domain: blackroad.network

**Purpose**: Developer hub, documentation, community

| Type | Name | Target | TTL | Proxy | Notes |
|------|------|--------|-----|-------|-------|
| CNAME | @ | `blackboxprogramming.github.io` | Auto | ✅ Proxied | GitHub Pages for docs |
| CNAME | www | `blackroad.network` | Auto | ✅ Proxied | www → apex redirect |
| CNAME | api | `blackroad-os-production.up.railway.app` | Auto | ✅ Proxied | API access for developers |
| CNAME | sandbox | `blackroad-os-staging.up.railway.app` | Auto | ✅ Proxied | Staging/sandbox environment |

**CNAME File** (for GitHub Pages):
Create file `CNAME` in your `docs/` or GitHub Pages root:
```
blackroad.network
```

**Page Rules**:
- `www.blackroad.network/*` → Forwarding URL (301) → `https://blackroad.network/$1`

---

### Domain: blackroad.me

**Purpose**: Personal identity portal, Pocket OS

| Type | Name | Target | TTL | Proxy | Notes |
|------|------|--------|-----|-------|-------|
| CNAME | @ | `os.blackroad.systems` | Auto | ✅ Proxied | Identity portal via main OS |
| CNAME | www | `blackroad.me` | Auto | ✅ Proxied | www → apex redirect |
| CNAME | id | `os.blackroad.systems` | Auto | ✅ Proxied | Explicit identity subdomain |

---

### Domain: lucidia.earth

**Purpose**: Narrative experiences, interactive storytelling (Phase 2)

| Type | Name | Target | TTL | Proxy | Notes |
|------|------|--------|-----|-------|-------|
| CNAME | @ | `blackboxprogramming.github.io` | Auto | ✅ Proxied | GitHub Pages (Phase 2) |
| CNAME | www | `lucidia.earth` | Auto | ✅ Proxied | www → apex redirect |
| CNAME | studio | `lucidia-studio.vercel.app` | Auto | ✅ Proxied | Lucidia Studio (Phase 3) |

**CNAME File** (for GitHub Pages):
```
lucidia.earth
```

---

### Domain: aliceqi.com

**Purpose**: ALICE QI research showcase (Phase 2)

| Type | Name | Target | TTL | Proxy | Notes |
|------|------|--------|-----|-------|-------|
| CNAME | @ | `blackboxprogramming.github.io` | Auto | ✅ Proxied | GitHub Pages |
| CNAME | www | `aliceqi.com` | Auto | ✅ Proxied | www → apex redirect |
| CNAME | research | `aliceqi.com` | Auto | ✅ Proxied | Research portal |
| CNAME | docs | `aliceqi.com` | Auto | ✅ Proxied | Technical documentation |

---

### Domain: blackroadqi.com

**Purpose**: Financial/quantitative intelligence product (Phase 2)

| Type | Name | Target | TTL | Proxy | Notes |
|------|------|--------|-----|-------|-------|
| CNAME | @ | `blackroadqi-app.up.railway.app` | Auto | ✅ Proxied | Dedicated QI app (Phase 2) |
| CNAME | www | `blackroadqi.com` | Auto | ✅ Proxied | www → apex redirect |
| CNAME | api | `blackroadqi-api.up.railway.app` | Auto | ✅ Proxied | QI API endpoint |

---

### Domain: roadwallet.com

**Purpose**: Wallet interface (alias to OS)

| Type | Name | Target | TTL | Proxy | Notes |
|------|------|--------|-----|-------|-------|
| CNAME | @ | `os.blackroad.systems` | Auto | ✅ Proxied | Alias to main OS wallet |
| CNAME | www | `roadwallet.com` | Auto | ✅ Proxied | www → apex redirect |

---

### Domain: aliceos.io

**Purpose**: Legacy alias (points to main OS)

| Type | Name | Target | TTL | Proxy | Notes |
|------|------|--------|-----|-------|-------|
| CNAME | @ | `os.blackroad.systems` | Auto | ✅ Proxied | Legacy domain |
| CNAME | www | `aliceos.io` | Auto | ✅ Proxied | www → apex redirect |

---

### Domain: blackroadquantum.com

**Purpose**: Quantum research hub (Phase 2)

| Type | Name | Target | TTL | Proxy | Notes |
|------|------|--------|-----|-------|-------|
| CNAME | @ | `blackboxprogramming.github.io` | Auto | ✅ Proxied | GitHub Pages |
| CNAME | www | `blackroadquantum.com` | Auto | ✅ Proxied | www → apex redirect |
| CNAME | lab | `quantum-lab.up.railway.app` | Auto | ✅ Proxied | Quantum Lab app (Phase 2) |

---

## Advanced Configuration

### SSL/TLS Settings

**For all domains**:

1. **Encryption Mode**: Full (strict)
   - Cloudflare ↔ Railway: encrypted with valid cert

2. **Edge Certificates**:
   - ✅ Always Use HTTPS
   - ✅ Automatic HTTPS Rewrites
   - ✅ Certificate Transparency Monitoring
   - ✅ TLS 1.3 (enabled by default)

3. **HSTS** (HTTP Strict Transport Security):
   - ✅ Enable HSTS
   - Max Age: 6 months (15768000 seconds)
   - ✅ Include subdomains
   - ❌ Preload (wait until stable, then enable)

### Caching Rules

**Static Assets** (CSS, JS, images):
```
Cache Level: Standard
Browser Cache TTL: Respect Existing Headers
Edge Cache TTL: 1 month
```

**API Endpoints** (`/api/*`):
```
Cache Level: Bypass
(Don't cache API responses)
```

**Page Rules Example** (`blackroad.systems`):
```
Rule 1: *blackroad.systems/api/*
  - Cache Level: Bypass
  - Disable Apps
  - Disable Performance

Rule 2: *blackroad.systems/*.css
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 day

Rule 3: *blackroad.systems/*.js
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 day

Rule 4: www.blackroad.systems/*
  - Forwarding URL: 301 redirect to https://blackroad.systems/$1
```

### Firewall Rules

**Block known bots** (optional):
```
Field: User Agent
Operator: contains
Value: "BadBot|Scraper|AhrefsBot"
Action: Block
```

**Rate Limiting** (protect API):
```
Field: URI Path
Operator: starts with
Value: /api/
Rate: 100 requests per minute
Action: Challenge (CAPTCHA)
```

### Security Headers

**Via Cloudflare Workers** (optional, advanced):

Create a Worker to add security headers:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newHeaders = new Headers(response.headers)

  // Security headers
  newHeaders.set('X-Frame-Options', 'DENY')
  newHeaders.set('X-Content-Type-Options', 'nosniff')
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
```

---

## Verification Checklist

After DNS setup for each domain:

- [ ] **DNS Propagation**: Check with `dig <domain>` or https://dnschecker.org
- [ ] **SSL Certificate**: Visit `https://<domain>` - should show valid cert (🔒)
- [ ] **WWW Redirect**: Visit `https://www.<domain>` - should redirect to apex
- [ ] **HTTP → HTTPS**: Visit `http://<domain>` - should redirect to HTTPS
- [ ] **API Endpoint**: Test `curl https://<domain>/health` (if applicable)
- [ ] **Cloudflare Analytics**: Check Cloudflare dashboard → Analytics tab

---

## Automation Script

**File**: `scripts/cloudflare/sync_dns.py`

```python
#!/usr/bin/env python3
"""
Sync DNS records from ops/domains.yaml to Cloudflare

Usage:
  export CF_API_TOKEN="your-token"
  export CF_ZONE_ID="your-zone-id"
  python scripts/cloudflare/sync_dns.py
"""

import os
import sys
import yaml
import requests
from typing import Dict, List

CF_API_TOKEN = os.getenv("CF_API_TOKEN")
CF_ZONE_ID = os.getenv("CF_ZONE_ID")
CF_API_BASE = "https://api.cloudflare.com/client/v4"

def load_domains() -> Dict:
    """Load domain config from ops/domains.yaml"""
    with open("ops/domains.yaml") as f:
        return yaml.safe_load(f)

def get_existing_records(zone_id: str) -> List[Dict]:
    """Fetch all DNS records for a zone"""
    url = f"{CF_API_BASE}/zones/{zone_id}/dns_records"
    headers = {
        "Authorization": f"Bearer {CF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()["result"]

def create_dns_record(zone_id: str, record: Dict) -> Dict:
    """Create a DNS record"""
    url = f"{CF_API_BASE}/zones/{zone_id}/dns_records"
    headers = {
        "Authorization": f"Bearer {CF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    response = requests.post(url, headers=headers, json=record)
    response.raise_for_status()
    return response.json()["result"]

def update_dns_record(zone_id: str, record_id: str, record: Dict) -> Dict:
    """Update a DNS record"""
    url = f"{CF_API_BASE}/zones/{zone_id}/dns_records/{record_id}"
    headers = {
        "Authorization": f"Bearer {CF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    response = requests.put(url, headers=headers, json=record)
    response.raise_for_status()
    return response.json()["result"]

def sync_records():
    """Sync DNS records from domains.yaml to Cloudflare"""
    if not CF_API_TOKEN or not CF_ZONE_ID:
        print("Error: CF_API_TOKEN and CF_ZONE_ID must be set")
        sys.exit(1)

    config = load_domains()
    existing = get_existing_records(CF_ZONE_ID)

    # Build index of existing records
    existing_index = {
        f"{r['type']}:{r['name']}": r for r in existing
    }

    for domain in config.get("domains", []):
        if domain.get("mode") != "dns":
            continue

        record_data = {
            "type": domain["record"]["type"],
            "name": domain["name"],
            "content": domain["record"]["value"],
            "ttl": 1,  # Auto
            "proxied": True  # Enable Cloudflare proxy
        }

        key = f"{record_data['type']}:{record_data['name']}"

        if key in existing_index:
            # Update existing
            record_id = existing_index[key]["id"]
            print(f"Updating: {key}")
            update_dns_record(CF_ZONE_ID, record_id, record_data)
        else:
            # Create new
            print(f"Creating: {key}")
            create_dns_record(CF_ZONE_ID, record_data)

    print("✅ DNS sync complete!")

if __name__ == "__main__":
    sync_records()
```

**Make executable**:
```bash
chmod +x scripts/cloudflare/sync_dns.py
```

---

## Troubleshooting

### DNS Not Resolving

**Problem**: `dig blackroad.systems` returns no results

**Solutions**:
1. Check nameservers are updated at GoDaddy
2. Wait 5-60 minutes for propagation
3. Verify zone is "Active" in Cloudflare dashboard
4. Check DNS records exist in Cloudflare

### SSL Certificate Errors

**Problem**: Browser shows "Not Secure" or certificate error

**Solutions**:
1. Check SSL/TLS mode is "Full (strict)" in Cloudflare
2. Verify Railway app has valid SSL cert
3. Check "Always Use HTTPS" is enabled
4. Wait a few minutes for edge certificate provisioning

### Site Not Loading

**Problem**: Domain resolves but site doesn't load

**Solutions**:
1. Check Railway app is deployed and healthy
2. Verify custom domain is added in Railway dashboard
3. Check Railway logs for errors: `railway logs --service backend`
4. Test Railway URL directly (e.g., `your-app.up.railway.app`)

### Mixed Content Warnings

**Problem**: Page loads but some assets show as insecure

**Solutions**:
1. Enable "Automatic HTTPS Rewrites" in Cloudflare
2. Update hard-coded `http://` URLs to `https://` in code
3. Use protocol-relative URLs: `//example.com/asset.js`

---

## Maintenance

**Monthly**:
- Review Cloudflare analytics
- Check SSL certificate status
- Review firewall logs (if WAF enabled)

**Quarterly**:
- Audit DNS records (remove unused)
- Review page rules and caching
- Update security headers if needed

**Annually**:
- Review Cloudflare plan (consider Pro if traffic grows)
- Audit all domain registrations (renew at GoDaddy)
- Review and update security policies

---

## References

- **Cloudflare Docs**: https://developers.cloudflare.com/dns/
- **Railway Custom Domains**: https://docs.railway.app/deploy/custom-domains
- **DNS Checker**: https://dnschecker.org
- **SSL Labs Test**: https://www.ssllabs.com/ssltest/

---

**This blueprint ensures all BlackRoad domains are properly configured with Cloudflare for optimal performance, security, and reliability.**
