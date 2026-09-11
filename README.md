# Shelf
### What things cost. Over time.
*A personal grocery price tracker by IDX*

**Live site:** [shelf-idx.vercel.app](https://shelf-idx.vercel.app)

---

## What it is

Shelf is a passive reference tool for people who want to understand what's happening to the price of the food they actually buy. Not a budgeting app. Not an alert system. Just a clean, honest view of how six grocery staples have moved over time — so you can start to see the bigger economic picture in something as ordinary as a dozen eggs.

One purpose. Kept sharp.

---

## What it shows

Six items, chosen because each tells a different story:

| Item | Unit | Story |
|------|------|-------|
| Eggs | per dozen | Volatile — spiked to $6.23 in early 2025, now recovering |
| Ground Beef | per lb | Slow relentless climb |
| Chicken Breast | per lb | The stable anchor — makes everything else look alarming |
| Pork Chops | per lb | Stepped climbing with plateaus |
| Milk | per gallon | Slow and steady |
| Coffee | per lb | The sleeper — nearly doubled since early 2024 |

Data source: FRED API (Federal Reserve Bank of St. Louis / BLS Average Price Data). Live API calls — no mock data.

---

## How it works

- **Pulse strip** — a "LAST 90 DAYS" snapshot at the top: six line-only sparklines showing recent movement at a glance
- **Card grid** — six item cards with 36-month sparklines, current price, and a computed trend badge (VOLATILE / RISING / CLIMBING / STABLE / FALLING)
- **Detail view** — click any card to see the full price history chart with a 1Y / 3Y / 5Y time range toggle, linear regression trend line, and stats row (change, period low, period high, observations)

Trend badges are data-driven — computed from the actual observations, not hardcoded.

---

## Design intent

**Warm, minimal, editorial.** Like a well-designed print magazine that happens to be interactive. The data is the visual — the chrome disappears.

- Warm cream background, dark charcoal text
- Each item has its own muted accent color — amber, rust, sage, mauve, slate, brown
- Color used as signal only: trend badges are semantic (red for rising/volatile, green for falling, gray for stable)
- No dark mode. Warm and approachable, always.

The consciousness-raising is in the shape of the lines. No annotations, no callouts, no "did you know?" — just the data.

---

## Tech stack

- **Vue 3** + TypeScript, Vite
- **Vuetify 3** for layout and grid
- **Vue Router** for card → detail navigation
- **Chart.js / vue-chartjs** for detail charts
- **Inline SVG** for pulse strip sparklines
- **FRED API** for live price data
- **Vercel serverless function** (`/api/fred`) to proxy FRED API calls and avoid CORS in production
- No backend, no mock data, no Pinia, no testing framework

### Reusable components
- **PriceChart.vue** — time-series line chart with area fill, trend line overlay, and time range filtering. Carries forward to Case Study 3.
- **ItemCard.vue** — card with sparkline, price, unit, and computed trend badge

---

## Repo structure

```
api/
  fred.ts               # Vercel serverless proxy for FRED API
src/
  components/
    PriceChart.vue      # Reusable time-series chart component
    ItemCard.vue        # Item card with sparkline and trend badge
  composables/
    useFredData.ts      # FRED API data fetching and trend computation
  views/
    HomeView.vue        # Main grid — pulse strip + card grid
    DetailView.vue      # Full price history chart
  router/
    index.ts
  main.ts
BRIEF.md                # Design spec written before build began
vercel.json             # Routing and serverless config
```

---

## Running locally

```bash
npm install
npm run dev
```

Add your FRED API key to `.env`:
```
VITE_FRED_API_KEY=your_key_here
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project context

Built as Protogen 300s Case Study 1 (Interactive Data Story) — part of the Slalom Protogen learning series. Shelf is also the first product under IDX, a personal project exploring tools that help regular people navigate economic data without needing to be analysts.

The workflow: spec in BRIEF.md → visual design in Claude Design → code generation with GitHub Copilot → iteration from screenshots. Designer stayed in reviewer and decision-maker role throughout. See `BRIEF.md` for the full design spec.