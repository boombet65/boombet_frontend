<!-- betslip.vue  -->

<template>
  <aside class="betslip-sidebar">
    <div class="flex items-center justify-between  px-4 py-3 border-b border-cyan-800/60 flex-shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-sm font-black text-cyan-100">BET SLIP</span>
      </div>
    </div>
    <BetSlipContent />
  </aside>
</template>

<script setup>
import { useBetStore } from '../../stores/betStore'
import BetSlipContent  from './BetSlipContent.vue'
const betStore = useBetStore()
</script>

<style scoped>
.betslip-sidebar {
  position: fixed;
  top: var(--navbar-h);
  right: 0;
  bottom: 0;
  width: var(--betslip-w, 320px);
  display: flex;
  flex-direction: column;
  background: #0a1e2b;
  border-left: 1px solid var(--border, #155e75);
  z-index: 200;
  overflow: hidden;
}
</style>