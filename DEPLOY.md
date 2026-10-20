# Deploying `royalexe.dev`

The site is a static site — no build step. This repo already contains:

- `CNAME` → `royalexe.dev`
- absolute canonical / Open Graph URLs for `https://royalexe.dev/`
- `.nojekyll` so GitHub Pages serves the files as-is

## 0. Buy the domain (the only step I can't do)

`royalexe.dev` appeared unclaimed when checked. Register it with:

- **Cloudflare Registrar** — at-cost, ~$10–11/year, free DNS and WHOIS privacy
- **Porkbun** — ~$11/year, easy DNS panel
- **Namecheap** — ~$11 first year

If you are a student, check the **GitHub Student Developer Pack → Name.com**
offer first. It includes a free domain for a year on select extensions, and
`.dev` is one of them.

> Confirm the price is standard at checkout. If it is marked "premium",
> pick `royalsec.dev` or `royalterminal.dev` instead and change `CNAME`,
> the canonical URL, and the Open Graph URLs.

## 1. Create the GitHub repo

Create a **public** repo named `royal-terminal` (or `royalexe.github.io` for
a root-level github.io URL).

From this folder:

```bash
git remote add origin git@github.com:royalexe/royal-terminal.git
git push -u origin main
```

Or upload the files through GitHub's web UI.

## 2. Enable GitHub Pages

Repo → **Settings → Pages → Build and deployment**

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**
- Save

Because `CNAME` is present, Pages will use `royalexe.dev` as the custom
domain. Register the domain first, or the github.io URL may redirect to an
unregistered domain.

## 3. DNS records

At your registrar / DNS host, create:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `royalexe.github.io` |

If the DNS panel supports an `ALIAS`/`ANAME` at the apex, `royalexe.github.io`
also works instead of the A/AAAA records.

**Cloudflare DNS:** set these records to **DNS only** (grey cloud) while
GitHub issues the TLS certificate. Do not proxy them at first.

## 4. Verify and force HTTPS

- In **Settings → Pages**, wait for the DNS check to pass.
- If GitHub asks for a TXT record to verify ownership, add the
  `_github-pages-challenge-*` record at your DNS host and click **Verify**.
- Tick **Enforce HTTPS** once the certificate is ready (can take up to 24h).
- `.dev` is HSTS-preloaded, so the site is HTTPS-only. GitHub's free
  certificate handles that.

## 5. Check it

```bash
dig +short royalexe.dev A
dig +short www.royalexe.dev CNAME
curl -I https://royalexe.dev
```

The site should be live at **https://royalexe.dev**.

## Optional: use Cloudflare Pages instead

If you register the domain at Cloudflare, you can skip the DNS table:

1. Cloudflare dashboard → **Workers & Pages → Create → Pages**
2. Upload the site folder (or connect the GitHub repo)
3. **Custom domains → Set up a domain** → `royalexe.dev`
4. Cloudflare handles DNS and TLS automatically

The `CNAME` file is ignored by Cloudflare Pages.
