<!-- BetsPage.vue - Only showing the changed parts -->
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

      <!-- Rest of the template stays the same -->
      <!-- Jackpot Bets -->
      <div v-else-if="activeTab === 'jackpot'">
        <!-- ... -->
      </div>

      <!-- Virtual Bets -->
      <div v-else-if="activeTab === 'virtuals'">
        <!-- ... -->
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

const allBets = computed(() => betStore.betHistory || [])

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

/**
 * ============ FIX: Format Open Bet for display ============
 * Open bets have status: 'PENDING' and result: 'OPEN'
 */
function formatOpenBet(bet) {
  console.log('📊 Formatting open bet:', bet)
  
  return {
    id: bet.id,
    bet_ticket: bet.ticket_code,
    type: bet.selections?.length > 1 ? 'accumulator' : 'single',
    stake: bet.stake,
    netPayout: bet.payout || bet.netPayout,
    totalOdds: bet.total_odds || bet.totalOdds,
    // ============ Show status with proper icon ============
    status: 'PENDING', // Always PENDING for open bets
    statusLabel: 'In Progress',
    statusIcon: '⏳',
    selections: bet.selections?.map(sel => ({
      matchName: sel.match?.home_team && sel.match?.away_team 
        ? `${sel.match.home_team} vs ${sel.match.away_team}`
        : sel.matchName || sel.match?.name,
      market: sel.market_key || sel.market || '1X2',
      pick: sel.outcome_key || sel.pick,
      odds: sel.odds_at_placement || sel.odds,
      matchStatus: sel.match?.status || 'UPCOMING',
      currentScore: sel.match?.current_score,
      elapsedMinute: sel.match?.elapsed_minute
    }))
  }
}

/**
 * ============ FIX: Format Settled Bet for display ============
 * Settled bets have status: 'SETTLED' and result: 'WON', 'LOST', or 'CANCELLED'
 */
function formatSettledBet(bet) {
  console.log('🏁 Formatting settled bet:', bet)
  
  const isWon = bet.result === 'WON'
  const isLost = bet.result === 'LOST'
  
  return {
    id: bet.id,
    bet_ticket: bet.ticket_code,
    stake: bet.stake,
    potentialWin: isWon ? bet.payout : 0,
    tax: bet.tax || 0,
    netPayout: isWon ? bet.payout : 0,
    // ============ Use result for display ============
    result: bet.result?.toLowerCase(), // 'won', 'lost', 'cancelled'
    resultLabel: isWon ? 'Won' : isLost ? 'Lost' : 'Cancelled',
    resultIcon: isWon ? '✅' : isLost ? '❌' : '🚫',
    resultColor: isWon ? 'text-green-400' : isLost ? 'text-red-400' : 'text-gray-400',
    createdAt: bet.updated_at || bet.settledAt || bet.createdAt,
    selections: bet.selections?.map(sel => ({
      matchName: sel.match?.home_team && sel.match?.away_team 
        ? `${sel.match.home_team} vs ${sel.match.away_team}`
        : sel.matchName || sel.match?.name,
      result: sel.status 
    }))
  }
}

// Format bet for JackpotBetCard component
function formatJackpotBet(bet) {
  return {
    id: bet.id,
    jackpotName: bet.jackpotName || 'Mega Jackpot',
    stake: bet.stake,
    prizePool: bet.prizePool || bet.payout,
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
    odds: bet.total_odds || bet.totalOdds,
    payout: bet.result === 'WON' ? bet.payout : 0,
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
    const result = await betStore.fetchBetHistory({ limit: 100 })
    console.log('📨 Bets loaded:', result)
    
    // ============ DEBUG: Log bet statuses ============
    if (result.success) {
      result.data.forEach(bet => {
        console.log(`Bet ${bet.ticket_code}: status=${bet.status}, result=${bet.result}`)
      })
    }
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