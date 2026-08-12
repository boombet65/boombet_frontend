<template>
    <div class="min-h-screen flex flex-col items-center justify-center px-4 text-center"
         style="background: var(--grad-hero, linear-gradient(135deg,#020c14,#0d2d40));">
      <div class="text-8xl mb-6">🏟️</div>
      <h1 class="text-6xl font-black text-cyan-100 mb-3">404</h1>
      <p class="text-xl font-bold text-cyan-400 mb-2">Page Not Found</p>
      <p class="text-sm text-cyan-600 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <div class="flex gap-3">
        <RouterLink to="/" class="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 hover:opacity-90 transition-opacity">
          Go Home
        </RouterLink>
        <RouterLink to="/sports" class="px-6 py-2.5 rounded-xl font-bold text-sm border border-cyan-700 text-cyan-300 hover:border-cyan-500 transition-all">
          Bet Now
        </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  </script>