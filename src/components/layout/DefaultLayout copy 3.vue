<template>
  <div class="default-layout">

    <TheNavbar />

    <div class="layout-body">
      <TheSidebar class="sidebar-desktop" />

      <main class="layout-main">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </RouterView>
      </main>

      <BetSlipSidebar class="betslip-desktop" />
    </div>

    <BottomNavigation class="bottom-nav-mobile" @open-slip="mobileSlipOpen = true" />

    <!-- Overlay -->
    <Transition name="fade">
      <div v-if="mobileSlipOpen"
           class="fixed inset-0 z-[80] bg-black/70 lg:hidden"
           @click="mobileSlipOpen = false" />
    </Transition>

    <!-- Mobile Bet Slip — slides from RIGHT, covers everything -->
<Transition
enter-active-class="transition-transform duration-300 ease-out"
enter-from-class="translate-x-full"
enter-to-class="translate-x-0"
leave-active-class="transition-transform duration-200 ease-in"
leave-from-class="translate-x-0"
leave-to-class="translate-x-full"
>
<div v-if="mobileSlipOpen"
     class="fixed top-0 right-0 bottom-0 z-[200] w-full flex flex-col lg:hidden"
     style="background: #0a1e2b; border-left: 1px solid var(--border);">

  <!-- Header -->
  <div class="flex items-center justify-between px-4 flex-shrink-0"
       style="height: var(--navbar-h); border-bottom: 1px solid var(--border);">
    <div class="flex items-center gap-2">
      <span class="text-sm font-black text-cyan-100">BET SLIP</span>
      <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-yellow-400 text-cyan-950">
        {{ betStore.slipCount }}
      </span>
    </div>
    <button class="w-8 h-8 flex items-center justify-center rounded-lg text-cyan-500 hover:bg-cyan-800 hover:text-cyan-200 transition-colors"
            @click="mobileSlipOpen = false">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>

  <!-- Content -->
  <BetSlipContent @close="mobileSlipOpen = false" />

</div>
</Transition>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useBetStore }   from '../../stores/betStore'
import TheNavbar         from '../../components/layout/TheNavbar.vue'
import TheSidebar        from '../../components/layout/TheSidebar.vue'
import BottomNavigation  from '../../components/layout/BottomNavigation.vue'
import BetSlipSidebar    from '../../components/betting/BetSlipSidebar.vue'
import BetSlipContent    from '../../components/betting/BetSlipContent.vue'

const betStore       = useBetStore()
const mobileSlipOpen = ref(false)
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
  padding-top: var(--navbar-full);
}
.sidebar-desktop   { display: none; }
.betslip-desktop   { display: none; }
.bottom-nav-mobile { display: flex; }
.layout-main {
  flex: 1;
  min-width: 0;
  min-height: calc(100vh - var(--navbar-h));
  overflow-x: hidden;
  padding-bottom: var(--bottomnav-h);
}
@media (min-width: 1024px) {
  .sidebar-desktop   { display: flex; }
  .betslip-desktop   { display: flex; }
  .bottom-nav-mobile { display: none; }
  .layout-main {
    margin-left: var(--sidebar-w);
    margin-right: var(--betslip-w, 320px);
    padding-bottom: 0;
  }
}
</style>