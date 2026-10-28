# Affiliate & Gumroad Application Checklists

**Updated:** 2026-10-25 (Asia/Shanghai)  
**Stack:** Impact → Home Depot (primary) · CJ → Lowe’s / Wayfair · Awin (secondary) · Gumroad (parallel)  
**Amazon Associates:** deferred — do not apply.

Rates, forms, and UI labels change. Treat dashboard copy as source of truth. Re-verify before clicking Submit.

---

## Legend

| Tag | Meaning |
| --- | --- |
| **Agent** | Sally can draft, fill text fields in a dry-run doc, or walk Vincent through screens |
| **Vincent** | Must use his own identity, phone OTP, tax form, payment method, or government ID |

---

## 0) Shared prerequisites (do once)

### Agent-preparable
- [ ] Live site copy ready (`site/`): FTC disclosure, About, Privacy, at least one calculator
- [ ] Domain shortlist (`domains.md`) — recommend `homefixmath.com`
- [ ] One-paragraph publisher description (paste into network applications):
  > HomeFixMath publishes free US DIY material calculators (fence, paint, deck, drywall, mulch/gravel). Visitors get panel/post counts and shopping lists, then may click through to home-improvement retailers. Audience: US homeowners and DIYers. Content is original HTML calculators + how-to math explainers. Traffic plan: SEO + organic social.
- [ ] Property URL list once domain is live (home, fence calculator, disclosure)

### Vincent-only
- [ ] **Buy domain** and point DNS (Cloudflare Pages / Netlify / similar)
- [ ] Confirm email he will use for all networks (e.g. Gmail)
- [ ] Create or unlock **PayPal** that can receive commercial USD (Gumroad + often Impact)
- [ ] Optional but recommended: **Payoneer** account (Awin; often CJ)
- [ ] Passport / national ID ready if a network asks for identity verification
- [ ] Know tax residency (China) and whether he files as individual (W-8BEN) vs entity (W-8BEN-E)

**Human gate before Impact Home Depot brand apply:** public HTTPS URL on the purchased domain.

---

## 1) Impact (network) + W-8BEN

**Goal:** Impact publisher account ready so Home Depot brand can be requested.

### Agent-preparable
- [ ] Direct Vincent to Impact’s publisher signup (official Impact “Join as Partner” flow)
- [ ] Pre-fill answers: niche = Home & Garden / DIY; content type = Tools & calculators / content site
- [ ] Draft answers for “How do you drive traffic?” (SEO + organic social; no paid media claimed unless true)
- [ ] Remind: complete tax profile before expecting payouts

### Vincent-only
- [ ] Create Impact account with his email
- [ ] Complete profile (name, address, country = China / as applicable)
- [ ] Complete **tax information** — typically **W-8BEN** for foreign individual
  - Legal name matching ID
  - Permanent residence address
  - Foreign tax identifying number if he has one (or mark N/A per form instructions)
  - Treaty claims only if he understands them — default: follow Impact’s prompts; do not invent treaty articles
- [ ] Add **payout method** (PayPal and/or bank / other options Impact shows for his country)
- [ ] Pass any email / phone verification OTP
- [ ] Accept Impact publisher terms

**Done when:** Impact dashboard shows tax complete (or “pending review”) and payout method saved.

---

## 2) Home Depot (on Impact) — once site is live

**Prerequisite:** Public site on real domain + Impact account.

### Agent-preparable
- [ ] Confirm live URLs work (home, fence calculator, affiliate disclosure)
- [ ] Screenshot or note sample content for brand review
- [ ] Draft brand-application blurbs (same publisher description as §0)
- [ ] After approval: wire tagged product / deep links into shopping-list placeholders

### Vincent-only
- [ ] In Impact, search **The Home Depot** (or official Home Depot affiliate program)
- [ ] Submit join / partnership request with live site URL
- [ ] Answer any questionnaire honestly (no inflated traffic)
- [ ] Wait for brand approval or rejection; do not create fake traffic
- [ ] After approval: generate tracking links only from Impact (no manual URL guessing)

**Notes (research snapshot — re-check dashboard):** published program often ~1% most products / BOPIS, higher on select décor; short cookie (~1 day). Push “buy today” near results when live.

---

## 3) CJ Affiliate → Lowe’s / Wayfair (NA)

**Goal:** Second network for A/B shopping-list retailers.

### Agent-preparable
- [ ] Publisher description + property URLs (same as Impact)
- [ ] Priority advertiser list: Lowe’s, Wayfair (North America)
- [ ] After approval: map SKUs / categories to calculator shopping lists

### Vincent-only
- [ ] Sign up at CJ Affiliate as a publisher
- [ ] Add HomeFixMath as a property (HTTPS URL)
- [ ] Complete **tax** (expect **W-8BEN** for CN individual)
- [ ] Set payout (Payoneer common for cross-border; follow CJ’s offered methods)
- [ ] Complete any phone / email / ID checks CJ requests
- [ ] Apply to **Lowe’s** and **Wayfair** (or current program names) inside CJ
- [ ] Accept advertiser terms when approved

**Order tip:** Can start same week as Impact if Vincent tolerates two signups; otherwise after HD is submitted.

---

## 4) Awin (secondary / niche brands)

**Goal:** Specialty DIY / tool merchants not covered well by HD/Lowe’s.  
**Note:** ShareASale closed 2025-10-06; new publishers use **Awin**.

### Agent-preparable
- [ ] Shortlist niche advertisers later (tools, specialty fence, outdoor)
- [ ] Explain $1-class refundable deposit before Vincent pays

### Vincent-only
- [ ] Create Awin publisher account
- [ ] Pay refundable **~$1 / £1 / €1** deposit (card) when prompted
- [ ] Complete **Tax Details** for China residency (Awin’s non-US flow — not a US W-9)
- [ ] Complete ID / manual review if requested
- [ ] Set payout via **Payoneer** (typical for non-domestic) from inside Awin when offered
- [ ] Join individual advertisers after account approval

---

## 5) Gumroad + PayPal (parallel digital product)

**Goal:** Sell first PDF pack (see `gumroad-pack-v1.md`) without waiting on retail affiliate approval.

### Agent-preparable
- [ ] Write / design PDF pack v1
- [ ] Draft Gumroad product title, description, price suggestion, cover blurb
- [ ] Draft post-purchase thank-you text
- [ ] Link product from site when domain + product are live

### Vincent-only
- [ ] Create Gumroad account
- [ ] Connect **PayPal** payout (mainland China: PayPal USD path is the documented option — confirm in Gumroad Help for his country)
- [ ] Complete any tax / identity forms Gumroad requires (often W-8BEN-class for non-US)
- [ ] Publish product (or approve Agent draft then publish)
- [ ] Confirm he can receive a test payout / that PayPal commercial receive works

**Do not use Lemon Squeezy as primary** for CN payout unless Vincent confirms country support later.

---

## Suggested sequence (minimize rework)

1. Vincent: domain + DNS + PayPal (and Payoneer if easy)  
2. Agent: deploy `site/` to HTTPS  
3. Vincent: Impact + W-8BEN + payout → apply Home Depot  
4. Vincent: CJ + tax + apply Lowe’s / Wayfair  
5. Agent: ship Gumroad pack files → Vincent: Gumroad + PayPal publish  
6. Optional: Awin + $1 deposit for niche brands  
7. Ads (AdSense): only after real traffic — not this checklist

---

## Explicitly out of scope

- Amazon Associates application, tax interview, or 3-qualifying-sales chase  
- Claiming Alipay as a direct payout from US retail networks  
- Agent submitting tax forms or OTPs as Vincent
