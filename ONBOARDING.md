# Handover — betPawa UX Review Week · Findings Hub

**You are taking this over while Jim is on leave.** Everything you need is in this file. Read it top to bottom before changing anything.

- **Live page:** https://jimpawa.github.io/ux-review-hub/
- **Repo:** `jimpawa/ux-review-hub` (branch `main`, GitHub Pages serves `/` root of `main`)
- **Owner:** Jim (Dimitrios Tsipoutas) — dimitrios.tsipoutas@pawatech.com
- **Away:** _[FILL IN: dates]_ · **Deputy / who to ask first:** _[FILL IN: name]_

---

## 1. What this thing is

A **single static webpage** that aggregates the UX findings from UX Review Week. Each reviewer did their audit in their own Figma file, on a page named **"UX Findings"**. This hub pulls all of that into one place so the team and stakeholders read one link instead of nine Figma files.

Current content: **9 topics · 113 strengths · 183 friction points** (17 critical, 37 high, 69 medium, 50 low, 10 nit) · 19 Laws of UX.

**Critical thing to understand: it is a SNAPSHOT, not a live view.** A webpage cannot fetch Figma. The findings are hand-authored as data inside `build.mjs`. Nothing updates by itself. If a reviewer edits their Figma file, this hub does not change until someone re-extracts and rebuilds.

---

## 2. Before you can do anything — access checklist

1. **GitHub** — write access to `jimpawa/ux-review-hub`. This is Jim's personal account, so access must be granted by him; if you don't have it before he leaves, you cannot deploy. Get this sorted first.
2. **Node.js** — v20+ (built with v24). No dependencies, no `npm install`, no `package.json`. Plain `node`.
3. **Figma** — view access to the reviewers' files (table in §5). Only needed if you must re-extract findings.
4. **Claude Code** — optional but this is how the project was built; the repo is set up so an agent can pick it up from this file.

---

## 3. The only routine operation: rebuild + deploy

`build.mjs` is the source of truth. It **generates** `index.html` and `data.json` — never hand-edit those two files, your edits get overwritten.

```bash
cd ux-review-hub && node build.mjs 2026-08-05 && git add -A && git commit -m "Refresh hub" && git push
```

Pass **today's date** as the argument — it becomes the snapshot label shown on the page. If you omit it the label literally reads "snapshot", which looks broken to stakeholders.

Pages redeploys automatically on push to `main`, usually within a minute. Verify on the live URL, not just locally.

To preview before pushing, just open `index.html` in a browser — it's fully self-contained, no server needed.

---

## 4. Where things live

| Path | What |
|---|---|
| `build.mjs` | **The dataset + the entire generator.** ~1150 lines. Topics array at the top, HTML/CSS/JS template at the bottom. |
| `index.html` | Generated. Do not edit. |
| `data.json` | Generated. Do not edit. |
| `img/<topic-slug>/` | Screens exported from Figma at 2×. |
| `README.md` | Short public blurb. **Its "Topics ready / TODO" lines are stale** — all 9 topics are live now. Fix if you touch it. |

Key structures inside `build.mjs`:

- `topics[]` — the data. Each topic: `name`, `reviewer`, `tag` (`law` \| `severity` \| `none`), `flows[]`. A flow has `images[]` plus `strengths[]` and `frictions[]`, or `subs[]` for sub-flows.
- `ORDER` (~line 680) — controls tab order on the page. Not alphabetical, not by count. Deliberate.
- `SEV_ASSIGN` — text-substring → severity map. Used because some reviewers didn't tag severity (see §6).
- `LAW_ASSIGN` — text-substring → Law of UX map, same reason.
- `LAWS` — the 19 law descriptions used in the hover/tap tooltips.
- `IMG_NUMS` — maps a finding's badge to its exact screen, for Global Navigation and Live Betting.

---

## 5. Topic → Figma file key

Each file is named after its topic; findings are on the page named **"UX Findings"**.

| Topic | Reviewer | Figma file key |
|---|---|---|
| Global Navigation | Jim | `1H2KzGBaKHKuv9TirkutUM` |
| Homepage & Sports Discovery | — | `1MQKMFzFTMfBHqu29n5KEY` |
| Pre-Event Betting | Aleida & Konsta | `PoVIhpxPmpC2MtxrIhRHNs` |
| Live Betting | Henry | `Tfv3EKofMYn6cRzjHR4VLu` |
| My Bets & Cashout | Ajay | `o0JS6yvcoXhMiRcvzUjawC` |
| Casino & Virtuals & Other Products | Ishkhan | `Hw0iiubXIIO7ASeTXm7hJI` |
| Help & Support | Ishkhan & Aleida | `7RmAoEilfNK5YhK8yAPPNr` |
| Sign-up & Login | — | `fuDEdY5Y69N5k0dwhC8AFf` |
| Deposits & Withdrawals | — | (in `build.mjs` dataset) |

URL form: `https://www.figma.com/design/<key>/`

---

## 6. Traps that have already cost time

Read these before re-extracting anything from Figma.

**Figma pages don't enumerate normally.** `get_metadata` returns only ONE page. To list all pages, read `figma.root.children` — `loadAllPagesAsync` is unsupported here; use `setCurrentPageAsync` then read.

**Two different finding structures exist across reviewer files.** Reviewers used the template's "Idea badge" (Kind: Good/Bad) plus an optional "SEVERITY Chip" (CRITICAL/HIGH/MEDIUM/LOW/NIT):
- **(a) Wrapped** — each finding sits in its own frame (Live Betting, My Bets). Detect: frames with a direct Idea badge + a direct TEXT and no "Screen capture" child.
- **(b) Loose** — badges and texts sit directly under the section (Help & Support, Casino). Walk the section's children after the heading "Findings — one numbered bullet per badge", pairing each text with the **preceding** badge's Kind.

Filter out "Drop screen" and other placeholder texts in both cases.

**Help & Support and Homepage use boards, not screen-captures** (A1–A3 / B1–B3). Each board becomes a flow; "worth keeping" → strengths, "friction" → frictions.

**Severity and laws are partly hub-side, not reviewer-authored.** Global Navigation and Casino/Virtuals were reviewed without severity — it was assigned via `SEV_ASSIGN`. Help & Support has no severity at all. Only GN and Homepage have reviewer-tagged laws; the rest come from `LAW_ASSIGN`. **These assignments have not been mirrored back into the reviewers' Figma files** — that was a deliberate "hub first" decision, and it's still open (§8). Don't tell a reviewer the hub reflects their own tagging when it may not.

**Top Priority is subs-aware.** Flows with `subs[]` expose an *empty* top-level `frictions` array — you must traverse `f.subs[].frictions` or you'll silently undercount. Correct total is 54 including Deposits & Withdrawals' 5.

**Deep links must keep working.** The hub has shareable routes at three levels: `#/summary` (the Overview tab — slug stayed `summary` after the rename), `#/<topic>`, `#/<topic>/<flow>`, and finding-level `#/<topic>/<flow>/<sub|->/<badge>` which re-opens the exact detail modal on load. Stakeholders have pasted these links into Slack and tickets. If you restructure flows or rename topics, old links break. Check a few after any structural change.

**Figma SECTION child coordinates are offsets, not absolute.** A section positions children relative to its own origin. Set the section's `x/y`, then append children with coords measured from the section top. Adding the section's base Y to child coords makes the section render as an empty box with content hanging far below it. Prefer auto-layout frames for wrappers.

---

## 7. Do not do these

- **Don't hand-edit `index.html` or `data.json`.** Regenerate from `build.mjs`.
- **Don't rename topics or restructure flows** without checking deep links (§6). Cosmetic-looking renames break URLs people have already shared.
- **Don't say the product is "before it reaches customers"** anywhere in the copy. betPawa is **live**. The Overview intro is worded carefully for this reason.
- **Don't write "promotions"** — the agreed term everywhere in this hub is **"campaigns"**.
- **Don't put reviewer names on the per-topic summary cards.** They were deliberately removed.
- **Don't re-add the long "Executive summary" critical-dump** to the Overview. It was removed after feedback; the short orienting paragraph is intentional.
- **Don't force-push or rewrite history** on `main`. Pages serves from it.
- **Don't restructure a reviewer's Figma file** to make extraction easier without asking them. One file (Sign-up & Login) was cleaned up already, but only duplicate badges were deduped, and Figma version history was the safety net.

---

## 7b. Top Priority is fixed at 54 (critical + high)

Jim's rule: the Top Priority list is **54 findings — 17 CRITICAL + 37 HIGH** — and that number stays put. New findings get MEDIUM / LOW / NIT. Do not raise the critical+high count without asking him. Check after every build:

```bash
node -e "const d=require('./data.json');console.log(d.totals.sev.CRITICAL + d.totals.sev.HIGH)"
```

The number is quoted to stakeholders, so silent drift makes the priority list untrustworthy.

## 8. Open backlog

Nothing is broken and nothing is urgent. If someone asks "what's next":

1. **Sign-up & Login is missing 3–4 findings** (file `fuDEdY5Y69N5k0dwhC8AFf`): product nav + bottom nav distracting on sign-up/login; "error message may confuse a user who doesn't remember creating an account"; "inline error message is generic, doesn't guide the required action" (may overlap the existing "vague error message" item); Flow 6 "improve verification text so users understand how to use the code".
2. **Live Betting has one orphan text** outside any flow section — *"A live row can show no clock and a dashed score ('–') with nothing explaining why."* Decide whether it duplicates the existing "no actual time/score" item.
3. **Deposits & Withdrawals has no Figma file key**, so its 35 findings can't be diffed against a source. Ask Jim where they came from.
4. **Mirror the remaining hub-side laws and severities back into the reviewers' Figma files.** Only Pre-Event Flow 1's four severity chips are synced so far.
5. **Help & Support has no real screenshots** — the Figma file only had empty template placeholders. The 14 board cards in `img/help-support/` are the boards, not device screens.

Reviewer-side gaps (nothing to import — needs the reviewer): My Bets *Settled Bets* has 13 badges on screens but only 10 written up; Pre-Event Flow 1 numbering skips 15; the Casino file's Virtuals section still has unfilled template placeholders.

Decided and closed: **Global Navigation's "Request 01/02" sections are out of scope** — they're separate one-off exercises, not review findings, so an audit will always show them as a 13-finding "gap". Leave them out. **Pre-match screen exports** (3 screens exist in Figma, never exported) — Jim decided to leave Pre-Event as is.

Done since first draft of this file: pre-match screens are exported and wired (`img/pre-match/`, 13 screens); `README.md` topic list is current; a full Figma-vs-hub audit (2026-08-05) confirmed GN, My Bets, Homepage, Casino, Help and Pre-Event complete.

---

## 9. Writing style, if you add findings

Findings and recommendations are written in **plain human language**, not technical shorthand. Say "the deposit page", not "`/deposit`". The only technical thing kept as-is is the Law-of-UX tag. Match the tone of what's already there.

---

## 10. If it breaks and you can't reach Jim

The live page is a static snapshot — it cannot break on its own, and there's no backend, no API key, no build pipeline to fail.

- **Page looks wrong after your push** → `git revert HEAD && git push`. Pages redeploys the previous version in about a minute.
- **Page is blank** → almost certainly malformed data breaking the inline JS. Check the browser console, then revert.
- **Pages not updating** → check the Actions/Pages tab in the GitHub repo; deploys occasionally queue.

Worst case, do nothing: the last good version stays live. There is no state to lose and no data that expires.
