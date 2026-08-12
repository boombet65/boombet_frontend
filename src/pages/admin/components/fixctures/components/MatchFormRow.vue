<template>
  <div class="bg-slate-900/50 rounded-xl border border-cyan-800/30 p-3 sm:p-4">
    <div class="flex justify-between items-center mb-2 sm:mb-3">
      <span class="text-cyan-400 text-xs sm:text-sm font-bold">Match #{{ index + 1 }}</span>
      <button @click="$emit('remove')" class="text-red-400 hover:text-red-300 text-xs sm:text-sm">✕ Remove</button>
    </div>

    <div class="grid grid-cols-2 gap-2 sm:gap-3">
      <FormField label="Home Team" v-model="match.home_team" placeholder="Home" />
      <FormField label="Away Team" v-model="match.away_team" placeholder="Away" />
      <FormField label="League" v-model="match.league" placeholder="League" />
      <FormField label="Date" v-model="match.date" type="date" />
      <FormField label="Time" v-model="match.time" type="time" />
      <FormField label="Odds Home" v-model.number="match.odds_home" type="number" placeholder="1.95" color="emerald" />
      <FormField label="Odds Draw" v-model.number="match.odds_draw" type="number" placeholder="3.20" color="yellow" />
      <FormField label="Odds Away" v-model.number="match.odds_away" type="number" placeholder="4.50" color="red" />
      <div class="col-span-2">
        <label class="text-cyan-400 text-[10px] sm:text-xs block mb-0.5">Status</label>
        <select v-model="match.status" class="w-full px-2 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-xs sm:text-sm">
          <option value="UPCOMING">🟢 Upcoming</option>
          <option value="LIVE">🔴 Live</option>
          <option value="FINISHED">⚪ Finished</option>
          <option value="CANCELLED">❌ Cancelled</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import FormField from './FormField.vue'

defineProps({
  match: { type: Object, required: true },
  index: Number
})

defineEmits(['remove'])
</script>