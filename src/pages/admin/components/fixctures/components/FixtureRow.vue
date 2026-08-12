<template>
  <tr class="border-t border-cyan-800/30 hover:bg-slate-900/30">
    <td class="px-4 py-3 text-white text-xs font-mono">{{ fixture.id?.slice(0, 6) }}...</td>
    <td class="px-4 py-3">
      <div class="text-white text-sm font-bold">{{ fixture.home_team }}</div>
      <div class="text-cyan-500 text-[10px]">vs</div>
      <div class="text-white text-sm font-bold">{{ fixture.away_team }}</div>
    </td>
    <td class="px-4 py-3 text-cyan-300 text-xs">{{ fixture.league || 'N/A' }}</td>
    <td class="px-4 py-3 text-cyan-300 text-xs">
      <div>{{ formatDate(fixture.date) }}</div>
      <div class="text-cyan-500 text-[10px]">{{ fixture.time }}</div>
    </td>
    <td class="px-4 py-3">
      <span class="px-2 py-1 rounded-full text-[10px] font-medium" :class="statusClass">
        {{ getStatusIcon(fixture.status) }} {{ fixture.status || 'UNKNOWN' }}
      </span>
    </td>
    <!-- ============ ODDS - Using '1X2' structure ============ -->
    <td class="px-4 py-3">
      <div class="space-y-0.5 text-xs">
        <div class="text-emerald-400">1: {{ fixture.odds?.['1X2']?.['1'] ?? 'N/A' }}</div>
        <div class="text-yellow-400">X: {{ fixture.odds?.['1X2']?.['X'] ?? 'N/A' }}</div>
        <div class="text-red-400">2: {{ fixture.odds?.['1X2']?.['2'] ?? 'N/A' }}</div>
      </div>
    </td>
    <td class="px-4 py-3">
      <div class="flex gap-1">
        <!-- View Button -->
        <button @click="$emit('view')" class="p-1 text-blue-400 hover:text-blue-300" title="View Details">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <!-- Edit Button -->
        <button @click="$emit('edit')" class="p-1 text-yellow-400 hover:text-yellow-300" title="Edit">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <!-- Update Odds Button -->
        <button @click="$emit('odds')" class="p-1 text-cyan-400 hover:text-cyan-300" title="Update Odds">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-6 3v-3m-3 3h12M5 17h4m6 0h4M5 7h4m6 0h4M5 10h4m6 0h4M5 14h4m6 0h4" />
          </svg>
        </button>
        <!-- Toggle Status Button -->
        <button @click="$emit('status')" class="p-1 text-emerald-400 hover:text-emerald-300" title="Toggle Status">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <!-- Delete Button -->
        <button @click="$emit('delete')" class="p-1 text-red-400 hover:text-red-300" title="Delete">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  fixture: {
    type: Object,
    required: true
  }
})

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
  return new Date(d).toLocaleDateString('en-TZ', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

function getStatusIcon(status) {
  const icons = {
    UPCOMING: '🟢',
    LIVE: '🔴',
    FINISHED: '⚪',
    CANCELLED: '❌'
  }
  return icons[status] || '⚪'
}
</script>