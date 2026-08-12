<template>
    <div class="max-w-5xl mx-auto px-4 py-6 space-y-6">
  
      <!-- Welcome -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-cyan-100">Welcome, {{ user?.firstName }}! 👋</h1>
          <p class="text-sm text-cyan-600 mt-1">Manage your account and bets</p>
        </div>
        <RouterLink to="/bets" class="px-4 py-2 rounded-xl text-sm font-bold border border-cyan-700 text-cyan-300 hover:border-cyan-500 transition-all">
          My Bets →
        </RouterLink>
      </div>
  
      <!-- Stats cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div v-for="stat in stats" :key="stat.label"
             class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-4">
          <p class="text-xs text-cyan-600 mb-2">{{ stat.label }}</p>
          <p class="text-xl font-black font-mono" :class="stat.color">{{ stat.value }}</p>
          <p class="text-[10px] text-cyan-700 mt-1">{{ stat.sub }}</p>
        </div>
      </div>
  
      <!-- Balance card -->
      <div class="bg-gradient-to-br from-cyan-900/40 to-cyan-950 border border-cyan-700/50 rounded-2xl p-6">
        <div class="flex items-start justify-between mb-6">
          <div>
            <p class="text-xs text-cyan-600 font-semibold uppercase tracking-wide mb-1">Available Balance</p>
            <p class="text-4xl font-black font-mono text-yellow-400">TZS {{ formatMoney(user?.balance || 0) }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-yellow-400/10">💰</div>
        </div>
        <div class="flex gap-3">
          <button class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 hover:opacity-90 transition-opacity">
            + Deposit
          </button>
          <button class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-cyan-700 text-cyan-300 hover:border-cyan-500 transition-all">
            Withdraw
          </button>
        </div>
      </div>
  
      <!-- Recent bets -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-black text-cyan-100">Recent Bets</h2>
          <RouterLink to="/bets" class="text-xs font-bold text-yellow-400 hover:text-yellow-300">View all →</RouterLink>
        </div>
        <div class="space-y-3">
          <SettledBetCard v-for="bet in recentBets" :key="bet.id" :bet="bet" @click="goToBet" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { useAuthStore } from '../../stores/authStore'
  import SettledBetCard from '../../components/betting/SettledBetCard.vue'
  
  const authStore = useAuthStore()
  const router    = useRouter()
  const user      = computed(() => authStore.user)
  
  function formatMoney(n) { return new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 2 }).format(n || 0) }
  function goToBet(id)    { router.push(`/bets/${id}`) }
  
  const stats = [
    { label: 'Total Bets',   value: '47',          color: 'text-cyan-200',    sub: 'All time' },
    { label: 'Won',          value: '28',           color: 'text-emerald-400', sub: '59.5% win rate' },
    { label: 'Total Won',    value: 'TZS 12,450',   color: 'text-yellow-400',  sub: 'Lifetime earnings' },
    { label: 'Active Bets',  value: '2',            color: 'text-cyan-300',    sub: 'Pending results' },
  ]
  
  const recentBets = [
    { id: 'BB003', stake: 300, payout: 690,  result: 'won',  createdAt: new Date().toISOString(), selections: [{ matchName: 'Arsenal vs Man City' }, { matchName: 'Barcelona vs Real Madrid' }] },
    { id: 'BB004', stake: 150, payout: 0,    result: 'lost', createdAt: new Date().toISOString(), selections: [{ matchName: 'Chelsea vs Liverpool' }] },
    { id: 'BB005', stake: 500, payout: 1250, result: 'won',  createdAt: new Date().toISOString(), selections: [{ matchName: 'Bayern vs PSG' }] },
  ]
  </script>