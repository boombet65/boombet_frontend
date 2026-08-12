<template>
    <div class="flex flex-col flex-1 overflow-hidden">
  
  
      <!-- Row 2: Sports / Virtuals tabs -->
      <div class="flex border-b border-cyan-800/60 flex-shrink-0">
        <button
          class="flex-1 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5"
          :class="activeTab === 'sports' ? 'text-yellow-400 border-yellow-400' : 'text-cyan-600 border-transparent hover:text-cyan-300'"
          @click="activeTab = 'sports'">
          Sports
          <span class=" rounded-full flex items-center justify-center text-[10px] font-black  text-cyan-450">
         ({{ betStore.slipCount }})
        </span>
        </button>
        <button
          class="flex-1 py-2.5 text-xs font-bold transition-all border-b-2"
          :class="activeTab === 'virtuals' ? 'text-yellow-400 border-yellow-400' : 'text-cyan-600 border-transparent hover:text-cyan-300'"
          @click="activeTab = 'virtuals'">
          Virtuals
        </button>
      </div>
  
      <!-- ══ SPORTS TAB ══ -->
      <template v-if="activeTab === 'sports'">
  
        <!-- Row 3: Booking code + Clear all -->
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-cyan-800/60 flex-shrink-0">
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-700 text-cyan-400 text-xs font-bold hover:border-cyan-500 hover:text-cyan-200 transition-all"
                  @click="createBookingCode">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
            Create Booking Code
          </button>
          <button v-if="betStore.slipCount > 0"
                  class="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
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
  
          <!-- Items — NO stake input per item -->
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
                <button class="w-5 h-5 flex items-center justify-center rounded text-cyan-700 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
  
          <!-- Single stake input for ALL games -->
          <div>
            <label class="block text-[11px] font-bold text-cyan-600 mb-1.5 uppercase tracking-wide">Stake (TZS)</label>
            <input v-model.number="betStore.stake"
                   type="number" min="10" placeholder="Enter stake amount"
                   class="w-full bg-cyan-950/80 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors" />
          </div>
  
          <!-- Quick stakes -->
          <div class="flex gap-1.5">
            <button v-for="q in [50, 100, 200, 500]" :key="q"
                    class="flex-1 py-1.5 text-xs font-bold rounded-lg border border-cyan-800 text-cyan-600 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
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
          <button class="w-full py-3 rounded-xl text-sm font-black bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 hover:opacity-90 transition-opacity disabled:opacity-40"
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
                  class="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
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
  
      <!-- Booking code modal -->
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
              <button class="flex-1 py-2.5 rounded-xl text-xs font-bold border border-cyan-700 text-cyan-400 hover:border-cyan-500 transition-colors"
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
  
  defineEmits(['close'])
  
  const betStore    = useBetStore()
  const activeTab   = ref('sports')
  const virtualSlip = ref([])
  const bookingCode = ref('')
  const copied      = ref(false)
  
  function formatMoney(n) {
    return new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(n || 0)
  }
  
  function placeBet() {
    // TODO: connect to betService
    alert('Bet placed!')
    betStore.clearSlip()
  }
  
  function createBookingCode() {
    if (betStore.slipCount === 0) return
    // TODO: replace with API call
    bookingCode.value = Math.random().toString(36).substring(2, 8).toUpperCase()
  }
  
  async function copyCode() {
    await navigator.clipboard.writeText(bookingCode.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
  </script>