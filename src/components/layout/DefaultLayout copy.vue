<template>
  <div class="default-layout">

    <!-- Top Navbar -->
    <TheNavbar />

    <!-- Body: Sidebar + Page content -->
    <div class="layout-body">

      <!-- Sidebar — desktop only -->
      <TheSidebar class="sidebar-desktop" />

      <!-- Main page content -->
      <main class="layout-main">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </RouterView>
      </main>
        <!-- Bet Slip Sidebar -->
      <BetSlipSidebar class="sidebar-desktop" />
    </div>

    <!-- Bottom Navigation — mobile only -->
    <BottomNavigation class="bottom-nav-mobile" />

  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import TheNavbar       from '../../components/layout/TheNavbar.vue'
import TheSidebar      from '../../components/layout/TheSidebar.vue'
import BottomNavigation from '../../components/layout/BottomNavigation.vue'
import BetSlipSidebar from '../../components/betting/BetSlipSidebar.vue'
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

/* Sidebar only on desktop */
.sidebar-desktop {
  display: none;
}

/* Main content area */
.layout-main {
  flex: 1;
  min-width: 0;
  min-height: calc(100vh - var(--navbar-h));
  overflow-x: hidden;
  /* Space for mobile bottom nav */
  padding-bottom: var(--bottomnav-h);
}

/* Bottom nav only on mobile */
.bottom-nav-mobile {
  display: flex;
}

/* ── Desktop ── */
@media (min-width: 1024px) {
  .sidebar-desktop {
    display: flex;
  }
  .layout-main {
    margin-left: var(--sidebar-w);
    padding-bottom: 0;
  }
  .bottom-nav-mobile {
    display: none;
  }
}
</style>
