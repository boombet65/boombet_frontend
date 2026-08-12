<!-- JackpotBetCard.vue  -->
<template>
    <div class="bg-gradient-to-br from-yellow-950/40 to-cyan-950 border border-yellow-700/30 rounded-2xl p-4">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div>
          <p class="text-[11px] text-cyan-600 font-mono mb-1">#{{ bet.id }}</p>
          <p class="text-sm font-bold text-yellow-300">{{ bet.jackpotName }}</p>
          <p class="text-[11px] text-cyan-600 mt-0.5">{{ formatDate(bet.createdAt) }}</p>
        </div>
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
              :class="statusClass">
          {{ statusLabel }}
        </span>
      </div>
  
      <div class="flex items-center justify-between text-xs mt-3 pt-3 border-t border-yellow-800/30">
        <div>
          <span class="text-cyan-600">Entry </span>
          <span class="font-bold text-cyan-200 font-mono">KES {{ formatMoney(bet.stake) }}</span>
        </div>
        <div class="text-right">
          <span class="text-cyan-600">Prize Pool </span>
          <span class="font-bold text-yellow-400 font-mono">KES {{ formatMoney(bet.prizePool) }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  const props = defineProps({ bet: { type: Object, required: true } })
  
  const statusClass = computed(() => ({
    won:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    lost:    'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  }[props.bet.result] || 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'))
  
  const statusLabel = computed(() => ({
    won: '🏆 Won', lost: '❌ Lost', pending: '⏳ Pending'
  }[props.bet.result] || '⏳ Pending'))
  
  function formatMoney(n) {
    return new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(n || 0)
  }
  function formatDate(d) {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })
  }
  </script>