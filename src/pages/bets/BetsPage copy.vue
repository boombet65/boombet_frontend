<!-- BetsPage.vue  -->
<template>
    <div class="max-w-3xl mx-auto px-4 py-6">
  
      <h1 class="text-2xl font-black text-cyan-100 mb-6">My Bets</h1>
  
      <AppTabs :tabs="tabs" v-model="activeTab" />
  
      <div class="mt-4">
  
        <!-- Open Bets -->
        <div v-if="activeTab === 'open'">
          <div v-if="loading" class="space-y-3">
            <BetCardSkeleton v-for="n in 3" :key="n" />
          </div>
          <EmptyState v-else-if="openBets.length === 0" icon="📋" title="No open bets" description="Place a bet to see it here" action-to="/sports" action-label="Bet Now" />
          <div v-else class="space-y-3">
            <OpenBetCard v-for="bet in openBets" :key="bet.id" :bet="bet" />
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
                    @click="settledFilter = f.value">
              {{ f.label }}
            </button>
          </div>
          <div v-if="loading" class="space-y-3">
            <BetCardSkeleton v-for="n in 4" :key="n" />
          </div>
          <EmptyState v-else-if="filteredSettled.length === 0" icon="🏁" title="No settled bets" description="Finished bets appear here" />
          <div v-else class="space-y-3">
            <SettledBetCard v-for="bet in filteredSettled" :key="bet.id" :bet="bet" @click="goToDetail" />
          </div>
        </div>
  
        <!-- Jackpot Bets -->
        <div v-else-if="activeTab === 'jackpot'">
          <EmptyState v-if="jackpotBets.length === 0" icon="💰" title="No jackpot bets" description="Try your luck on the jackpot" action-to="/jackpot" action-label="Play Jackpot" />
          <div v-else class="space-y-3">
            <JackBetCard v-for="bet in jackpotBets" :key="bet.id" :bet="bet" />
          </div>
        </div>
  
        <!-- Virtual Bets -->
        <div v-else-if="activeTab === 'virtuals'">
          <EmptyState v-if="virtualBets.length === 0" icon="🤖" title="No virtual bets" description="Bet on virtual sports 24/7" action-to="/virtuals" action-label="Play Virtuals" />
          <div v-else class="space-y-3">
            <VirtualBetCard v-for="bet in virtualBets" :key="bet.id" :bet="bet" />
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import AppTabs        from '../../components/ui/AppTabs.vue'
  import BetCardSkeleton from '../../components/betting/BetCardSkeleton.vue'
  import OpenBetCard    from '../../components/betting/OpenBetCard.vue'
  import SettledBetCard from '../../components/betting/SettledBetCard.vue'
  import JackBetCard    from '../../components/betting/JackpotBetCard.vue'
  import VirtualBetCard from '../../components/betting/VirtualBetCard.vue'
  import EmptyState     from '../../components/shared/EmptyState.vue'
  
  const router        = useRouter()
  const activeTab     = ref('open')
  const settledFilter = ref('all')
  const loading       = ref(false)
  
  const tabs = [
    { key: 'open',     label: 'Open',     icon: '⏳', count: 2 },
    { key: 'settled',  label: 'Settled',  icon: '🏁', count: 5 },
    { key: 'jackpot',  label: 'Jackpot',  icon: '💰', count: 1 },
    { key: 'virtuals', label: 'Virtuals', icon: '🤖', count: 3 },
  ]
  
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'won', label: '✅ Won' },
    { value: 'lost', label: '❌ Lost' },
  ]
  
  const openBets = ref([
    { id: 'BB001', type: 'accumulator', stake: 500, potentialWin: 4500, selections: [
      { matchName: 'Arsenal vs Man City', market: '1X2', pick: 'Arsenal', odds: 2.45 },
      { matchName: 'Barcelona vs Real Madrid', market: '1X2', pick: 'Barcelona', odds: 2.10 },
    ]},
    { id: 'BB002', type: 'single', stake: 200, potentialWin: 490, selections: [
      { matchName: 'Bayern vs PSG', market: '1X2', pick: 'Bayern', odds: 1.65 },
    ]},
  ])
  
  const settledBets = ref([
    { id: 'BB003', stake: 300, payout: 690, result: 'won',  createdAt: new Date().toISOString(), selections: [{ matchName: 'Juventus vs Milan' }, { matchName: 'Dortmund vs Leipzig' }] },
    { id: 'BB004', stake: 150, payout: 0,   result: 'lost', createdAt: new Date().toISOString(), selections: [{ matchName: 'Chelsea vs Liverpool' }] },
    { id: 'BB005', stake: 500, payout: 1250, result: 'won', createdAt: new Date().toISOString(), selections: [{ matchName: 'Man Utd vs Spurs' }] },
  ])
  
  const jackpotBets = ref([
    { id: 'JP001', jackpotName: 'Mega Jackpot', stake: 100, prizePool: 10000000, result: 'pending', createdAt: new Date().toISOString() },
  ])
  
  const virtualBets = ref([
    { id: 'VB001', sport: 'Virtual Football', matchName: 'Virtual Arsenal vs Virtual Chelsea', stake: 100, odds: 2.10, payout: 210, result: 'won',  createdAt: new Date().toISOString() },
    { id: 'VB002', sport: 'Virtual Football', matchName: 'Virtual Madrid vs Virtual Barca',    stake: 200, odds: 1.85, payout: 0,   result: 'lost', createdAt: new Date().toISOString() },
  ])
  
  const filteredSettled = computed(() => {
    if (settledFilter.value === 'all') return settledBets.value
    return settledBets.value.filter(b => b.result === settledFilter.value)
  })
  
  function goToDetail(id) { router.push(`/bets/${id}`) }
  </script>