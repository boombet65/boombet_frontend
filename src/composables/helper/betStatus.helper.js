// helpers/betStatus.helper.js

/**
 * Helper to determine bet display status
 * Based on backend status and result fields
 */
export const BetStatusHelper = {
  /**
   * Get the display status for a bet
   * @param {Object} bet - Bet object with status and result
   * @returns {Object} Display status information
   */
  getDisplayStatus(bet) {
    if (!bet) return { label: 'Unknown', icon: '❓', color: 'gray' }
    
    const { status, result } = bet
    
    // Case 1: Bet is still pending/open
    if (status === 'PENDING' && result === 'OPEN') {
      return {
        label: 'In Progress',
        icon: '⏳',
        color: 'blue',
        description: 'Matches are still ongoing'
      }
    }
    
    // Case 2: Bet is settled and won
    if (status === 'SETTLED' && result === 'WON') {
      return {
        label: 'Won',
        icon: '✅',
        color: 'green',
        description: 'You won this bet!'
      }
    }
    
    // Case 3: Bet is settled and lost
    if (status === 'SETTLED' && result === 'LOST') {
      return {
        label: 'Lost',
        icon: '❌',
        color: 'red',
        description: 'Better luck next time'
      }
    }
    
    // Case 4: Bet is cancelled
    if (result === 'CANCELLED') {
      return {
        label: 'Cancelled',
        icon: '🚫',
        color: 'gray',
        description: 'This bet was cancelled'
      }
    }
    
    // Default
    return {
      label: 'Unknown',
      icon: '❓',
      color: 'gray',
      description: 'Unknown status'
    }
  },
  
  /**
   * Check if bet is still open/pending
   */
  isOpen(bet) {
    return bet.status === 'PENDING' && bet.result === 'OPEN'
  },
  
  /**
   * Check if bet is settled
   */
  isSettled(bet) {
    return bet.status === 'SETTLED' && (bet.result === 'WON' || bet.result === 'LOST')
  },
  
  /**
   * Check if bet was won
   */
  isWon(bet) {
    return bet.status === 'SETTLED' && bet.result === 'WON'
  },
  
  /**
   * Check if bet was lost
   */
  isLost(bet) {
    return bet.status === 'SETTLED' && bet.result === 'LOST'
  },
  
  /**
   * Check if bet was cancelled
   */
  isCancelled(bet) {
    return bet.result === 'CANCELLED'
  }
}