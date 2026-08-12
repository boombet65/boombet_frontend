<template>
    <div class="max-w-7xl mx-auto px-4 py-6">
  
      <h1 class="text-2xl font-black text-cyan-100 mb-2">🎲 Casino</h1>
      <p class="text-sm text-cyan-600 mb-6">Play the best casino games with real-time results</p>
  
      <!-- Category filter -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2" style="scrollbar-width:none;">
        <button v-for="cat in categories" :key="cat.key"
                class="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
                :class="activeCategory === cat.key
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-cyan-800 bg-cyan-900/20 text-cyan-500 hover:border-cyan-600'"
                @click="activeCategory = cat.key">
          {{ cat.icon }} {{ cat.label }}
        </button>
      </div>
  
      <!-- Featured: Aviator banner -->
      <RouterLink to="/casino/aviator"
        class="flex items-center gap-4 p-5 rounded-2xl mb-6 hover:opacity-90 transition-opacity"
        style="background: linear-gradient(135deg, #0d1f35, #1a0a2e);">
        <span class="text-5xl" style="animation: aviator-fly 2s ease-in-out infinite;">✈️</span>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-lg font-black text-white">Aviator</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">🔥 HOT</span>
          </div>
          <p class="text-sm text-cyan-500">Watch the multiplier fly — cash out before it crashes!</p>
        </div>
        <span class="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 flex-shrink-0">Play</span>
      </RouterLink>
  
      <!-- Games grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <GameCard v-for="game in games" :key="game.id" :game="game" @click="openGame" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import GameCard from '../../components/casino/GameCard.vue'
  
  const activeCategory = ref('all')
  const categories = [
    { key: 'all',       label: 'All Games', icon: '🎮' },
    { key: 'slots',     label: 'Slots',     icon: '🎰' },
    { key: 'table',     label: 'Table',     icon: '🃏' },
    { key: 'live',      label: 'Live',      icon: '📡' },
    { key: 'crash',     label: 'Crash',     icon: '📈' },
  ]
  
  const games = ref([
    { id: 1,  name: 'Aviator',       provider: 'Spribe',      emoji: '✈️', gradient: 'linear-gradient(135deg,#0d1f35,#1a0a2e)', hot: true,  isNew: false },
    { id: 2,  name: 'Lucky Dice',    provider: 'Evolution',   emoji: '🎲', gradient: 'linear-gradient(135deg,#1a0033,#0d0020)', hot: false, isNew: true  },
    { id: 3,  name: 'Blackjack',     provider: 'NetEnt',      emoji: '🃏', gradient: 'linear-gradient(135deg,#001a0d,#003319)', hot: false, isNew: false },
    { id: 4,  name: 'Roulette',      provider: 'Evolution',   emoji: '🎡', gradient: 'linear-gradient(135deg,#1a0000,#330000)', hot: true,  isNew: false },
    { id: 5,  name: 'Book of Ra',    provider: 'Novomatic',   emoji: '📖', gradient: 'linear-gradient(135deg,#1a1000,#2a1a00)', hot: false, isNew: false },
    { id: 6,  name: 'Mines',         provider: 'Spribe',      emoji: '💣', gradient: 'linear-gradient(135deg,#001a1a,#002a2a)', hot: false, isNew: true  },
    { id: 7,  name: 'Plinko',        provider: 'Spribe',      emoji: '🎯', gradient: 'linear-gradient(135deg,#0d003d,#1a0066)', hot: false, isNew: true  },
    { id: 8,  name: 'Dragon Tiger',  provider: 'Evolution',   emoji: '🐉', gradient: 'linear-gradient(135deg,#1a0000,#2a0000)', hot: true,  isNew: false },
    { id: 9,  name: 'Baccarat',      provider: 'Evolution',   emoji: '🎴', gradient: 'linear-gradient(135deg,#001a00,#002a00)', hot: false, isNew: false },
    { id: 10, name: 'Sweet Bonanza', provider: 'Pragmatic',   emoji: '🍬', gradient: 'linear-gradient(135deg,#1a003d,#2a0066)', hot: false, isNew: false },
  ])
  
  function openGame(game) {
    console.log('Open game:', game.name)
    // TODO: navigate to game or open in modal
  }
  </script>