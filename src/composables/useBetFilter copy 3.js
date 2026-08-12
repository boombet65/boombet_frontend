// composables/useBetFilter.js
import { ref, computed } from 'vue'
import { BetStatusHelper } from './helper/betStatus.helper'

/**
 * Composable for filtering bets by type (settled, open, jackpot, virtual)
 * @param {Array} allBets - Array of all bets from API
 * @returns {Object} Filtered bets and helper functions
 */
export function useBetFilter(allBets) {
  const settledFilter = ref('all') // 'all', 'won', 'lost'
  
  /**
   * ============ FIX: Check if a bet should be considered open ============
   * A bet is OPEN if:
   * 1. Status is 'PENDING' (not yet settled by backend)
   * 2. OR result is 'OPEN' (matches still pending)
   * 3. OR any selection match is not FINISHED yet
   */
  const openBets = computed(() => {
    if (!allBets.value) return []
    
    return allBets.value.filter(bet => {
      // If status is PENDING or result is OPEN, it's an open bet
      if (bet.status === 'PENDING' || bet.result === 'OPEN') {
        return true
      }
      
      // ============ FIX: Check if any match is still not finished ============
      // If any selection has a match that is not FINISHED, bet is still open
      if (bet.selections && bet.selections.length > 0) {
        const hasUnfinishedMatch = bet.selections.some(sel => {
          const matchStatus = sel.match?.status || sel.matchStatus
          return matchStatus !== 'FINISHED'
        })
        
        // If there's an unfinished match, treat as open
        if (hasUnfinishedMatch) {
          return true
        }
      }
      
      // Otherwise, bet is settled
      return false
    })
  })
  
  /**
   * Filter Settled Bets
   * ============ FIX: Check if bet should be settled ============
   */
  const settledBets = computed(() => {
    if (!allBets.value) return []
    
    return allBets.value.filter(bet => {
      // If status is SETTLED and has result, it's settled
      if (bet.status === 'SETTLED' && (bet.result === 'WON' || bet.result === 'LOST' || bet.result === 'CANCELLED')) {
        return true
      }
      
      // ============ FIX: Check if all matches are FINISHED ============
      // If all selections have finished matches, bet should be settled
      if (bet.selections && bet.selections.length > 0) {
        const allMatchesFinished = bet.selections.every(sel => {
          const matchStatus = sel.match?.status || sel.matchStatus
          return matchStatus === 'FINISHED'
        })
        
        // If all matches are finished and bet is not settled, consider it settled
        if (allMatchesFinished) {
          return true
        }
      }
      
      return false
    })
  })
  
  /**
   * Filter Settled Bets by result (won/lost/all)
   */
  const filteredSettledBets = computed(() => {
    if (settledFilter.value === 'all') return settledBets.value
    
    return settledBets.value.filter(bet => {
      // Use the actual result if available
      if (bet.result === 'WON' || bet.result === 'LOST') {
        return bet.result.toLowerCase() === settledFilter.value
      }
      
      // ============ FIX: Calculate result from selections ============
      // If result is not set, calculate from selections
      if (bet.selections && bet.selections.length > 0) {
        const allWon = bet.selections.every(sel => sel.status === 'WON')
        const anyLost = bet.selections.some(sel => sel.status === 'LOST')
        
        if (allWon) {
          return settledFilter.value === 'won'
        } else if (anyLost) {
          return settledFilter.value === 'lost'
        }
      }
      
      return false
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