<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.self="$emit('close')">
    <div class="bg-slate-800 rounded-2xl border border-red-700 p-4 sm:p-6 w-full max-w-md">
      <h3 class="text-lg sm:text-xl font-bold text-red-400 mb-3">Delete Fixture</h3>
      <p class="text-white text-sm sm:text-base mb-1">Are you sure you want to delete this fixture?</p>
      <p class="text-cyan-400 text-sm mb-3">{{ fixture?.home_team }} vs {{ fixture?.away_team }}</p>
      <p class="text-red-400 text-xs sm:text-sm mb-4">⚠️ This action cannot be undone!</p>
      
      <div class="flex flex-col xs:flex-row gap-2 sm:gap-3">
        <button @click="$emit('confirm')" class="flex-1 py-2.5 sm:py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-400 text-sm sm:text-base" :disabled="loading">
          Delete
        </button>
        <button @click="$emit('close')" class="flex-1 py-2.5 sm:py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600 text-sm sm:text-base">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  fixture: Object,
  loading: Boolean
})

defineEmits(['update:modelValue', 'confirm', 'close'])
</script>