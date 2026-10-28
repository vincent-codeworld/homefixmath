# Calculator Spec v1 — Fence Panel & Post Calculator

**Ship first.** URL path: `/calculators/fence-panels.html`  
Units: **US customary only** (feet / inches). No metric toggle in v1.

---

## SEO

| Element | Copy |
| --- | --- |
| **Title** | Fence Panel Calculator — Panels, Posts & Caps (Free) \| HomeFixMath |
| **H1** | Fence Panel & Post Calculator |
| **Meta description** | Free DIY fence panel calculator. Enter fence length, panel width, and gates — get panels, posts, and caps to order. US feet. Estimates only. |
| **Primary keyword** | fence calculator / fence panel calculator |
| **Canonical** | https://homefixmath.com/calculators/fence-panels.html (after domain live) |

---

## Inputs

| ID | Label | Type | Default | Constraints |
| --- | --- | --- | --- | --- |
| `totalLengthFt` | Total fence run length (ft) | number | 100 | > 0, ≤ 2000 |
| `panelWidthFt` | Panel width (ft) | select / number | 8 | Common: 6 or 8; allow custom 4–12 |
| `gateCount` | Number of gates | integer | 1 | ≥ 0, ≤ 20 |
| `gateWidthFt` | Width per gate (ft) | number | 4 | > 0 if gates > 0; typical 3–5 |
| `includeCaps` | Include post caps? | checkbox | true | — |
| `extraPosts` | Extra posts (corners/end custom) | integer | 0 | ≥ 0 — advanced; default 0 |

**Assumptions (stated on page):** One gate width applies to every gate. Panels are prefab sections (not board-by-board). Does not size post diameter, hole depth, concrete, or permits.

---

## Outputs (always whole numbers, round up)

| Output | Formula |
| --- | --- |
| Net panel length | `max(0, totalLengthFt − gateCount × gateWidthFt)` |
| Panels | `ceil(netPanelLength / panelWidthFt)` — if net = 0 → 0 |
| Posts (base) | If panels > 0: `panels + 1`; else if only gates/end needs: handle edge cases below |
| Gate post add | `+ 2 × gateCount` (each opening needs two posts framing the gate) |
| Total posts | `basePosts + gatePostAdd + extraPosts` |
| Caps | `totalPosts` if includeCaps else 0 |

### Worked example (show on page)

100 ft run, one 4-ft gate, 8-ft panels:  
net = 96 → panels = 12 → posts = 12 + 1 + 2 = **15** → caps = 15.

---

## Edge cases

1. **Gates wider than total length** → show error: “Gate width × count exceeds total fence length.”
2. **Zero length** → disable calculate / error.
3. **Zero panels but gates > 0** → posts = `2 × gateCount + extraPosts` (gate posts only); warn that remaining run is zero.
4. **Panel width does not divide evenly** → always `ceil`; note leftover gap / need to trim last panel (DIY tip).
5. **Very short run < panel width** → panels = 1 if net > 0.
6. **Floating inputs** → coerce to number; reject NaN.

---

## Formula sources (cite on page)

Planning formulas aligned with common DIY fence-panel estimators (panels = ceil(net length ÷ panel width); posts ≈ panels + 1 + 2 per gate).  
Reference methodology similar to public DIY calculators (e.g. calcfence / BuildEstimatory style panel math). **Not** a substitute for manufacturer instructions or local code. Always confirm panel/post specs with the product page.

---

## UI / UX

- Instant calculate on input change (no submit wall).
- Results card: Panels · Posts · Caps.
- “Shopping list (coming)” section: placeholders for panels, 4×4 posts, caps, post-hole mix — wire to Home Depot / Lowe’s / ShareASale **after** Vincent approves a network (Amazon deferred).
- Disclaimer block: estimates only; measure twice; utility locate before digging.
- FAQ: How many posts for 100 ft? Do I need concrete? 6-ft vs 8-ft panels?

---

## Analytics / affiliate (post-approval)

- No Amazon Associates for now (`monetization-notes.md`).
- Tagged retail links only after a publisher account is approved.
- No incentive language (“buy so I get paid”).
- Disclosure link in footer + short note near shopping list.
