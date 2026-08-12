
<!-- AviatorPage.vue  -->
<template>
  <div class="max-w-5xl mx-auto px-4 py-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">✈️</span>
        <div>
          <h1 class="text-xl font-black text-white">AVIATOR</h1>
          <p class="text-xs text-cyan-600">Provably Fair</p>
        </div>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/25 bg-red-500/10 text-xs font-bold text-red-400">
        <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
        {{ liveCount }} players
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4">

      <!-- Canvas -->
      <div class="lg:col-span-2 space-y-3">
        <AviatorCanvas />

        <!-- Crash history -->
        <div class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-4">
          <p class="text-xs text-cyan-600 font-bold uppercase tracking-wide mb-3">Recent Crashes</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="(val, i) in aviatorStore.history" :key="i"
                  class="px-2.5 py-1 rounded-full text-xs font-black font-mono border"
                  :class="val < 2  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                         : val < 5  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                         : val < 10 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                         :             'bg-purple-500/10 text-purple-400 border-purple-500/20'">
              {{ val.toFixed(2) }}x
            </span>
            <span v-if="aviatorStore.history.length === 0" class="text-xs text-cyan-700">No history yet</span>
          </div>
        </div>
      </div>

      <!-- Bet panels -->
      <div class="space-y-3">
        <div v-for="slot in [1, 2]" :key="slot"
             class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-4">

          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-bold text-cyan-500 uppercase">Bet {{ slot }}</p>
            <span v-if="slotBet(slot)?.cashedOut"
                  class="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              +TZS {{ slotBet(slot).profit.toFixed(2) }}
            </span>
          </div>

          <!-- Stake -->
          <div class="relative mb-3">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">TZS</span>
            <input v-model.number="stakes[slot]"
                   type="number" min="10" step="10" placeholder="Enter stake"
                   class="w-full bg-cyan-950/60 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl pl-12 pr-4 py-2.5 text-sm font-mono outline-none focus:border-yellow-400 transition-colors"
                   :disabled="aviatorStore.isFlying" />
          </div>

          <!-- Quick stakes -->
          <div class="flex gap-1 mb-3">
            <button v-for="q in [10, 50, 100, 500]" :key="q"
                    class="flex-1 py-1.5 text-[11px] font-bold rounded-lg border border-cyan-800 text-cyan-600 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                    :disabled="aviatorStore.isFlying"
                    @click="stakes[slot] = q">{{ q }}</button>
          </div>

          <!-- Auto cashout -->
          <div class="flex items-center gap-2 mb-3 text-xs text-cyan-600">
            <input :id="`auto-${slot}`" v-model="autoCashout[slot]" type="checkbox" class="accent-yellow-400" />
            <label :for="`auto-${slot}`">Auto at</label>
            <input v-model.number="autoCashoutAt[slot]"
                   type="number" step="0.1" min="1.1"
                   class="w-16 bg-cyan-950/60 border border-cyan-800 text-cyan-100 rounded-lg px-2 py-1 text-xs font-mono outline-none focus:border-yellow-400 transition-colors"
                   :disabled="!autoCashout[slot]" />
            <span>x</span>
          </div>

          <!-- Place Bet -->
          <button v-if="aviatorStore.isWaiting && !slotBet(slot)"
                  class="btn-action"
                  :disabled="!stakes[slot] || stakes[slot] < 10"
                  @click="handlePlaceBet(slot)">
            Place Bet
          </button>

          <!-- Cash Out -->
          <button v-else-if="aviatorStore.isFlying && slotBet(slot) && !slotBet(slot)?.cashedOut"
                  class="btn-cashout"
                  @click="cashOut(slot)">
            <span>CASH OUT</span>
            <span class="btn-cashout__amount">
              TZS {{ (stakes[slot] * aviatorStore.multiplier).toFixed(2) }}
            </span>
          </button>

          <!-- Status -->
          <div v-else class="btn-status">
            {{ slotBet(slot)?.cashedOut
                ? `Cashed out @ ${slotBet(slot).cashoutAt}x`
                : aviatorStore.isFlying
                  ? 'Round in progress'
                  : 'Waiting for next round...' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AviatorCanvas from './workingPage/AviatorCanvas.vue'
import { useAviator } from '../../composables/useAviator'

const { aviatorStore, placeBet, cashOut } = useAviator()

const liveCount     = ref(Math.floor(Math.random() * 300) + 50)
const stakes        = ref({ 1: 100, 2: 50 })
const autoCashout   = ref({ 1: false, 2: false })
const autoCashoutAt = ref({ 1: 2.0,  2: 2.0  })

const slotBet = (slot) => slot === 1 ? aviatorStore.myBet : aviatorStore.myBet2

function handlePlaceBet(slot) {
  placeBet(slot, stakes.value[slot])
}

// Auto cashout watcher
watch(() => aviatorStore.multiplier, (m) => {
  [1, 2].forEach(slot => {
    if (
      autoCashout.value[slot] &&
      slotBet(slot) &&
      !slotBet(slot)?.cashedOut &&
      m >= autoCashoutAt.value[slot]
    ) {
      cashOut(slot)
    }
  })
})
</script>

<style scoped>
.btn-action {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-weight: 900;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  background: linear-gradient(to right, #eab308, #facc15);
  color: #083344;
}
.btn-action:hover:not(:disabled) { opacity: 0.9; }
.btn-action:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-cashout {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-weight: 900;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.3;
  transition: transform 0.1s;
  background: linear-gradient(135deg, #00c853, #00e676);
  color: #020c14;
}
.btn-cashout:active { transform: scale(0.97); }
.btn-cashout__amount { font-size: 11px; opacity: 0.8; font-family: 'JetBrains Mono', monospace; }

.btn-status {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-size: 11px;
  text-align: center;
  color: #164e63;
  background: rgba(8, 145, 178, 0.08);
}
</style>