import { ref } from 'vue'

interface FredObservationResponse {
  observations: Array<{
    date: string
    value: string
  }>
}

export interface FredObservation {
  date: string
  value: number
}

export interface FredItem {
  id: string
  name: string
  unit: string
  observations: FredObservation[]
  currentPrice: number
  color: string
  trend: TrendLabel
  trendColor: string
}

export type TrendLabel = 'VOLATILE' | 'FALLING' | 'STABLE' | 'CLIMBING' | 'RISING'

export interface TrendResult {
  label: TrendLabel
  color: string
}

interface FredItemDefinition {
  id: string
  name: string
  unit: string
  color: string
}

const FRED_API_URL = '/fred-api/fred/series/observations'

const itemDefinitions: FredItemDefinition[] = [
  { id: 'APU0000708111', name: 'Eggs', unit: 'per dozen', color: '#C8962A' },
  { id: 'APU0000703112', name: 'Ground Beef', unit: 'per lb', color: '#9B3A2A' },
  { id: 'APU0000FF1101', name: 'Chicken Breast', unit: 'per lb', color: '#5C7A4E' },
  { id: 'APU0000FD3101', name: 'Pork Chops', unit: 'per lb', color: '#7D5A6E' },
  { id: 'APU0000709112', name: 'Milk', unit: 'per gallon', color: '#4A6580' },
  { id: 'APU0000717311', name: 'Coffee', unit: 'per lb', color: '#6B4A32' },
]

const trendColors: Record<TrendLabel, string> = {
  VOLATILE: '#C0392B',
  FALLING: '#27AE60',
  STABLE: '#7F8C8D',
  CLIMBING: '#E67E22',
  RISING: '#C0392B',
}

function standardDeviation(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

export function computeTrend(observations: FredObservation[]): TrendResult {
  if (observations.length < 2) {
    return { label: 'STABLE', color: trendColors.STABLE }
  }

  const latestObservationDate = observations.reduce((latest, observation) => {
    const date = new Date(observation.date)
    return date > latest ? date : latest
  }, new Date(observations[0]!.date))
  const cutoff = new Date(latestObservationDate)
  cutoff.setMonth(cutoff.getMonth() - 12)

  const recentValues = observations
    .filter((observation) => new Date(observation.date) >= cutoff)
    .map((observation) => observation.value)

  if (recentValues.length < 2) {
    return { label: 'STABLE', color: trendColors.STABLE }
  }

  const firstValue = recentValues[0]!
  const lastValue = recentValues[recentValues.length - 1]!
  const mean = recentValues.reduce((sum, value) => sum + value, 0) / recentValues.length
  const change = firstValue === 0 ? 0 : ((lastValue - firstValue) / firstValue) * 100
  const stdDev = standardDeviation(recentValues)

  if (stdDev > mean * 0.15) {
    return { label: 'VOLATILE', color: trendColors.VOLATILE }
  }

  if (change < -3) {
    return { label: 'FALLING', color: trendColors.FALLING }
  }

  if (change < 3) {
    return { label: 'STABLE', color: trendColors.STABLE }
  }

  const monthOverMonthChanges = recentValues.slice(1).map((value, index) => value - recentValues[index]!)
  const meanChange = monthOverMonthChanges.reduce((sum, value) => sum + value, 0) / monthOverMonthChanges.length
  const stepped = standardDeviation(monthOverMonthChanges) > Math.abs(meanChange)

  if (stepped) {
    return { label: 'CLIMBING', color: trendColors.CLIMBING }
  }

  return { label: 'RISING', color: trendColors.RISING }
}

export function useFredData() {
  const items = ref<FredItem[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchData() {
    const apiKey = import.meta.env.VITE_FRED_API_KEY

    if (!apiKey) {
      error.value = 'FRED API key is missing.'
      loading.value = false
      return
    }

    try {
      const fetchedItems = await Promise.all(
        itemDefinitions.map(async (definition): Promise<FredItem> => {
          const params = new URLSearchParams({
            series_id: definition.id,
            api_key: apiKey,
            file_type: 'json',
            observation_start: '2021-01-01',
          })
          const response = await fetch(`${FRED_API_URL}?${params}`)

          if (!response.ok) {
            throw new Error(`FRED request failed for ${definition.name}: ${response.status}`)
          }

          const data = (await response.json()) as FredObservationResponse
          const observations = data.observations
            .filter((observation) => observation.value !== '.')
            .map((observation) => ({
              date: observation.date,
              value: Number(observation.value),
            }))
            .filter((observation) => Number.isFinite(observation.value))
          const trend = computeTrend(observations)

          return {
            ...definition,
            observations,
            currentPrice: observations[observations.length - 1]?.value ?? 0,
            trend: trend.label,
            trendColor: trend.color,
          }
        }),
      )

      items.value = fetchedItems
      console.log('FRED data:', items.value)
    } catch (fetchError) {
      error.value = fetchError instanceof Error ? fetchError.message : 'Unable to fetch FRED data.'
    } finally {
      loading.value = false
    }
  }

  void fetchData()

  return {
    items,
    loading,
    error,
  }
}
