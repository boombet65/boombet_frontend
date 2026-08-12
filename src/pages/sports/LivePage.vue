
// src/pages/sports/LivePage.vue 
<template>
  <div class="max-w-7xl mx-auto px-0 py-6">

    <div class="flex items-center gap-3 mb-6 px-2">
      <span class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
      <h1 class="text-2xl font-black text-cyan-100">Live </h1>
      <span class="px-2.5 py-1 rounded-full text-xs font-black bg-red-500/15 text-red-400 border border-red-500/25">
        {{ formattedLiveMatches.length }} LIVE
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="matchStore.loading" class="text-center py-10">
      <p class="text-cyan-400 font-semibold animate-pulse">Inapakia Mechi za Live...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="matchStore.error" class="bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm">
      {{ matchStore.error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="formattedLiveMatches.length === 0">
      <EmptyState icon="📡" title="No live matches" description="Live matches will appear here when they start" />
    </div>

    <!-- Live Matches List -->
    <div v-else class="grid gap-4 sm:grid-cols-1 xl:grid-cols-1">
      <MatchCard v-for="match in formattedLiveMatches" :key="match.id" :match="match" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import MatchCard from '../../components/betting/MatchCard.vue'
import EmptyState from '../../components/shared/EmptyState.vue'
import { useMatchStore } from '../../stores/match/useMatchStore.js'

const matchStore = useMatchStore()

// Helper Function: Kubadilisha Muundo wa DB kwenda kwenye Muundo unaosomwa na MatchCard.vue
const formatMatchForCard = (dbMatch) => {
  const odds1X2 = dbMatch.odds?.['1X2'] || {}

  // ✅ FUNCTION KUPATA DAKIKA KUTOKA EVENTS
  const getCurrentMinuteFromEvents = (match) => {
    if (!match?.predetermined_script?.events_timeline) return null
    
    const events = match.predetermined_script.events_timeline
    
    // Kama match iko LIVE, chukua event ya mwisho
    if (match.status === 'LIVE') {
      // Chukua event ya mwisho iliyorekodiwa
      const lastEvent = events[events.length - 1]
      if (lastEvent && lastEvent.minute !== undefined) {
        return lastEvent.minute
      }
    }
    
    return null
  }

  // ✅ PATA DAKIKA KWA LIVE MATCH
  let displayTime = ''
  if (dbMatch.status === 'LIVE') {
    // Jaribu kupata dakika kutoka events
    const currentMinute = getCurrentMinuteFromEvents(dbMatch)
    
    // Kama hakuna events, tumia elapsed_minute ikiwa ipo
    if (currentMinute !== null) {
      displayTime = `${currentMinute}'`
    } else if (dbMatch.elapsed_minute) {
      displayTime = `${dbMatch.elapsed_minute}'`
    } else {
      displayTime = 'LIVE'
    }
  } else {
    // Upcoming: onyesha time tu
    displayTime = dbMatch.time || ''
  }

  // ✅ LOG kwa ajili ya debugging
  console.log('📅 Live Match:', dbMatch.home_team, 'vs', dbMatch.away_team)
  console.log('📅 Status:', dbMatch.status)
  console.log('📅 Events Timeline:', dbMatch.predetermined_script?.events_timeline?.length || 0)
  console.log('📅 Display Time:', displayTime)

  return {
    id: dbMatch.id,
    league: dbMatch.league || 'General League',
    time: displayTime,  // ← HAPA ITAONESHA DAKIKA KUTOKA EVENTS
    homeTeam: dbMatch.home_team,
    awayTeam: dbMatch.away_team,
    live: dbMatch.status === 'LIVE',
    status: dbMatch.status,
    predetermined_script: dbMatch.predetermined_script, // ✅ PITISHA SCRIPT
    elapsed_minute: dbMatch.elapsed_minute,
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

// Computed Property - Live matches only
const formattedLiveMatches = computed(() => {
  return matchStore.liveMatches.map(formatMatchForCard)
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