<!-- components/betting/SettledBetCard.vue -->
<template>
  <div
    class="bg-cyan-900/20 border rounded-2xl p-4 cursor-pointer hover:border-cyan-600/60 transition-all duration-200"
    :class="bet.result === 'won' ? 'border-emerald-700/40' : 'border-red-700/40'"
    @click="$emit('click', bet.id)"
  >
    <div class="flex items-start justify-between gap-3 mb-3">
      <div>
        <p class="text-[11px] text-cyan-600 font-mono mb-1">#{{ bet.bet_ticket }}</p>
        <p v-if="bet.type" class="text-[10px] text-cyan-600/60 uppercase tracking-wider">{{ bet.type }}</p>
      </div>
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
            :class="bet.result === 'won'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'">
        {{ bet.result === 'won' ? '✅ Won' : '❌ Lost' }}
      </span>
    </div>

    <!-- Selections Preview -->
    <div class="space-y-1.5 mb-3">
      <div v-for="(sel, idx) in bet.selections?.slice(0, 3)" :key="idx"
           class="flex items-center justify-between text-xs">
        <span class="text-cyan-400 truncate max-w-[60%]">{{ sel.matchName }}</span>
        <span class="text-cyan-600 font-mono">{{ sel.result === 'WON' ? '✅' : '❌' }}</span>
      </div>
      <p v-if="(bet.selections?.length || 0) > 3" class="text-[11px] text-cyan-600">
        +{{ bet.selections.length - 3 }} more
      </p>
    </div>

    <div class="flex items-center justify-between pt-3 border-t border-cyan-800/40 text-xs">
      <div>
        <span class="text-cyan-600">Stake </span>
        <span class="font-bold text-cyan-200 font-mono">TZS {{ formatMoney(bet.stake) }}</span>
      </div>
      <div class="text-right">
        <span class="text-cyan-600">{{ bet.result === 'won' ? 'Won ' : 'Return ' }}</span>
        <span class="font-bold font-mono" :class="bet.result === 'won' ? 'text-emerald-400' : 'text-cyan-600'">
          TZS {{ formatMoney(bet.netPayout || 0) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ bet: { type: Object, required: true } })
defineEmits(['click'])

function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ', { minimumFractionDigits: 2 }).format(n || 0)
}
</script>