<template>
  <div>
    <label class="text-xs sm:text-sm block mb-1" :class="colorClass">{{ label }}</label>
    <input 
      :value="modelValue"
      type="number"
      step="0.01"
      @input="$emit('update:modelValue', Number($event.target.value))"
      class="w-full px-3 sm:px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: Number,
    default: null
  },
  color: {
    type: String,
    default: 'cyan'
  }
})

defineEmits(['update:modelValue'])

const colorClass = computed(() => {
  const map = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400'
  }
  return map[props.color] || 'text-cyan-400'
})
</script>