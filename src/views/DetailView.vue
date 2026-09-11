<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const itemNames: Record<string, string> = {
  eggs: 'Eggs',
  'ground-beef': 'Ground Beef',
  'chicken-breast': 'Chicken Breast',
  'pork-chops': 'Pork Chops',
  milk: 'Milk',
  coffee: 'Coffee',
}

const itemName = computed(() => itemNames[String(route.params.id)] ?? 'Shelf item')
</script>

<template>
  <main class="detail-view">
    <RouterLink class="back-link" to="/">← All items</RouterLink>
    <div class="detail-heading">
      <p class="eyebrow">Price history</p>
      <h1>{{ itemName }}</h1>
      <strong>$0.00</strong>
    </div>
    <div class="chart-placeholder" aria-label="Empty chart placeholder"></div>
  </main>
</template>

<style scoped>
.detail-view {
  color: #2c2a27;
}

.back-link {
  display: inline-block;
  color: #817a71;
  font-size: 0.78rem;
  transition: color 160ms ease;
}

.back-link:hover {
  color: #2c2a27;
}

.detail-heading {
  margin-top: 76px;
}

.eyebrow {
  color: #817a71;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin-top: 10px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.8rem, 7vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
}

.detail-heading strong {
  display: block;
  margin-top: 20px;
  font-size: 2rem;
  font-weight: 600;
}

.chart-placeholder {
  height: 360px;
  margin-top: 48px;
  border: 1px solid rgba(44, 42, 39, 0.16);
  background: rgba(255, 252, 247, 0.42);
}
</style>
