<!-- OddsCard.vue -->
<template>
  <button
    type="button"
    class="flex flex-row items-center justify-between px-3 py-2.5 rounded border transition-all duration-200 min-w-[70px] cursor-pointer gap-2 select-none"
    :class="selected
      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300 shadow-lg shadow-yellow-400/10 ring-1 ring-yellow-400/50'
      : 'border-cyan-800/60 bg-cyan-900/30 text-cyan-400 hover:border-cyan-600 hover:bg-cyan-800/30'"
    @click="handleClick"
  >
    <span 
      class="text-xs font-semibold truncate transition-colors duration-150" 
      :class="selected ? 'text-yellow-300' : 'text-cyan-400'"
    >
      {{ label }}
    </span>
    <span 
      class="text-xs font-black font-mono transition-colors duration-150" 
      :class="selected ? 'text-yellow-300' : 'text-cyan-200'"
    >
      {{ Number(odds).toFixed(2) }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  label:    { type: String, required: true },
  odds:     { type: [String, Number], required: true },
  selected: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

function handleClick(event) {
  // Zuia event isiende kwenye parent (MatchCard goToDetail)
  event.stopPropagation()
  emit('click', event)
}
</script>