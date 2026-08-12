<template>
  <div class="max-w-md mx-auto px-4 py-6 space-y-4">

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-black text-white">Deposit</h1>
      <p class="text-xs text-cyan-600 mt-1">Weka pesa kwenye akaunti yako</p>
    </div>

    <!-- Error message -->
    <div v-if="error" class="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {{ error }}
    </div>

    <!-- Success message -->
    <div v-if="success" class="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {{ success }}
    </div>

    <!-- Amount input -->
    <div>
      <label class="block text-[11px] font-bold text-cyan-600 mb-1.5 uppercase tracking-wide">Kiasi (TZS)</label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">TZS</span>
        <input v-model.number="amount"
               type="number" min="500" placeholder="0"
               class="w-full bg-cyan-950/80 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl pl-12 pr-4 py-3 text-sm font-mono outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors" />
      </div>
      <p class="text-[10px] text-cyan-700 mt-1">Kiwango cha chini ni TZS 500</p>
    </div>

    <!-- Quick amounts -->
    <div class="grid grid-cols-4 gap-2">
      <button v-for="q in [500, 1000, 5000, 10000]" :key="q"
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
          <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
               :class="method === m.id ? 'border-yellow-400 bg-yellow-400' : 'border-cyan-700'">
            <div v-if="method === m.id" class="w-1.5 h-1.5 rounded-full bg-cyan-950"></div>
          </div>
        </button>
      </div>
    </div>

    <!-- Phone number (Required for mobile money) -->
    <div>
      <label class="block text-[11px] font-bold text-cyan-600 mb-1.5 uppercase tracking-wide">Namba ya Simu</label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">+255</span>
        <input v-model="phone"
               type="tel" placeholder="7XX XXX XXX"
               maxlength="9"
               class="w-full bg-cyan-950/80 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl pl-14 pr-4 py-3 text-sm font-mono outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10 transition-colors" />
      </div>
      <p class="text-[10px] text-cyan-700 mt-1">Weka namba ya simu uliyojisajilia kwenye Mobile Money (M-Pesa/Airtel/Tigo)</p>
    </div>

    <!-- Deposit button -->
    <button class="btn-primary w-full py-3.5 rounded-xl text-sm font-black mt-2"
            :disabled="!canDeposit || loading"
            @click="confirmModal = true">
      {{ loading ? 'Processing...' : `Endelea na TZS ${amount ? amount.toLocaleString() : '0'}` }}
    </button>

    <!-- Confirm Modal -->
    <AppModal v-model="confirmModal" title="Thibitisha Amana" max-width="400px">
      <div class="space-y-4">
        <div class="bg-cyan-900/30 rounded-xl p-4 space-y-2.5">
          <div class="flex justify-between text-sm">
            <span class="text-cyan-600">Kiasi</span>
            <span class="text-white font-black font-mono">TZS {{ amount?.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-cyan-600">Njia</span>
            <span class="text-white font-bold">{{ selectedMethod?.name }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-cyan-600">Namba</span>
            <span class="text-white font-mono">+255 {{ phone }}</span>
          </div>
          <div class="border-t border-cyan-800/60 pt-2 flex justify-between text-sm">
            <span class="text-cyan-600">Utapokea</span>
            <span class="text-emerald-400 font-black font-mono">TZS {{ amount?.toLocaleString() }}</span>
          </div>
        </div>
        <p class="text-[11px] text-cyan-700 text-center">
          Utapokea prompt kwenye simu yako. Ingiza PIN yako kukamilisha malipo.
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
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppModal from '../../components/ui/AppModal.vue'
import { useAuthStore } from '../../stores/authStore'
import { useFinancialStore } from '../../stores/financial.store.js' 

const router = useRouter()
const authStore = useAuthStore()
const financialStore = useFinancialStore() // 2. Initialize financial store

const amount       = ref(null)
const method       = ref('mpesa')
const phone        = ref('')
const confirmModal = ref(false)

// Kazi ya Loading na Errors sasa inasimamiwa na Pinia store
const loading = computed(() => financialStore.loading)
const error   = computed(() => financialStore.error)
const success = computed(() => financialStore.success)

const methods = [
  { id: 'mpesa',  icon: '📱', name: 'M-Pesa',     desc: 'Lipa kupitia M-Pesa' },
  { id: 'airtel', icon: '📲', name: 'Airtel Money', desc: 'Lipa kupitia Airtel Money' },
  { id: 'tigo',   icon: '📱', name: 'Tigo Pesa',   desc: 'Lipa kupitia Tigo Pesa' },
]

const selectedMethod = computed(() => methods.find(m => m.id === method.value))

const canDeposit = computed(() => {
  if (!amount.value || amount.value < 500) return false
  if (!phone.value || phone.value.length < 9) return false
  return true
})

function formatShort(n) {
  if (n >= 1000) return `${n / 1000}K`
  return n
}

async function processDeposit() {
  if (!authStore.isLoggedIn) {
    financialStore.error = 'Tafadhali ingia kwanza kabla ya kuweka pesa'
    confirmModal.value = false
    router.push('/login')
    return
  }

  try {
    // Kusafisha namba ya simu iende taratibu bila +255 au 0 mbele
    let cleanPhone = phone.value.replace(/\D/g, '')
    if (cleanPhone.startsWith('255')) cleanPhone = cleanPhone.substring(3)
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1)
    
    // 3. Wito kwenda kwenye Pinia Store Action
    const txData = await financialStore.initiateDeposit({
      amount: amount.value,
      phoneNumber: cleanPhone
    })

    if (txData && txData.order_id) {
      confirmModal.value = false
      
      // Redirect kwenda kwenye ukurasa wa kusubiri muamala
      router.push({
        path: '/deposit/status',
        query: {
          order_id: txData.order_id,
          amount: amount.value,
          expires_at: txData.expires_at
        }
      })
    }
  } catch (err) {
    // Error tayari inakuwa handled na store, tuna-clear tu baada ya sekunde 5
    setTimeout(() => {
      financialStore.clearMessages()
    }, 5000)
  }
}

// Hakikisha tunafuta error yoyote iliyobaki component ikifungwa
onUnmounted(() => {
  financialStore.clearMessages()
})
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