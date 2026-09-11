<template>
  <div class="app-shell">
    <div class="app-container">
      <RouterView />
    </div>
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  background: #f5f0e8;
}

.app-container {
  width: min(100%, 1296px);
  margin: 0 auto;
  padding: 40px 48px;
}

@media (max-width: 600px) {
  .app-container {
    padding: 28px 20px;
  }
}
</style>
