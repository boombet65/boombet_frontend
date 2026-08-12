<template>
    <div class="flex flex-col items-center justify-center gap-3" :class="fullscreen ? 'min-h-screen' : 'py-12'">
      <div class="rounded-full border-2 border-cyan-800 border-t-yellow-400 animate-spin"
           :class="sizeClass" />
      <p v-if="text" class="text-sm text-cyan-600 font-medium">{{ text }}</p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  const props = defineProps({
    size:       { type: String, default: 'md' }, // sm | md | lg
    text:       { type: String, default: '' },
    fullscreen: { type: Boolean, default: false },
  })
  const sizeClass = computed(() => ({
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[props.size]))
  </script>