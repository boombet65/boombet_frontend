<!-- SportDetailPage.vue - Direct DB Data Load -->
<template>
  <div class="min-h-screen pb-10">
    <!-- Back Button & Header -->
    <div class="sticky top-0 z-20 bg-[#060810]/90 backdrop-blur-md border-b border-cyan-800/40 shadow-md">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div class="flex items-center justify-between sm:justify-center relative">
          <!-- Back Button -->
          <button 
            @click="goBack"
            class="p-1.5 sm:p-2 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-200 rounded-xl transition-colors duration-200 flex-shrink-0 sm:absolute sm:left-0 border border-cyan-800/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <!-- Center Content -->
          <div class="text-center flex-1 sm:flex-none px-2 sm:px-0">
            <h1 class="text-xs sm:text-lg font-black text-cyan-100 truncate" v-if="matchData">
              {{ matchData.homeTeam }} <span class="text-yellow-400 font-bold">vs</span> {{ matchData.awayTeam }}
            </h1>
            <p class="text-[10px] sm:text-xs text-cyan-500 font-medium truncate" v-if="matchData">{{ matchData.league }}</p>
          </div>

          <!-- Spacer for mobile balance -->
          <div class="w-8 sm:hidden"></div>
        </div>
      </div>
    </div>

    <!-- Loading State Kama Match Haijapatikana Bado -->
    <div v-if="!matchData" class="max-w-7xl mx-auto px-3 mt-10 text-center py-12 bg-cyan-900/10 rounded-2xl border border-cyan-800/30">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-3"></div>
      <p class="text-sm font-semibold text-cyan-400">Inapakia taarifa za mechi kutoka database...</p>
    </div>

    <!-- Match Details Content -->
    <div v-else class="max-w-7xl mx-auto px-3 mt-4 space-y-4">
      
      <!-- Match Status & Teams Header Card -->
      <div class="bg-cyan-900/20 rounded-2xl border border-cyan-800/40 p-4 shadow-lg backdrop-blur-sm">
        <div class="flex flex-col items-center">
          
          <!-- Status Badge -->
          <div class="mb-3">
            <span v-if="matchData.live" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE
            </span>
            <span v-else class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-900/40 text-cyan-400 border border-cyan-800/60">
              ⏳ {{ matchData.time || 'Upcoming' }}
            </span>
          </div>

          <!-- Teams & Live Score Display -->
          <div class="flex items-center justify-between w-full max-w-2xl gap-2 sm:gap-4">
            <!-- Home Team -->
            <div class="flex flex-col items-center flex-1 text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-cyan-900/40 border border-cyan-700/50 flex items-center justify-center text-sm sm:text-2xl font-black text-yellow-400 mb-2 shadow-inner">
                {{ getTeamInitials(matchData.homeTeam) }}
              </div>
              <span class="text-xs sm:text-sm font-bold text-cyan-100 line-clamp-1">{{ matchData.homeTeam }}</span>
              <span v-if="matchData.live" class="text-xl sm:text-3xl font-black text-yellow-400 mt-1">
                {{ matchData.score?.home ?? 0 }}
              </span>
            </div>

            <!-- VS / Time Divider -->
            <div class="flex flex-col items-center px-2">
              <span class="text-xs font-black text-cyan-600 bg-cyan-900/30 px-2.5 py-1 rounded-lg border border-cyan-800/40">VS</span>
              <span class="text-[10px] sm:text-xs font-bold text-cyan-400 mt-2">{{ matchData.time }}</span>
            </div>

            <!-- Away Team -->
            <div class="flex flex-col items-center flex-1 text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-cyan-900/40 border border-cyan-700/50 flex items-center justify-center text-sm sm:text-2xl font-black text-yellow-400 mb-2 shadow-inner">
                {{ getTeamInitials(matchData.awayTeam) }}
              </div>
              <span class="text-xs sm:text-sm font-bold text-cyan-100 line-clamp-1">{{ matchData.awayTeam }}</span>
              <span v-if="matchData.live" class="text-xl sm:text-3xl font-black text-yellow-400 mt-1">
                {{ matchData.score?.away ?? 0 }}
              </span>
            </div>
          </div>

          <!-- Match Meta Info -->
          <div class="mt-4 pt-3 border-t border-cyan-800/40 w-full" v-if="matchData.date || matchData.time">
            <div class="flex justify-center items-center gap-6 text-[11px] sm:text-xs text-cyan-500 font-semibold">
              <div class="flex items-center gap-1.5" v-if="matchData.date">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ matchData.date }}</span>
              </div>
              <div class="flex items-center gap-1.5" v-if="matchData.time">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ matchData.time }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Betting Markets Section -->
      <div class="bg-cyan-900/20 rounded-2xl border border-cyan-800/40 p-3 sm:p-5 space-y-6">
        
        <!-- 1. 1X2 | Full Time -->
        <div v-if="matchData.homeOdds || matchData.drawOdds || matchData.awayOdds">
          <h3 class="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wider mb-2 sm:mb-3">1X2 | Full Time</h3>
          <div class="grid grid-cols-3 gap-2 sm:gap-3">
            <button 
              v-if="matchData.homeOdds"
              @click="handleOddsClick('1', matchData.homeOdds, '1', '1X2 | Full Time')"
              class="flex justify-between items-center px-3 py-2.5 sm:py-3 rounded-xl border transition-all duration-200"
              :class="getOddButtonClass('1')"
            >
              <span class="text-xs font-bold" :class="getLabelClass('1')">1</span>
              <span class="text-sm sm:text-base font-black">{{ matchData.homeOdds }}</span>
            </button>

            <button 
              v-if="matchData.drawOdds"
              @click="handleOddsClick('X', matchData.drawOdds, 'X', '1X2 | Full Time')"
              class="flex justify-between items-center px-3 py-2.5 sm:py-3 rounded-xl border transition-all duration-200"
              :class="getOddButtonClass('X')"
            >
              <span class="text-xs font-bold" :class="getLabelClass('X')">X</span>
              <span class="text-sm sm:text-base font-black">{{ matchData.drawOdds }}</span>
            </button>

            <button 
              v-if="matchData.awayOdds"
              @click="handleOddsClick('2', matchData.awayOdds, '2', '1X2 | Full Time')"
              class="flex justify-between items-center px-3 py-2.5 sm:py-3 rounded-xl border transition-all duration-200"
              :class="getOddButtonClass('2')"
            >
              <span class="text-xs font-bold" :class="getLabelClass('2')">2</span>
              <span class="text-sm sm:text-base font-black">{{ matchData.awayOdds }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Double Chance -->
        <div v-if="doubleChanceOdds && Object.keys(doubleChanceOdds).length">
          <h3 class="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wider mb-2 sm:mb-3">Double Chance | Full Time</h3>
          <div class="grid grid-cols-3 gap-2 sm:gap-3">
            <button 
              v-for="(odd, label) in doubleChanceOdds"
              :key="label"
              @click="handleOddsClick(label, odd, label, 'Double Chance')"
              class="flex justify-between items-center px-3 py-2.5 sm:py-3 rounded-xl border transition-all duration-200"
              :class="getOddButtonClass(label)"
            >
              <span class="text-xs font-bold" :class="getLabelClass(label)">{{ label }}</span>
              <span class="text-sm sm:text-base font-black">{{ odd }}</span>
            </button>
          </div>
        </div>

        <!-- 3. Both Teams To Score -->
        <div v-if="bttsOdds && Object.keys(bttsOdds).length">
          <h3 class="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wider mb-2 sm:mb-3">Both Teams To Score</h3>
          <div class="grid grid-cols-2 gap-2 sm:gap-3">
            <button 
              v-for="(odd, key) in bttsOdds"
              :key="key"
              @click="handleOddsClick(`BTTS_${key}`, odd, key, 'Both Teams to Score')"
              class="flex justify-between items-center px-3 py-2.5 sm:py-3 rounded-xl border transition-all duration-200"
              :class="getOddButtonClass(`BTTS_${key}`)"
            >
              <span class="text-xs font-bold capitalize" :class="getLabelClass(`BTTS_${key}`)">{{ key }}</span>
              <span class="text-sm sm:text-base font-black">{{ odd }}</span>
            </button>
          </div>
        </div>

        <!-- 4. Over / Under -->
        <div v-if="overUnderOdds && Object.keys(overUnderOdds).length">
          <h3 class="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wider mb-2 sm:mb-3">Over / Under | Full Time</h3>
          <div class="grid grid-cols-2 gap-2 sm:gap-3">
            <button 
              v-for="(odd, label) in overUnderOdds" 
              :key="label"
              @click="handleOddsClick(`OU_${label}`, odd, label, 'Over/Under')"
              class="flex justify-between items-center px-3 py-2.5 sm:py-3 rounded-xl border transition-all duration-200"
              :class="getOddButtonClass(`OU_${label}`)"
            >
              <span class="text-[11px] font-bold" :class="getLabelClass(`OU_${label}`)">{{ label }}</span>
              <span class="text-sm sm:text-base font-black">{{ odd }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBetStore } from '../../../stores/betStore.js'
import { useMatchStore } from '../../../stores/match/useMatchStore.js'

const router = useRouter()
const route = useRoute()
const betStore = useBetStore()
const matchStore = useMatchStore()

// 1. Pata Match ID kutoka Route Params au Query
const matchId = computed(() => route.params.id || route.query.id)

// 2. Tafuta Match husika kutoka kwenye MatchStore
const rawMatch = computed(() => {
  if (!matchId.value) return null
  return matchStore.upcomingMatches.find(m => m.id == matchId.value) ||
         matchStore.liveMatches.find(m => m.id == matchId.value) || null
})

// 3. Format Match Data (Inarudisha NULL kama mechi haijapatikana bado)
const matchData = computed(() => {
  if (!rawMatch.value) return null

  const m = rawMatch.value
  const odds1X2 = m.odds?.['1X2'] || {}

  return {
    id: m.id,
    homeTeam: m.home_team || m.homeTeam,
    awayTeam: m.away_team || m.awayTeam,
    league: m.league,
    time: m.status === 'LIVE' 
      ? (m.elapsed_minute ? `${m.elapsed_minute}'` : 'LIVE') 
      : m.time,
    date: m.date,
    live: m.status === 'LIVE' || m.live || false,
    score: {
      home: m.current_score?.home ?? m.score?.home ?? 0,
      away: m.current_score?.away ?? m.score?.away ?? 0
    },
    homeOdds: odds1X2['1'] ?? m.homeOdds,
    drawOdds: odds1X2['X'] ?? m.drawOdds,
    awayOdds: odds1X2['2'] ?? m.awayOdds
  }
})

// 4. Odds za Masoko Mengine (100% Moja kwa moja kutoka DB)
const doubleChanceOdds = computed(() => {
  return rawMatch.value?.odds?.['Double Chance'] || null
})

const bttsOdds = computed(() => {
  return rawMatch.value?.odds?.['BTTS'] || null
})

const overUnderOdds = computed(() => {
  return rawMatch.value?.odds?.['Over/Under'] || null
})

// Bet Store Selection Checker
const isSelected = (marketKey) => {
  if (!matchData.value) return false
  const fullMarketKey = `${matchData.value.id}_${marketKey}`
  return betStore.isSelected(matchData.value.id, fullMarketKey)
}

const getOddButtonClass = (marketKey) => {
  if (isSelected(marketKey)) {
    return 'bg-gradient-to-r from-yellow-500 to-yellow-400 border-yellow-300 text-cyan-950 font-black shadow-md scale-[1.02]'
  }
  return 'bg-cyan-900/40 border-cyan-800/60 text-cyan-100 hover:border-cyan-500 hover:bg-cyan-900/60'
}

const getLabelClass = (marketKey) => {
  return isSelected(marketKey) ? 'text-cyan-950' : 'text-cyan-400'
}

// Add Selection to Slip
const handleOddsClick = (marketKey, oddsValue, pickLabel, marketName) => {
  if (!matchData.value || !oddsValue) return
  const odds = parseFloat(oddsValue)
  if (isNaN(odds)) return

  const fullMarketKey = `${matchData.value.id}_${marketKey}`

  betStore.addToSlip({
    matchId: matchData.value.id,
    matchName: `${matchData.value.homeTeam} vs ${matchData.value.awayTeam}`,
    market: marketName,
    pick: `${marketName} - ${pickLabel}`,
    marketKey: fullMarketKey,
    odds: odds,
  })
}

const getTeamInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const goBack = () => router.back()

// Kama Store iko tupu pindi mtumiaji anaporefresh page moja kwa moja
onMounted(() => {
  if (matchStore.upcomingMatches.length === 0 && matchStore.liveMatches.length === 0) {
    matchStore.fetchAllMatches()
  }
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>