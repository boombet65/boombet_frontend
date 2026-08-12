// useBetStore.js 

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBetStore = defineStore('bet', () => {
  const slip    = ref([])   // [{ matchId, matchName, market, pick, marketKey, odds, stake }]
  const stake   = ref(0)
  const isOpen  = ref(false)
  const betType = ref('single') // 'single' | 'accumulator'

  const slipCount    = computed(() => slip.value.length)
  const totalOdds    = computed(() => slip.value.reduce((acc, b) => acc * (b.odds || 1), 1))
  const potentialWin = computed(() => stake.value * totalOdds.value)

  function isSelected(matchId, marketKey) {
    return slip.value.some(b => b.matchId === matchId && b.marketKey === marketKey)
  }

  function addToSlip(selection) {
    // Remove same market from same match (only one pick per market per match)
    slip.value = slip.value.filter(
      b => !(b.matchId === selection.matchId && b.market === selection.market)
    )
    // If same exact pick → it was already removed (toggle off). Check:
    const alreadyExact = slip.value.some(b => b.marketKey === selection.marketKey)
    if (!alreadyExact) {
      slip.value.push({ ...selection, stake: 100 })
      isOpen.value = true
    }
  }

  function removeFromSlip(marketKey) {
    slip.value = slip.value.filter(b => b.marketKey !== marketKey)
    if (slip.value.length === 0) isOpen.value = false
  }

  function clearSlip() {
    slip.value  = []
    stake.value = 0
    isOpen.value = false
  }

  return {
    slip, stake, isOpen, betType,
    slipCount, totalOdds, potentialWin,
    isSelected, addToSlip, removeFromSlip, clearSlip,
  }
})