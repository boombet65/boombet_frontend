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

    <!-- Loading State -->
    <div v-if="matchStore.loading" class="text-center py-10">
      <p class="text-cyan-400 font-semibold animate-pulse">Inapakia Mechi...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="matchStore.error" class="bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm">
      {{ matchStore.error }}
    </div>

    <!-- Matches -->
    <div v-else-if="formattedMatches.length > 0" class="space-y-6">
      <div v-for="league in groupedMatches" :key="league.name">
        <!-- League header -->
        <div class="flex items-center gap-2 mb-3">
          <span class="text-sm">🏆</span>
          <h3 class="text-sm font-bold text-cyan-400">{{ league.name }}</h3>
          <div class="flex-1 h-px bg-cyan-800/40"></div>
          <span class="text-xs text-cyan-700">{{ league.matches.length }} matches</span>
        </div>
        <div class="grid gap-3 sm:grid-cols-1 xl:grid-cols-1">
          <MatchCard 
            v-for="match in league.matches" 
            :key="match.id" 
            :match="match"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState icon="⚽" title="No matches available" description="Check back later for upcoming matches" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import MatchCard from '../../components/betting/MatchCard.vue'
import EmptyState from '../../components/shared/EmptyState.vue'
import { useMatchStore } from '../../stores/match/useMatchStore.js'

const matchStore = useMatchStore()

const activeSport = ref('football')

const sports = [
  { key: 'football',   label: 'Football',   icon: '⚽' },
  { key: 'basketball', label: 'Basketball', icon: '🏀' },
  { key: 'tennis',     label: 'Tennis',     icon: '🎾' },
  { key: 'cricket',    label: 'Cricket',    icon: '🏏' },
  { key: 'rugby',      label: 'Rugby',      icon: '🏉' },
]

// Helper Function: Kubadilisha Muundo wa DB kwenda kwenye Muundo unaosomwa na MatchCard.vue
// Helper Function: Kubadilisha Muundo wa DB kwenda kwenye Muundo unaosomwa na MatchCard.vue
const formatMatchForCard = (dbMatch) => {
  const odds1X2 = dbMatch.odds?.['1X2'] || {}

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayName = days[date.getDay()]
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${dayName} ${day}/${month}`
  }

  // Format time with AM/PM
  const formatTimeWithAMPM = (timeStr) => {
    if (!timeStr) return ''
    
    const [hours, minutes] = timeStr.split(':').map(Number)
    if (isNaN(hours) || isNaN(minutes)) return timeStr
    
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 || 12
    return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`
  }

  // Kama ni LIVE - onyesha dakika
  // Kama ni UPCOMING - onyesha time na date: "07:00 PM Sat 08/08"
  let displayTime = ''
  if (dbMatch.status === 'LIVE') {
    displayTime = dbMatch.elapsed_minute ? `${dbMatch.elapsed_minute}'` : 'LIVE'
  } else {
    const dateStr = formatDate(dbMatch.date)
    const timeStr = formatTimeWithAMPM(dbMatch.time)
    // TIME KWANZA THEN DATE: "07:00 PM Sat 08/08"
    displayTime = timeStr && dateStr ? `${timeStr} ${dateStr}` : (timeStr || dateStr || '')
  }

  console.log('📅 Match:', dbMatch.home_team, 'vs', dbMatch.away_team)
  console.log('📅 Status:', dbMatch.status)
  console.log('📅 Display Time:', displayTime)

  return {
    id: dbMatch.id,
    league: dbMatch.league || 'General League',
    time: displayTime,  // ← HAPA INAONYESHA "07:00 PM Sat 08/08"
    homeTeam: dbMatch.home_team,
    date: dbMatch.date || '',
    awayTeam: dbMatch.away_team,
    live: dbMatch.status === 'LIVE',
    score: {
      home: dbMatch.current_score?.home ?? 0,
      away: dbMatch.current_score?.away ?? 0
    },
    odds: [
      { key: '1', label: '1', value: odds1X2['1'] ?? 1.00 },
      { key: 'X', label: 'X', value: odds1X2['X'] ?? 1.00 },
      { key: '2', label: '2', value: odds1X2['2'] ?? 1.00 }
    ]
  }
}

// Computed Property - All matches formatted
const formattedMatches = computed(() => {
  // Combine both upcoming and live matches
  const allMatches = [...matchStore.upcomingMatches, ...matchStore.liveMatches]
  return allMatches.map(formatMatchForCard)
})

// Group matches by league
const groupedMatches = computed(() => {
  const groups = {}
  formattedMatches.value.forEach(m => {
    if (!groups[m.league]) groups[m.league] = { name: m.league, matches: [] }
    groups[m.league].matches.push(m)
  })
  return Object.values(groups)
})

// Fetch Matches & Connect Socket Lifecycle Hooks
onMounted(() => {
  matchStore.fetchAllMatches()
  matchStore.initMatchSocket()
})

onUnmounted(() => {
  matchStore.disconnectSocket()
})
</script>