
// betDetailPage.vue 
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
                    : 'bg-red-500/10 text-red-400 border-red-500/20'">
              {{ bet.result === 'won' ? '✅ WON' : '❌ LOST' }}
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
    <p class="text-sm font-bold text-cyan-100 font-mono">TZS {{ formatMoney(bet.potentialWin || bet.netPayout) }}</p>
  </div>
  
  <!-- Net Payout - Full width row -->
  <div class="col-span-2 sm:col-span-4 pt-3 mt-2 border-t border-cyan-800/40">
    <div class="flex items-center justify-between">
      <p class="text-[11px] text-cyan-600">{{ bet.result === 'won' ? 'Net Won' : 'Net Return' }}</p>
      <p class="text-sm font-black font-bold" :class="bet.result === 'won' ? 'text-emerald-400' : 'text-cyan-600'">
        TZS {{ formatMoney(bet.netPayout) }}
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
                   :class="sel.result === 'won' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'">
                {{ sel.result === 'won' ? '✓' : '✕' }}
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
            <div class="flex items-center justify-center text-xs  mt-4">
          <p class="text-xs text-cyan-500 ">Placed: {{ formatDate(bet.createdAt) }}</p>
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
  import EmptyState     from '../../components/shared/EmptyState.vue'
  import { useBetStore } from '../../stores/betStore'
  
  const route  = useRoute()
  const router = useRouter()
  const betStore = useBetStore()
  const bet    = ref(null)
  const loading = ref(false)
  
  function formatMoney(n) { 
    return new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(n || 0) 
  }
  
  function formatDate(d)  { 
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
      const storedBet = betStore.userBets.find(b => (b.id || b.bookingCode) === betId)
      
      if (storedBet) {
        // Format the bet
        bet.value = {
          id: storedBet.id || storedBet.bookingCode,
          stake: storedBet.stake,
          totalOdds: storedBet.totalOdds || storedBet.odds,
          tax: storedBet.tax,
          potentialWin: storedBet.result === 'WON' ? storedBet.potentialReturn : 0,
          netPayout: storedBet.netPayout,
          result: storedBet.result?.toLowerCase(),
          createdAt: storedBet.settledAt || storedBet.createdAt,
          selections: storedBet.selections?.map(sel => ({
            matchName: sel.match?.name || sel.matchName,
            market: sel.market || '1X2',
            pick: sel.selection || sel.pick,
            odds: sel.odds,
            result: sel.result?.toLowerCase(),
            league: sel.league || sel.match?.league,
            score: sel.score
          }))
        }
      } else {
        // TODO: Fetch from API if not in store
        // const fetchedBet = await betService.getBetById(betId)
        // bet.value = formatSettledBet(fetchedBet)
        
        // Fallback mock data
        bet.value = {
          id: betId,
          stake: 500,
          totalOdds: 4.50,
          potentialWin: 2250,
          netPayout: 2250,
          result: 'won',
          createdAt: new Date().toISOString(),
          selections: [
            { 
              matchName: 'Arsenal vs Man City', 
              market: '1X2', 
              pick: 'Arsenal', 
              odds: 2.10, 
              result: 'won', 
              league: 'Premier League', 
              score: '2-1' 
            },
            { 
              matchName: 'Barcelona vs Real Madrid', 
              market: '1X2', 
              pick: 'Barcelona', 
              odds: 2.14, 
              result: 'won', 
              league: 'La Liga', 
              score: '3-0' 
            },
          ]
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