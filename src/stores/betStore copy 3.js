// store/betStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import betService from '../services/betService'

export const useBetStore = defineStore('bet', () => {
  // State
  const slip = ref([])   // [{ matchId, matchName, market, pick, marketKey, odds, stake }]
  const stake = ref(0)
  const isOpen = ref(false)
  const betType = ref('single') // 'single' | 'accumulator'
  
  // Bet history state
  const userBets = ref([])
  const userBetsTotal = ref(0)
  const isLoadingBets = ref(false)
  const betStats = ref(null)
  const isLoadingStats = ref(false)
  
  // Placing bet state
  const isPlacingBet = ref(false)
  const lastPlacedBet = ref(null)
  const placeBetError = ref(null)
  
  // Booking code loading
  const isLoadingBookingCode = ref(false)
  const loadedBet = ref(null)
  
  // Win notifications
  const uncheckedWins = ref([])
  const hasUnreadWins = ref(false)

  // Computed
  const slipCount = computed(() => slip.value.length)
  const totalOdds = computed(() => slip.value.reduce((acc, b) => acc * (b.odds || 1), 1))
  const potentialWin = computed(() => stake.value * totalOdds.value)
  const canPlaceBet = computed(() => slipCount.value > 0 && stake.value >= 100)
  
  // Check if minimum stake is met
  const isStakeValid = computed(() => stake.value >= 100)

  // Actions
  function isSelected(matchId, marketKey) {
    return slip.value.some(b => b.matchId === matchId && b.marketKey === marketKey)
  }

  function addToSlip(selection) {
    const alreadySelected = slip.value.some(
      b => b.matchId === selection.matchId && b.marketKey === selection.marketKey
    )
    
    if (alreadySelected) {
      slip.value = slip.value.filter(
        b => !(b.matchId === selection.matchId && b.marketKey === selection.marketKey)
      )
    } else {
      slip.value = slip.value.filter(b => b.matchId !== selection.matchId)
      slip.value.push({ ...selection, stake: 100 })
      isOpen.value = true
    }
    
    if (slip.value.length === 0) isOpen.value = false
  }

  function removeFromSlip(matchId, marketKey) {
    slip.value = slip.value.filter(b => !(b.matchId === matchId && b.marketKey === marketKey))
    if (slip.value.length === 0) isOpen.value = false
  }

  function clearSlip() {
    slip.value = []
    stake.value = 0
    isOpen.value = false
    placeBetError.value = null
  }

  function updateStake(newStake) {
    stake.value = Math.max(0, parseFloat(newStake) || 0)
  }

  /**
   * Place bet using backend API
   */
  async function placeBetWithBackend() {
    if (!canPlaceBet.value) {
      placeBetError.value = {
        message: !slipCount.value ? 'Add selections to your slip' : 'Minimum stake is 100 Tsh'
      }
      return { success: false, error: placeBetError.value }
    }
    
    isPlacingBet.value = true
    placeBetError.value = null
    
    try {
      const result = await betService.placeBet(slip.value, stake.value)
      
      if (result.success) {
        lastPlacedBet.value = result.data
        // Clear slip after successful bet
        clearSlip()
        return { success: true, data: result.data }
      } else {
        placeBetError.value = { message: result.message }
        return { success: false, error: result }
      }
    } catch (error) {
      placeBetError.value = { message: error.message || 'Failed to place bet' }
      return { success: false, error: placeBetError.value }
    } finally {
      isPlacingBet.value = false
    }
  }

  /**
   * Load user bet history
   */
  async function loadUserBets(options = {}) {
    isLoadingBets.value = true
    
    try {
      const result = await betService.getUserBets(options)
      
      if (result.success) {
        userBets.value = result.data.bets
        userBetsTotal.value = result.data.total
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.message }
      }
    } catch (error) {
      console.error('Load user bets error:', error)
      return { success: false, error: error.message }
    } finally {
      isLoadingBets.value = false
    }
  }

  /**
   * Load user bet statistics
   */
  async function loadBetStats() {
    isLoadingStats.value = true
    
    try {
      const result = await betService.getUserBetStats()
      
      if (result.success) {
        betStats.value = result.data
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.message }
      }
    } catch (error) {
      console.error('Load bet stats error:', error)
      return { success: false, error: error.message }
    } finally {
      isLoadingStats.value = false
    }
  }

  /**
   * Load bet by booking code (active only)
   */
  async function loadBetByCode(bookingCode) {
    isLoadingBookingCode.value = true
    loadedBet.value = null
    
    try {
      const result = await betService.loadActiveBetByBookingCode(bookingCode)
      
      if (result.success) {
        // Format selections for slip
        const formattedSelections = betService.formatSelectionsFromBackend(result.data.selections)
        loadedBet.value = {
          ...result.data,
          selections: formattedSelections
        }
        return { success: true, data: loadedBet.value }
      } else {
        return { 
          success: false, 
          message: result.message,
          canLoad: result.canLoad,
          data: result.data
        }
      }
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      isLoadingBookingCode.value = false
    }
  }

  /**
   * Apply loaded bet to slip (for sharing feature)
   */
  function applyLoadedBetToSlip(loadedBetData) {
    if (!loadedBetData || !loadedBetData.selections) return false
    
    // Clear current slip
    clearSlip()
    
    // Add selections to slip
    loadedBetData.selections.forEach(selection => {
      slip.value.push({
        matchId: selection.matchId,
        matchName: selection.matchName,
        market: selection.market || '1X2',
        marketKey: selection.marketKey,
        pick: selection.pick,
        odds: selection.odds,
        stake: loadedBetData.stake
      })
    })
    
    // Set stake
    stake.value = parseFloat(loadedBetData.stake)
    isOpen.value = true
    
    return true
  }

  /**
   * Check booking code status
   */
  async function checkBookingCode(bookingCode) {
    try {
      const result = await betService.checkBookingCodeStatus(bookingCode)
      return result
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  /**
   * Cancel a bet
   */
  async function cancelUserBet(betId) {
    try {
      const result = await betService.cancelBet(betId)
      
      if (result.success) {
        // Refresh user bets after cancellation
        await loadUserBets()
        return { success: true, data: result.data }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  /**
   * Generate new booking code for a bet
   */
  async function regenerateBookingCode(betId) {
    try {
      const result = await betService.generateNewBookingCode(betId)
      return result
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  /**
   * Load unchecked win notifications
   */
  async function loadUncheckedWins() {
    try {
      const result = await betService.getUncheckedWins()
      
      if (result.success) {
        uncheckedWins.value = result.data.wins || []
        hasUnreadWins.value = result.data.hasUnreadWins || false
        return { success: true, data: result.data }
      }
      return { success: false, message: result.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  /**
   * Mark win as notified (you may need a separate API for this)
   */
  function markWinsAsNotified() {
    // This would typically call an API to mark notifications as read
    // For now, just clear local state
    uncheckedWins.value = []
    hasUnreadWins.value = false
  }

  // Add to betStore.js inside the actions

/**
 * Load all user bets without filters (for filtering on frontend)
 */
async function loadAllUserBets() {
  isLoadingBets.value = true
  
  try {
    // Load with large limit to get all bets
    const result = await betService.getUserBets({ limit: 500 })
    
    if (result.success) {
      userBets.value = result.data.bets
      userBetsTotal.value = result.data.total
      return { success: true, data: result.data }
    } else {
      return { success: false, error: result.message }
    }
  } catch (error) {
    console.error('Load all user bets error:', error)
    return { success: false, error: error.message }
  } finally {
    isLoadingBets.value = false
  }
}



  return {
    // State
    slip,
    stake,
    isOpen,
    betType,
    userBets,
    userBetsTotal,
    isLoadingBets,
    betStats,
    isLoadingStats,
    isPlacingBet,
    lastPlacedBet,
    placeBetError,
    isLoadingBookingCode,
    loadedBet,
    uncheckedWins,
    hasUnreadWins,
    
    // Computed
    slipCount,
    totalOdds,
    potentialWin,
    canPlaceBet,
    isStakeValid,
    
    // Actions
    isSelected,
    addToSlip,
    removeFromSlip,
    clearSlip,
    updateStake,
    placeBetWithBackend,
    loadUserBets,
    loadBetStats,
    loadBetByCode,
    applyLoadedBetToSlip,
    checkBookingCode,
    cancelUserBet,
    regenerateBookingCode,
    loadUncheckedWins,
    markWinsAsNotified,
    loadAllUserBets
  }
})