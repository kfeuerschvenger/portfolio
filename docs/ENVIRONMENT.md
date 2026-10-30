<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/header-strip-dark.svg">
  <img src="assets/brand/header-strip-light.svg" alt="kfeuerschvenger" width="100%">
</picture>

# Environment

Everything needed to run the site on a laptop and to ship it behind a reverse proxy. The application itself reads no environment variables: the only two that matter belong to the deployment.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "JetBrains Mono, Consolas, monospace", "primaryColor": "#090a0c", "primaryBorderColor": "#00ff00", "primaryTextColor": "#00ff00", "lineColor": "#357d35", "textColor": "#357d35", "edgeLabelBackground": "#090a0c"}}}%%
flowchart LR
  SRC["src and index.html"] -->|npm run build| DIST[dist]
  DIST -->|COPY --from builder| NGX["nginx:alpine"]
  CONF[nginx.conf template] -->|envsubst at start| NGX
  NGX -->|port 80| NPM[nginx-proxy-manager]
  NPM --> WEB[feuerschvenger.com]
  classDef amber fill:#090a0c,stroke:#ffbf00,color:#ffbf00
  classDef cyan fill:#090a0c,stroke:#00ffff,color:#00ffff
  class NPM amber
  class WEB cyan
```

## Local development

You need Node 22 (the repository pins it in `.nvmrc` and `engines`, so `nvm use` picks the right one) and npm.

```bash
npm ci
npm run dev
```

The dev server listens on http://localhost:5173.

| Script | What it does |
|---|---|
| `npm run dev` | The Vite dev server, after `predev` |
| `npm run build` | `tsc -b` then `vite build` into `dist/`, after `prebuild` |
| `npm run preview` | Serves `dist/` on http://localhost:4173 |
| `npm run lint` | ESLint over every `.ts` and `.tsx` file |
| `npm test` | The Vitest suite, see [TESTING.md](TESTING.md) |
| `npm run test:coverage` | The same suite with v8 coverage |
| `npm run showcase` | Retakes every screenshot and the hero animation, see [CUSTOMIZATION.md](CUSTOMIZATION.md) |

> [!IMPORTANT]
> Use the npm scripts, not `vite` directly. `predev` and `prebuild` run `scripts/copy-social-preview.mjs`, which copies `docs/assets/brand/social-preview.png` into `public/`. Skipping the hook leaves `/social-preview.png` missing and the Open Graph image broken.

## Fonts

The page loads JetBrains Mono and Fira Code from Google Fonts at runtime, so the first paint needs internet access. Offline, the browser falls back to its default monospace font. The Content Security Policy allows `fonts.googleapis.com` for styles and `fonts.gstatic.com` for font files and nothing else third party.

## Docker

The `Dockerfile` has two stages: a `node:22-alpine` builder that runs `npm ci` and `npm run build`, and an `nginx:alpine` runtime that receives `dist/`, the `nginx.conf` template, the security headers snippet and an entrypoint check.

```bash
docker build -t portfolio .
docker run --rm -p 8080:80 portfolio
```

Then open http://localhost:8080. The container accepts one variable, `TRUSTED_PROXY_CIDR`, described below.

## Docker Compose behind nginx-proxy-manager

`docker-compose.yml` builds the image, names the container `portfolio-kfeuerschvenger`, restarts it unless stopped and attaches it to an external network so nginx-proxy-manager can reach it. It publishes no port. TLS, the domain and the proxy host live in the nginx-proxy-manager UI, not in this repository.

```bash
docker network ls
docker network inspect <network>
docker compose up -d --build
```

| Variable | Required | Meaning |
|---|---|---|
| `PROXY_NETWORK` | Yes | Name of the Docker network nginx-proxy-manager is attached to, for example `npm_default`. Compose refuses to start without it |
| `TRUSTED_PROXY_CIDR` | No | The network the proxy connects from, trusted for `X-Forwarded-For` so rate limits count real visitors. Default `172.16.0.0/12`, the whole Docker bridge range. Narrow it to the proxy network subnet |

Put both in an untracked `.env` file next to the compose file, using `.env.example` as the template.

```text
PROXY_NETWORK=npm_default
TRUSTED_PROXY_CIDR=172.18.0.0/16
```

> [!WARNING]
> The default range trusts every container on every bridge network, so any of them could spoof a client address. Set `TRUSTED_PROXY_CIDR` to the proxy network subnet in every real deployment.

To reach the site without the proxy, uncomment the `ports` block in the compose file. The healthcheck calls `/health` every 30 seconds.

## What nginx does

`nginx.conf` is an envsubst template. The image entrypoint renders it into `conf.d/default.conf` at start-up, substituting only `TRUSTED_PROXY_CIDR`. Before that, `docker/18-check-trusted-proxy.sh` validates the value and stops the container with a message naming the variable when it is empty or not a valid IPv4 or IPv6 address or CIDR.

| Area | Behaviour |
|---|---|
| Real client address | `set_real_ip_from` the trusted range, `X-Forwarded-For` as the header |
| Rate limits | Three zones keyed by client address, with bursts: 10 requests per second for `index.html` and `/health`, 30 for assets and 20 for everything else, plus 10 connections per address |
| Single page fallback | Unknown paths get `index.html` with a 200, so deep links reach the router |
| Caching | Hashed assets `public, max-age=31536000, immutable`. `index.html` `no-cache, no-store, must-revalidate`. Other `.html` files one hour. One `Cache-Control` header each |
| Brand files | Favicons, manifest icons, the manifest and the social preview have their own locations with sensible cache lifetimes |
| Compression | gzip level 6 for text types |
| `/health` | Returns `200 healthy` as plain text |
| Blocked | Requests for `.php`, `.jsp`, `.cgi`, `.asp`, WordPress paths and dotfiles get a plain 404. Scanner user agents (sqlmap, nikto, masscan, zgrab, nmap) get a 403. Crawlers and link previews are welcome |
| Errors | A plain text 404 for missing files and a 429 with `Retry-After` |

<details>
<summary>Security headers</summary>

Set with `always` in `security-headers.conf` and included at server level and in every location that defines its own `add_header`, because nginx drops inherited headers in such a location.

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'` |
| `Strict-Transport-Security` | `max-age=31536000` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `no-referrer-when-downgrade` |

`style-src` keeps `'unsafe-inline'` because React writes inline `style` attributes.

</details>

## Troubleshooting

| Symptom | Check |
|---|---|
| `docker compose up` stops with `Set PROXY_NETWORK` | Export `PROXY_NETWORK` or create `.env` from `.env.example`, and make sure the network exists in `docker network ls` |
| The container exits at start-up naming `TRUSTED_PROXY_CIDR` | The value is empty or malformed. Use one IPv4 or IPv6 address or CIDR, no lists |
| Every visitor shares one rate limit | `TRUSTED_PROXY_CIDR` does not contain the proxy address, so nginx sees the proxy and not the visitor |
| 502 from nginx-proxy-manager | The container and the proxy are not on the same network, or the proxy host points at the wrong container name or port 80 |
| The social preview is missing in development | `vite` was started directly. Use `npm run dev`, or run `node scripts/copy-social-preview.mjs` once |
| Text renders in a default monospace font | The Google Fonts request was blocked or the machine is offline |
| A change to the page does not show | `index.html` is never cached, but hashed assets are immutable: rebuild the image and hard refresh |

---

[Back to the README](../README.md) · Previous: [Architecture](ARCHITECTURE.md) · Next: [Customization](CUSTOMIZATION.md)
