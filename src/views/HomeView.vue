<script setup lang="ts">
import { useRouter } from 'vue-router'
import { VCard, VCol, VRow } from 'vuetify/components'

const router = useRouter()

const items = [
  { id: 'eggs', name: 'Eggs' },
  { id: 'ground-beef', name: 'Ground Beef' },
  { id: 'chicken-breast', name: 'Chicken Breast' },
  { id: 'pork-chops', name: 'Pork Chops' },
  { id: 'milk', name: 'Milk' },
  { id: 'coffee', name: 'Coffee' },
]

function openItem(id: string) {
  router.push(`/item/${id}`)
}
</script>

<template>
  <main class="home-view">
    <header class="page-header">
      <div>
        <h1>Shelf</h1>
        <p>What things cost. Over time.</p>
      </div>
      <div class="freshness"><span class="freshness-dot"></span>Updated monthly via FRED · Aug 2026</div>
    </header>

    <section class="pulse-strip" aria-labelledby="pulse-heading">
      <p id="pulse-heading" class="eyebrow">Last 90 days</p>
      <div class="pulse-grid">
        <div v-for="item in items" :key="`pulse-${item.id}`" class="pulse-item">
          <span class="eyebrow">{{ item.name }}</span>
          <strong>$0.00</strong>
          <div class="sparkline-placeholder"></div>
        </div>
      </div>
    </section>

    <section class="shelf-section" aria-label="Items on the shelf">
      <v-row class="shelf-grid">
        <v-col v-for="item in items" :key="item.id" cols="12" md="4">
          <v-card class="item-card" elevation="0" @click="openItem(item.id)">
            <div class="item-card-header">
              <span class="eyebrow">{{ item.name }}</span>
              <span class="trend-badge">Trend</span>
            </div>
            <strong class="item-price">$0.00</strong>
            <span class="item-unit">per unit</span>
            <div class="card-sparkline-placeholder"></div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="add-card" elevation="0">
            <span>+ Add to shelf</span>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </main>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(44, 42, 39, 0.24);
}

h1 {
  color: #2c2a27;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.95;
}

.page-header p {
  margin-top: 14px;
  color: #77716a;
  font-size: 1rem;
}

.freshness,
.eyebrow {
  color: #817a71;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.4;
  text-transform: uppercase;
}

.freshness {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.freshness-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #668066;
}

.pulse-strip {
  margin-top: 28px;
  padding: 14px 0 18px;
  border-top: 1px solid rgba(44, 42, 39, 0.18);
  border-bottom: 1px solid rgba(44, 42, 39, 0.18);
}

.pulse-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  margin-top: 16px;
}

.pulse-item {
  min-width: 0;
  padding: 0 16px;
  border-left: 1px solid rgba(44, 42, 39, 0.15);
}

.pulse-item:first-child {
  padding-left: 0;
  border-left: 0;
}

.pulse-item strong {
  display: block;
  margin-top: 7px;
  color: #2c2a27;
  font-size: 1.15rem;
  font-weight: 600;
}

.pulse-item .eyebrow {
  white-space: nowrap;
}

.sparkline-placeholder,
.card-sparkline-placeholder {
  height: 22px;
  margin-top: 10px;
  border: 1px solid rgba(44, 42, 39, 0.15);
  background: rgba(255, 252, 247, 0.42);
}

.shelf-section {
  margin-top: 36px;
}

.shelf-grid {
  margin: -10px;
}

.item-card,
.add-card {
  min-height: 250px;
  padding: 24px;
  border: 1px solid rgba(44, 42, 39, 0.16);
  border-radius: 10px;
  background: #fffdf8;
  color: #2c2a27;
  cursor: pointer;
  transition: border-color 160ms ease, transform 160ms ease;
}

.item-card:hover {
  border-color: rgba(44, 42, 39, 0.42);
  transform: translateY(-2px);
}

.item-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.trend-badge {
  padding: 4px 8px;
  border: 1px solid rgba(126, 116, 103, 0.35);
  border-radius: 999px;
  color: #817a71;
  font-size: 0.64rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.item-price {
  display: block;
  margin-top: 24px;
  font-size: 2.25rem;
  font-weight: 600;
  letter-spacing: -0.04em;
}

.item-unit {
  color: #817a71;
  font-size: 0.78rem;
}

.card-sparkline-placeholder {
  height: 80px;
  margin-top: 28px;
}

.add-card {
  display: grid;
  min-height: 250px;
  place-items: center;
  border-style: dashed;
  background: transparent;
  color: #817a71;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

@media (max-width: 800px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .pulse-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 18px;
  }
}

@media (max-width: 520px) {
  .pulse-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pulse-item:nth-child(3n + 1) {
    padding-left: 16px;
    border-left: 1px solid rgba(44, 42, 39, 0.15);
  }

  .pulse-item:nth-child(2n + 1) {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
