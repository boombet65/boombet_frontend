<!-- BetSlipContent.vue  -->

<template>
  <div class="flex flex-col flex-1 overflow-hidden relative">

    <!-- ══ TOAST ══ -->
    <Transition name="toast">
      <div v-if="toast.show"
           class="absolute top-3 left-3 right-3 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold shadow-lg"
           :class="toast.type === 'success'
             ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
             : 'bg-red-500/20 border border-red-500/40 text-red-400'">
        <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        {{ toast.message }}
      </div>


    </Transition>

    <!-- Row 2: Sports / Virtuals tabs -->
    <div class="flex border-b border-cyan-800/60 flex-shrink-0">
      <button
        class="flex-1 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5"
        :class="activeTab === 'sports' ? 'text-yellow-400 border-yellow-400' : 'text-cyan-600 border-transparent'"
        @click="activeTab = 'sports'">
        Sports
        <span class="rounded-full flex items-center justify-center text-[10px] font-black text-cyan-450">
          ({{ betStore.slipCount }})
        </span>
      </button>
      <button
        class="flex-1 py-2.5 text-xs font-bold transition-all border-b-2"
        :class="activeTab === 'virtuals' ? 'text-yellow-400 border-yellow-400' : 'text-cyan-600 border-transparent'"
        @click="activeTab = 'virtuals'">
        Virtuals
      </button>
    </div>

    <!-- ══ SPORTS TAB ══ -->
    <template v-if="activeTab === 'sports'">

      <!-- Booking code + Clear all -->
      <div class="flex items-center justify-between px-4 py-2.5 border-b border-cyan-800/60 flex-shrink-0">
        <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-700 text-cyan-400 text-xs font-bold transition-all"
                @click="createBookingCode">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
          </svg>
          Create Booking Code
        </button>
        <button v-if="betStore.slipCount > 0"
                class="text-xs font-bold text-red-400 transition-colors"
                @click="betStore.clearSlip()">
          Clear All
        </button>
      </div>

      <!-- Selections list -->
      <div class="flex-1 overflow-y-auto divide-y divide-cyan-800/40" style="scrollbar-width: none;">

        <!-- Empty -->
        <div v-if="betStore.slipCount === 0"
             class="flex flex-col items-center justify-center h-48 text-center px-4">
          <span class="text-3xl mb-3">📋</span>
          <p class="text-sm font-semibold text-cyan-600">Slip is empty</p>
          <p class="text-xs text-cyan-700 mt-1">Click on odds to add selections</p>
        </div>

        <!-- Items -->
        <div v-for="sel in betStore.slip" :key="sel.marketKey" class="px-4 py-3">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-cyan-100 truncate">{{ sel.matchName }}</p>
              <p class="text-[11px] text-cyan-600 mt-0.5">
                {{ sel.market }} · <span class="text-cyan-400">{{ sel.pick }}</span>
              </p>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span class="text-sm font-black text-yellow-400 font-mono">{{ sel.odds }}</span>
              <button class="w-5 h-5 flex items-center justify-center rounded text-cyan-700"
                      @click="betStore.removeFromSlip(sel.marketKey)">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="betStore.slipCount > 0"
           class="p-4 border-t border-cyan-800/60 space-y-3 flex-shrink-0">

        <!-- Stake input -->
        <div>
          <label class="block text-[11px] font-bold text-cyan-600 mb-1.5 uppercase tracking-wide">Stake (TZS)</label>
          <input v-model.number="betStore.stake"
                 type="number" min="10" placeholder="Enter stake amount"
                 class="w-full bg-cyan-950/80 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors" />
        </div>

        <!-- Quick stakes -->
        <div class="flex gap-1.5">
          <button v-for="q in [50, 100, 200, 500]" :key="q"
                  class="flex-1 py-1.5 text-xs font-bold rounded-lg border border-cyan-800 text-cyan-600 transition-colors"
                  @click="betStore.stake = q">{{ q }}</button>
        </div>

        <!-- Summary -->
        <div class="space-y-1.5 text-xs bg-cyan-900/30 rounded-xl px-3 py-2.5">
          <div class="flex justify-between">
            <span class="text-cyan-600">Total Odds</span>
            <span class="text-yellow-400 font-black font-mono">{{ betStore.totalOdds.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-cyan-600">Potential Win</span>
            <span class="text-emerald-400 font-black font-mono">TZS {{ formatMoney(betStore.potentialWin) }}</span>
          </div>
        </div>

        <!-- Place bet -->
        <button class="btn-place-bet"
                :disabled="!betStore.stake || betStore.stake < 10"
                @click="placeBet">
          Place Bet
        </button>

        <p class="text-[10px] text-cyan-700 text-center">20% Excise Duty · Must be 18+</p>
      </div>

    </template>

    <!-- ══ VIRTUALS TAB ══ -->
    <template v-else>
      <div class="flex items-center justify-end px-4 py-2.5 border-b border-cyan-800/60 flex-shrink-0">
        <button v-if="virtualSlip.length > 0"
                class="text-xs font-bold text-red-400 transition-colors"
                @click="virtualSlip = []">
          Clear All
        </button>
      </div>
      <div class="flex-1 overflow-y-auto" style="scrollbar-width: none;">
        <div v-if="virtualSlip.length === 0"
             class="flex flex-col items-center justify-center h-48 text-center px-4">
          <span class="text-3xl mb-3">🤖</span>
          <p class="text-sm font-semibold text-cyan-600">No virtual bets</p>
          <p class="text-xs text-cyan-700 mt-1">Add virtual selections to your slip</p>
        </div>
      </div>
    </template>

    <!-- ══ BOOKING CODE MODAL ══ -->
    <Transition name="fade">
      <div v-if="bookingCode"
           class="absolute inset-0 flex items-center justify-center z-10"
           style="background: rgba(0,0,0,0.75);"
           @click.self="bookingCode = ''">
        <div class="bg-cyan-950 border border-cyan-700 rounded-2xl p-6 mx-4 text-center w-full max-w-xs">
          <p class="text-xs text-cyan-600 mb-2 font-semibold uppercase tracking-wide">Booking Code</p>
          <p class="text-3xl font-black font-mono text-yellow-400 tracking-widest mb-4">{{ bookingCode }}</p>
          <p class="text-xs text-cyan-600 mb-5">Share this code so others can load your slip</p>
          <div class="flex gap-2">
            <button class="flex-1 py-2.5 rounded-xl text-xs font-bold border border-cyan-700 text-cyan-400 transition-colors"
                    @click="copyCode">
              {{ copied ? '✅ Copied!' : 'Copy Code' }}
            </button>
            <button class="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950"
                    @click="bookingCode = ''">
              Done
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBetStore } from '../../stores/betStore'
import AppToast from '../ui/AppToast.vue'

defineEmits(['close'])

const betStore    = useBetStore()
const activeTab   = ref('sports')
const virtualSlip = ref([])
const bookingCode = ref('')
const copied      = ref(false)

// ── Toast ─────────────────────────────────────────────────────────────────
const toast = ref({ show: false, message: '', type: 'success' })

function showToast(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, duration)
}


// ── Helpers ───────────────────────────────────────────────────────────────
function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 2 }).format(n || 0)
}

// ── Place Bet ─────────────────────────────────────────────────────────────
function placeBet() {
  if (!betStore.stake || betStore.stake < 10) {
    showToast('Minimum stake ni TZS 10', 'error')
    return
  }
  // TODO: connect to betService
  showToast(`Bet imewekwa! TZS ${betStore.stake} · Odds ${betStore.totalOdds.toFixed(2)}`, 'success')
  betStore.clearSlip()
}

// ── Booking Code ──────────────────────────────────────────────────────────
function createBookingCode() {
  if (betStore.slipCount === 0) {
    showToast('Ongeza mchezo kwanza', 'error')
    return
  }
  bookingCode.value = Math.random().toString(36).substring(2, 8).toUpperCase()
}

async function copyCode() {
  await navigator.clipboard.writeText(bookingCode.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.btn-place-bet {
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
.btn-place-bet:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Toast */
.toast-enter-active,
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from,
.toast-leave-to     { opacity: 0; transform: translateY(-8px); }

/* Fade (booking modal) */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }
</style>