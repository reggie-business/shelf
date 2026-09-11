<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import PriceChart from '../components/PriceChart.vue'
import { useFredData, type FredObservation } from '../composables/useFredData'

const route = useRoute()
const { items, loading, error } = useFredData()

const selectedMonths = ref(36)
const ranges = [
  { label: '1Y', months: 12 },
  { label: '3Y', months: 36 },
  { label: '5Y', months: 60 },
]

const item = computed(() => items.value.find((candidate) => candidate.id === String(route.params.id)))

const filteredObservations = computed(() => {
  if (!item.value || item.value.observations.length === 0) {
    return []
  }

  const latestObservationDate = item.value.observations.reduce((latest, observation) => {
    const date = new Date(observation.date)
    return date > latest ? date : latest
  }, new Date(item.value.observations[0]!.date))
  const cutoff = new Date(latestObservationDate)
  cutoff.setMonth(cutoff.getMonth() - selectedMonths.value)

  return item.value.observations.filter((observation) => new Date(observation.date) >= cutoff)
})

const trendLine = computed(() => {
  const observations = filteredObservations.value
  if (observations.length < 2) {
    return undefined
  }

  const values = observations.map((observation) => observation.value)
  const meanX = (values.length - 1) / 2
  const meanY = values.reduce((sum, value) => sum + value, 0) / values.length
  const numerator = values.reduce((sum, value, index) => sum + (index - meanX) * (value - meanY), 0)
  const denominator = values.reduce((sum, _, index) => sum + (index - meanX) ** 2, 0)
  const slope = denominator === 0 ? 0 : numerator / denominator
  const intercept = meanY - slope * meanX

  return {
    start: intercept,
    end: intercept + slope * (values.length - 1),
  }
})

const currentPriceLabel = computed(() => {
  if (!item.value) {
    return ''
  }

  const latestObservation = item.value.observations[item.value.observations.length - 1]
  const dateLabel = latestObservation
    ? new Date(`${latestObservation.date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : '—'

  return `$${item.value.currentPrice.toFixed(2)} ${item.value.unit} · ${dateLabel}`
})

const periodChange = computed(() => {
  const observations = filteredObservations.value
  if (observations.length < 2 || observations[0]!.value === 0) {
    return '—'
  }

  const change = ((observations[observations.length - 1]!.value - observations[0]!.value) / observations[0]!.value) * 100
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
})

const periodLow = computed(() => {
  const values = filteredObservations.value.map((observation) => observation.value)
  return values.length > 0 ? `$${Math.min(...values).toFixed(2)}` : '—'
})

const periodHigh = computed(() => {
  const values = filteredObservations.value.map((observation) => observation.value)
  return values.length > 0 ? `$${Math.max(...values).toFixed(2)}` : '—'
})

const observationCount = computed(() => `${filteredObservations.value.length} months`)

function selectRange(months: number) {
  selectedMonths.value = months
}
</script>

<template>
  <main class="detail-view">
    <RouterLink class="back-link" to="/">← All items</RouterLink>

    <p v-if="error" class="data-error">{{ error }}</p>
    <p v-else-if="loading" class="loading-state">Loading...</p>
    <template v-else-if="item">
      <header class="detail-header">
        <div>
          <p class="eyebrow">Price history</p>
          <h1>{{ item.name }}</h1>
          <p class="current-price">{{ currentPriceLabel }}</p>
        </div>
        <div class="range-toggle" aria-label="Time range">
          <button
            v-for="range in ranges"
            :key="range.months"
            type="button"
            :class="{ active: selectedMonths === range.months }"
            @click="selectRange(range.months)"
          >
            {{ range.label }}
          </button>
        </div>
      </header>

      <section class="chart-card" aria-label="Price history chart">
        <PriceChart
          :observations="filteredObservations"
          :color="item.color"
          mode="card"
          :months="selectedMonths"
          :height="280"
          :trend-line="trendLine"
        />
      </section>

      <section class="stats-row" aria-label="Price statistics">
        <div>
          <span class="eyebrow">Change over period</span>
          <strong>{{ periodChange }}</strong>
        </div>
        <div>
          <span class="eyebrow">Period low</span>
          <strong>{{ periodLow }}</strong>
        </div>
        <div>
          <span class="eyebrow">Period high</span>
          <strong>{{ periodHigh }}</strong>
        </div>
        <div>
          <span class="eyebrow">Observations</span>
          <strong>{{ observationCount }}</strong>
        </div>
      </section>
    </template>
    <p v-else class="data-error">Item not found.</p>

    <footer>Source: U.S. Bureau of Labor Statistics via FRED API · IDX</footer>
  </main>
</template>

<style scoped>
.detail-view {
  color: #2c2a27;
}

.back-link,
.eyebrow,
footer {
  color: #817a71;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.back-link {
  display: inline-block;
  font-size: 0.72rem;
  transition: color 160ms ease;
}

.back-link:hover {
  color: #2c2a27;
}

.detail-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-top: 68px;
}

h1 {
  margin-top: 10px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
}

.current-price {
  margin-top: 18px;
  color: #77716a;
  font-size: 1rem;
}

.range-toggle {
  display: flex;
  gap: 6px;
}

.range-toggle button {
  padding: 7px 12px;
  border: 1px solid rgba(44, 42, 39, 0.25);
  border-radius: 999px;
  background: transparent;
  color: #817a71;
  cursor: pointer;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.range-toggle button.active {
  border-color: #2c2a27;
  background: #2c2a27;
  color: #fffdf8;
}

.chart-card {
  margin-top: 44px;
  padding: 28px 28px 16px;
  border: 1px solid rgba(44, 42, 39, 0.16);
  border-radius: 10px;
  background: #fffdf8;
  box-shadow: 0 8px 24px rgba(44, 42, 39, 0.06);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid rgba(44, 42, 39, 0.18);
}

.stats-row div {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stats-row strong {
  color: #2c2a27;
  font-size: 1.5rem;
  font-weight: 600;
}

.loading-state,
.data-error {
  margin-top: 68px;
  color: #817a71;
}

footer {
  margin-top: 64px;
  padding-top: 20px;
  border-top: 1px solid rgba(44, 42, 39, 0.18);
}

@media (max-width: 700px) {
  .detail-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
