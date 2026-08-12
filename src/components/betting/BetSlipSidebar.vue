// BetSlipSidebar.vue 
<template>
  <aside class="h-full flex flex-col bg-[#0a1e2b] border-l border-[#155e75] overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-cyan-800/60 flex-shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-sm font-black text-cyan-100">BET SLIP</span>
        <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-yellow-400 text-cyan-950">
          {{ betStore.slipCount }}
        </span>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <BetSlipContent />
    </div>
  </aside>
</template>

<script setup>
import { useBetStore } from '../../stores/bet/betStore.js'
import BetSlipContent from './BetSlipContent.vue'

const betStore = useBetStore()
</script>