<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 flex items-stretch h-16 bg-cyan-950 border-t border-cyan-800" style="backdrop-filter: blur(14px);">

    <!-- Home -->
    <RouterLink to="/" class="flex flex-col items-center justify-center flex-1 gap-0.5 pb-1 text-cyan-600 transition-colors duration-200 hover:text-cyan-300 [&.router-link-exact-active]:text-yellow-400">
      <span class="text-xl leading-none">🏠</span>
      <span class="text-[10px] font-semibold">Home</span>
    </RouterLink>

    <!-- Sports -->
    <RouterLink to="/sports" class="flex flex-col items-center justify-center flex-1 gap-0.5 pb-1 text-cyan-600 transition-colors duration-200 hover:text-cyan-300 [&.router-link-active]:text-yellow-400">
      <span class="text-xl leading-none">⚽</span>
      <span class="text-[10px] font-semibold">Sports</span>
    </RouterLink>

    <!-- Bet Slip (center — gold highlight) -->
    <button
      class="flex flex-col items-center justify-center flex-1 gap-0.5 pb-1 relative text-yellow-400 transition-colors duration-200"
      @click="betStore.isOpen = !betStore.isOpen"
    >
      <span class="text-xl leading-none">📋</span>
      <span class="text-[10px] font-semibold">Slip</span>
      <span v-if="slipCount > 0"
            class="absolute top-1.5 right-[calc(50%-18px)] min-w-[15px] h-[15px] px-1 flex items-center justify-center rounded-full text-[9px] font-black bg-yellow-400 text-cyan-950">
        {{ slipCount }}
      </span>
    </button>

    <!-- My Bets -->
    <RouterLink to="/bets" class="flex flex-col items-center justify-center flex-1 gap-0.5 pb-1 text-cyan-600 transition-colors duration-200 hover:text-cyan-300 [&.router-link-active]:text-yellow-400">
      <span class="text-xl leading-none">🎟️</span>
      <span class="text-[10px] font-semibold">My Bets</span>
    </RouterLink>

    <!-- Account -->
    <RouterLink to="/dashboard" class="flex flex-col items-center justify-center flex-1 gap-0.5 pb-1 text-cyan-600 transition-colors duration-200 hover:text-cyan-300 [&.router-link-active]:text-yellow-400">
      <span class="text-xl leading-none">👤</span>
      <span class="text-[10px] font-semibold">Account</span>
    </RouterLink>

  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useBetStore } from '../../stores/betStore'

const betStore  = useBetStore()
const slipCount = computed(() => betStore.slipCount)
</script>