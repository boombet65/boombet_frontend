<template>
  <div class="p-4 hover:bg-slate-900/30">
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <div class="text-white font-bold text-sm">{{ fixture.home_team }}</div>
        <div class="text-cyan-500 text-xs">vs</div>
        <div class="text-white font-bold text-sm">{{ fixture.away_team }}</div>
      </div>
      <span class="px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap" :class="statusClass">
        {{ getStatusIcon(fixture.status) }} {{ fixture.status }}
      </span>
    </div>
    
    <div class="grid grid-cols-2 gap-1 text-xs text-cyan-400 mb-2">
      <div>🏆 {{ fixture.league || 'N/A' }}</div>
      <div>📅 {{ formatDate(fixture.date) }} {{ fixture.time }}</div>
    </div>
    
    <div class="flex justify-between items-center">
      <div class="flex gap-2 text-xs">
        <span class="text-emerald-400">1: {{ fixture.odds?.['1X2']?.['1'] ?? 'N/A' }}</span>
        <span class="text-yellow-400">X: {{ fixture.odds?.['1X2']?.['X'] ?? 'N/A' }}</span>
        <span class="text-red-400">2: {{ fixture.odds?.['1X2']?.['2'] ?? 'N/A' }}</span>
      </div>
      <div class="flex gap-1">
        <button @click="$emit('view')" class="p-1.5 text-blue-400 hover:text-blue-300" title="View Details">👁️</button>
        <button @click="$emit('edit')" class="p-1.5 text-yellow-400 hover:text-yellow-300" title="Edit">✏️</button>
        <button @click="$emit('odds')" class="p-1.5 text-cyan-400 hover:text-cyan-300" title="Odds">📊</button>
        <button @click="$emit('status')" class="p-1.5 text-emerald-400 hover:text-emerald-300" title="Status">🔄</button>
        <button @click="$emit('delete')" class="p-1.5 text-red-400 hover:text-red-300" title="Delete">🗑️</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ fixture: { type: Object, required: true } })
defineEmits(['view', 'edit', 'odds', 'status', 'delete'])

const statusClass = computed(() => {
  const map = {
    UPCOMING: 'bg-emerald-500/20 text-emerald-400',
    LIVE: 'bg-red-500/20 text-red-400',
    FINISHED: 'bg-slate-500/20 text-slate-400',
    CANCELLED: 'bg-red-500/20 text-red-400'
  }
  return map[props.fixture.status] || 'bg-slate-500/20 text-slate-400'
})

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-TZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getStatusIcon(status) {
  const icons = { UPCOMING: '🟢', LIVE: '🔴', FINISHED: '⚪', CANCELLED: '❌' }
  return icons[status] || '⚪'
}
</script>