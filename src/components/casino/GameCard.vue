<template>
    <div class="group relative bg-cyan-900/20 border border-cyan-800/40 rounded-2xl overflow-hidden hover:border-cyan-600/60 transition-all duration-300 cursor-pointer"
         @click="$emit('click', game)">
  
      <!-- Thumbnail -->
      <div class="aspect-video bg-gradient-to-br flex items-center justify-center text-5xl"
           :style="{ background: game.gradient || 'linear-gradient(135deg, #0d3347, #0e7490)' }">
        {{ game.emoji }}
      </div>
  
      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span class="px-5 py-2 rounded-xl font-bold text-sm bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950">
          Play Now
        </span>
      </div>
  
      <!-- Badges -->
      <div class="absolute top-2 left-2 flex gap-1">
        <span v-if="game.hot" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-500/90 text-white">HOT</span>
        <span v-if="game.isNew" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/90 text-white">NEW</span>
      </div>
  
      <!-- Info -->
      <div class="p-3">
        <p class="text-sm font-bold text-cyan-100 truncate">{{ game.name }}</p>
        <p class="text-[11px] text-cyan-600 mt-0.5">{{ game.provider }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({ game: { type: Object, required: true } })
  defineEmits(['click'])
  </script>