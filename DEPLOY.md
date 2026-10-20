# Deploying `royalexe.dev`

The site is a static site — no build step. The current free deployment is
**<https://royalexe.github.io/>**. This repo contains:

- canonical / Open Graph URLs for `https://royalexe.github.io/`
- `.nojekyll` so GitHub Pages serves the files as-is
- no `CNAME` yet, so the free github.io URL works

When the custom domain is ready, add a `CNAME` file containing the domain and
update the canonical / Open Graph URLs to match.

## 0. Get the domain

`royalexe.dev` appeared unclaimed when checked.

### Student route — free first year

The **GitHub Student Developer Pack** includes a free one-year domain from
**Name.com** on select extensions, including `.dev`. You must apply and verify
your student status yourself — GitHub needs your school email or enrollment
document, and I can't submit that for you.

1. Sign in to GitHub, enable two-factor authentication if you haven't already,
   then open **<https://github.com/settings/education/benefits>**.
2. Under **GitHub Education**, click **Start an application**.
3. Choose **Student**, select your school, and use your school-issued email if
   you have one. If you don't, upload one of:
   - school ID with a current enrollment date
   - current class schedule
   - transcript
   - enrollment/admission verification letter
4. Submit the application. Approval can be quick, but allow a few days.
5. After approval, open the **GitHub Education portal** (or the Pack page),
   find the **Name.com** offer under **Domains**, and click **Get offer**.
6. Create a Name.com account using the **same email as your GitHub account**.
   Use a permanent email you control — not a temporary one.
7. Search for `royalexe.dev`, add it to the cart, and apply the Student Pack
   offer at checkout. The first year should be free; renewal is paid.
8. Continue with [Step 1](#1-create-the-github-repo).

Notes:

- The offer covers one standard domain for one year. It does not cover
  premium/aftermarket names.
- Name.com may require a payment method for renewal/identity checks. The
  first-year discount should still apply.
- If checkout doesn't show the discount, log out of both GitHub and Name.com,
  sign back in, and reopen the offer from the Pack page. If it still fails,
  contact Name.com support before paying.
- If `.dev` isn't eligible when you claim it, use another extension from the
  offer, or fall back to the paid route below.

### Paid route

Register it with:

- **Cloudflare Registrar** — at-cost, ~$10–11/year, free DNS and WHOIS privacy
- **Porkbun** — ~$11/year, easy DNS panel
- **Namecheap** — ~$11 first year

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

At your registrar / DNS host, create the records below. At **Name.com**:
**My Domains → `royalexe.dev` → Manage DNS**. Remove any default parking
A/CNAME records for `@` or `www` first, or they will conflict.

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
