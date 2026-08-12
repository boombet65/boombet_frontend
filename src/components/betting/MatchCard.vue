<!-- MatchCard.vue -->
<template>
  <div class="bg-cyan-900/20 border-b border-cyan-800/40 p-2 hover:border-cyan-700/50 transition-all duration-200">

    <!-- Match Header & Teams -->
    <div @click="goToDetail" class="cursor-pointer p-1.5 rounded-lg transition-colors">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="text-xs text-cyan-600 font-medium">{{ match.league }}</span>
          <span v-if="isLive" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> LIVE
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[12px] text-cyan-500 font-bold">{{ match.time }}</span>
        </div>
      </div>

      <!-- Teams -->
      <div class="grid grid-cols-3 items-center gap-3 mb-1">
        <div class="text-left">
          <p class="text-sm font-bold text-cyan-100 truncate">{{ homeTeamName }}</p>
          <p v-if="isLive" class="text-xs font-black text-yellow-400 mt-1">{{ currentScore.home }}</p>
        </div>
        
        <div class="text-center">
          <span class="text-xs font-bold text-cyan-600 bg-transparent px-2 py-1 rounded-lg">VS</span>
        </div>
        
        <div class="text-right">
          <p class="text-sm font-bold text-cyan-100 truncate">{{ awayTeamName }}</p>
          <p v-if="isLive" class="text-xs font-black text-yellow-400 mt-1">{{ currentScore.away }}</p>
        </div>
      </div>
    </div>

    <!-- Odds Row -->
    <div class="flex gap-2 mt-1" v-if="formatted1X2Odds.length">
      <OddCard
        v-for="odd in formatted1X2Odds" 
        :key="odd.key"
        :label="odd.label"
        :odds="odd.value"
        :selected="betStore.isSelected(match.id, `${match.id}_1X2_${odd.key}`)"
        class="flex-1"
        @click.stop="selectOdd(odd)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import OddCard from './OddsCard.vue'
import { useBetStore } from '../../stores/bet/betStore.js'

const router = useRouter()
const betStore = useBetStore()
const props = defineProps({ match: { type: Object, required: true } })

// ============ FORMAT DATE ============
const formattedDate = computed(() => {
  const dateString = props.match.date
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayName = days[date.getDay()]
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  
  // LOG DATE
  console.log('📅 Original Date:', dateString)
  console.log('📅 Formatted Date:', `${dayName} ${day}/${month}`)
  
  return `${dayName} ${day}/${month}`
})
// =====================================

// Getters
const homeTeamName = computed(() => props.match.home_team || props.match.homeTeam)
const awayTeamName = computed(() => props.match.away_team || props.match.awayTeam)
const isLive = computed(() => props.match.status === 'LIVE' || props.match.live || false)
const currentScore = computed(() => props.match.current_score || props.match.score || { home: 0, away: 0 })

// Format 1X2 Odds
const formatted1X2Odds = computed(() => {
  if (!props.match?.odds) return []

  const odds1X2 = props.match.odds['1X2'] || props.match.odds

  if (Array.isArray(odds1X2)) return odds1X2

  const options = []
  if (odds1X2 && typeof odds1X2 === 'object') {
    if (odds1X2['1'] !== undefined) options.push({ key: '1', label: '1', value: odds1X2['1'] })
    if (odds1X2['X'] !== undefined) options.push({ key: 'X', label: 'X', value: odds1X2['X'] })
    if (odds1X2['2'] !== undefined) options.push({ key: '2', label: '2', value: odds1X2['2'] })
  }

  return options
})

function selectOdd(odd) {
  if (!props.match?.id || !odd.value) return

  const fullMarketKey = `${props.match.id}_1X2_${odd.key}`
  
  betStore.addToSlip({
    matchId:   props.match.id,
    matchName: `${homeTeamName.value} vs ${awayTeamName.value}`,
    market:    '1X2',
    pick:      odd.key,
    marketKey: fullMarketKey,
    odds:      parseFloat(odd.value),
  })
}

function goToDetail() {
  if (!props.match?.id) return

  router.push({
    name: 'sport-detail',
    params: { id: props.match.id }
  })
}
</script>