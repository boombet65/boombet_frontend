<template>
    <div class="max-w-5xl mx-auto px-4 py-6">
      <h1 class="text-2xl font-black text-cyan-100 mb-2">🎁 Promotions</h1>
      <p class="text-sm text-cyan-600 mb-6">Exclusive offers and bonuses for BoomBet players</p>
  
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="promo in promotions" :key="promo.id"
             class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl overflow-hidden hover:border-cyan-600/60 transition-all group">
  
          <!-- Banner -->
          <div class="h-32 flex items-center justify-center text-6xl relative"
               :style="{ background: promo.gradient }">
            {{ promo.emoji }}
            <span v-if="promo.tag"
                  class="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black"
                  :class="promo.tag === 'NEW' ? 'bg-blue-500/80 text-white' : 'bg-red-500/80 text-white'">
              {{ promo.tag }}
            </span>
          </div>
  
          <div class="p-4">
            <h3 class="text-base font-black text-cyan-100 mb-1">{{ promo.title }}</h3>
            <p class="text-xs text-cyan-600 mb-4">{{ promo.desc }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-cyan-700">Expires: {{ promo.expires }}</span>
              <button class="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 hover:opacity-90 transition-opacity">
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const promotions = [
    { id: 1, emoji: '🎯', title: 'Welcome Bonus 100%', desc: 'Get 100% bonus on your first deposit up to TZS 5,000', gradient: 'linear-gradient(135deg,#001a33,#002a4d)', tag: 'NEW', expires: '31 Dec 2025' },
    { id: 2, emoji: '⚽', title: 'Acca Boost 50%',     desc: 'Get up to 50% extra winnings on all accumulator bets', gradient: 'linear-gradient(135deg,#001a0d,#002a1a)', tag: null, expires: 'Ongoing' },
    { id: 3, emoji: '💸', title: 'Free Bet Friday',    desc: 'Every Friday receive a free TZS 200 bet — no deposit needed', gradient: 'linear-gradient(135deg,#1a0033,#2a0066)', tag: 'HOT', expires: 'Every Friday' },
    { id: 4, emoji: '🏆', title: 'Weekly Cashback',    desc: 'Get 10% cashback on your weekly losses every Monday', gradient: 'linear-gradient(135deg,#1a1200,#2a1f00)', tag: null, expires: 'Ongoing' },
    { id: 5, emoji: '✈️', title: 'Aviator Promo',      desc: 'Play Aviator and get a free spin worth TZS 100', gradient: 'linear-gradient(135deg,#0d1f35,#1a0a2e)', tag: 'NEW', expires: '15 Jan 2026' },
    { id: 6, emoji: '👥', title: 'Refer a Friend',     desc: 'Earn TZS 500 for every friend you refer who deposits', gradient: 'linear-gradient(135deg,#001a1a,#003333)', tag: null, expires: 'Ongoing' },
  ]
  </script>