<template>
    <div class="max-w-md mx-auto px-4 py-6">
      <div class="bg-cyan-950/50 rounded-2xl border border-cyan-800 p-6">
        
        <!-- Header -->
        <div class="text-center mb-6">
          <h1 class="text-xl font-black text-white">Deposit Status</h1>
          <p class="text-xs text-cyan-600 mt-1">Subiri uthibitisho wa malipo</p>
        </div>
  
        <!-- Pending State -->
        <div v-if="status === 'pending'" class="text-center space-y-4">
          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
          </div>
          
          <div class="bg-cyan-900/30 rounded-xl p-4">
            <p class="text-sm text-cyan-300">Amount: <span class="text-white font-bold">TZS {{ amount.toLocaleString() }}</span></p>
            <p class="text-xs text-cyan-600 mt-1">Order ID: {{ order_id }}</p>
          </div>
  
          <div class="space-y-2">
            <p class="text-sm text-yellow-400 font-bold">📱 Angalia simu yako!</p>
            <p class="text-xs text-cyan-600">Utapokea prompt ya kuingiza PIN yako.</p>
            <p class="text-xs text-cyan-600">Baada ya kuingiza PIN, salio lako litaongezeka moja kwa moja.</p>
          </div>
  
          <div class="bg-cyan-900/20 rounded-xl p-3">
            <p class="text-xs text-cyan-600">Inaisha baada ya:</p>
            <p class="text-lg font-mono font-bold text-yellow-400">{{ timeLeft }}</p>
          </div>
  
          <button @click="checkStatus" :disabled="checking" 
                  class="btn-secondary w-full py-2.5 rounded-xl text-sm font-bold">
            {{ checking ? 'Inaangalia...' : 'Angalia Status' }}
          </button>
        </div>
  
        <!-- Success State -->
        <div v-else-if="status === 'completed'" class="text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
            <svg class="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          
          <h2 class="text-xl font-black text-emerald-400">Deposit Successful!</h2>
          
          <div class="bg-cyan-900/30 rounded-xl p-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">Amount Added</span>
              <span class="text-white font-bold">TZS {{ amount.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-cyan-600">New Balance</span>
              <span class="text-yellow-400 font-bold">TZS {{ newBalance.toLocaleString() }}</span>
            </div>
          </div>
  
          <div class="flex gap-3">
            <button @click="goToDashboard" class="btn-primary flex-1 py-2.5 rounded-xl text-sm font-bold">
              Go to Dashboard
            </button>
            <button @click="newDeposit" class="btn-secondary flex-1 py-2.5 rounded-xl text-sm font-bold">
              New Deposit
            </button>
          </div>
        </div>
  
        <!-- Expired State -->
        <div v-else-if="status === 'expired'" class="text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/>
            </svg>
          </div>
          
          <h2 class="text-xl font-black text-red-400">Payment Expired</h2>
          <p class="text-sm text-cyan-600">The payment request has expired. Please initiate a new deposit.</p>
  
          <button @click="newDeposit" class="btn-primary w-full py-2.5 rounded-xl text-sm font-bold">
            New Deposit
          </button>
        </div>
  
        <!-- Error State -->
        <div v-else-if="status === 'error'" class="text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/>
            </svg>
          </div>
          
          <h2 class="text-xl font-black text-red-400">Error</h2>
          <p class="text-sm text-cyan-600">{{ errorMessage }}</p>
  
          <button @click="newDeposit" class="btn-primary w-full py-2.5 rounded-xl text-sm font-bold">
            Try Again
          </button>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '../../../stores/authStore'
  import api from '../../../services/api'
  
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  
  const order_id = ref(route.query.order_id || '')
  const amount = ref(parseFloat(route.query.amount) || 0)
  const expires_at = ref(route.query.expires_at)
  const status = ref('pending')
  const newBalance = ref(0)
  const checking = ref(false)
  const errorMessage = ref('')
  
  let interval = null
  let timerInterval = null
  let timeLeftSeconds = 0
  
  const timeLeft = ref('00:00')
  
  function updateTimeLeft() {
    if (!expires_at.value) {
      timeLeft.value = '05:00'
      return
    }
    
    const now = new Date()
    const expiry = new Date(expires_at.value)
    const diff = Math.max(0, Math.floor((expiry - now) / 1000))
    
    const minutes = Math.floor(diff / 60)
    const seconds = diff % 60
    
    timeLeft.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    
    if (diff <= 0) {
      status.value = 'expired'
      clearInterval(timerInterval)
      clearInterval(interval)
    }
  }
  
  async function checkStatus() {
    checking.value = true
    
    try {
      const response = await api.get(`/auth/payment/status/${order_id.value}`)
      const result = response.data
      
      if (result.status === 'completed') {
        status.value = 'completed'
        newBalance.value = result.data?.new_balance || authStore.user?.balance || 0
        clearInterval(interval)
        clearInterval(timerInterval)
        
        // Refresh user balance in store
        await authStore.fetchUserBalance()
        
      } else if (result.status === 'expired') {
        status.value = 'expired'
        clearInterval(interval)
        clearInterval(timerInterval)
      }
      
    } catch (err) {
      console.error('Status check error:', err)
      // Don't change status on error, just log
    } finally {
      checking.value = false
    }
  }
  
  function goToDashboard() {
    router.push('/')
  }
  
  function newDeposit() {
    router.push('/deposite')
  }
  
  onMounted(() => {
    if (!order_id.value) {
      status.value = 'error'
      errorMessage.value = 'No payment reference found'
      return
    }
    
    // Start auto-check every 3 seconds
    interval = setInterval(checkStatus, 3000)
    
    // Start timer
    timerInterval = setInterval(updateTimeLeft, 1000)
    updateTimeLeft()
    
    // Initial check
    checkStatus()
  })
  
  onUnmounted(() => {
    if (interval) clearInterval(interval)
    if (timerInterval) clearInterval(timerInterval)
  })
  </script>
  
  <style scoped>
  .btn-primary {
    background: linear-gradient(to right, #eab308, #facc15);
    color: #083344;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .btn-primary:hover:not(:disabled) { opacity: 0.9; }
  
  .btn-secondary {
    background: transparent;
    color: #67e8f9;
    border: 1px solid rgba(8,145,178,0.4);
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: #67e8f9; }
  </style>