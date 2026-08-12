<!-- BetsDetailPage.vue  -->
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
              <p class="text-sm font-bold text-yellow-400 font-mono">{{ bet.totalOdds }}</p>
            </div>
            <div>
              <p class="text-[11px] text-cyan-600 mb-1">Potential Win</p>
              <p class="text-sm font-bold text-cyan-100 font-mono">TZS  {{ formatMoney(bet.potentialWin) }}</p>
            </div>
            <div>
              <p class="text-[11px] text-cyan-600 mb-1">{{ bet.result === 'won' ? 'Won' : 'Return' }}</p>
              <p class="text-sm font-bold font-mono" :class="bet.result === 'won' ? 'text-emerald-400' : 'text-cyan-600'">
                TZS {{ formatMoney(bet.netPayout) }}
              </p>
            </div>
          </div>
  
          <p class="text-xs text-cyan-700 mt-4">Placed: {{ formatDate(bet.createdAt) }}</p>
        </div>
  
        <!-- Selections -->
        <div class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-5">
          <h3 class="text-sm font-bold text-cyan-400 mb-4">Selections ({{ bet.selections?.length }})</h3>
  
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
                <p class="text-xs text-cyan-600 mt-0.5">{{ sel.market }} · <span class="text-cyan-400">{{ sel.pick }}</span></p>
                <div class="flex items-center justify-between mt-1.5 text-xs text-cyan-700">
                  <span>{{ sel.league }}</span>
                  <span class="font-mono">{{ sel.score || '—' }}</span>
                </div>
              </div>
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
  
  const route  = useRoute()
  const router = useRouter()
  const bet    = ref(null)
  const loading = ref(false)
  
  function formatMoney(n) { return new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(n || 0) }
  function formatDate(d)  { return new Date(d).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) }
  
  onMounted(() => {
    // TODO: fetch from betService.getBetById(route.params.id)
    bet.value = {
      id: route.params.id, stake: 500, totalOdds: 4.50, potentialWin: 2250, payout: 2250,
      result: 'won', createdAt: new Date().toISOString(),
      selections: [
        { matchName: 'Arsenal vs Man City', market: '1X2', pick: 'Arsenal', odds: 2.10, result: 'won', league: 'Premier League', score: '2-1' },
        { matchName: 'Barcelona vs Real Madrid', market: '1X2', pick: 'Barcelona', odds: 2.14, result: 'won', league: 'La Liga', score: '3-0' },
      ],
    }
  })
  </script>