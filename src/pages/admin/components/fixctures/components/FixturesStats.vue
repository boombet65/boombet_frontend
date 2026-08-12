<template>
  <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
    <StatsCard label="Total" :value="total" color="cyan" />
    <StatsCard label="Upcoming" :value="upcoming" color="emerald" />
    <StatsCard label="Live" :value="live" color="red" />
    <StatsCard label="Finished" :value="finished" color="slate" />
    <StatsCard label="Total Bets" :value="totalBets" color="yellow" class="col-span-2 xs:col-span-3 sm:col-span-1" />
  </div>
</template>

<script setup>
import StatsCard from './StatsCard.vue'

defineProps({
  total: {
    type: Number,
    default: 0
  },
  upcoming: {
    type: Number,
    default: 0
  },
  live: {
    type: Number,
    default: 0
  },
  finished: {
    type: Number,
    default: 0
  },
  totalBets: {
    type: Number,
    default: 0
  }
})
</script>