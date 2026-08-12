<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.self="$emit('close')">
    <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg sm:text-xl font-bold text-white">Fixture Details</h3>
          <p class="text-cyan-400 text-sm">{{ fixture?.home_team }} vs {{ fixture?.away_team }}</p>
        </div>
        <button @click="$emit('close')" class="text-cyan-400 hover:text-white text-2xl">×</button>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <DetailItem label="Match Code" :value="fixture?.match_code" />
        <DetailItem label="Status">
          <span class="px-2 py-1 rounded-full text-xs font-medium" :class="statusClass">
            {{ getStatusIcon(fixture?.status) }} {{ fixture?.status }}
          </span>
        </DetailItem>
        <DetailItem label="League" :value="fixture?.league || 'N/A'" />
        <DetailItem label="Date" :value="formatDate(fixture?.date)" />
        <DetailItem label="Time" :value="fixture?.time" />
        <DetailItem label="Current Score" :value="`${fixture?.current_score?.home || 0} - ${fixture?.current_score?.away || 0}`" />
        
        <!-- ============ ODDS - FIXED ============ -->
        <div class="col-span-1 sm:col-span-2">
          <h4 class="text-cyan-400 text-sm font-semibold mb-2">Odds</h4>
          <div class="grid grid-cols-3 gap-3 sm:gap-4 bg-slate-900/50 rounded-xl p-3 sm:p-4">
            <div class="text-center">
              <p class="text-emerald-400 font-bold text-lg sm:text-xl">{{ fixture?.odds?.['1X2']?.['1'] ?? 'N/A' }}</p>
              <p class="text-cyan-600 text-[10px] sm:text-xs">Home (1)</p>
            </div>
            <div class="text-center">
              <p class="text-yellow-400 font-bold text-lg sm:text-xl">{{ fixture?.odds?.['1X2']?.['X'] ?? 'N/A' }}</p>
              <p class="text-cyan-600 text-[10px] sm:text-xs">Draw (X)</p>
            </div>
            <div class="text-center">
              <p class="text-red-400 font-bold text-lg sm:text-xl">{{ fixture?.odds?.['1X2']?.['2'] ?? 'N/A' }}</p>
              <p class="text-cyan-600 text-[10px] sm:text-xs">Away (2)</p>
            </div>
          </div>
        </div>

        <!-- ============ PREDETERMINED SCRIPT - FINAL SCORES ONLY ============ -->
        <div class="col-span-1 sm:col-span-2" v-if="fixture?.predetermined_script">
          <h4 class="text-cyan-400 text-sm font-semibold mb-2">Match Results</h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/50 rounded-xl p-3 sm:p-4">
            <!-- Full Time -->
            <div class="text-center">
              <p class="text-white font-bold text-lg sm:text-xl">
                {{ fixture.predetermined_script?.final_ft?.homeScore || 0 }} - {{ fixture.predetermined_script?.final_ft?.awayScore || 0 }}
              </p>
              <p class="text-cyan-600 text-[10px] sm:text-xs">Full Time</p>
            </div>
            <!-- Half Time -->
            <div class="text-center">
              <p class="text-yellow-400 font-bold text-lg sm:text-xl">
                {{ fixture.predetermined_script?.final_ht?.homeScore || 0 }} - {{ fixture.predetermined_script?.final_ht?.awayScore || 0 }}
              </p>
              <p class="text-cyan-600 text-[10px] sm:text-xs">Half Time</p>
            </div>
            <!-- Second Half -->
            <div class="text-center">
              <p class="text-emerald-400 font-bold text-lg sm:text-xl">
                {{ fixture.predetermined_script?.second_half?.homeScore || 0 }} - {{ fixture.predetermined_script?.second_half?.awayScore || 0 }}
              </p>
              <p class="text-cyan-600 text-[10px] sm:text-xs">Second Half</p>
            </div>
          </div>

          <!-- Extra Time -->
          <div v-if="fixture.predetermined_script?.extra_time_mins" class="mt-3 grid grid-cols-2 gap-3 bg-slate-900/30 rounded-xl p-3">
            <div class="text-center">
              <p class="text-cyan-300 font-bold text-sm">FT: {{ fixture.predetermined_script?.extra_time_mins?.ft || 0 }} min</p>
              <p class="text-cyan-600 text-[10px]">Extra Time (FT)</p>
            </div>
            <div class="text-center">
              <p class="text-cyan-300 font-bold text-sm">HT: {{ fixture.predetermined_script?.extra_time_mins?.ht || 0 }} min</p>
              <p class="text-cyan-600 text-[10px]">Extra Time (HT)</p>
            </div>
          </div>

          <!-- Goals -->
          <div class="mt-3 grid grid-cols-2 gap-3 bg-slate-900/30 rounded-xl p-3">
            <div class="text-center">
              <p class="text-emerald-400 font-bold text-sm">
                {{ fixture.predetermined_script?.first_goal_by === 'home' ? '🏠 Home' : 
                   fixture.predetermined_script?.first_goal_by === 'away' ? '✈️ Away' : '❌ None' }}
              </p>
              <p class="text-cyan-600 text-[10px]">First Goal</p>
            </div>
            <div class="text-center">
              <p class="text-red-400 font-bold text-sm">
                {{ fixture.predetermined_script?.last_goal_by === 'home' ? '🏠 Home' : 
                   fixture.predetermined_script?.last_goal_by === 'away' ? '✈️ Away' : '❌ None' }}
              </p>
              <p class="text-cyan-600 text-[10px]">Last Goal</p>
            </div>
          </div>

          <!-- Stats -->
          <div v-if="fixture.predetermined_script?.stats" class="mt-3">
            <h5 class="text-cyan-400 text-xs font-semibold mb-2">Match Stats</h5>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/30 rounded-xl p-3">
              <div class="text-center">
                <p class="text-white font-bold text-sm">{{ fixture.predetermined_script?.stats?.corners?.home || 0 }} - {{ fixture.predetermined_script?.stats?.corners?.away || 0 }}</p>
                <p class="text-cyan-600 text-[10px]">Corners</p>
              </div>
              <div class="text-center">
                <p class="text-yellow-400 font-bold text-sm">{{ fixture.predetermined_script?.stats?.yellow_cards?.home || 0 }} - {{ fixture.predetermined_script?.stats?.yellow_cards?.away || 0 }}</p>
                <p class="text-cyan-600 text-[10px]">Yellow Cards</p>
              </div>
              <div class="text-center">
                <p class="text-red-400 font-bold text-sm">{{ fixture.predetermined_script?.stats?.red_cards?.home || 0 }} - {{ fixture.predetermined_script?.stats?.red_cards?.away || 0 }}</p>
                <p class="text-cyan-600 text-[10px]">Red Cards</p>
              </div>
              <div class="text-center">
                <p class="text-emerald-400 font-bold text-sm">{{ fixture.predetermined_script?.stats?.shots_on_target?.home || 0 }} - {{ fixture.predetermined_script?.stats?.shots_on_target?.away || 0 }}</p>
                <p class="text-cyan-600 text-[10px]">Shots on Target</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Timestamps -->
        <DetailItem label="Created At" :value="formatDateTime(fixture?.createdAt)" />
        <DetailItem label="Updated At" :value="formatDateTime(fixture?.updatedAt)" />
      </div>

      <!-- Close Button -->
      <div class="flex justify-end gap-3 pt-4 border-t border-cyan-800/30 mt-4">
        <button @click="$emit('close')" class="px-6 py-2.5 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600 text-sm">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DetailItem from './DetailItem.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  fixture: { type: Object, default: null }
})

defineEmits(['update:modelValue', 'close'])

const statusClass = computed(() => {
  const map = {
    UPCOMING: 'bg-emerald-500/20 text-emerald-400',
    LIVE: 'bg-red-500/20 text-red-400',
    FINISHED: 'bg-slate-500/20 text-slate-400',
    CANCELLED: 'bg-red-500/20 text-red-400'
  }
  return map[props.fixture?.status] || 'bg-slate-500/20 text-slate-400'
})

function formatDate(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString('en-TZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleString('en-TZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getStatusIcon(status) {
  const icons = { UPCOMING: '🟢', LIVE: '🔴', FINISHED: '⚪', CANCELLED: '❌' }
  return icons[status] || '⚪'
}
</script>