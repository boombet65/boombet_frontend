<template>
    <div class="max-w-7xl mx-auto px-4 py-6">
      <h1 class="text-2xl font-black text-cyan-100 mb-2">🤖 Virtual Sports</h1>
      <p class="text-sm text-cyan-600 mb-6">Bet on virtual matches 24/7 — results every few minutes</p>
  
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <RouterLink v-for="sport in virtualSports" :key="sport.key" :to="`/virtuals/${sport.key}`"
          class="relative overflow-hidden rounded-2xl p-5 border hover:border-cyan-600/60 transition-all group block"
          :style="{ background: sport.gradient, borderColor: 'rgba(21,94,117,0.4)' }">
          <div class="text-4xl mb-3 group-hover:scale-110 transition-transform">{{ sport.emoji }}</div>
          <h3 class="text-base font-black text-white mb-1">{{ sport.name }}</h3>
          <p class="text-xs text-cyan-500 mb-3">{{ sport.desc }}</p>
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-cyan-600">Next match in</span>
            <span class="text-xs font-black font-mono text-yellow-400">{{ sport.nextIn }}</span>
          </div>
        </RouterLink>
      </div>
  
      <!-- Upcoming virtual matches -->
      <h2 class="text-lg font-black text-cyan-100 mb-4">Upcoming Matches</h2>
      <div class="grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
        <MatchCard v-for="match in virtualMatches" :key="match.id" :match="match" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  import MatchCard from '../../components/betting/MatchCard.vue'
  
  const virtualSports = [
    { key: 'football', name: 'Virtual Football', emoji: '⚽', desc: 'Top leagues, instant results', gradient: 'linear-gradient(135deg,#001a0d,#003319)', nextIn: '00:45' },
    { key: 'racing',   name: 'Virtual Racing',   emoji: '🏎️', desc: 'Race to win big prizes',      gradient: 'linear-gradient(135deg,#1a0000,#2a0000)', nextIn: '02:10' },
    { key: 'dogs',     name: 'Greyhound Racing', emoji: '🐕', desc: '6 dogs, one winner',           gradient: 'linear-gradient(135deg,#0d001a,#1a0033)', nextIn: '01:20' },
  ]
  
  const virtualMatches = [
    { id: 'V1', league: 'Virtual Premier League', time: '00:45', homeTeam: 'V-Arsenal', awayTeam: 'V-Chelsea',  live: false, odds: [{ key: '1', label: '1', value: 2.10 }, { key: 'X', label: 'X', value: 3.20 }, { key: '2', label: '2', value: 3.40 }] },
    { id: 'V2', league: 'Virtual La Liga',        time: '01:15', homeTeam: 'V-Barca',   awayTeam: 'V-Madrid',   live: false, odds: [{ key: '1', label: '1', value: 1.95 }, { key: 'X', label: 'X', value: 3.50 }, { key: '2', label: '2', value: 3.80 }] },
    { id: 'V3', league: 'Virtual Bundesliga',     time: '02:00', homeTeam: 'V-Bayern',  awayTeam: 'V-Dortmund', live: false, odds: [{ key: '1', label: '1', value: 1.65 }, { key: 'X', label: 'X', value: 4.00 }, { key: '2', label: '2', value: 5.00 }] },
  ]
  </script>