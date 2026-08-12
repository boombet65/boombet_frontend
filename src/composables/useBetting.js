import { computed } from 'vue'
import { useBetStore } from '../stores/betStore'

export function useBetting() {
  const betStore = useBetStore()

  const slip         = computed(() => betStore.slip)
  const slipCount    = computed(() => betStore.slipCount)
  const totalOdds    = computed(() => betStore.totalOdds)
  const potentialWin = computed(() => betStore.potentialWin)

  function addToSlip(selection) { betStore.addToSlip(selection) }
  function removeFromSlip(key)  { betStore.removeFromSlip(key) }
  function clearSlip()          { betStore.clearSlip() }
  function isSelected(matchId, marketKey) { return betStore.isSelected(matchId, marketKey) }

  async function placeBet() {
    // TODO: connect betService.placeBet()
    console.log('Placing bet:', betStore.slip)
    betStore.clearSlip()
  }

  return { slip, slipCount, totalOdds, potentialWin, addToSlip, removeFromSlip, clearSlip, isSelected, placeBet }
}