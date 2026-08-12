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
                :disabled="isCreatingBookingCode"
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
                      @click="betStore.removeFromSlip(sel.matchId, sel.marketKey)">
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
          <input v-model.number="stakeAmount"
                 type="number" min="100" placeholder="Enter stake amount"
                 @input="updateStake"
                 class="w-full bg-cyan-950/80 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors" />
          <p v-if="stakeAmount > 0 && stakeAmount < 100" class="text-red-400 text-[10px] mt-1">Minimum stake ni TZS 100</p>
        </div>

        <!-- Quick stakes -->
        <div class="flex gap-1.5">
          <button v-for="q in [100, 200, 500, 1000]" :key="q"
                  class="flex-1 py-1.5 text-xs font-bold rounded-lg border border-cyan-800 text-cyan-600 transition-colors"
                  @click="setQuickStake(q)">{{ q }}</button>
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
                :disabled="isPlacingBet || !isStakeValid"
                @click="placeBet">
          <span v-if="isPlacingBet" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Place Bet</span>
        </button>

        <p class="text-[10px] text-cyan-700 text-center">20% Excise Duty · Must be 18+</p>
      </div>

    </template>

    <!-- ══ VIRTUALS TAB ══ -->
    <template v-else>
      <div class="flex items-center justify-end px-4 py-2.5 border-b border-cyan-800/60 flex-shrink-0">
        <button v-if="virtualSlip.length > 0"
                class="text-xs font-bold text-red-400 transition-colors"
                @click="clearVirtualSlip">
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
      <div v-if="showBookingModal"
           class="absolute inset-0 flex items-center justify-center z-10"
           style="background: rgba(0,0,0,0.75);"
           @click.self="closeBookingModal">
        <div class="bg-cyan-950 border border-cyan-700 rounded-2xl p-6 mx-4 text-center w-full max-w-xs">
          <p class="text-xs text-cyan-600 mb-2 font-semibold uppercase tracking-wide">Booking Code</p>
          <p class="text-3xl font-black font-mono text-yellow-400 tracking-widest mb-4">{{ generatedBookingCode }}</p>
          <p class="text-xs text-cyan-600 mb-5">Share this code so others can load your slip</p>
          <div class="flex gap-2">
            <button class="flex-1 py-2.5 rounded-xl text-xs font-bold border border-cyan-700 text-cyan-400 transition-colors"
                    @click="copyBookingCode">
              {{ copied ? '✅ Copied!' : 'Copy Code' }}
            </button>
            <button class="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950"
                    @click="closeBookingModal">
              Done
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══ SUCCESS MODAL (After placing bet) ══ -->
    <Transition name="fade">
      <div v-if="showSuccessModal"
           class="absolute inset-0 flex items-center justify-center z-10"
           style="background: rgba(0,0,0,0.85);"
           @click.self="closeSuccessModal">
        <div class="bg-cyan-950 border border-cyan-700 rounded-2xl p-5 mx-4 text-center w-full max-w-sm">
          <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg class="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p class="text-lg font-black text-white mb-1">Bet Placed!</p>
          <p class="text-xs text-cyan-400 mb-3">Booking Code</p>
          <p class="text-2xl font-black font-mono text-yellow-400 tracking-widest mb-4">{{ placedBetData?.bookingCode }}</p>
          <div class="space-y-2 text-left bg-cyan-900/30 rounded-xl p-3 mb-4">
            <div class="flex justify-between text-xs">
              <span class="text-cyan-600">Stake:</span>
              <span class="text-cyan-100 font-bold">TZS {{ formatMoney(placedBetData?.stake) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-cyan-600">Total Odds:</span>
              <span class="text-yellow-400 font-bold">{{ placedBetData?.totalOdds?.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-cyan-600">Potential Win:</span>
              <span class="text-emerald-400 font-bold">TZS {{ formatMoney(placedBetData?.potentialReturn) }}</span>
            </div>
          </div>
          <button class="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950"
                  @click="closeSuccessModal">
            Continue
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBetStore } from '../../stores/betStore'
import betService from '../../services/betService'

defineEmits(['close'])

const betStore = useBetStore()
const activeTab = ref('sports')
const virtualSlip = ref([])

// Stake handling
const stakeAmount = ref(betStore.stake)
const isStakeValid = computed(() => stakeAmount.value >= 100)

// Bet placement state
const isPlacingBet = ref(false)

// Booking code state
const showBookingModal = ref(false)
const generatedBookingCode = ref('')
const isCreatingBookingCode = ref(false)
const copied = ref(false)

// Success modal state
const showSuccessModal = ref(false)
const placedBetData = ref(null)

// Toast
const toast = ref({ show: false, message: '', type: 'success' })

function showToast(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, duration)
}

// ── Helpers ───────────────────────────────────────────────────────────────
function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 0 }).format(n || 0)
}

function updateStake() {
  betStore.updateStake(stakeAmount.value)
}

function setQuickStake(amount) {
  stakeAmount.value = amount
  betStore.updateStake(amount)
}

// Watch store stake to sync input
watch(() => betStore.stake, (newVal) => {
  stakeAmount.value = newVal
})

// ── Place Bet (Integrated with Backend) ───────────────────────────────────
async function placeBet() {
  if (!isStakeValid.value) {
    showToast('Minimum stake ni TZS 100', 'error')
    return
  }
  
  if (betStore.slipCount === 0) {
    showToast('Add selections to your slip first', 'error')
    return
  }
  
  isPlacingBet.value = true
  
  try {
    const result = await betStore.placeBetWithBackend()
    
    if (result.success) {
      placedBetData.value = result.data
      showSuccessModal.value = true
      showToast('Bet placed successfully!', 'success')
    } else {
      showToast(result.error?.message || 'Failed to place bet', 'error')
    }
  } catch (error) {
    console.error('Place bet error:', error)
    showToast('Something went wrong. Please try again.', 'error')
  } finally {
    isPlacingBet.value = false
  }
}

// ── Booking Code (Integrated with Backend) ─────────────────────────────────
async function createBookingCode() {
  if (betStore.slipCount === 0) {
    showToast('Add selections to create booking code', 'error')
    return
  }
  
  isCreatingBookingCode.value = true
  
  try {
    // Format selections for booking code
    const selections = betStore.slip.map(sel => ({
      match: {
        id: sel.matchId,
        name: sel.matchName,
        market: sel.market,
        marketKey: sel.marketKey
      },
      selection: sel.pick,
      odds: sel.odds
    }))
    
    // Create a temporary bet to get booking code
    // Note: You might need a separate API endpoint for this
    // For now, using placeBet with zero stake? Or create a preview endpoint
    
    // Alternative: Generate local code for sharing slip (not placed yet)
    // This is for slip sharing BEFORE placing bet
    const tempCode = Math.random().toString(36).substring(2, 9).toUpperCase()
    generatedBookingCode.value = tempCode
    showBookingModal.value = true
    
    // Optional: Save to localStorage for later retrieval
    const shareData = {
      code: tempCode,
      selections: betStore.slip,
      createdAt: Date.now()
    }
    const existingShares = JSON.parse(localStorage.getItem('shared_slips') || '{}')
    existingShares[tempCode] = shareData
    localStorage.setItem('shared_slips', JSON.stringify(existingShares))
    
  } catch (error) {
    console.error('Create booking code error:', error)
    showToast('Failed to create booking code', 'error')
  } finally {
    isCreatingBookingCode.value = false
  }
}

async function copyBookingCode() {
  try {
    await navigator.clipboard.writeText(generatedBookingCode.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
    showToast('Code copied to clipboard!', 'success')
  } catch (error) {
    showToast('Failed to copy', 'error')
  }
}

function closeBookingModal() {
  showBookingModal.value = false
  generatedBookingCode.value = ''
  copied.value = false
}

function closeSuccessModal() {
  showSuccessModal.value = false
  placedBetData.value = null
}

// ── Virtual Slip ──────────────────────────────────────────────────────────
function clearVirtualSlip() {
  virtualSlip.value = []
}

// Optional: Load shared slip by booking code
async function loadSharedSlip(bookingCode) {
  const sharedSlips = JSON.parse(localStorage.getItem('shared_slips') || '{}')
  const sharedData = sharedSlips[bookingCode]
  
  if (sharedData && sharedData.selections) {
    // Clear current slip
    betStore.clearSlip()
    
    // Add shared selections
    sharedData.selections.forEach(sel => {
      betStore.addToSlip(sel)
    })
    
    showToast('Slip loaded successfully!', 'success')
    return true
  }
  
  return false
}

// Expose loadSharedSlip to parent if needed
defineExpose({ loadSharedSlip })

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

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>