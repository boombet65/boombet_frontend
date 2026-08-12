
<!-- OddsCard.vue -->
<template>
    <button
      class="flex flex-row items-center justify-between px-3 py-2.5 rounded-sm border  transition-all duration-150 min-w-[70px] cursor-pointer"
      :class="selected
        ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/10'
        : 'border-cyan-800/60 bg-cyan-900/30 hover:border-cyan-600 hover:bg-cyan-800/30'"
      @click="$emit('click')"
    >
      <span class="text-sm font-semibold text-cyan-600 mb-1 truncate w-full text-center">{{ label }}</span>
      <span class="text-sm font-black font-mono" :class="selected ? 'text-yellow-400' : 'text-cyan-200'">
        {{ odds }}
      </span>
    </button>
  </template>
  
  <script setup>
  defineProps({
    label:    { type: String, required: true },
    odds:     { type: [String, Number], required: true },
    selected: { type: Boolean, default: false },
  })
  defineEmits(['click'])
  </script>