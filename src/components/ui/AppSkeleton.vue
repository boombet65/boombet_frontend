<template>
    <div
      class="animate-pulse rounded-lg bg-gradient-to-r from-cyan-900/60 via-cyan-800/40 to-cyan-900/60 bg-[length:200%_100%]"
      :style="{ width: width, height: height }"
      :class="rounded ? 'rounded-full' : 'rounded-lg'"
    />
  </template>
  
  <script setup>
  defineProps({
    width:   { type: String, default: '100%' },
    height:  { type: String, default: '16px' },
    rounded: { type: Boolean, default: false },
  })
  </script>