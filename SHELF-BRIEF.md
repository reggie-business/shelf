# BRIEF.md — Shelf
### A personal grocery price tracker by IDX
*Protogen 300s — Case Study 1 (Interactive Data Story)*

---

## The idea
Shelf is a passive reference tool for people who want to understand what's
happening to the price of the food they actually buy. Not a budgeting app.
Not an alert system. Not an action tool. Just a clean, honest view of how
six grocery staples have moved over time — so you can start to see the
bigger economic picture in something as ordinary as a dozen eggs.

One purpose. Kept sharp.

---

## Users & context
- **Primary user:** A curious, economically aware person who shops for
  groceries and wants to feel less confused by inflation headlines.
- **Use pattern:** Passive and occasional. You open it, glance, notice
  something, close it. It rewards returning visitors more than first-timers.
- **Not for:** Budgeting, price alerts, actionable recommendations, or
  prediction. Shelf observes; it does not advise.

---

## The six items on the shelf
Each was chosen because it tells a different story and together they
reveal how economic forces affect a household in different ways:

| Item | FRED Series ID | Unit | Story |
|------|---------------|------|-------|
| Eggs, Grade A Large | APU0000708111 | per dozen | Volatile — spiked to $6.23 in Mar 2025, now recovering |
| Ground Beef, 100% | APU0000703112 | per lb | Slow relentless climb — now $6.89/lb |
| Chicken Breast, Boneless | APU0000FF1101 | per lb | The stable anchor — $4.15/lb, makes beef look alarming |
| Pork Chops | APU0000FD3101 | per lb | Moderate steady climb |
| Milk, Whole | APU0000709112 | per gallon | Slow and steady |
| Coffee, Ground Roast | APU0000717311 | per lb | The sleeper — nearly doubled since early 2024, now $9.46/lb |

Data source: FRED API (Federal Reserve Bank of St. Louis / BLS Average
Price Data). Live API calls — no mock data.

---

## Layout
Single page, top to bottom:

1. **Header:** "Shelf" wordmark + tagline ("What things cost. Over time.")
   No nav, no clutter. Optional: data freshness indicator ("Updated monthly
   via FRED").

2. **Item grid:** Six item cards arranged in a 2×3 or 3×2 grid. Each card
   shows:
   - Item name (plain language: "Eggs", not "Grade A Large")
   - Current price (large, readable)
   - Unit (per dozen / per lb / per gallon)
   - Sparkline showing the last 36 months of price movement
   - A subtle trend indicator (up / flat / volatile) — color as signal,
     not decoration

3. **Detail view (on card click/tap):** Expands or navigates to a larger
   chart showing the full price history for that item. This is the main
   interactive element. Shows the same data at a larger scale with axis
   labels and a visible trend line. No tooltips required at MVP — the
   shape of the line is the story.

4. **Footer:** Data attribution ("Source: U.S. Bureau of Labor Statistics
   via FRED API") + IDX mark.

---

## Interactions
- **Card click → detail view:** The primary and only required interaction.
  Clicking any item card expands the price history chart for that item.
  This is the graded interactive element for the rubric.
- **Back navigation:** Simple — back to the grid. No deep routing required.
- **(Nice to have):** A time range toggle on the detail view (1Y / 3Y / 5Y /
  All). Not required for MVP.

---

## Design direction
**Warm, minimal, editorial.** Like a well-designed print magazine that
happens to be interactive. The data is the visual — the chrome should
disappear.

- **Background:** Warm off-white or light cream — not stark white, not dark.
  Think: a well-lit kitchen counter.
- **Text:** Dark charcoal, not pure black. Readable, not harsh.
- **Each item has its own muted accent color** for its sparkline and detail
  chart — distinct but not neon. Sophisticated palette, like a good
  infographic. Suggested starting point:
  - Eggs: warm amber
  - Beef: deep rust/terracotta
  - Chicken: sage green
  - Pork: dusty mauve
  - Milk: slate blue
  - Coffee: warm brown
- **Trend color:** Green (stable/declining), amber (moderate increase),
  red (significant increase) — semantic only, not decorative.
- **Typography:** Clean, legible sans-serif. Large price numbers. Item
  names in plain language. Nothing clever.
- **No dark mode.** Warm and approachable, always.

---

## Tech stack
- Vue 3 + TypeScript, Vite
- Vuetify 3 for layout and grid
- Vue Router for card → detail navigation
- Chart.js / vue-chartjs for sparklines and detail charts
  (reusable chart component — carries forward to Case Study 3)
- FRED API (`https://api.stlouisfed.org/fred/series/observations`)
  called at runtime, API key stored in `.env` as `VITE_FRED_API_KEY`
- Deployed on Vercel, API key in Vercel environment variables
- No backend, no mock data, no Pinia, no testing framework

---

## Reusable components to build (carry forward)
- **PriceChart.vue** — time-series line chart, configurable by series data,
  color, and time range. This is the component that Case Study 3 (Finance
  Dashboard) reuses for cash flow over time.
- **ItemCard.vue** — card with sparkline, current price, and trend
  indicator. Reusable pattern for Case Study 2 (My Yard plant cards).

---

## The data story (do not editorialize — let the lines speak)
The six items were chosen because their price histories diverge in
interesting ways. A user who spends time on Shelf will notice:
- Eggs are volatile in a way nothing else is
- Beef has been climbing for years without drama
- Coffee nearly doubled in 18 months without most people noticing
- Chicken has held relatively steady, which makes everything else
  look worse by comparison

No annotations. No callouts. No "did you know?" The consciousness-raising
is in the shape of the lines.

---

## Definition of done
- Live on Vercel, password protected
- Six items load real data from FRED API
- Sparklines visible on all cards
- Click on any card → full price history chart renders
- Warm, minimal aesthetic — does not look like a generic chart library demo
- PriceChart.vue is a real reusable component
- README and BRIEF.md in repo root, commit history shows real work

---

## Nice to haves (only if time)
- Time range toggle on detail view (1Y / 3Y / 5Y)
- Subtle loading states while FRED data fetches
- "Last updated" indicator on each card
- A seventh item slot that hints at the future AI-powered watchlist feature
  ("+ Add to shelf" — non-functional, just plants the seed)
