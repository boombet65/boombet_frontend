// composables/useBetFilter.js
import { ref, computed } from 'vue'

/**
 * Composable for filtering bets by type (settled, open, jackpot, virtual)
 * @param {Array} allBets - Array of all bets from API
 * @returns {Object} Filtered bets and helper functions
 */
export function useBetFilter(allBets) {
  // Filter states
  const settledFilter = ref('all') // 'all', 'won', 'lost'
  
  /**
   * Filter Open Bets (status = 'OPEN' or result = 'PENDING')
   * Open bets are those not yet settled
   */
  const openBets = computed(() => {
    if (!allBets.value) return []
    return allBets.value.filter(bet => {
      // Open bet conditions: status is OPEN and result is PENDING
      return bet.status === 'OPEN' && bet.result === 'PENDING'
    })
  })
  
  /**
   * Filter Settled Bets (status = 'SETTLED' or result is WON/LOST)
   * Settled bets are those that have been completed
   */
  const settledBets = computed(() => {
    if (!allBets.value) return []
    return allBets.value.filter(bet => {
      // Settled bet conditions: status is SETTLED or result is not PENDING
      return bet.status === 'SETTLED' || (bet.result !== 'PENDING' && bet.result !== null)
    })
  })
  
  /**
   * Filter Settled Bets by result (won/lost/all)
   */
  const filteredSettledBets = computed(() => {
    if (settledFilter.value === 'all') return settledBets.value
    return settledBets.value.filter(bet => {
      const result = bet.result?.toLowerCase()
      return result === settledFilter.value
    })
  })
  
  /**
   * Filter Jackpot Bets
   * Jackpot bets have type = 'jackpot' or jackpotId exists
   */
  const jackpotBets = computed(() => {
    if (!allBets.value) return []
    return allBets.value.filter(bet => {
      return bet.type === 'jackpot' || bet.isJackpot === true || bet.jackpotId !== undefined
    })
  })
  
  /**
   * Filter Virtual Bets
   * Virtual bets have type = 'virtual' or sport is virtual
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
  
  /**
   * Check if user has any bets
   */
  const hasAnyBets = computed(() => {
    return allBets.value && allBets.value.length > 0
  })
  
  /**
   * Check if specific type has bets
   */
  const hasOpenBets = computed(() => openBets.value.length > 0)
  const hasSettledBets = computed(() => settledBets.value.length > 0)
  const hasJackpotBets = computed(() => jackpotBets.value.length > 0)
  const hasVirtualBets = computed(() => virtualBets.value.length > 0)
  
  /**
   * Update settled filter
   * @param {string} filter - 'all', 'won', or 'lost'
   */
  function updateSettledFilter(filter) {
    settledFilter.value = filter
  }
  
  /**
   * Reset all filters
   */
  function resetFilters() {
    settledFilter.value = 'all'
  }
  
  return {
    // Filtered bet arrays
    openBets,
    settledBets,
    filteredSettledBets,
    jackpotBets,
    virtualBets,
    
    // Counts
    betCounts,
    hasAnyBets,
    hasOpenBets,
    hasSettledBets,
    hasJackpotBets,
    hasVirtualBets,
    
    // Filter state and methods
    settledFilter,
    updateSettledFilter,
    resetFilters
  }
}