<!-- betDetailPage.vue -->
<template>
  <div class="max-w-2xl mx-auto px-4 py-6">

    <button class="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-300 transition-colors mb-6"
            @click="router.back()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to My Bets
    </button>

    <div v-if="loading"><LoadingSpinner /></div>

    <div v-else-if="bet" class="space-y-4">

      <!-- Header card -->
      <div class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-5">
        <div class="flex items-start justify-between mb-5">
          <div>
            <p class="text-xs text-cyan-600 font-mono mb-1">Bet ID</p>
            <p class="text-base font-black text-yellow-400 font-mono">#{{ bet.id }}</p>
          </div>
          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border"
                :class="bet.result === 'won'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : bet.result === 'lost'
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'">
            {{ bet.result === 'won' ? '✅ WON' : bet.result === 'lost' ? '❌ LOST' : '⏳ PENDING' }}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-cyan-800/40">
          <div>
            <p class="text-[11px] text-cyan-600 mb-1">Stake</p>
            <p class="text-sm font-bold text-cyan-100 font-mono">TZS {{ formatMoney(bet.stake) }}</p>
          </div>
          
          <div>
            <p class="text-[11px] text-cyan-600 mb-1">Total Odds</p>
            <p class="text-sm font-bold text-yellow-400 font-mono">{{ bet.totalOdds || '—' }}</p>
          </div>
          
          <div>
            <p class="text-[11px] text-cyan-600 mb-1">Tax 12%</p>
            <p class="text-sm font-bold text-cyan-100 font-mono">TZS {{ formatMoney(bet.tax || 0) }}</p>
          </div>
          
          <div>
            <p class="text-[11px] text-cyan-600 mb-1">Potential Win</p>
            <p class="text-sm font-bold text-emerald-400 font-mono">TZS {{ formatMoney(bet.possibleWin || bet.potentialWin || 0) }}</p>
          </div>
          
          <!-- Net Payout - Full width row -->
          <div class="col-span-2 sm:col-span-4 pt-3 mt-2 border-t border-cyan-800/40">
            <div class="flex items-center justify-between">
              <p class="text-[11px] text-cyan-600">{{ bet.result === 'won' ? 'Net Won' : 'Net Return' }}</p>
              <p class="text-sm font-black font-bold" :class="bet.result === 'won' ? 'text-emerald-400' : 'text-cyan-600'">
                TZS {{ formatMoney(bet.payout || bet.netPayout) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Selections -->
      <div class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-5">
        <h3 class="text-sm font-bold text-cyan-400 mb-4">Selections ({{ bet.selections?.length || 0 }})</h3>

        <div class="space-y-3">
          <div v-for="(sel, i) in bet.selections" :key="i"
               class="flex items-start gap-3 p-3 rounded-xl"
               :class="sel.result === 'won' ? 'bg-emerald-500/5 border border-emerald-500/15' : 'bg-cyan-950/40'">

            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                 :class="sel.result === 'won' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-600/20 text-cyan-400'">
              {{ sel.result === 'won' ? '✓' : sel.result === 'lost' ? '✕' : '⏳' }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-bold text-cyan-100 truncate">{{ sel.matchName }}</p>
                <span class="text-sm font-black text-yellow-400 font-mono flex-shrink-0">{{ sel.odds }}</span>
              </div>
              <p class="text-xs text-cyan-600 mt-0.5">{{ sel.market || '1X2' }} · <span class="text-cyan-400">{{ sel.pick }}</span></p>
              <div class="flex items-center justify-between mt-1.5 text-xs text-cyan-700">
                <span>{{ sel.league || '—' }}</span>
                <span class="font-mono">{{ sel.score || '—' }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center text-xs mt-4">
            <p class="text-xs text-cyan-500">Placed: {{ formatDate(bet.createdAt) }}</p>
          </div>
        </div>
      </div>

    </div>

    <EmptyState v-else icon="🔍" title="Bet not found" description="This bet doesn't exist" action-to="/bets" action-label="My Bets" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '../../components/shared/LoadingSpinner.vue'
import EmptyState from '../../components/shared/EmptyState.vue'
import { useBetStore } from '../../stores/bet/betStore'

const route = useRoute()
const router = useRouter()
const betStore = useBetStore()
const bet = ref(null)
const loading = ref(false)

function formatMoney(n) { 
  return new Intl.NumberFormat('en-KE', { minimumFractionDigits: 0 }).format(n || 0) 
}

function formatDate(d) { 
  if (!d) return '—'
  return new Date(d).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) 
}

async function loadBet() {
  const betId = route.params.id
  
  // First check if we have data from navigation state
  if (history.state?.bet) {
    bet.value = history.state.bet
    return
  }
  
  // If not, fetch from store or API
  loading.value = true
  try {
    // Try to find in store first
    const storedBet = betStore.betHistory.find(b => {
      return (b.id || b.ticket_code || b.bookingCode) === betId
    })
    
    if (storedBet) {
      // Format the bet
      bet.value = {
        id: storedBet.id || storedBet.ticket_code || storedBet.bookingCode,
        stake: storedBet.stake,
        totalOdds: storedBet.total_odds || storedBet.totalOdds || 1,
        tax: storedBet.tax || 0,
        possibleWin: storedBet.possible_win || storedBet.possibleWin || 0,
        payout: storedBet.payout || storedBet.netPayout || 0,
        result: storedBet.result?.toLowerCase() || 'pending',
        createdAt: storedBet.updated_at || storedBet.settledAt || storedBet.createdAt,
        selections: storedBet.selections?.map(sel => ({
          matchName: sel.match?.home_team && sel.match?.away_team 
            ? `${sel.match.home_team} vs ${sel.match.away_team}`
            : sel.matchName || sel.match?.name || 'Unknown Match',
          market: sel.market_key || sel.market || '1X2',
          pick: sel.outcome_key || sel.pick || '—',
          odds: sel.odds_at_placement || sel.odds || 1,
          result: sel.result?.toLowerCase() || 'pending',
          league: sel.league || sel.match?.league || '—',
          score: sel.score || sel.match?.current_score || '—'
        }))
      }
      console.log('✅ Bet found in store:', bet.value)
    } else {
      // Try to fetch by ticket code
      console.log('🔍 Bet not in store, fetching from API...')
      const result = await betStore.fetchBetByTicket(betId)
      
      if (result.success && result.data) {
        const data = result.data
        bet.value = {
          id: data.id || data.ticket_code || data.bookingCode,
          stake: data.stake,
          totalOdds: data.total_odds || data.totalOdds || 1,
          tax: data.tax || 0,
          possibleWin: data.possible_win || data.possibleWin || 0,
          payout: data.payout || data.netPayout || 0,
          result: data.result?.toLowerCase() || 'pending',
          createdAt: data.updated_at || data.settledAt || data.createdAt,
          selections: data.selections?.map(sel => ({
            matchName: sel.match?.home_team && sel.match?.away_team 
              ? `${sel.match.home_team} vs ${sel.match.away_team}`
              : sel.matchName || sel.match?.name || 'Unknown Match',
            market: sel.market_key || sel.market || '1X2',
            pick: sel.outcome_key || sel.pick || '—',
            odds: sel.odds_at_placement || sel.odds || 1,
            result: sel.result?.toLowerCase() || 'pending',
            league: sel.league || sel.match?.league || '—',
            score: sel.score || sel.match?.current_score || '—'
          }))
        }
        console.log('✅ Bet fetched from API:', bet.value)
      } else {
        console.error('❌ Bet not found:', result.error)
      }
    }
  } catch (error) {
    console.error('Failed to load bet:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBet()
})
</script>