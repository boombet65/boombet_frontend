<!-- BetsPage.vue -->
<template>
    <div class="max-w-3xl mx-auto px-4 py-6">
  
      <h1 class="text-2xl font-black text-cyan-100 mb-6">My Bets</h1>
  
      <AppTabs :tabs="tabsWithCounts" v-model="activeTab" />
  
      <div class="mt-4">
  
        <!-- Open Bets -->
        <div v-if="activeTab === 'open'">
          <div v-if="loading" class="space-y-3">
            <BetCardSkeleton v-for="n in 3" :key="n" />
          </div>
          <EmptyState v-else-if="!hasOpenBets" 
                     icon="📋" 
                     title="No open bets" 
                     description="Place a bet to see it here" 
                     action-to="/sports" 
                     action-label="Bet Now" />
          <div v-else class="space-y-3">
            <OpenBetCard v-for="bet in openBets" :key="bet.id" :bet="formatOpenBet(bet)" />
          </div>
        </div>
  
        <!-- Settled Bets -->
        <div v-else-if="activeTab === 'settled'">
          <!-- Filter -->
          <div class="flex gap-2 mb-4 flex-wrap">
            <button v-for="f in filters" :key="f.value"
                    class="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                    :class="settledFilter === f.value
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                      : 'border-cyan-800 text-cyan-600 hover:border-cyan-600'"
                    @click="updateSettledFilter(f.value)">
              {{ f.label }}
            </button>
          </div>
          
          <div v-if="loading" class="space-y-3">
            <BetCardSkeleton v-for="n in 4" :key="n" />
          </div>
          <EmptyState v-else-if="filteredSettledBets.length === 0" 
                     icon="🏁" 
                     title="No settled bets" 
                     description="Finished bets appear here" />
          <div v-else class="space-y-3">
            <SettledBetCard v-for="bet in filteredSettledBets" 
                            :key="bet.id" 
                            :bet="formatSettledBet(bet)" 
                            @click="goToDetail" />
          </div>
        </div>
  
        <!-- Jackpot Bets -->
        <div v-else-if="activeTab === 'jackpot'">
          <div v-if="loading" class="space-y-3">
            <BetCardSkeleton v-for="n in 2" :key="n" />
          </div>
          <EmptyState v-else-if="!hasJackpotBets" 
                     icon="💰" 
                     title="No jackpot bets" 
                     description="Try your luck on the jackpot" 
                     action-to="/jackpot" 
                     action-label="Play Jackpot" />
          <div v-else class="space-y-3">
            <JackpotBetCard v-for="bet in jackpotBets" :key="bet.id" :bet="formatJackpotBet(bet)" />
          </div>
        </div>
  
        <!-- Virtual Bets -->
        <div v-else-if="activeTab === 'virtuals'">
          <div v-if="loading" class="space-y-3">
            <BetCardSkeleton v-for="n in 2" :key="n" />
          </div>
          <EmptyState v-else-if="!hasVirtualBets" 
                     icon="🤖" 
                     title="No virtual bets" 
                     description="Bet on virtual sports 24/7" 
                     action-to="/virtuals" 
                     action-label="Play Virtuals" />
          <div v-else class="space-y-3">
            <VirtualBetCard v-for="bet in virtualBets" :key="bet.id" :bet="formatVirtualBet(bet)" />
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import AppTabs from '../../components/ui/AppTabs.vue'
  import BetCardSkeleton from '../../components/betting/BetCardSkeleton.vue'
  import OpenBetCard from '../../components/betting/OpenBetCard.vue'
  import SettledBetCard from '../../components/betting/SettledBetCard.vue'
  import JackpotBetCard from '../../components/betting/JackpotBetCard.vue'
  import VirtualBetCard from '../../components/betting/VirtualBetCard.vue'
  import EmptyState from '../../components/shared/EmptyState.vue'
  import { useBetStore } from '../../stores/bet/betStore.js'
  import { useAuthStore } from '../../stores/auth/authStore.js'
  import { useBetFilter } from '../../composables/useBetFilter'
  
  const router = useRouter()
  const betStore = useBetStore()
  const authStore = useAuthStore()
  
  // State
  const activeTab = ref('open')
  const loading = ref(true)
  
  // Get all bets from store
  const allBets = computed(() => betStore.userBets)
  
  // Use the filter composable
  const {
    openBets,
    filteredSettledBets,
    jackpotBets,
    virtualBets,
    settledFilter,
    hasOpenBets,
    hasSettledBets,
    hasJackpotBets,
    hasVirtualBets,
    updateSettledFilter
  } = useBetFilter(allBets)
  
  // Filters for settled bets
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'won', label: '✅ Won' },
    { value: 'lost', label: '❌ Lost' },
  ]
  
  // Tabs with dynamic counts
  const tabsWithCounts = computed(() => [
    { key: 'open', label: 'Open', icon: '⏳', count: openBets.value.length },
    { key: 'settled', label: 'Settled', icon: '🏁', count: filteredSettledBets.value.length },
    { key: 'jackpot', label: 'Jackpot', icon: '💰', count: jackpotBets.value.length },
    { key: 'virtuals', label: 'Virtuals', icon: '🤖', count: virtualBets.value.length },
  ])
  
  // Format bet for OpenBetCard component
 function formatOpenBet(bet) {
  return {
    id: bet.id || bet.bookingCode,
    type: bet.selections?.length > 1 ? 'accumulator' : 'single',
    stake: bet.stake,
    netPayout: bet.netPayout ,
    selections: bet.selections?.map(sel => ({
      matchName: sel.match?.name || sel.matchName,
      market: sel.match?.market || sel.market || '1X2',
      pick: sel.selection || sel.pick,
      odds: sel.odds
    }))
  }
}
  
  // Format bet for SettledBetCard component
  function formatSettledBet(bet) {
    return {
      id: bet.id || bet.bookingCode,
      stake: bet.stake,
      potentialWin: bet.result === 'WON' ? bet.potentialReturn : 0,
      tax: bet.tax,
      netPayout: bet.netPayout,
      result: bet.result?.toLowerCase(),
      createdAt: bet.settledAt || bet.createdAt,
      selections: bet.selections?.map(sel => ({
        matchName: sel.match?.name || sel.matchName
      }))
    }
  }
  
  // Format bet for JackpotBetCard component
  function formatJackpotBet(bet) {
    return {
      id: bet.id,
      jackpotName: bet.jackpotName || 'Mega Jackpot',
      stake: bet.stake,
      prizePool: bet.prizePool || bet.potentialReturn,
      result: bet.result?.toLowerCase() || 'pending',
      createdAt: bet.createdAt
    }
  }
  
  // Format bet for VirtualBetCard component
  function formatVirtualBet(bet) {
    return {
      id: bet.id,
      sport: bet.sport || 'Virtual Football',
      matchName: bet.matchName || bet.selections?.[0]?.matchName,
      stake: bet.stake,
      odds: bet.totalOdds,
      payout: bet.result === 'WON' ? bet.potentialReturn : 0,
      result: bet.result?.toLowerCase(),
      createdAt: bet.createdAt
    }
  }
  
  // Load bets from API
  async function loadBets() {
    if (!authStore.isLoggedIn) {
      loading.value = false
      return
    }
    
    loading.value = true
    try {
      await betStore.loadUserBets({ limit: 100 })
    } catch (error) {
      console.error('Failed to load bets:', error)
    } finally {
      loading.value = false
    }
  }
  
  // Navigate to bet detail
  function goToDetail(id) {
    router.push(`/bets/${id}`)
  }
  
  // Load bets on mount
  onMounted(() => {
    loadBets()
  })
  </script>