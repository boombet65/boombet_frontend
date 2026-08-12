<template>
  <div class="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-cyan-800/30 overflow-hidden">
    <!-- Mobile View -->
    <div class="block sm:hidden divide-y divide-cyan-800/30">
      <div v-if="fixtures.length === 0 && !loading" class="px-4 py-8 text-center text-cyan-400">
        No fixtures found
      </div>
      <FixtureCard 
        v-for="fixture in fixtures" 
        :key="fixture.id" 
        :fixture="fixture"
        @view="$emit('view', fixture)"
        @edit="$emit('edit', fixture)"
        @odds="$emit('odds', fixture)"
        @status="$emit('status', fixture)"
        @delete="$emit('delete', fixture)"
      />
    </div>

    <!-- Desktop View -->
    <div class="hidden sm:block overflow-x-auto">
      <table class="w-full min-w-[800px]">
        <thead class="bg-slate-900/50">
          <tr>
            <th class="text-left px-4 py-3 text-cyan-400 text-xs font-medium">ID</th>
            <th class="text-left px-4 py-3 text-cyan-400 text-xs font-medium">Teams</th>
            <th class="text-left px-4 py-3 text-cyan-400 text-xs font-medium">League</th>
            <th class="text-left px-4 py-3 text-cyan-400 text-xs font-medium">Date & Time</th>
            <th class="text-left px-4 py-3 text-cyan-400 text-xs font-medium">Status</th>
            <th class="text-left px-4 py-3 text-cyan-400 text-xs font-medium">Odds</th>
            <th class="text-left px-4 py-3 text-cyan-400 text-xs font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="fixtures.length === 0 && !loading">
            <td colspan="7" class="px-4 py-8 text-center text-cyan-400">No fixtures found</td>
          </tr>
          <FixtureRow 
            v-for="fixture in fixtures" 
            :key="fixture.id" 
            :fixture="fixture"
            @view="$emit('view', fixture)"
            @edit="$emit('edit', fixture)"
            @odds="$emit('odds', fixture)"
            @status="$emit('status', fixture)"
            @delete="$emit('delete', fixture)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import FixtureCard from './FixtureCard.vue'
import FixtureRow from './FixtureRow.vue'

defineProps({
  fixtures: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

defineEmits(['view', 'edit', 'odds', 'status', 'delete'])
</script>