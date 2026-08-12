<!-- SportDetailPage.vue - Full Dynamic Markets Support -->
<template>
  <div class="min-h-screen pb-16 bg-[#060810] text-cyan-100">
    <!-- Back Button & Header -->
    <div class="sticky top-0 z-20 bg-[#060810]/95 backdrop-blur-md border-b border-cyan-800/40 shadow-md">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div class="flex items-center justify-between relative">
          <!-- Back Button -->
          <button 
            @click="goBack"
            class="p-2 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-200 rounded-xl transition-colors duration-200 border border-cyan-800/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <!-- Center Content -->
          <div class="text-center flex-1 px-2">
            <h1 class="text-sm sm:text-base font-black text-cyan-100 truncate" v-if="matchData">
              {{ matchData.homeTeam }} <span class="text-yellow-400 font-bold">vs</span> {{ matchData.awayTeam }}
            </h1>
            <p class="text-[10px] sm:text-xs text-cyan-500 font-medium truncate" v-if="matchData">{{ matchData.league }}</p>
          </div>

          <div class="w-9"></div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!matchData" class="max-w-4xl mx-auto px-3 mt-10 text-center py-12 bg-cyan-900/10 rounded-2xl border border-cyan-800/30">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-3"></div>
      <p class="text-sm font-semibold text-cyan-400">Loading markets...</p>
    </div>

    <!-- Match Details Content -->
    <div v-else class="max-w-4xl mx-auto px-3 mt-4 space-y-4">
      
      <!-- Match Banner Card -->
      <div class="bg-gradient-to-b from-cyan-900/30 to-cyan-950/60 rounded-2xl border border-cyan-800/40 p-4 shadow-xl backdrop-blur-sm">
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

          <!-- Teams & Score -->
          <div class="flex items-center justify-between w-full max-w-xl gap-2">
            <!-- Home Team -->
            <div class="flex flex-col items-center flex-1 text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-cyan-900/50 border border-cyan-700/50 flex items-center justify-center text-sm sm:text-2xl font-black text-yellow-400 mb-2 shadow-inner">
                {{ getTeamInitials(matchData.homeTeam) }}
              </div>
              <span class="text-xs sm:text-sm font-bold text-cyan-100 line-clamp-1">{{ matchData.homeTeam }}</span>
              <span v-if="matchData.live" class="text-2xl font-black text-yellow-400 mt-1">{{ matchData.score?.home ?? 0 }}</span>
            </div>

            <!-- VS -->
            <div class="flex flex-col items-center px-2">
              <span class="text-xs font-black text-cyan-500 bg-cyan-900/40 px-2.5 py-1 rounded-lg border border-cyan-800/60">VS</span>
              <span class="text-[10px] text-cyan-400 mt-2 font-mono">{{ matchData.date }}</span>
            </div>

            <!-- Away Team -->
            <div class="flex flex-col items-center flex-1 text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-cyan-900/50 border border-cyan-700/50 flex items-center justify-center text-sm sm:text-2xl font-black text-yellow-400 mb-2 shadow-inner">
                {{ getTeamInitials(matchData.awayTeam) }}
              </div>
              <span class="text-xs sm:text-sm font-bold text-cyan-100 line-clamp-1">{{ matchData.awayTeam }}</span>
              <span v-if="matchData.live" class="text-2xl font-black text-yellow-400 mt-1">{{ matchData.score?.away ?? 0 }}</span>
            </div>
          </div>

        </div>
      </div>

      <!-- DYNAMIC BETTING MARKETS LIST -->
      <div class="space-y-3">
        <div 
          v-for="market in formattedMarkets" 
          :key="market.key"
          class="bg-cyan-900/20 rounded-2xl border border-cyan-800/40 p-3 sm:p-4 shadow-sm"
        >
          <!-- Market Header Title -->
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <span class="w-1.5 h-3 bg-yellow-400 rounded-full"></span>
              {{ market.title }}
            </h3>
            <span class="text-[10px] text-cyan-500 font-mono">{{ Object.keys(market.options).length }} options</span>
          </div>

         <!-- Market Odds Grid -->
          <div 
            class="grid gap-2"
            :class="getGridColsClass(market.key, market.options.length)"
          >
            <button 
              v-for="opt in market.options"
              :key="opt.key"
              @click="handleOddsClick(market.key, opt.key, opt.value, market.title)"
              class="flex justify-between items-center px-3 py-2.5 rounded-sm border transition-all duration-200 text-left active:scale-[0.98]"
              :class="getOddButtonClass(market.key, opt.key)"
            >
              <span class="text-xs font-bold truncate pr-1" :class="getLabelClass(market.key, opt.key)">
                {{ formatOptionLabel(opt.key, market.key) }}
              </span>
              <span class="text-xs sm:text-sm font-black font-mono ml-auto">{{ formatOdds(opt.value) }}</span>
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
import { useBetStore } from '../../../stores/bet/betStore.js'
import { useMatchStore } from '../../../stores/match/useMatchStore.js'

const router = useRouter()
const route = useRoute()
const betStore = useBetStore()
const matchStore = useMatchStore()

const matchId = computed(() => route.params.id || route.query.id)



const formatOdds = (val) => {
  const num = parseFloat(val)
  return isNaN(num) ? val : num.toFixed(2)
}
// Tafuta match kutoka Store
const rawMatch = computed(() => {
  if (!matchId.value) return null
  return matchStore.upcomingMatches.find(m => m.id == matchId.value) ||
         matchStore.liveMatches.find(m => m.id == matchId.value) || null
})

// General match information
const matchData = computed(() => {
  if (!rawMatch.value) return null
  const m = rawMatch.value
  return {
    id: m.id,
    homeTeam: m.home_team || m.homeTeam,
    awayTeam: m.away_team || m.awayTeam,
    league: m.league,
    time: m.time,
    date: m.date,
    live: m.status === 'LIVE' || m.live || false,
    score: m.current_score || { home: 0, away: 0 }
  }
})

// Majina ya Masoko kwa Kiswahili/Kiingereza Kizuri cha Betting
const marketTitleMap = {
  '1X2': '1X2 | Full Time',
  'Double_Chance': 'Double Chance',
  'BTTS': 'Both Teams To Score',
  'Over_Under': 'Over / Under (Goals)',
  'Correct_Score': 'Correct Score',
  'Handicap': 'Handicap',
  'HT_FT': 'Half Time / Full Time',
  'BTTS_Win': 'BTTS & Match Result',
  'Odd_Even': 'Total Goals (Odd/Even)',
  'Total_Goals': 'Exact Total Goals',
  'Both_Halves': 'Goals In Both Halves',
  'First_Last_Goal': 'First / Last Goal Scorer',
  'Highest_Scoring_Half': 'Highest Scoring Half',
  'Clean_Sheet': 'Clean Sheet'
}

// Kanuni za Mpangilio wa Masoko (Array ya Vipaumbele)
const optionOrderMap = {
  '1X2': ['1', 'X', '2'],
  'Double_Chance': ['1X', '12', 'X2'],
  'BTTS': ['YES', 'NO', 'Yes', 'No'],
  'Over_Under': ['OVER', 'UNDER', 'Over', 'Under']
}

// Convert DB Odds object to structured list WITH GUARANTEED ARRAY ORDERING
const formattedMarkets = computed(() => {
  if (!rawMatch.value?.odds) return []

  const oddsObj = rawMatch.value.odds
  
  return Object.keys(oddsObj).map(marketKey => {
    const rawOptions = oddsObj[marketKey] || {}
    const optionsArray = []
    
    // Kama tuna order mahususi (Mfano: 1, X, 2)
    if (optionOrderMap[marketKey]) {
      const preferredOrder = optionOrderMap[marketKey]
      
      // 1. Weka vile vilivyo kwenye mpangilio unaotakiwa
      preferredOrder.forEach(key => {
        if (rawOptions[key] !== undefined) {
          optionsArray.push({ key: key, value: rawOptions[key] })
        }
      })

      // 2. Kama kuna key yoyote iliyobaki kutoka DB, iongeze mwishoni
      Object.keys(rawOptions).forEach(key => {
        if (!preferredOrder.includes(key)) {
          optionsArray.push({ key: key, value: rawOptions[key] })
        }
      })
    } else {
      // Masoko mengine badilisha tu kutoka Object kwenda Array
      Object.keys(rawOptions).forEach(key => {
        optionsArray.push({ key: key, value: rawOptions[key] })
      })
    }

    return {
      key: marketKey,
      title: marketTitleMap[marketKey] || marketKey.replace(/_/g, ' '),
      options: optionsArray // Hapa sasa ni Array badala ya Object!
    }
  })
})

// MPANGILIO WA GRID (Responsive Columns kulingana na aina ya soko)
const getGridColsClass = (marketKey, totalOptions) => {
  if (marketKey === '1X2' || marketKey === 'Double_Chance' || marketKey === 'Highest_Scoring_Half') {
    return 'grid-cols-3'
  }
  if (marketKey === 'Correct_Score' || marketKey === 'HT_FT') {
    return 'grid-cols-2 sm:grid-cols-4'
  }
  if (marketKey === 'Over_Under' || marketKey === 'BTTS' || marketKey === 'Odd_Even') {
    return 'grid-cols-2'
  }
  if (totalOptions > 4) {
    return 'grid-cols-2 sm:grid-cols-3'
  }
  return 'grid-cols-2'
}

// Format Option Label ili ikae vizuri (Mfano: "OVER_2.5" -> "Over 2.5", "Home_Home" -> "Home / Home")
const formatOptionLabel = (optionKey, marketKey) => {
  if (marketKey === '1X2') {
    if (optionKey === '1') return `1 `
    if (optionKey === 'X') return 'X '
    if (optionKey === '2') return `2 `
  }
  
  return optionKey
    .replace(/_/g, ' ')
    .replace('OVER', 'Over')
    .replace('UNDER', 'Under')
}

// Slip Checker
const isSelected = (marketKey, optionKey) => {
  if (!matchData.value) return false
  const fullMarketKey = `${matchData.value.id}_${marketKey}_${optionKey}`
  return betStore.isSelected(matchData.value.id, fullMarketKey)
}

const getOddButtonClass = (marketKey, optionKey) => {
  if (isSelected(marketKey, optionKey)) {
    return 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/10 text-yellow-300 font-black  ring-1 ring-yellow-400/50'
  }
  return 'bg-cyan-900/40 border-cyan-800/60 text-cyan-200 hover:border-cyan-500 hover:bg-cyan-900/60'
}

const getLabelClass = (marketKey, optionKey) => {
  return isSelected(marketKey, optionKey) ? 'text-yellow-300' : 'text-cyan-200'
}

// Handle Add/Remove Bet Slip
const handleOddsClick = (marketKey, optionKey, oddsValue, marketTitle) => {
  if (!matchData.value || !oddsValue) return
  const odds = parseFloat(oddsValue)
  if (isNaN(odds)) return

  const fullMarketKey = `${matchData.value.id}_${marketKey}_${optionKey}`
  const label = formatOptionLabel(optionKey, marketKey)

  betStore.addToSlip({
    matchId: matchData.value.id,
    matchName: `${matchData.value.homeTeam} vs ${matchData.value.awayTeam}`,
    market: marketTitle,
    pick: `${marketTitle} - ${label}`,
    marketKey: fullMarketKey,
    odds: odds,
  })
}

const getTeamInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const goBack = () => router.back()

onMounted(() => {
  if (matchStore.upcomingMatches.length === 0 && matchStore.liveMatches.length === 0) {
    matchStore.fetchAllMatches()
  }
})
</script>