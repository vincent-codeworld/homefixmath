# Site Outline — HomeFixMath (Minimal Static IA)

## Information architecture

```
/
├── index.html                 Home — value prop, calculator list, CTA
├── calculators/
│   ├── concrete.html          Live (lead tool)
│   ├── fence-panels.html      Live
│   ├── paint.html             Live (2026-10-28)
│   └── deck-boards.html       Live (2026-10-28)
├── privacy.html               Privacy policy
├── affiliate-disclosure.html  FTC disclosure (network-agnostic until signed)
└── about.html                 Mission, estimate disclaimer, contact
```

Later: `drywall.html`, `gravel-mulch.html` + short how-tos.

## Page briefs

| Page | Purpose | Must include |
| --- | --- | --- |
| Home | SEO hub + trust | H1, calculator cards (concrete first, then fence/paint/deck, 2 coming), disclosure in footer |
| Fence calculator | Core product | Working JS, formula notes, FAQ, shopping-list placeholders, disclosure |
| Privacy | Compliance | Data practices (v1: no accounts; disclose analytics if added) |
| Affiliate disclosure | FTC | Generic “may earn commission” until a network is live; then name it |
| About | Trust | Mission, estimate disclaimer, owner-operated |

## Stack recommendation: **Cloudflare Pages + plain HTML/CSS/JS**

1. **Free/cheap + global CDN** — enough for static calculators; no Node runtime for v1.
2. **Public URL in hours** — needed for SEO and for any affiliate network site review (Impact/CJ/ShareASale are lighter than Amazon’s 3-sale gate, but still want a real site).
3. **Same account as Cloudflare Registrar** — DNS → Pages in one place for `homefixmath.com`.

### Why not Vercel + Next (static) yet?

Adds tooling without Day-1 upside. Revisit for MDX content clusters later.

### Hosting checklist

- [ ] Cloudflare account (Vincent)
- [ ] Deploy `/workspace/homecalcmath/site`
- [ ] Attach domain + `www` redirect + HTTPS
- [ ] Footer everywhere: Privacy · Affiliate Disclosure · About

### Monetization posture

Amazon Associates **deferred**. Wire shopping CTAs after Vincent picks Impact / CJ / ShareASale (see `monetization-notes.md`).
