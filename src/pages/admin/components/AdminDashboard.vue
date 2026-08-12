<!-- views/admin/AdminDashboard.vue -->
<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-cyan-400 text-sm mb-1">Total Bets</p>
            <p class="text-3xl font-bold text-white">{{ stats.totalBets }}</p>
            <p class="text-xs text-cyan-500 mt-2">+{{ stats.betsGrowth }}% from last month</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <span class="text-2xl">🎲</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-cyan-400 text-sm mb-1">Total Users</p>
            <p class="text-3xl font-bold text-white">{{ stats.totalUsers }}</p>
            <p class="text-xs text-cyan-500 mt-2">+{{ stats.usersGrowth }}% from last month</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <span class="text-2xl">👥</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-cyan-400 text-sm mb-1">Total Volume</p>
            <p class="text-3xl font-bold text-white">TZS {{ formatMoney(stats.totalVolume) }}</p>
            <p class="text-xs text-cyan-500 mt-2">Total stake amount</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <span class="text-2xl">💰</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-cyan-400 text-sm mb-1">Total Payout</p>
            <p class="text-3xl font-bold text-white">TZS {{ formatMoney(stats.totalPayout) }}</p>
            <p class="text-xs text-cyan-500 mt-2">Total winnings paid</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <span class="text-2xl">🏆</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Bets -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
        <h3 class="text-lg font-bold text-white mb-4">Recent Bets</h3>
        <div class="space-y-3">
          <div v-for="bet in recentBets" :key="bet.id" 
               class="flex items-center justify-between p-3 rounded-xl bg-slate-900/50">
            <div>
              <p class="text-sm font-medium text-white">#{{ bet.id }}</p>
              <p class="text-xs text-cyan-500">{{ formatDate(bet.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-yellow-400">TZS {{ formatMoney(bet.stake) }}</p>
              <p class="text-xs" :class="bet.result === 'WON' ? 'text-green-400' : 'text-cyan-500'">
                {{ bet.result || 'PENDING' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Users -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
        <h3 class="text-lg font-bold text-white mb-4">Top Bettors</h3>
        <div class="space-y-3">
          <div v-for="user in topUsers" :key="user.id" 
               class="flex items-center justify-between p-3 rounded-xl bg-slate-900/50">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <span class="text-sm">👤</span>
              </div>
              <div>
                <p class="text-sm font-medium text-white">{{ user.phone_number }}</p>
                <p class="text-xs text-cyan-500">{{ user.totalBets }} bets</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-yellow-400">TZS {{ formatMoney(user.totalStake) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Bets for Settlement -->
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white">Pending Bets for Settlement</h3>
        <router-link to="/admin/bets" class="text-sm text-yellow-400 hover:text-yellow-300">
          View All →
        </router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-cyan-800/50">
              <th class="text-left py-3 text-cyan-400 text-xs font-medium">Bet ID</th>
              <th class="text-left py-3 text-cyan-400 text-xs font-medium">User</th>
              <th class="text-left py-3 text-cyan-400 text-xs font-medium">Stake</th>
              <th class="text-left py-3 text-cyan-400 text-xs font-medium">Potential Win</th>
              <th class="text-left py-3 text-cyan-400 text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bet in pendingBets" :key="bet.id" class="border-b border-cyan-800/30">
              <td class="py-3 text-white text-sm">#{{ bet.id }}</td>
              <td class="py-3 text-cyan-300 text-sm">{{ bet.user?.phone_number }}</td>
              <td class="py-3 text-yellow-400 text-sm">TZS {{ formatMoney(bet.stake) }}</td>
              <td class="py-3 text-emerald-400 text-sm">TZS {{ formatMoney(bet.potentialReturn) }}</td>
              <td class="py-3">
                <div class="flex gap-2">
                  <button @click="settleBet(bet.id, 'WON')" class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30">
                    Won
                  </button>
                  <button @click="settleBet(bet.id, 'LOST')" class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30">
                    Lost
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBetStore } from '@/stores/betStore'
import { useUserStore } from '@/stores/userStore'

const betStore = useBetStore()
const userStore = useUserStore()

const stats = ref({
  totalBets: 0,
  totalUsers: 0,
  totalVolume: 0,
  totalPayout: 0,
  betsGrowth: 12,
  usersGrowth: 8
})

const recentBets = ref([])
const topUsers = ref([])
const pendingBets = ref([])

function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ').format(n || 0)
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString()
}

async function settleBet(betId, result) {
  try {
    await betStore.settleBet(betId, result)
    await loadDashboardData()
  } catch (error) {
    console.error('Failed to settle bet:', error)
  }
}

async function loadDashboardData() {
  // Load stats
  const statsResult = await betStore.getAdminStats()
  if (statsResult.success) {
    stats.value = { ...stats.value, ...statsResult.data }
  }
  
  // Load recent bets
  const betsResult = await betStore.loadAdminBets({ limit: 10 })
  if (betsResult.success) {
    recentBets.value = betsResult.data.bets
    pendingBets.value = betsResult.data.bets.filter(b => b.result === 'PENDING')
  }
  
  // Load top users
  const usersResult = await userStore.getTopUsers()
  if (usersResult.success) {
    topUsers.value = usersResult.data
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>