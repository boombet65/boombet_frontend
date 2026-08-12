<template>
  <aside class="betslip-sidebar">

    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-cyan-800/60 flex-shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-sm font-black text-cyan-100">BET SLIP</span>
        <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-yellow-400 text-cyan-950">
          {{ betStore.slipCount }}
        </span>
      </div>
      <!-- Single / Acca toggle -->
      <div class="flex rounded-lg overflow-hidden border border-cyan-800 text-[11px] font-bold">
        <button class="px-2.5 py-1 transition-colors"
                :class="betStore.betType === 'single' ? 'bg-yellow-400 text-cyan-950' : 'text-cyan-500 hover:text-cyan-300'"
                @click="betStore.betType = 'single'">Single</button>
        <button class="px-2.5 py-1 transition-colors"
                :class="betStore.betType === 'accumulator' ? 'bg-yellow-400 text-cyan-950' : 'text-cyan-500 hover:text-cyan-300'"
                @click="betStore.betType = 'accumulator'">Acca</button>
      </div>
    </div>

    <!-- Selections -->
    <div class="flex-1 overflow-y-auto divide-y divide-cyan-800/40" style="scrollbar-width: none;">

      <!-- Empty state -->
      <div v-if="betStore.slipCount === 0" class="flex flex-col items-center justify-center h-48 text-center px-4">
        <span class="text-3xl mb-3">📋</span>
        <p class="text-sm font-semibold text-cyan-600">Slip is empty</p>
        <p class="text-xs text-cyan-700 mt-1">Click odds to add selections</p>
      </div>

      <!-- Bet items -->
      <div v-for="sel in betStore.slip" :key="sel.marketKey" class="px-4 py-3">
        <div class="flex items-start justify-between gap-2 mb-2">
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-cyan-100 truncate">{{ sel.matchName }}</p>
            <p class="text-[11px] text-cyan-600 mt-0.5">
              {{ sel.market }} · <span class="text-cyan-400">{{ sel.pick }}</span>
            </p>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <span class="text-sm font-black text-yellow-400 font-mono">{{ sel.odds }}</span>
            <button class="w-5 h-5 flex items-center justify-center rounded text-cyan-700 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    @click="betStore.removeFromSlip(sel.marketKey)">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Single stake input -->
        <input v-if="betStore.betType === 'single'"
               v-model.number="sel.stake"
               type="number" min="10" placeholder="Stake (KES)"
               class="w-full bg-cyan-950/80 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-yellow-400 transition-colors" />
      </div>
    </div>

    <!-- Footer -->
    <div v-if="betStore.slipCount > 0" class="p-4 border-t border-cyan-800/60 space-y-3 flex-shrink-0">

      <!-- Acca stake -->
      <div v-if="betStore.betType === 'accumulator'">
        <input v-model.number="betStore.stake"
               type="number" min="10" placeholder="Enter stake (KES)"
               class="w-full bg-cyan-950/80 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-yellow-400 transition-colors" />
      </div>

      <!-- Quick stakes -->
      <div class="flex gap-1.5">
        <button v-for="q in [50, 100, 200, 500]" :key="q"
                class="flex-1 py-1.5 text-xs font-bold rounded-lg border border-cyan-800 text-cyan-600 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                @click="betStore.stake = q">{{ q }}</button>
      </div>

      <!-- Summary -->
      <div class="space-y-1.5 text-xs">
        <div class="flex justify-between">
          <span class="text-cyan-600">Total Odds</span>
          <span class="text-yellow-400 font-black font-mono">{{ betStore.totalOdds.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-cyan-600">Potential Win</span>
          <span class="text-emerald-400 font-black font-mono">KES {{ formatMoney(betStore.potentialWin) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button class="px-3 py-2.5 rounded-xl text-xs font-bold border border-cyan-800 text-cyan-600 hover:border-red-500/50 hover:text-red-400 transition-colors"
                @click="betStore.clearSlip()">Clear</button>
        <button class="flex-1 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 hover:opacity-90 transition-opacity"
                @click="placeBet">Place Bet</button>
      </div>

      <p class="text-[10px] text-cyan-700 text-center">20% Excise Duty · Must be 18+</p>
    </div>

  </aside>
</template>

<script setup>
import { useBetStore } from '../../stores/betStore'

const betStore = useBetStore()

function formatMoney(n) {
  return new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(n || 0)
}

function placeBet() {
  // TODO: connect to betService
  alert('Bet placed!')
  betStore.clearSlip()
}
</script>

<style scoped>
.betslip-sidebar {
  position: fixed;
  top: var(--navbar-h);
  right: 0;
  bottom: 0;
  width: 320px;
  display: flex;
  flex-direction: column;
  background: #0a1e2b;
  border-left: 1px solid var(--border, #155e75);
  z-index: 40;
  overflow: hidden;
}
</style>