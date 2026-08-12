<template>
  <div class="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-cyan-800/30 p-3 sm:p-4">
    <div class="flex flex-wrap gap-2 sm:gap-3">
      <div class="flex-1 min-w-[140px] sm:min-w-[200px]">
        <input 
          :value="search"
          type="text" 
          placeholder="Search fixtures..."
          class="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-xs sm:text-sm placeholder-cyan-700"
          @input="$emit('update:search', $event.target.value)"
        />
      </div>
      <select 
        :value="sport"
        class="flex-1 min-w-[100px] sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-xs sm:text-sm"
        @change="$emit('update:sport', $event.target.value)"
      >
        <option value="">All Sports</option>
        <option value="football">⚽ Football</option>
        <option value="basketball">🏀 Basketball</option>
        <option value="tennis">🎾 Tennis</option>
        <option value="cricket">🏏 Cricket</option>
        <option value="rugby">🏉 Rugby</option>
      </select>
      <select 
        :value="status"
        class="flex-1 min-w-[100px] sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-xs sm:text-sm"
        @change="$emit('update:status', $event.target.value)"
      >
        <option value="">All Status</option>
        <option value="UPCOMING">🟢 Upcoming</option>
        <option value="LIVE">🔴 Live</option>
        <option value="FINISHED">⚪ Finished</option>
        <option value="CANCELLED">❌ Cancelled</option>
      </select>
      <button @click="$emit('apply')" class="px-3 sm:px-5 py-1.5 sm:py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 text-xs sm:text-sm">
        Apply
      </button>
      <button @click="$emit('reset')" class="px-3 sm:px-5 py-1.5 sm:py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 text-xs sm:text-sm">
        Reset
      </button>
      <button @click="$emit('refresh')" class="px-3 sm:px-5 py-1.5 sm:py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 text-xs sm:text-sm">
        <span class="hidden xs:inline">Refresh</span>
        <span class="xs:hidden">⟳</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  search: String,
  sport: String,
  status: String
})

defineEmits(['update:search', 'update:sport', 'update:status', 'apply', 'reset', 'refresh'])
</script>