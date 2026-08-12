// SportsPage.vue 

<template>
    <div class="max-w-7xl mx-auto px-4 py-6">
  
      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <h1 class="text-2xl font-black text-cyan-100">⚽ Sports</h1>
        <RouterLink to="/sports/live" class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-400">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Betting
        </RouterLink>
      </div>
  
      <!-- Sport tabs -->
      <div class="flex gap-2 mb-5 overflow-x-auto pb-2" style="scrollbar-width:none;">
        <button v-for="sport in sports" :key="sport.key"
                class="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
                :class="activeSport === sport.key
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-cyan-800 bg-cyan-900/20 text-cyan-500 hover:border-cyan-600 hover:text-cyan-300'"
                @click="activeSport = sport.key">
          {{ sport.icon }} {{ sport.label }}
        </button>
      </div>


      <!-- Matches -->
      <div class="space-y-6">
        <div v-for="league in groupedMatches" :key="league.name">
          <!-- League header -->
          <div class="flex items-center gap-2 mb-3">
            <span class="text-sm">🏆</span>
            <h3 class="text-sm font-bold text-cyan-400">{{ league.name }}</h3>
            <div class="flex-1 h-px bg-cyan-800/40"></div>
            <span class="text-xs text-cyan-700">{{ league.matches.length }} matches</span>
          </div>
          <div class="grid gap-3 sm:grid-cols-1 xl:grid-cols-1">
            <MatchCard v-for="match in league.matches" :key="match.id" :match="match" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { RouterLink } from 'vue-router'
  import MatchCard from '../../components/betting/MatchCard.vue'
  
  const activeSport = ref('football')
  
  const sports = [
    { key: 'football',   label: 'Football',   icon: '⚽' },
    { key: 'basketball', label: 'Basketball', icon: '🏀' },
    { key: 'tennis',     label: 'Tennis',     icon: '🎾' },
    { key: 'cricket',    label: 'Cricket',    icon: '🏏' },
    { key: 'rugby',      label: 'Rugby',      icon: '🏉' },
  ]
  
  const allMatches = [
    { id: 1,  league: 'Premier League',   time: '20:00', homeTeam: 'Arsenal',   awayTeam: 'Man City',    live: false, odds: [{ key: '1', label: '1', value: 2.45 }, { key: 'X', label: 'X', value: 3.20 }, { key: '2', label: '2', value: 2.80 }] },
    { id: 2,  league: 'Premier League',   time: '17:30', homeTeam: 'Chelsea',   awayTeam: 'Liverpool',   live: false, odds: [{ key: '1', label: '1', value: 2.90 }, { key: 'X', label: 'X', value: 3.10 }, { key: '2', label: '2', value: 2.40 }] },
    { id: 3,  league: 'La Liga',          time: '21:45', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', live: false, odds: [{ key: '1', label: '1', value: 2.10 }, { key: 'X', label: 'X', value: 3.40 }, { key: '2', label: '2', value: 3.20 }] },
    { id: 4,  league: 'La Liga',          time: '19:00', homeTeam: 'Atletico',  awayTeam: 'Sevilla',     live: false, odds: [{ key: '1', label: '1', value: 1.80 }, { key: 'X', label: 'X', value: 3.60 }, { key: '2', label: '2', value: 4.20 }] },
    { id: 5,  league: 'Serie A',          time: '19:30', homeTeam: 'Juventus',  awayTeam: 'AC Milan',    live: false, odds: [{ key: '1', label: '1', value: 1.95 }, { key: 'X', label: 'X', value: 3.50 }, { key: '2', label: '2', value: 3.80 }] },
    { id: 6,  league: 'Bundesliga',       time: '18:30', homeTeam: 'Bayern',    awayTeam: 'Dortmund',    live: false, odds: [{ key: '1', label: '1', value: 1.60 }, { key: 'X', label: 'X', value: 4.00 }, { key: '2', label: '2', value: 5.50 }] },
  ]
  
  const groupedMatches = computed(() => {
    const groups = {}
    allMatches.forEach(m => {
      if (!groups[m.league]) groups[m.league] = { name: m.league, matches: [] }
      groups[m.league].matches.push(m)
    })
    return Object.values(groups)
  })
  </script>