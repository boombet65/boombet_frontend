<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.self="$emit('close')">
    <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-4 sm:p-6 w-full max-w-md">
      <h3 class="text-lg sm:text-xl font-bold text-white mb-2">Update Odds</h3>
      <p class="text-cyan-400 text-sm mb-4">{{ fixture?.home_team }} vs {{ fixture?.away_team }}</p>
      
      <div class="space-y-3 sm:space-y-4">
        <OddsField label="Home (1)" v-model="form.home" color="emerald" />
        <OddsField label="Draw (X)" v-model="form.draw" color="yellow" />
        <OddsField label="Away (2)" v-model="form.away" color="red" />
        
        <div class="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-2">
          <button @click="submit" class="flex-1 py-2.5 sm:py-3 bg-yellow-500 text-slate-900 rounded-xl font-bold hover:bg-yellow-400 text-sm sm:text-base" :disabled="loading">
            Update Odds
          </button>
          <button @click="$emit('close')" class="flex-1 py-2.5 sm:py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600 text-sm sm:text-base">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import OddsField from './OddsField.vue'

const props = defineProps({
  modelValue: Boolean,
  fixture: Object,
  loading: Boolean
})

const emit = defineEmits(['update:modelValue', 'update', 'close'])

const form = ref({ home: null, draw: null, away: null })

watch(() => props.fixture, (newVal) => {
  if (newVal) {
    const o = newVal.odds?.['1X2'] || newVal.odds || {}
    form.value = {
      home: o.home || null,
      draw: o.draw || null,
      away: o.away || null
    }
  }
}, { immediate: true })

function submit() {
  emit('update', form.value)
}
</script>