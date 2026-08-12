<template>
  <button 
    class="p-1 hover:opacity-70 transition-opacity"
    :class="colorClass"
    @click="$emit('click')"
    :title="title"
  >
    <span class="text-base">{{ icon }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'white'
  },
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])

const colorClass = computed(() => {
  const map = {
    yellow: 'text-yellow-400 hover:text-yellow-300',
    cyan: 'text-cyan-400 hover:text-cyan-300',
    emerald: 'text-emerald-400 hover:text-emerald-300',
    red: 'text-red-400 hover:text-red-300',
    white: 'text-white hover:text-cyan-300'
  }
  return map[props.color] || 'text-white'
})
</script>