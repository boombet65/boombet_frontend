<template>
    <div class="max-w-md mx-auto px-4 py-6 space-y-4 relative">
  
      <!-- Toast -->
      <Transition name="toast">
        <AppToast v-if="toast.show" :toast="toast" />
      </Transition>
  
      <!-- Header -->
      <div class="mb-2">
        <h1 class="text-xl font-black text-white">Deposit</h1>
        <p class="text-xs text-cyan-600 mt-1">Add funds to your account</p>
      </div>
  
      <!-- Current balance -->
      <div class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p class="text-[11px] text-cyan-600 uppercase tracking-wide font-bold">Current Balance</p>
          <p class="text-xl font-black text-white font-mono mt-1">{{ authStore.formattedBalance }}</p>
        </div>
        <span class="text-3xl">💰</span>
      </div>
  
      <!-- Amount input -->
      <div>
        <label class="block text-[11px] font-bold text-cyan-600 mb-1.5 uppercase tracking-wide">
          Amount (TZS)
          <span class="text-cyan-700 normal-case">· Min TZS {{ minDeposit.toLocaleString() }}</span>
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">TZS</span>
          <input v-model.number="amount"
                 type="number" :min="minDeposit" placeholder="0"
                 class="w-full bg-cyan-950/80 border text-cyan-100 placeholder-cyan-700 rounded-xl pl-12 pr-4 py-3 text-sm font-mono outline-none transition-colors"
                 :class="amountError
                   ? 'border-red-500 focus:border-red-500'
                   : 'border-cyan-800 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10'" />
        </div>
        <p v-if="amountError" class="text-[11px] text-red-400 mt-1">{{ amountError }}</p>
      </div>
  
      <!-- Quick amounts -->
      <div class="grid grid-cols-4 gap-2">
        <button v-for="q in [1000, 5000, 10000, 50000]" :key="q"
                class="py-2 text-xs font-bold rounded-lg border transition-colors"
                :class="amount === q
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-cyan-800 text-cyan-600 hover:border-cyan-600'"
                @click="amount = q">
          {{ formatShort(q) }}
        </button>
      </div>
  
      <!-- Payment method -->
      <div>
        <label class="block text-[11px] font-bold text-cyan-600 mb-2 uppercase tracking-wide">Payment Method</label>
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
      <div v-if="method !== 'card'">
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
  
      <!-- Deposit button -->
      <button class="w-full py-3.5 rounded-xl text-sm font-black transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style="background: linear-gradient(to right, #eab308, #facc15); color: #083344;"
              :disabled="!canDeposit"
              @click="confirmModal = true">
        Continue with TZS {{ amount ? amount.toLocaleString() : '0' }}
      </button>
  
      <!-- Confirm Modal -->
      <AppModal v-model="confirmModal" title="Confirm Deposit" max-width="400px">
        <div class="space-y-4">
          <div class="bg-cyan-900/30 rounded-xl p-4 space-y-2.5">
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">Amount</span>
              <span class="text-white font-black font-mono">TZS {{ amount?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">Method</span>
              <span class="text-white font-bold">{{ selectedMethod?.name }}</span>
            </div>
            <div v-if="method !== 'card'" class="flex justify-between text-sm">
              <span class="text-cyan-600">Phone</span>
              <span class="text-white font-mono">+255 {{ phone }}</span>
            </div>
            <div class="border-t border-cyan-800/60 pt-2 flex justify-between text-sm">
              <span class="text-cyan-600">You will receive</span>
              <span class="text-emerald-400 font-black font-mono">TZS {{ amount?.toLocaleString() }}</span>
            </div>
          </div>
          <p class="text-[11px] text-cyan-700 text-center">
            {{ method !== 'card'
              ? 'You will receive a payment prompt on your phone'
              : 'You will receive a confirmation email' }}
          </p>
        </div>
  
        <template #footer>
          <div class="flex gap-2">
            <button class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-cyan-800 text-cyan-400 hover:border-cyan-600 transition-colors"
                    @click="confirmModal = false">
              Cancel
            </button>
            <button class="flex-1 py-2.5 rounded-xl text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    style="background: linear-gradient(to right, #eab308, #facc15); color: #083344;"
                    :disabled="loading"
                    @click="processDeposit">
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Processing...
              </span>
              <span v-else>Confirm Deposit</span>
            </button>
          </div>
        </template>
      </AppModal>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useAuthStore } from '../../stores/authStore'
  import AppModal  from '../../components/ui/AppModal.vue'
  import AppToast  from '../../components/ui/AppToast.vue'
  
  const authStore    = useAuthStore()
  const amount       = ref(null)
  const method       = ref('mpesa')
  const phone        = ref('')
  const confirmModal = ref(false)
  const loading      = ref(false)
  const minDeposit   = 1000
  
  const toast = ref({ show: false, message: '', type: 'success' })
  
  function showToast(message, type = 'success') {
    toast.value = { show: true, message, type }
    setTimeout(() => { toast.value.show = false }, 3500)
  }
  
  const methods = [
    { id: 'mpesa',  icon: '📱', name: 'M-Pesa',      desc: 'Pay via M-Pesa' },
    { id: 'airtel', icon: '📲', name: 'Airtel Money', desc: 'Pay via Airtel Money' },
    { id: 'card',   icon: '💳', name: 'Bank Card',    desc: 'Visa / Mastercard' },
  ]
  
  const selectedMethod = computed(() => methods.find(m => m.id === method.value))
  
  const amountError = computed(() => {
    if (!amount.value) return ''
    if (amount.value < minDeposit) return `Minimum deposit is TZS ${minDeposit.toLocaleString()}`
    return ''
  })
  
  const phoneError = computed(() => {
    if (method.value === 'card') return ''
    if (phone.value && phone.value.length < 9) return 'Enter a valid 9-digit phone number'
    return ''
  })
  
  const canDeposit = computed(() => {
    if (!amount.value || amount.value < minDeposit) return false
    if (method.value !== 'card' && phone.value.length < 9) return false
    return true
  })
  
  function formatShort(n) {
    return n >= 1000 ? `${n / 1000}K` : n
  }
  
  async function processDeposit() {
    loading.value = true
    try {
      const result = await authStore.initiateDeposit(amount.value)
      confirmModal.value = false
      if (result.success) {
        // initiateDeposit inafungua paymentUrl — user anaenda payment page
        // Kama haikuelekeza bado, onyesha success
        showToast(`Deposit of TZS ${amount.value.toLocaleString()} initiated!`, 'success')
        amount.value = null
        phone.value  = ''
      } else {
        showToast(result.message || 'Deposit failed. Try again.', 'error')
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