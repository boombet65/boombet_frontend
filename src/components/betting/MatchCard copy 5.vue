<!-- MatchCard.vue -->
<template>
  <div class="bg-cyan-900/20 border-b border-cyan-800/40 p-2 hover:border-cyan-700/50 transition-all duration-200">

    <!-- Match Header & Teams (Clickable area to navigate) -->
    <div @click="goToDetail" class="cursor-pointer hover:bg-cyan-900/30 p-1.5 rounded-lg transition-colors">
      <!-- Match header -->
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="text-xs text-cyan-600 font-medium">{{ match.league }}</span>
          <span v-if="match.live" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> LIVE
          </span>
        </div>
        <span class="text-[11px] text-cyan-600">{{ match.time }}</span>
      </div>

      <!-- Teams -->
      <div class="grid grid-cols-3 items-center gap-3 mb-1">
        <div class="text-left">
          <p class="text-sm font-bold text-cyan-100 truncate">{{ match.homeTeam }}</p>
          <p v-if="match.live" class="text-xs font-black text-yellow-400 mt-1">{{ match.score?.home }}</p>
        </div>
        
        <div class="text-center">
          <span class="text-xs font-bold text-cyan-600 bg-transparent px-2 py-1 rounded-lg">VS</span>
        </div>
        
        <div class="text-right">
          <p class="text-sm font-bold text-cyan-100 truncate">{{ match.awayTeam }}</p>
          <p v-if="match.live" class="text-xs font-black text-yellow-400 mt-1">{{ match.score?.away }}</p>
        </div>
      </div>
    </div>

    <!-- Odds row (Inajitegemea ili kuzuia kufungua detail page mtu akibonyeza odd) -->
    <div class="flex gap-2 mt-1">
      <OddCard
        v-for="odd in match.odds" 
        :key="odd.key"
        :label="odd.label"
        :odds="odd.value"
        :selected="betStore.isSelected(match.id, `${match.id}_${odd.key}`)"
        class="flex-1"
        @click.stop="selectOdd(odd)"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import OddCard from './OddsCard.vue'
import { useBetStore } from '../../stores/betStore.js'

const router = useRouter()
const betStore = useBetStore()
const props = defineProps({ match: { type: Object, required: true } })

const pickMap = {
  '1': '1X2 | Full Time - 1',
  'X': '1X2 | Full Time - X',
  '2': '1X2 | Full Time - 2',
}

function selectOdd(odd) {
  const marketKey = `${props.match.id}_${odd.key}`
  
  betStore.addToSlip({
    matchId:   props.match.id,
    matchName: `${props.match.homeTeam} vs ${props.match.awayTeam}`,
    market:    '1X2',
    pick:      pickMap[odd.key] ?? `1X2 | Full Time - ${odd.label}`,
    marketKey: marketKey,
    odds:      odd.value,
  })
}

// Inampeleka mchezaji kwenye SportDetailPage ikipitisha match ID au Object
function goToDetail() {
  if (!props.match?.id) return

  // Tumia direct URL path badala ya route name
  router.push(`/SportDetail/${props.match.id}`)
}
</script>