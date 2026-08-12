<!-- VirtualBetCard.vue  -->
<template>
    <div class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-4 hover:border-cyan-700/50 transition-all">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div>
          <p class="text-[11px] text-cyan-600 font-mono mb-1">#{{ bet.id }}</p>
          <p class="text-sm font-bold text-cyan-100">{{ bet.sport }}</p>
          <p class="text-[11px] text-cyan-600 mt-0.5">{{ formatDate(bet.createdAt) }}</p>
        </div>
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
              :class="bet.result === 'won'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : bet.result === 'lost'
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'">
          {{ bet.result === 'won' ? '✅ Won' : bet.result === 'lost' ? '❌ Lost' : '⏳ Pending' }}
        </span>
      </div>
      <p class="text-xs text-cyan-400 mb-3 truncate">{{ bet.matchName }}</p>
      <div class="flex items-center justify-between pt-3 border-t border-cyan-800/40 text-xs">
        <div><span class="text-cyan-600">Stake </span><span class="font-bold text-cyan-200 font-mono">KES {{ formatMoney(bet.stake) }}</span></div>
        <div><span class="text-cyan-600">Odds </span><span class="font-bold text-yellow-400 font-mono">{{ bet.odds }}</span></div>
        <div><span class="font-bold font-mono" :class="bet.result === 'won' ? 'text-emerald-400' : 'text-cyan-600'">KES {{ formatMoney(bet.payout) }}</span></div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({ bet: { type: Object, required: true } })
  function formatMoney(n) { return new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(n || 0) }
  function formatDate(d) { if (!d) return ''; return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) }
  </script>