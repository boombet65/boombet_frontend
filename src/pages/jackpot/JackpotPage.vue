<!-- Jackpot.vue  -->
<template>
    <div class="max-w-4xl mx-auto px-4 py-6">
  
      <!-- Hero -->
      <div class="relative overflow-hidden rounded-2xl p-8 text-center mb-8"
           style="background: linear-gradient(135deg, #1a1200, #2a1f00);">
        <div class="absolute inset-0 opacity-5 text-[200px] leading-none flex items-center justify-center select-none pointer-events-none">💰</div>
        <p class="text-sm font-bold text-yellow-600 mb-2 uppercase tracking-widest">Mega Jackpot</p>
        <h1 class="text-5xl font-black text-yellow-400 mb-2 font-mono">KES 10,000,000</h1>
        <p class="text-cyan-500 text-sm mb-6">Pick all 13 correct scores to win</p>
        <div class="flex items-center justify-center gap-6 text-sm text-yellow-700">
          <div class="text-center"><p class="font-black text-yellow-400 text-lg">13</p><p>Matches</p></div>
          <div class="text-center"><p class="font-black text-yellow-400 text-lg">KES 100</p><p>Entry</p></div>
          <div class="text-center"><p class="font-black text-yellow-400 text-lg">48h</p><p>Remaining</p></div>
        </div>
      </div>
  
      <!-- Jackpot matches -->
      <div class="space-y-3">
        <div v-for="(match, i) in jackpotMatches" :key="match.id"
             class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-4">
  
          <div class="flex items-center gap-2 mb-3">
            <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black bg-yellow-400/20 text-yellow-400">{{ i + 1 }}</span>
            <span class="text-xs text-cyan-600">{{ match.league }}</span>
            <span class="text-xs text-cyan-600 ml-auto">{{ match.time }}</span>
          </div>
  
          <div class="flex items-center justify-between gap-4 mb-3">
            <p class="text-sm font-bold text-cyan-100 flex-1 text-right">{{ match.homeTeam }}</p>
            <span class="text-xs text-cyan-700 font-bold flex-shrink-0">VS</span>
            <p class="text-sm font-bold text-cyan-100 flex-1">{{ match.awayTeam }}</p>
          </div>
  
          <div class="flex gap-2">
            <button v-for="opt in match.options" :key="opt"
                    class="flex-1 py-2 rounded-xl border text-sm font-bold transition-all"
                    :class="selections[match.id] === opt
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                      : 'border-cyan-800 text-cyan-600 hover:border-cyan-600 hover:text-cyan-300'"
                    @click="selections[match.id] = opt">
              {{ opt }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- Submit -->
      <div class="mt-6 bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-4 text-sm">
          <span class="text-cyan-600">Selections made</span>
          <span class="font-bold text-cyan-100">{{ Object.keys(selections).length }} / 13</span>
        </div>
        <div class="flex items-center justify-between mb-4 text-sm">
          <span class="text-cyan-600">Entry fee</span>
          <span class="font-black text-yellow-400">KES 100</span>
        </div>
        <button class="w-full py-3.5 rounded-xl font-black text-base bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 hover:opacity-90 transition-opacity disabled:opacity-40"
                :disabled="Object.keys(selections).length < 13">
          {{ Object.keys(selections).length < 13 ? `Pick ${13 - Object.keys(selections).length} more` : 'Submit Entry — KES 100' }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const selections = ref({})
  
  const jackpotMatches = [
    { id: 1,  league: 'Premier League', time: 'Sat 15:00', homeTeam: 'Arsenal',   awayTeam: 'Man City',    options: ['1', 'X', '2'] },
    { id: 2,  league: 'Premier League', time: 'Sat 17:30', homeTeam: 'Chelsea',   awayTeam: 'Liverpool',   options: ['1', 'X', '2'] },
    { id: 3,  league: 'La Liga',        time: 'Sat 20:00', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', options: ['1', 'X', '2'] },
    { id: 4,  league: 'La Liga',        time: 'Sat 18:00', homeTeam: 'Atletico',  awayTeam: 'Sevilla',     options: ['1', 'X', '2'] },
    { id: 5,  league: 'Serie A',        time: 'Sat 19:45', homeTeam: 'Juventus',  awayTeam: 'AC Milan',    options: ['1', 'X', '2'] },
    { id: 6,  league: 'Bundesliga',     time: 'Sat 17:30', homeTeam: 'Bayern',    awayTeam: 'Dortmund',    options: ['1', 'X', '2'] },
    { id: 7,  league: 'Ligue 1',        time: 'Sat 21:00', homeTeam: 'PSG',       awayTeam: 'Marseille',   options: ['1', 'X', '2'] },
    { id: 8,  league: 'Premier League', time: 'Sun 15:00', homeTeam: 'Man Utd',   awayTeam: 'Spurs',       options: ['1', 'X', '2'] },
    { id: 9,  league: 'Serie A',        time: 'Sun 17:00', homeTeam: 'Inter',     awayTeam: 'Napoli',      options: ['1', 'X', '2'] },
    { id: 10, league: 'La Liga',        time: 'Sun 16:15', homeTeam: 'Valencia',  awayTeam: 'Villarreal',  options: ['1', 'X', '2'] },
    { id: 11, league: 'Bundesliga',     time: 'Sun 15:30', homeTeam: 'Leipzig',   awayTeam: 'Leverkusen',  options: ['1', 'X', '2'] },
    { id: 12, league: 'Premier League', time: 'Sun 16:30', homeTeam: 'Newcastle', awayTeam: 'West Ham',    options: ['1', 'X', '2'] },
    { id: 13, league: 'Champions Lge',  time: 'Tue 21:00', homeTeam: 'Real Madrid',awayTeam: 'Bayern',     options: ['1', 'X', '2'] },
  ]
  </script>