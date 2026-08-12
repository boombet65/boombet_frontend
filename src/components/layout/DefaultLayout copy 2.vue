<template>
  <div class="default-layout">

    <TheNavbar />

    <div class="layout-body">

      <!-- Sidebar LEFT — desktop -->
      <TheSidebar class="sidebar-desktop" />

      <!-- Main content -->
      <main class="layout-main">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </RouterView>
      </main>

      <!-- Bet Slip RIGHT — desktop -->
      <BetSlipSidebar class="betslip-desktop" />

    </div>

    <!-- Bottom nav — mobile -->
    <BottomNavigation class="bottom-nav-mobile" />

  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import TheNavbar        from '../../components/layout/TheNavbar.vue'
import TheSidebar       from '../../components/layout/TheSidebar.vue'
import BottomNavigation from '../../components/layout/BottomNavigation.vue'
import BetSlipSidebar   from '../../components/betting/BetSlipSidebar.vue'
</script>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-root);
}

.layout-body {
  display: flex;
  flex: 1;
  padding-top: var(--navbar-h);
}

.sidebar-desktop  { display: none; }
.betslip-desktop  { display: none; }
.bottom-nav-mobile { display: flex; }

.layout-main {
  flex: 1;
  min-width: 0;
  min-height: calc(100vh - var(--navbar-h));
  overflow-x: hidden;
  padding-bottom: var(--bottomnav-h);
}

@media (min-width: 1024px) {
  .sidebar-desktop  { display: flex; }
  .betslip-desktop  { display: flex; }
  .bottom-nav-mobile { display: none; }

  .layout-main {
    margin-left: var(--sidebar-w);
    margin-right: var(--betslip-w, 320px);
    padding-bottom: 0;
  }
}
</style>