<script setup lang="ts">
import { computed } from 'vue'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Legend, Tooltip)

type ChartMode = 'pulse' | 'card'

interface Observation {
  date: string
  value: number
}

const props = withDefaults(
  defineProps<{
    observations: Observation[]
    color: string
    mode: ChartMode
    months?: number
  }>(),
  {
    months: 36,
  },
)

const filteredObservations = computed(() => {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - props.months)

  return props.observations.filter((observation) => new Date(observation.date) >= cutoff)
})

const chartData = computed<ChartData<'line'>>(() => ({
  labels: filteredObservations.value.map((observation) => observation.date),
  datasets: [
    {
      data: filteredObservations.value.map((observation) => observation.value),
      borderColor: props.color,
      backgroundColor: hexToRgba(props.color, 0.15),
      borderWidth: props.mode === 'pulse' ? 1.5 : 2,
      fill: props.mode === 'card',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
        drawBorder: false,
      },
    },
  },
}))

function hexToRgba(hex: string, opacity: number) {
  const normalizedHex = hex.replace('#', '')
  const red = Number.parseInt(normalizedHex.slice(0, 2), 16)
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16)
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}
</script>

<template>
  <div class="price-chart" :class="`price-chart--${mode}`">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.price-chart {
  width: 100%;
  height: 40px;
}

.price-chart--card {
  height: 80px;
}
</style>
