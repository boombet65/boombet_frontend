
// betSlipContent.vue 
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

      <!-- Booking code + Clear all - only when selections exist -->
      <div v-if="betStore.slipCount > 0" class="flex items-center justify-between px-4 py-2.5 border-b border-cyan-800/60 flex-shrink-0">
        <div class="flex gap-2">
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-700 text-cyan-400 text-xs font-bold transition-all"
                  :disabled="isCreatingBookingCode"
                  @click="createBookingCode">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
            Create Code
          </button>
          <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-700 text-cyan-400 text-xs font-bold transition-all"
                  @click="openLoadBookingModal">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Load Code
          </button>
        </div>
        <button class="text-xs font-bold text-red-400 transition-colors"
                @click="betStore.clearSlip()">
          Clear All
        </button>
      </div>

      <!-- Selections list -->
      <div class="flex-1 overflow-y-auto" style="scrollbar-width: none;">

        <!-- Empty State -->
        <div v-if="betStore.slipCount === 0" class="flex flex-col items-center justify-center h-full px-6 py-8">
          <!-- Icon -->
          <div class="w-16 h-16 rounded-full bg-cyan-900/30 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-cyan-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor"/>
            </svg>
          </div>
          
          <!-- Title -->
          <p class="text-sm font-bold text-cyan-100 mb-1">Sports bet slip is empty</p>
          <p class="text-xs text-cyan-600 mb-6">Load a booking code or click on odds to add selections</p>
          
          <!-- Input and Load Button -->
          <div class="w-full space-y-3">
            <div class="flex gap-2">
              <input 
                v-model="loadCodeInput"
                type="text"
                placeholder="ENTER CODE E.G. ABC123"
                maxlength="10"
                class="flex-1 min-w-0 bg-cyan-900/50 border border-cyan-700 rounded-lg px-3 py-2 text-cyan-100 text-xs font-mono tracking-wider uppercase outline-none focus:border-yellow-400 placeholder:text-cyan-600 placeholder:tracking-normal"
                @keyup.enter="submitLoadBookingCode"
              />
              <button 
                @click="submitLoadBookingCode"
                :disabled="isLoadingBookingCode || !loadCodeInput.trim()"
                class="px-6 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 disabled:opacity-50 whitespace-nowrap flex-shrink-0"
              >
                <span v-if="isLoadingBookingCode" class="flex items-center gap-2">
                  <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Loading...
                </span>
                <span v-else>Load</span>
              </button>
            </div>
            
            <!-- Or Divider -->
            <div class="flex items-center gap-3">
              <div class="flex-1 h-px bg-cyan-800/40"></div>
              <span class="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">or</span>
              <div class="flex-1 h-px bg-cyan-800/40"></div>
            </div>
            
            <!-- Browse Sports Button -->
            <RouterLink to="/sports" 
                       class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold border border-cyan-700 text-cyan-400 hover:border-cyan-500 hover:text-cyan-200 transition-colors"
                       @click="$emit('close')">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Browse Sports
            </RouterLink>
          </div>
        </div>

        <!-- Items - when selections exist -->
        <div v-else>
          <div v-for="sel in betStore.slip" :key="sel.marketKey" class="px-4 py-3 border-b border-cyan-800/40">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-cyan-100 truncate">{{ sel.matchName }}</p>
                <p class="text-[11px] text-cyan-600 mt-0.5">
                  {{ sel.market }} · <span class="text-cyan-400">{{ sel.pick }}</span>
                </p>
              </div>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <span class="text-sm font-black text-yellow-400 font-mono">{{ sel.odds }}</span>
                <button class="w-5 h-5 flex items-center justify-center rounded text-cyan-700 hover:text-red-400 transition-colors"
                        @click="betStore.removeFromSlip(sel.matchId, sel.marketKey)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer - only when selections exist -->
      <div v-if="betStore.slipCount > 0"
           class="p-4 border-t border-cyan-800/60 space-y-3 flex-shrink-0">

        <!-- Stake input -->
        <div>
          <label class="block text-[11px] font-bold text-cyan-600 mb-1.5 uppercase tracking-wide">Stake (TZS)</label>
          <input v-model.number="stakeAmount"
                 type="number" min="125000" placeholder="Enter stake amount"
                 @input="updateStake"
                 :disabled="!authStore.isLoggedIn"
                 class="w-full bg-cyan-950/80 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
          <p v-if="stakeAmount > 0 && stakeAmount < 125000" class="text-red-400 text-[10px] mt-1">Minimum stake ni TZS 125000</p>
        </div>

        <!-- Quick stakes -->
        <div class="flex gap-1.5">
          <button v-for="q in [100000, 200000, 250000, 4000000]" :key="q"
                  :disabled="!authStore.isLoggedIn"
                  class="flex-1 py-1.5 text-xs font-bold rounded-lg border border-cyan-800 text-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="setQuickStake(q)">{{ q }}</button>
        </div>

        <!-- Balance Display (only show when logged in) -->
        <div v-if="authStore.isLoggedIn" class="bg-cyan-900/40 rounded-xl px-3 py-2 flex justify-between items-center">
          <span class="text-cyan-400 text-xs font-medium">Your Balance</span>
          <span class="text-yellow-400 font-bold text-sm font-mono">
            TZS {{ formatMoney(authStore.userBalance || 0) }}
          </span>
        </div>

        <!-- Summary -->
        <div class="space-y-1.5 text-xs bg-cyan-900/30 rounded-xl px-3 py-2.5">
          <div class="flex justify-between">
            <span class="text-cyan-600">Total Odds</span>
            <span class="text-yellow-400 font-black font-mono">{{ betStore.totalOdds.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-cyan-600">Potential Win</span>
            <span class="text-emerald-400 font-black font-mono">TZS {{ formatMoney(potentialWin) }}</span>
          </div>
          <div class="flex justify-between border-t border-cyan-800/40 pt-1.5 mt-1">
            <span class="text-cyan-600">Tax (12%)</span>
            <span class="text-red-400 font-mono">- TZS {{ formatMoney(taxAmount) }}</span>
          </div>
          <div class="flex justify-between border-t border-yellow-400/20 pt-1.5 mt-1">
            <span class="text-cyan-100 font-bold">Net Payout</span>
            <span class="text-yellow-400 font-black font-mono">TZS {{ formatMoney(netPayout) }}</span>
          </div>
        </div>

        <!-- Place bet / Login button -->
        <button v-if="authStore.isLoggedIn" 
                class="btn-place-bet"
                :disabled="isPlacingBet || !isStakeValid || !hasEnoughBalance"
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

        <button v-else 
                class="btn-login"
                @click="showLoginModal = true">
          Login to Bet
        </button>

        <!-- Insufficient balance warning -->
        <div v-if="hasEnoughBalance === false && authStore.isLoggedIn && stakeAmount > 0" 
             class="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
          <p class="text-red-400 text-[10px]">Insufficient balance! You need TZS {{ formatMoney(stakeAmount) }} but have TZS {{ formatMoney(authStore.userBalance) }}</p>
        </div>

        <p class="text-[10px] text-cyan-700 text-center">12% Excise Duty on winnings · Must be 18+</p>
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

    <!-- ══ CREATE BOOKING CODE MODAL ══ -->
    <Transition name="fade">
      <div v-if="showBookingModal"
           class="absolute inset-0 flex items-center justify-center z-10"
           style="background: rgba(0,0,0,0.75);"
           @click.self="closeBookingModal">
        <div class="bg-cyan-950 border border-cyan-700 rounded-2xl p-6 mx-4 text-center w-full max-w-xs">
          <p class="text-xs text-cyan-600 mb-2 font-semibold uppercase tracking-wide">Booking Code</p>
          <p class="text-3xl font-black font-mono text-yellow-400 tracking-widest mb-4">{{ generatedBookingCode }}</p>
          <p class="text-xs text-cyan-600 mb-5">Valid for 5 hours. Share this code so others can load your slip</p>
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

    <!-- ══ LOAD BOOKING CODE MODAL ══ -->
    <Transition name="fade">
      <div v-if="showLoadBookingModal"
           class="absolute inset-0 z-20 flex items-center justify-center bg-black/90"
           @click.self="closeLoadBookingModal">
        <div class="bg-cyan-950 border border-cyan-700 rounded-2xl p-6 mx-4 w-full max-w-sm">
          <h3 class="text-white font-bold text-lg mb-4 text-center">Load Booking Code</h3>
          
          <div class="mb-4">
            <label class="block text-cyan-400 text-xs mb-2">Enter Booking Code</label>
            <input 
              v-model="loadCodeInput"
              type="text"
              placeholder="e.g., ABC123"
              maxlength="10"
              class="w-full bg-cyan-900/50 border border-cyan-700 rounded-lg px-4 py-2.5 text-cyan-100 text-center font-mono text-lg tracking-wider uppercase outline-none focus:border-yellow-400"
              @keyup.enter="submitLoadBookingCode"
            />
          </div>
          
          <div v-if="loadCodeError" class="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
            <p class="text-red-400 text-xs">{{ loadCodeError }}</p>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="submitLoadBookingCode"
              :disabled="isLoadingBookingCode"
              class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 disabled:opacity-50"
            >
              <span v-if="isLoadingBookingCode" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Loading...
              </span>
              <span v-else>Load Bet Slip</span>
            </button>
            <button 
              @click="closeLoadBookingModal"
              class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-cyan-700 text-cyan-400"
            >
              Cancel
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
          <div class="space-y-2 text-left bg-cyan-900/30 rounded-xl p-3 mb-4">
            <div class="flex justify-between text-xs">
              <span class="text-cyan-600">Stake:</span>
              <span class="text-cyan-100 font-bold">TZS {{ formatMoney(placedBetData?.stake) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-cyan-600">Total Odds:</span>
              <span class="text-yellow-400 font-bold">{{ placedBetData?.total_odds || placedBetData?.totalOdds?.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-cyan-600">Potential Win:</span>
              <span class="text-emerald-400 font-bold">TZS {{ formatMoney(placedBetData?.possible_win) }}</span>
            </div>
            <div class="flex justify-between text-xs border-t border-cyan-800/40 pt-2 mt-1">
              <span class="text-cyan-600">Net Payout:</span>
              <span class="text-yellow-400 font-bold">TZS {{ formatMoney(placedBetData?.payout) }}</span>
            </div>
          </div>
          <button class="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950"
                  @click="closeSuccessModalAndRefreshBalance">
            Done
          </button>
        </div>
      </div>
    </Transition>

    <!-- Login Modal -->
    <Transition name="fade">
      <div v-if="showLoginModal"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
           @click.self="showLoginModal = false">
        <div class="bg-cyan-950 border border-cyan-700 rounded-2xl p-6 mx-4 w-full max-w-sm">
          <h3 class="text-white font-bold text-lg mb-4 text-center">Login Required</h3>
          <p class="text-cyan-400 text-sm text-center mb-6">Please login to continue placing bets</p>
          <button @click="showLoginModal = false; redirectToLogin()"
                  class="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950">
            Go to Login
          </button>
          <button @click="showLoginModal = false"
                  class="w-full mt-3 py-2.5 rounded-xl text-sm font-bold border border-cyan-700 text-cyan-400">
            Cancel
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBetStore } from '../../stores/bet/betStore'
import { useAuthStore } from '../../stores/auth/authStore'
import { useBookingCodeStore } from '../../stores/bookingCode/useBookingCodeStore'

defineEmits(['close'])

const betStore = useBetStore()
const authStore = useAuthStore()
const bookingCodeStore = useBookingCodeStore()
const activeTab = ref('sports')
const virtualSlip = ref([])

// Login modal
const showLoginModal = ref(false)

// Stake handling
const stakeAmount = ref(betStore.stake)
const isStakeValid = computed(() => stakeAmount.value >= 125000)

// ============ CALCULATIONS (Frontend only for display) ============
const potentialWin = computed(() => {
  const stake = stakeAmount.value || 0
  const odds = betStore.totalOdds || 1
  return stake * (odds - 1)
})

const taxAmount = computed(() => {
  return potentialWin.value * 0.12
})

const netPayout = computed(() => {
  return potentialWin.value - taxAmount.value + stakeAmount.value
})
// ================================================================

// Check if user has enough balance
const hasEnoughBalance = computed(() => {
  if (!authStore.isLoggedIn) return false
  return (authStore.userBalance || 0) >= stakeAmount.value
})

// Bet placement state
const isPlacingBet = ref(false)

// Booking code state
const showBookingModal = ref(false)
const generatedBookingCode = ref('')
const isCreatingBookingCode = ref(false)
const copied = ref(false)

// Load booking code state
const showLoadBookingModal = ref(false)
const loadCodeInput = ref('')
const loadCodeError = ref('')
const isLoadingBookingCode = ref(false)

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
  if (!authStore.isLoggedIn) {
    showToast('Please login first', 'error')
    showLoginModal.value = true
    return
  }
  stakeAmount.value = amount
  betStore.updateStake(amount)
}

function redirectToLogin() {
  window.location.href = '/login'
}

// Refresh user balance
async function refreshUserBalance() {
  if (authStore.isLoggedIn) {
    await authStore.fetchUserBalance()
  }
}

// Watch store stake to sync input
watch(() => betStore.stake, (newVal) => {
  stakeAmount.value = newVal
})

// ── Place Bet ──────────────────────────────────────────────────────────────
async function placeBet() {
  if (!authStore.isLoggedIn) {
    showToast('Please login to place bets', 'error')
    showLoginModal.value = true
    return
  }
  
  if (!isStakeValid.value) {
    showToast('Minimum stake ni TZS 125000', 'error')
    return
  }
  
  if (betStore.slipCount === 0) {
    showToast('Add selections to your slip first', 'error')
    return
  }
  
  if (!hasEnoughBalance.value) {
    showToast(`Insufficient balance! You need TZS ${stakeAmount.value} but have TZS ${authStore.userBalance || 0}`, 'error')
    return
  }
  
  isPlacingBet.value = true
  
  try {
    const result = await betStore.placeBetWithBackend()
    
    if (result.success) {
      placedBetData.value = result.data
      showSuccessModal.value = true
      showToast('Bet placed successfully!', 'success')
      await refreshUserBalance()
    } else {
      if (result.error?.message?.toLowerCase().includes('insufficient') || 
          result.message?.toLowerCase().includes('insufficient')) {
        showToast('Insufficient balance. Please deposit funds.', 'error')
        await refreshUserBalance()
      } else {
        showToast(result.error?.message || result.message || 'Failed to place bet', 'error')
      }
    }
  } catch (error) {
    console.error('Place bet error:', error)
    showToast('Something went wrong. Please try again.', 'error')
  } finally {
    isPlacingBet.value = false
  }
}

async function closeSuccessModalAndRefreshBalance() {
  showSuccessModal.value = false
  placedBetData.value = null
  await refreshUserBalance()
}

function closeSuccessModal() {
  showSuccessModal.value = false
  placedBetData.value = null
}

// ── Create Booking Code ───────────────────────────────────────────────────
async function createBookingCode() {
  // if (!authStore.isLoggedIn) {
  //   showToast('Please login to create booking code', 'error')
  //   showLoginModal.value = true
  //   return
  // }
  
  if (betStore.slipCount === 0) {
    showToast('Add selections to create booking code', 'error')
    return
  }
  
  isCreatingBookingCode.value = true
  
  try {
    const fixedSlip = betStore.slip.map(sel => ({
      ...sel,
      matchId: sel.matchId || sel.match_id || sel.id || sel.matchID
    }))
    
    const result = await bookingCodeStore.createBookingCode(fixedSlip)
    
    if (result.success) {
      generatedBookingCode.value = result.data?.code || result.bookingCode
      showBookingModal.value = true
      showToast('Booking code created successfully!', 'success')
    } else {
      showToast(result.message || 'Failed to create booking code', 'error')
    }
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

// ── Load Booking Code ──────────────────────────────────────────────────────
function openLoadBookingModal() {
  loadCodeInput.value = ''
  loadCodeError.value = ''
  showLoadBookingModal.value = true
}

function closeLoadBookingModal() {
  showLoadBookingModal.value = false
  loadCodeInput.value = ''
  loadCodeError.value = ''
  isLoadingBookingCode.value = false
}

async function submitLoadBookingCode() {
  const code = loadCodeInput.value.trim().toUpperCase()
  
  if (!code) {
    loadCodeError.value = 'Please enter a booking code'
    return
  }
  
  isLoadingBookingCode.value = true
  loadCodeError.value = ''
  
  try {
    const result = await bookingCodeStore.fetchBookingCodeDetails(code)
    
    if (result.success && result.data) {
      betStore.clearSlip()
      
      const loadedMatches = result.data.selections || result.data.matches || []
      
      if (result.data.warning) {
        showToast(result.data.warning, 'warning')
      }
      
      if (result.data.has_status_changes) {
        showToast('Baadhi ya mechi zimebadilika status. Odds zilizohifadhiwa zimetumika.', 'warning')
      }
      
      loadedMatches.forEach(item => {
        betStore.addToSlip({
          matchId: item.match_id || item.matchId || item.id,
          matchName: `${item.home_team || ''} vs ${item.away_team || ''}`,
          market: item.market_key || item.market || '1X2',
          marketKey: `${item.match_id || item.id}_${item.market_key || '1X2'}`,
          pick: item.outcome_key || item.pick || '1',
          odds: item.odds || 1
        })
      })
      
      showToast(`Loaded ${loadedMatches.length} selections successfully!`, 'success')
      closeLoadBookingModal()
    } else {
      loadCodeError.value = result.message || 'Failed to load booking code'
    }
  } catch (error) {
    console.error('Load booking code error:', error)
    loadCodeError.value = error.response?.data?.message || 'Failed to load booking code. Please try again.'
  } finally {
    isLoadingBookingCode.value = false
  }
}

// ── Virtual Slip ──────────────────────────────────────────────────────────
function clearVirtualSlip() {
  virtualSlip.value = []
}

onMounted(async () => {
  if (authStore.isLoggedIn) {
    await refreshUserBalance()
  }
})

defineExpose({ loadSharedSlip: submitLoadBookingCode })
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

.btn-login {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-weight: 900;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: linear-gradient(to right, #0891b2, #06b6d4);
  color: white;
}
.btn-login:hover {
  background: linear-gradient(to right, #0e7490, #0891b2);
  transform: translateY(-1px);
}

/* Toast */
.toast-enter-active,
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from,
.toast-leave-to     { opacity: 0; transform: translateY(-8px); }

/* Fade */
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