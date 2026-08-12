<template>
  <div>
    <div class="mb-4">
      <label class="text-cyan-400 text-xs sm:text-sm block mb-1.5">Number of matches to add</label>
      <div class="flex flex-wrap gap-2 sm:gap-3">
        <input 
          v-model.number="count"
          type="number"
          min="1"
          max="20"
          class="w-20 sm:w-32 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
        />
        <button 
          @click="addMatches"
          class="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500 text-slate-900 rounded-lg font-bold hover:bg-emerald-400 text-sm"
        >
          Generate
        </button>
      </div>
    </div>

    <div v-if="matches.length > 0" class="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
      <MatchFormRow 
        v-for="(match, index) in matches" 
        :key="index"
        :match="match"
        :index="index"
        @remove="$emit('remove', index)"
      />
    </div>

    <div v-if="matches.length > 0" class="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-4">
      <button 
        @click="submit"
        class="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-400 hover:to-emerald-500 text-sm sm:text-base"
        :disabled="loading"
      >
        {{ loading ? 'Saving...' : `Save ${matches.length} Matches` }}
      </button>
      <button 
        @click="$emit('clear')"
        class="px-4 py-2.5 sm:py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600 text-sm sm:text-base"
      >
        Clear All
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MatchFormRow from './MatchFormRow.vue'

const props = defineProps({
  matches: { type: Array, default: () => [] },
  loading: Boolean
})

const emit = defineEmits(['add', 'remove', 'clear', 'submit'])

const count = ref(5)

function addMatches() {
  const num = Math.min(count.value || 1, 20)
  emit('add', num)
}

function submit() {
  const invalid = props.matches.some(m => !m.home_team || !m.away_team || !m.date || !m.time)
  if (invalid) {
    alert('Please fill in all required fields (Home Team, Away Team, Date, Time) for each match')
    return
  }

  const data = props.matches.map(m => ({
    home_team: m.home_team,
    away_team: m.away_team,
    league: m.league || null,
    date: m.date,
    time: m.time,
    odds: {
      '1X2': {
        home: m.odds_home || null,
        draw: m.odds_draw || null,
        away: m.odds_away || null
      }
    },
    status: m.status || 'UPCOMING'
  }))

  emit('submit', data)
}
</script>