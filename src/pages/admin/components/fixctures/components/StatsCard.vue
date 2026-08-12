<template>
  <div class="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-cyan-800/30 p-3 sm:p-4" :class="customClass">
    <p class="text-cyan-400 text-[10px] sm:text-sm">{{ label }}</p>
    <p class="text-lg sm:text-2xl font-bold" :class="colorClass">{{ value }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  color: {
    type: String,
    default: 'cyan'
  },
  class: {
    type: String,
    default: ''
  }
})

const colorMap = {
  cyan: 'text-cyan-400',
  emerald: 'text-emerald-400',
  red: 'text-red-400',
  slate: 'text-slate-400',
  yellow: 'text-yellow-400'
}

const colorClass = computed(() => colorMap[props.color] || 'text-white')
const customClass = computed(() => props.class || '')
</script>