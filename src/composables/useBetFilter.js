// composables/useBetFilter.js
import { ref, computed } from 'vue'

/**
 * Composable for filtering bets by type (settled, open, jackpot, virtual)
 * @param {Array} allBets - Array of all bets from API
 * @returns {Object} Filtered bets and helper functions
 */
export function useBetFilter(allBets) {
  const settledFilter = ref('all') // 'all', 'won', 'lost'
  
  /**
   * Filter Open Bets
   * ============ FIX: Check both status AND result ============
   * - status: 'PENDING' means bet is not yet settled
   * - result: 'OPEN' means matches are still pending/live
   */
  const openBets = computed(() => {
    if (!allBets.value) return []
    return allBets.value.filter(bet => {
      // A bet is OPEN if:
      // 1. Status is 'PENDING' (not yet settled)
      // 2. OR status is 'SETTLED' but result is 'OPEN' (shouldn't happen normally)
      // 3. OR result is 'OPEN' (matches still pending)
      return bet.status === 'PENDING' || bet.result === 'OPEN'
    })
  })
  
  /**
   * Filter Settled Bets
   * ============ FIX: Check status = 'SETTLED' ============
   */
  const settledBets = computed(() => {
    if (!allBets.value) return []
    return allBets.value.filter(bet => {
      // A bet is SETTLED when:
      // 1. Status is 'SETTLED'
      // 2. AND result is either 'WON' or 'LOST' or 'CANCELLED'
      return bet.status === 'SETTLED' && 
             (bet.result === 'WON' || bet.result === 'LOST' || bet.result === 'CANCELLED')
    })
  })
  
  /**
   * Filter Settled Bets by result (won/lost/all)
   */
  const filteredSettledBets = computed(() => {
    if (settledFilter.value === 'all') return settledBets.value
    return settledBets.value.filter(bet => {
      const result = bet.result?.toUpperCase()
      return result === settledFilter.value.toUpperCase()
    })
  })
  
  /**
   * Filter Jackpot Bets
   */
  const jackpotBets = computed(() => {
    if (!allBets.value) return []
    return allBets.value.filter(bet => {
      return bet.type === 'jackpot' || bet.isJackpot === true || bet.jackpotId !== undefined
    })
  })
  
  /**
   * Filter Virtual Bets
   */
  const virtualBets = computed(() => {
    if (!allBets.value) return []
    return allBets.value.filter(bet => {
      return bet.type === 'virtual' || bet.sport?.toLowerCase().includes('virtual') || bet.isVirtual === true
    })
  })
  
  /**
   * Get counts for each bet type
   */
  const betCounts = computed(() => ({
    open: openBets.value.length,
    settled: settledBets.value.length,
    jackpot: jackpotBets.value.length,
    virtual: virtualBets.value.length
  }))
  
  const hasAnyBets = computed(() => {
    return allBets.value && allBets.value.length > 0
  })
  
  const hasOpenBets = computed(() => openBets.value.length > 0)
  const hasSettledBets = computed(() => settledBets.value.length > 0)
  const hasJackpotBets = computed(() => jackpotBets.value.length > 0)
  const hasVirtualBets = computed(() => virtualBets.value.length > 0)
  
  function updateSettledFilter(filter) {
    settledFilter.value = filter
  }
  
  function resetFilters() {
    settledFilter.value = 'all'
  }
  
  return {
    openBets,
    settledBets,
    filteredSettledBets,
    jackpotBets,
    virtualBets,
    betCounts,
    hasAnyBets,
    hasOpenBets,
    hasSettledBets,
    hasJackpotBets,
    hasVirtualBets,
    settledFilter,
    updateSettledFilter,
    resetFilters
  }
}