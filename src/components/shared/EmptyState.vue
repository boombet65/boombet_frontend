<template>
    <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div class="text-5xl mb-4">{{ icon }}</div>
      <h3 class="text-lg font-bold text-cyan-200 mb-2">{{ title }}</h3>
      <p class="text-sm text-cyan-600 mb-6 max-w-xs">{{ description }}</p>
      <RouterLink v-if="actionTo" :to="actionTo"
        class="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 hover:opacity-90 transition-opacity">
        {{ actionLabel }}
      </RouterLink>
    </div>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  defineProps({
    icon:        { type: String, default: '📭' },
    title:       { type: String, default: 'Nothing here' },
    description: { type: String, default: '' },
    actionTo:    { type: String, default: '' },
    actionLabel: { type: String, default: 'Get Started' },
  })
  </script>