// LivePage.vue 

<template>
    <div class="max-w-7xl mx-auto px-4 py-6">
  
      <div class="flex items-center gap-3 mb-6">
        <span class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
        <h1 class="text-2xl font-black text-cyan-100">Live Betting</h1>
        <span class="px-2.5 py-1 rounded-full text-xs font-black bg-red-500/15 text-red-400 border border-red-500/25">
          {{ liveMatches.length }} LIVE
        </span>
      </div>
  
      <div v-if="liveMatches.length === 0">
        <EmptyState icon="📡" title="No live matches" description="Live matches will appear here when they start" />
      </div>
  
      <div v-else class="grid gap-4 sm:grid-cols-1 xl:grid-cols-1">
        <MatchCard v-for="match in liveMatches" :key="match.id" :match="match" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import MatchCard  from '../../components/betting/MatchCard.vue'
  import EmptyState from '../../components/shared/EmptyState.vue'
  
  const liveMatches = ref([
    { id: 10, league: 'Champions League', time: "73'", homeTeam: 'Bayern',   awayTeam: 'PSG',      live: true, score: { home: 2, away: 1 }, odds: [{ key: '1', label: '1', value: 1.65 }, { key: 'X', label: 'X', value: 4.20 }, { key: '2', label: '2', value: 5.00 }] },
    { id: 11, league: 'Premier League',   time: "55'", homeTeam: 'Dortmund', awayTeam: 'Leipzig',  live: true, score: { home: 1, away: 1 }, odds: [{ key: '1', label: '1', value: 2.30 }, { key: 'X', label: 'X', value: 3.10 }, { key: '2', label: '2', value: 2.90 }] },
    { id: 12, league: 'La Liga',          time: "38'", homeTeam: 'Atletico', awayTeam: 'Valencia', live: true, score: { home: 0, away: 0 }, odds: [{ key: '1', label: '1', value: 1.90 }, { key: 'X', label: 'X', value: 3.30 }, { key: '2', label: '2', value: 4.10 }] },
  ])
  </script>