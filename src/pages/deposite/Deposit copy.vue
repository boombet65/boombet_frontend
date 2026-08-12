<!-- Deposite.vue  -->
<template>
    <div class="max-w-md mx-auto px-4 py-6 space-y-4">
  
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl font-black text-white">Deposit</h1>
        <p class="text-xs text-cyan-600 mt-1">Weka pesa kwenye akaunti yako</p>
      </div>
  
      <!-- Amount input -->
      <div>
        <label class="block text-[11px] font-bold text-cyan-600 mb-1.5 uppercase tracking-wide">Kiasi (TZS)</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">TZS</span>
          <input v-model.number="amount"
                 type="number" min="1000" placeholder="0"
                 class="w-full bg-cyan-950/80 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl pl-12 pr-4 py-3 text-sm font-mono outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors" />
        </div>
      </div>
  
      <!-- Quick amounts -->
      <div class="grid grid-cols-4 gap-2">
        <button v-for="q in [1000, 5000, 10000, 50000]" :key="q"
                class="py-2 text-xs font-bold rounded-lg border transition-colors"
                :class="amount === q
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-cyan-800 text-cyan-600'"
                @click="amount = q">
          {{ formatShort(q) }}
        </button>
      </div>
  
      <!-- Payment method -->
      <div>
        <label class="block text-[11px] font-bold text-cyan-600 mb-2 uppercase tracking-wide">Njia ya Malipo</label>
        <div class="space-y-2">
          <button v-for="m in methods" :key="m.id"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                  :class="method === m.id
                    ? 'border-yellow-400 bg-yellow-400/08 '
                    : 'border-cyan-800/60 bg-cyan-900/20'"
                  @click="method = m.id">
            <span class="text-xl">{{ m.icon }}</span>
            <div class="text-left flex-1">
              <p class="text-sm font-bold" :class="method === m.id ? 'text-yellow-400' : 'text-cyan-100'">{{ m.name }}</p>
              <p class="text-[11px] text-cyan-600">{{ m.desc }}</p>
            </div>
            <!-- selected indicator -->
            <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                 :class="method === m.id ? 'border-yellow-400 bg-yellow-400' : 'border-cyan-700'">
              <div v-if="method === m.id" class="w-1.5 h-1.5 rounded-full bg-cyan-950"></div>
            </div>
          </button>
        </div>
      </div>
  
      <!-- Phone number (M-Pesa/Airtel) -->
      <div v-if="method !== 'card'">
        <label class="block text-[11px] font-bold text-cyan-600 mb-1.5 uppercase tracking-wide">Namba ya Simu</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">+255</span>
          <input v-model="phone"
                 type="tel" placeholder="7XX XXX XXX"
                 maxlength="9"
                 class="w-full bg-cyan-950/80 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl pl-14 pr-4 py-3 text-sm font-mono outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors" />
        </div>
      </div>
  
      <!-- Deposit button -->
      <button class="btn-primary w-full py-3.5 rounded-xl text-sm font-black mt-2"
              :disabled="!canDeposit"
              @click="confirmModal = true">
        Endelea na TZS {{ amount ? amount.toLocaleString() : '0' }}
      </button>
  
      <!-- Confirm Modal -->
      <AppModal v-model="confirmModal" title="Thibitisha Amana" max-width="400px">
        <div class="space-y-4">
          <!-- Summary -->
          <div class="bg-cyan-900/30 rounded-xl p-4 space-y-2.5">
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">Kiasi</span>
              <span class="text-white font-black font-mono">TZS {{ amount?.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">Njia</span>
              <span class="text-white font-bold">{{ selectedMethod?.name }}</span>
            </div>
            <div v-if="method !== 'card'" class="flex justify-between text-sm">
              <span class="text-cyan-600">Namba</span>
              <span class="text-white font-mono">+255 {{ phone }}</span>
            </div>
            <div class="border-t border-cyan-800/60 pt-2 flex justify-between text-sm">
              <span class="text-cyan-600">Utapokea</span>
              <span class="text-emerald-400 font-black font-mono">TZS {{ amount?.toLocaleString() }}</span>
            </div>
          </div>
  
          <p class="text-[11px] text-cyan-700 text-center">
            Utapokea {{ method !== 'card' ? 'prompt kwenye simu yako' : 'barua pepe ya uthibitisho' }}
          </p>
        </div>
  
        <template #footer>
          <div class="flex gap-2">
            <button class="btn-secondary flex-1 py-2.5 rounded-xl text-sm font-bold"
                    @click="confirmModal = false">
              Rudi
            </button>
            <button class="btn-primary flex-1 py-2.5 rounded-xl text-sm font-black"
                    :disabled="loading"
                    @click="processDeposit">
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Inashughulikia...
              </span>
              <span v-else>Thibitisha</span>
            </button>
          </div>
        </template>
      </AppModal>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import AppModal from '../../components/ui/AppModal.vue'
  
  const amount       = ref(null)
  const method       = ref('mpesa')
  const phone        = ref('')
  const confirmModal = ref(false)
  const loading      = ref(false)
  
  const methods = [
    { id: 'mpesa',  icon: '📱', name: 'M-Pesa',     desc: 'Lipa kupitia M-Pesa' },
    { id: 'airtel', icon: '📲', name: 'Airtel Money', desc: 'Lipa kupitia Airtel Money' },
    { id: 'card',   icon: '💳', name: 'Kadi ya Benki', desc: 'Visa / Mastercard' },
  ]
  
  const selectedMethod = computed(() => methods.find(m => m.id === method.value))
  
  const canDeposit = computed(() => {
    if (!amount.value || amount.value < 1000) return false
    if (method.value !== 'card' && phone.value.length < 9) return false
    return true
  })
  
  function formatShort(n) {
    if (n >= 1000) return `${n / 1000}K`
    return n
  }
  
  async function processDeposit() {
    loading.value = true
    // TODO: connect to payment API
    await new Promise(r => setTimeout(r, 2000))
    loading.value      = false
    confirmModal.value = false
    // TODO: show success toast, redirect
    alert(`Amana ya TZS ${amount.value?.toLocaleString()} imefanikiwa!`)
  }
  </script>
  
  <style scoped>
  .btn-primary {
    background: linear-gradient(to right, #eab308, #facc15);
    color: #083344;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
    font-family: var(--font-body);
  }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-primary:hover:not(:disabled) { opacity: 0.9; }
  
  .btn-secondary {
    background: transparent;
    color: #67e8f9;
    border: 1px solid rgba(8,145,178,0.4);
    cursor: pointer;
    transition: all 0.2s;
    font-family: var(--font-body);
  }
  .btn-secondary:hover { border-color: #67e8f9; }
  </style>