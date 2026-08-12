<template>
    <div class="max-w-md mx-auto px-4 py-6 space-y-4 relative">
  
      <!-- Toast -->
      <Transition name="toast">
        <AppToast v-if="toast.show" :toast="toast" />
      </Transition>
  
      <!-- Header -->
      <div class="mb-2">
        <h1 class="text-xl font-black text-white">Withdraw</h1>
        <p class="text-xs text-cyan-600 mt-1">Withdraw funds from your account</p>
      </div>
  
      <!-- Balance card -->
      <div class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p class="text-[11px] text-cyan-600 uppercase tracking-wide font-bold">Available Balance</p>
          <p class="text-xl font-black text-white font-mono mt-1">{{ authStore.formattedBalance }}</p>
          <p class="text-[10px] text-cyan-700 mt-1">
            Max withdrawable: TZS {{ maxWithdraw.toLocaleString() }}
          </p>
        </div>
        <span class="text-3xl">💰</span>
      </div>
  
      <!-- Amount -->
      <div>
        <label class="block text-[11px] font-bold text-cyan-600 mb-1.5 uppercase tracking-wide">
          Amount (TZS)
          <span class="text-cyan-700 normal-case">· Min TZS {{ minWithdraw.toLocaleString() }}</span>
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">TZS</span>
          <input v-model.number="amount"
                 type="number" :min="minWithdraw" :max="maxWithdraw" placeholder="0"
                 class="w-full bg-cyan-950/80 border text-cyan-100 placeholder-cyan-700 rounded-xl pl-12 pr-4 py-3 text-sm font-mono outline-none transition-colors"
                 :class="amountError
                   ? 'border-red-500 focus:border-red-500'
                   : 'border-cyan-800 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10'" />
        </div>
        <p v-if="amountError" class="text-[11px] text-red-400 mt-1">{{ amountError }}</p>
      </div>
  
      <!-- Quick amounts -->
      <div class="grid grid-cols-4 gap-2">
        <button v-for="q in quickAmounts" :key="q"
                class="py-2 text-xs font-bold rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                :class="amount === q
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-cyan-800 text-cyan-600 hover:border-cyan-600'"
                :disabled="q > maxWithdraw"
                @click="amount = q">
          {{ formatShort(q) }}
        </button>
      </div>
  
      <!-- Withdraw method -->
      <div>
        <label class="block text-[11px] font-bold text-cyan-600 mb-2 uppercase tracking-wide">Send To</label>
        <div class="space-y-2">
          <button v-for="m in methods" :key="m.id"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                  :class="method === m.id
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-cyan-800/60 bg-cyan-900/20 hover:border-cyan-700'"
                  @click="method = m.id">
            <span class="text-xl">{{ m.icon }}</span>
            <div class="text-left flex-1">
              <p class="text-sm font-bold" :class="method === m.id ? 'text-yellow-400' : 'text-cyan-100'">{{ m.name }}</p>
              <p class="text-[11px] text-cyan-600">{{ m.desc }}</p>
            </div>
            <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                 :class="method === m.id ? 'border-yellow-400 bg-yellow-400' : 'border-cyan-700'">
              <div v-if="method === m.id" class="w-1.5 h-1.5 rounded-full bg-cyan-950"></div>
            </div>
          </button>
        </div>
      </div>
  
      <!-- Phone number -->
      <div>
        <label class="block text-[11px] font-bold text-cyan-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">+255</span>
          <input v-model="phone" type="tel" placeholder="7XX XXX XXX" maxlength="9"
                 class="w-full bg-cyan-950/80 border text-cyan-100 placeholder-cyan-700 rounded-xl pl-14 pr-4 py-3 text-sm font-mono outline-none transition-colors"
                 :class="phoneError
                   ? 'border-red-500'
                   : 'border-cyan-800 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10'" />
        </div>
        <p v-if="phoneError" class="text-[11px] text-red-400 mt-1">{{ phoneError }}</p>
      </div>
  
      <!-- Withdraw button -->
      <button class="w-full py-3.5 rounded-xl text-sm font-black transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style="background: linear-gradient(to right, #eab308, #facc15); color: #083344;"
              :disabled="!canWithdraw"
              @click="confirmModal = true">
        Withdraw TZS {{ amount ? amount.toLocaleString() : '0' }}
      </button>
  
      <!-- Confirm Modal -->
      <AppModal v-model="confirmModal" title="Confirm Withdrawal" max-width="400px">
        <div class="space-y-4">
          <div class="bg-cyan-900/30 rounded-xl p-4 space-y-2.5">
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">Withdrawal Amount</span>
              <span class="text-white font-black font-mono">TZS {{ amount?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">Method</span>
              <span class="text-white font-bold">{{ selectedMethod?.name }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">Phone</span>
              <span class="text-white font-mono">+255 {{ phone }}</span>
            </div>
            <div class="border-t border-cyan-800/60 pt-2 flex justify-between text-sm">
              <span class="text-cyan-600">You will receive</span>
              <span class="text-emerald-400 font-black font-mono">TZS {{ amount?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">Balance after</span>
              <span class="text-cyan-100 font-mono">
                TZS {{ (( authStore.userBalance || 0) - (amount || 0)).toLocaleString() }}
              </span>
            </div>
          </div>
          <p class="text-[11px] text-cyan-700 text-center">
            Funds will reach your phone within 1–5 minutes
          </p>
        </div>
  
        <template #footer>
          <div class="flex gap-2">
            <button class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-cyan-800 text-cyan-400 hover:border-cyan-600 transition-colors"
                    @click="confirmModal = false">
              Cancel
            </button>
            <button class="flex-1 py-2.5 rounded-xl text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    style="background: linear-gradient(135deg, #c62828, #ff1744); color: #fff;"
                    :disabled="loading"
                    @click="processWithdraw">
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Processing...
              </span>
              <span v-else>Confirm Withdrawal</span>
            </button>
          </div>
        </template>
      </AppModal>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useAuthStore } from '../../stores/authStore'
  import AppModal from '../../components/ui/AppModal.vue'
  import AppToast from '../../components/ui/AppToast.vue'
  
  const authStore    = useAuthStore()
  const amount       = ref(null)
  const method       = ref('mpesa')
  const phone        = ref('')
  const confirmModal = ref(false)
  const loading      = ref(false)
  const minWithdraw  = 500
  
  const toast = ref({ show: false, message: '', type: 'success' })
  
  function showToast(message, type = 'success') {
    toast.value = { show: true, message, type }
    setTimeout(() => { toast.value.show = false }, 3500)
  }
  
  const methods = [
    { id: 'mpesa',  icon: '📱', name: 'M-Pesa',       desc: 'Receive via M-Pesa' },
    { id: 'airtel', icon: '📲', name: 'Airtel Money',  desc: 'Receive via Airtel Money' },
  ]
  
  const selectedMethod = computed(() => methods.find(m => m.id === method.value))
  
  // Max user anaweza kutoa — salio lake lote
  const maxWithdraw = computed(() => authStore.userBalance || 0)
  
  const quickAmounts = computed(() =>
    [500, 1000, 2000, 5000].filter(q => q <= maxWithdraw.value)
  )
  
  // ── Validation ─────────────────────────────────────────────────────────
  const amountError = computed(() => {
    if (!amount.value) return ''
    if (amount.value < minWithdraw)
      return `Minimum withdrawal is TZS ${minWithdraw.toLocaleString()}`
    if (amount.value > maxWithdraw.value)
      return `Insufficient balance. Available: TZS ${maxWithdraw.value.toLocaleString()}`
    return ''
  })
  
  const phoneError = computed(() => {
    if (phone.value && phone.value.length < 9) return 'Enter a valid 9-digit phone number'
    return ''
  })
  
  const canWithdraw = computed(() => {
    if (!amount.value) return false
    if (amount.value < minWithdraw) return false
    if (amount.value > maxWithdraw.value) return false
    if (phone.value.length < 9) return false
    return true
  })
  
  function formatShort(n) {
    return n >= 1000 ? `${n / 1000}K` : n
  }
  
  async function processWithdraw() {
    loading.value = true
    try {
      // authStore.withdraw inashughulikia balance check na API call
      const result = await authStore.withdraw(amount.value)
      confirmModal.value = false
  
      if (result.success) {
        showToast(
          `TZS ${amount.value.toLocaleString()} withdrawal successful!`,
          'success'
        )
        amount.value = null
        phone.value  = ''
      } else {
        showToast(result.message || 'Withdrawal failed. Try again.', 'error')
      }
    } catch {
      confirmModal.value = false
      showToast('Something went wrong. Try again.', 'error')
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
  .toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-8px); }
  </style>