<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.self="$emit('close')">
    <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h3 class="text-lg sm:text-xl font-bold text-white mb-4">
        {{ editing ? 'Edit Fixture' : 'Create New Fixture' }}
      </h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Teams -->
        <div class="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label class="text-cyan-400 text-xs sm:text-sm block mb-1.5">Home Team *</label>
            <input 
              v-model="form.home_team"
              type="text"
              required
              placeholder="e.g. Man United"
              class="w-full px-3 sm:px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 placeholder-cyan-700 text-sm"
            />
          </div>
          <div>
            <label class="text-cyan-400 text-xs sm:text-sm block mb-1.5">Away Team *</label>
            <input 
              v-model="form.away_team"
              type="text"
              required
              placeholder="e.g. Liverpool"
              class="w-full px-3 sm:px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 placeholder-cyan-700 text-sm"
            />
          </div>
        </div>

        <!-- League -->
        <div>
          <label class="text-cyan-400 text-xs sm:text-sm block mb-1.5">League / Tournament</label>
          <input 
            v-model="form.league"
            type="text"
            placeholder="e.g. Premier League"
            class="w-full px-3 sm:px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 placeholder-cyan-700 text-sm"
          />
        </div>

        <!-- Date & Time -->
        <div class="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label class="text-cyan-400 text-xs sm:text-sm block mb-1.5">Date *</label>
            <input 
              v-model="form.date"
              type="date"
              required
              class="w-full px-3 sm:px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
            />
          </div>
          <div>
            <label class="text-cyan-400 text-xs sm:text-sm block mb-1.5">Time *</label>
            <input 
              v-model="form.time"
              type="time"
              required
              class="w-full px-3 sm:px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
            />
          </div>
        </div>

        <!-- Odds -->
        <div>
          <label class="text-cyan-400 text-xs sm:text-sm block mb-1.5">Odds (1X2)</label>
          <div class="grid grid-cols-3 gap-2 sm:gap-4">
            <div>
              <label class="text-emerald-400 text-[10px] sm:text-xs block mb-0.5">Home (1)</label>
              <input 
                v-model.number="form.odds_home"
                type="number"
                step="0.01"
                placeholder="1.95"
                class="w-full px-2 sm:px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
              />
            </div>
            <div>
              <label class="text-yellow-400 text-[10px] sm:text-xs block mb-0.5">Draw (X)</label>
              <input 
                v-model.number="form.odds_draw"
                type="number"
                step="0.01"
                placeholder="3.20"
                class="w-full px-2 sm:px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
              />
            </div>
            <div>
              <label class="text-red-400 text-[10px] sm:text-xs block mb-0.5">Away (2)</label>
              <input 
                v-model.number="form.odds_away"
                type="number"
                step="0.01"
                placeholder="4.50"
                class="w-full px-2 sm:px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="text-cyan-400 text-xs sm:text-sm block mb-1.5">Status</label>
          <select 
            v-model="form.status"
            class="w-full px-3 sm:px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
          >
            <option value="UPCOMING">🟢 Upcoming</option>
            <option value="LIVE">🔴 Live</option>
            <option value="FINISHED">⚪ Finished</option>
            <option value="CANCELLED">❌ Cancelled</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-4">
          <button 
            type="submit" 
            class="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 text-sm sm:text-base"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Save Fixture' }}
          </button>
          <button 
            type="button"
            @click="$emit('close')" 
            class="flex-1 py-2.5 sm:py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600 text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  editing: Boolean,
  fixture: Object,
  loading: Boolean
})

const emit = defineEmits(['update:modelValue', 'save', 'close'])

const form = ref({
  home_team: '',
  away_team: '',
  league: '',
  date: '',
  time: '',
  odds_home: null,
  odds_draw: null,
  odds_away: null,
  status: 'UPCOMING'
})

watch(() => props.fixture, (newVal) => {
  if (newVal) {
    form.value = {
      home_team: newVal.home_team || '',
      away_team: newVal.away_team || '',
      league: newVal.league || '',
      date: newVal.date || '',
      time: newVal.time || '',
      odds_home: newVal.odds?.['1X2']?.home || newVal.odds?.home || null,
      odds_draw: newVal.odds?.['1X2']?.draw || newVal.odds?.draw || null,
      odds_away: newVal.odds?.['1X2']?.away || newVal.odds?.away || null,
      status: newVal.status || 'UPCOMING'
    }
  }
}, { immediate: true })

function resetForm() {
  form.value = {
    home_team: '',
    away_team: '',
    league: '',
    date: '',
    time: '',
    odds_home: null,
    odds_draw: null,
    odds_away: null,
    status: 'UPCOMING'
  }
}

function handleSubmit() {
  const data = {
    home_team: form.value.home_team,
    away_team: form.value.away_team,
    league: form.value.league || null,
    date: form.value.date,
    time: form.value.time,
    odds: {
      '1X2': {
        home: form.value.odds_home || null,
        draw: form.value.odds_draw || null,
        away: form.value.odds_away || null
      }
    },
    status: form.value.status
  }
  emit('save', data)
}

// Reset form when modal closes
watch(() => props.modelValue, (val) => {
  if (!val) resetForm()
})
</script>