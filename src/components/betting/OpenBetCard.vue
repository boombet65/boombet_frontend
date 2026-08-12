<!-- components/betting/OpenBetCard.vue -->
<template>
  <div class="bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-4 hover:border-cyan-700/60 transition-all duration-200">

    <!-- Header -->
    <div class="flex items-start justify-between gap-3 mb-3">
      <div>
        <p class="text-[11px] text-cyan-600 font-mono mb-1">#{{ bet.bet_ticket }}</p>
        <p v-if="bet.type" class="text-[10px] text-cyan-600/60 uppercase tracking-wider">{{ bet.type }}</p>
      </div>
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
        ⏳ Pending
      </span>
    </div>

  
    <!-- Footer -->
    <div class="flex items-center justify-between pt-3 border-t border-cyan-800/40 text-xs">
      <div>
        <span class="text-cyan-600">Stake </span>
        <span class="font-bold text-cyan-200 font-mono">TZS {{ formatMoney(bet.stake) }}</span>
      </div>
      <div class="text-right">
        <span class="text-cyan-600">To win </span>
        <span class="font-bold text-emerald-400 font-mono">TZS {{ formatMoney(bet.netPayout || 0) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ bet: { type: Object, required: true } })

function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 2 }).format(n || 0)
}
</script>