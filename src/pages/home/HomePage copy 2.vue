
// src/pages/home/HomePage.vue 
<template>
    <div class="min-h-screen">
  
      <!-- ── Hero ── -->
      <AutoPlay />
  
      <!-- ── Quick nav pills ── -->
      <section class="px-4 py-4 border-b border-cyan-800/40 overflow-x-auto" style="scrollbar-width:none;">
        <div class="flex gap-2 min-w-max mx-auto">
          <RouterLink v-for="cat in quickCats" :key="cat.label" :to="cat.to"
            class="flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-800/60 bg-cyan-900/20 text-sm font-semibold text-cyan-400 hover:border-cyan-600 hover:text-cyan-200 transition-all whitespace-nowrap">
            <span>{{ cat.icon }}</span>{{ cat.label }}
          </RouterLink>
        </div>
      </section>
  
      <div class="max-w-7xl mx-auto px-4 py-6 lg:px-8 space-y-8">
  
        <!-- ── Featured matches ── -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-black text-cyan-100">⚽ Featured Matches</h2>
            <RouterLink to="/sports" class="text-xs font-bold text-yellow-400 hover:text-yellow-300">View all →</RouterLink>
          </div>
          <div class="grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
            <MatchCard v-for="match in featuredMatches" :key="match.id" :match="match" />
          </div>
        </section>
  
        <!-- ── Live now ── -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-black text-cyan-100 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Now
            </h2>
            <RouterLink to="/sports/live" class="text-xs font-bold text-yellow-400 hover:text-yellow-300">View all →</RouterLink>
          </div>
          <div class="grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
            <MatchCard v-for="match in liveMatches" :key="match.id" :match="match" />
          </div>
        </section>
  
        <!-- ── Casino & Aviator promo ── -->
        <section class="grid sm:grid-cols-2 gap-4">
          <RouterLink to="/casino/aviator"
            class="relative overflow-hidden rounded-2xl p-6 block hover:opacity-90 transition-opacity"
            style="background: linear-gradient(135deg, #0d1f35, #1a0a2e);">
            <div class="absolute top-0 right-0 w-32 h-32 text-8xl leading-none opacity-20 select-none">✈️</div>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30 mb-3">🔥 HOT</span>
            <h3 class="text-xl font-black text-white mb-1">Aviator</h3>
            <p class="text-sm text-cyan-500 mb-4">Fly high, cash out before it crashes!</p>
            <span class="inline-flex px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950">Play Now</span>
          </RouterLink>
  
          <RouterLink to="/jackpot"
            class="relative overflow-hidden rounded-2xl p-6 block hover:opacity-90 transition-opacity"
            style="background: linear-gradient(135deg, #1a1200, #2a1f00);">
            <div class="absolute top-0 right-0 w-32 h-32 text-8xl leading-none opacity-20 select-none">💰</div>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 mb-3">JACKPOT</span>
            <h3 class="text-xl font-black text-yellow-300 mb-1">Win TZS 10M</h3>
            <p class="text-sm text-yellow-700 mb-4">Pick all 13 correct scores</p>
            <span class="inline-flex px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950">Play Jackpot</span>
          </RouterLink>
        </section>
  
        <!-- ── Promotions ── -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-black text-cyan-100">🎁 Promotions</h2>
            <RouterLink to="/promotions" class="text-xs font-bold text-yellow-400">View all →</RouterLink>
          </div>
          <div class="grid gap-3 sm:grid-cols-3">
            <div v-for="promo in promos" :key="promo.id"
                 class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-4 hover:border-cyan-600/60 transition-all">
              <span class="text-2xl">{{ promo.emoji }}</span>
              <h4 class="text-sm font-bold text-cyan-100 mt-2 mb-1">{{ promo.title }}</h4>
              <p class="text-xs text-cyan-600">{{ promo.desc }}</p>
            </div>
          </div>
        </section>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  import MatchCard from '../../components/betting/MatchCard.vue'
  import AutoPlay from './heroCards/AutoPlay.vue'
  
  const stats = [
    { value: '500K+', label: 'Active Users' },
    { value: '10K+',  label: 'Daily Matches' },
    { value: '98%',   label: 'Payout Rate' },
    { value: '24/7',  label: 'Support' },
  ]
  
  const quickCats = [
    { label: 'Football',  to: '/sports',          icon: '⚽' },
    { label: 'Live',      to: '/sports/live',      icon: '📡' },
    { label: 'Aviator',   to: '/casino/aviator',   icon: '✈️' },
    { label: 'Casino',    to: '/casino',           icon: '🎲' },
    { label: 'Virtuals',  to: '/virtuals',         icon: '🤖' },
    { label: 'Jackpot',   to: '/jackpot',          icon: '💰' },
  ]
  
  const featuredMatches = [
    { id: 1, league: 'Premier League', time: '20:00', homeTeam: 'Arsenal', awayTeam: 'Man City', live: false, odds: [{ key: '1', label: '1', value: 2.45 }, { key: 'X', label: 'X', value: 3.20 }, { key: '2', label: '2', value: 2.80 }] },
    { id: 2, league: 'La Liga',        time: '21:45', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', live: false, odds: [{ key: '1', label: '1', value: 2.10 }, { key: 'X', label: 'X', value: 3.40 }, { key: '2', label: '2', value: 3.20 }] },
    { id: 3, league: 'Serie A',        time: '19:30', homeTeam: 'Juventus', awayTeam: 'AC Milan', live: false, odds: [{ key: '1', label: '1', value: 1.95 }, { key: 'X', label: 'X', value: 3.50 }, { key: '2', label: '2', value: 3.80 }] },
  ]
  
  const liveMatches = [
    { id: 4, league: 'Champions League', time: "73'", homeTeam: 'Bayern', awayTeam: 'PSG', live: true, score: { home: 2, away: 1 }, odds: [{ key: '1', label: '1', value: 1.65 }, { key: 'X', label: 'X', value: 4.20 }, { key: '2', label: '2', value: 5.00 }] },
    { id: 5, league: 'Bundesliga',       time: "55'", homeTeam: 'Dortmund', awayTeam: 'Leipzig', live: true, score: { home: 1, away: 1 }, odds: [{ key: '1', label: '1', value: 2.30 }, { key: 'X', label: 'X', value: 3.10 }, { key: '2', label: '2', value: 2.90 }] },
  ]
  
  const promos = [
    { id: 1, emoji: '🎯', title: 'Welcome Bonus 100%', desc: 'Get 100% on your first deposit up to TZS 5,000' },
    { id: 2, emoji: '⚽', title: 'Acca Boost',          desc: 'Get up to 50% extra on accumulator wins' },
    { id: 3, emoji: '💸', title: 'Free Bet Friday',     desc: 'Every Friday get a TZS 200 free bet' },
  ]
  </script>