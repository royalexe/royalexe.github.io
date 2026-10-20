# royal@sec — terminal portfolio

A dark, CRT-flavoured personal site: window chrome, pixel type, orange accents,
a Gargantua-black-hole wallpaper, and a working fake shell.

## View it

```bash
xdg-open index.html
# or
python3 -m http.server 8090
# → http://localhost:8090
```

No build step, no dependencies. Drop the folder on any static host
(GitHub Pages, Netlify, Vercel, Cloudflare Pages) and it works.

**Production URL:** `https://royalexe.dev` — see [`DEPLOY.md`](DEPLOY.md) for
the domain/DNS checklist.

## Files

| File | What it does |
| --- | --- |
| `index.html` | All content and page structure |
| `styles.css` | Theme, window chrome, layout, responsive rules |
| `app.js` | Clock, nav highlight, typing effect, spotlight, copy button, interactive shell |
| `assets/cat.jpg` | Profile photo |
| `assets/blackhole.jpg` | Full-page background |
| `assets/og.jpg` | 1200×630 link-preview image |
| `CNAME` | Custom domain for GitHub Pages |
| `DEPLOY.md` | Domain + GitHub Pages instructions |

## Make it yours

Everything is plain HTML/CSS — no framework. The live links already point at:

- GitHub — `https://github.com/royalexe`
- X — `https://x.com/royal_govv`
- Email — `royal.exe@proton.me`

1. **Name / handle** — search for `royal` and `royal@sec` in `index.html`.
2. **Bio** — the two `.bio` paragraphs in the `Profile.exe` window.
3. **Email** — if it ever changes, update `royal.exe@proton.me` in the profile
   button, the contact section, and `data-email` on the copy button.
4. **Social links** — the `href`s in `actions`, `.socials`, and the footer.
5. **Domains / projects / writing** — edit the content inside `focus.dir`,
   `projects.dir`, and `writeups.log`. The four project cards are demo copy;
   replace the names and descriptions with your real repos, then swap the
   row links to point at the specific repositories.
6. **Colors** — top of `styles.css`: `--orange`, `--panel`, `--bright`, etc.
7. **Photos** — swap `assets/cat.jpg` (square profile photo) and
   `assets/blackhole.jpg` (background) and keep the filenames.
8. **Shell commands** — the `commands` object in `app.js`. Add your own:

```js
mycommand() { print('hello from the other side'); },
```

## Notes

- The shell is entirely client-side; it can't touch your machine. Try `socials`,
  `copy email`, `banner` and `neofetch` — `tab` autocompletes commands.
- The contact "form" is a `mailto:` link + copy-to-clipboard button. To collect
  messages properly, swap it for a Formspree/Netlify form.
- The profile photo lives at `assets/cat.jpg`; the scanlines and frame are CSS.
- Animations respect `prefers-reduced-motion`.
