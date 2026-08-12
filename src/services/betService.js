// services/betService.js
import api from './api'

/**
 * Bet Service - Handles all betting operations
 * Integrated with backend API
 */

const BET_ENDPOINTS = {
  PLACE_BET: '/bets/bets',                    // POST /api/bets - Backend inatarajia POST /
  USER_BETS: '/bets/bets',               // GET /api/bets/user - Backend inatarajia GET /user
  BET_STATS: '/bets/stats',
  LOAD_BET: '/bets/load',
  LOAD_ACTIVE_BET: '/bets/active',
  CHECK_BOOKING_CODE: '/bets/check',
  PREVIEW_BOOKING_CODE: '/bets/preview',
  GENERATE_BOOKING_CODE: (betId) => `/bets/${betId}/generate-booking-code`,
  CANCEL_BET: (betId) => `/bets/${betId}/cancel`,
  GET_BET_BY_ID: (betId) => `/bets/${betId}`,
  UNCHECKED_WINS: '/bets/unchecked-wins'
}

/**
 * Convert frontend pick to backend selection format
 * Backend expects: '1', 'X', or '2'
 */
function convertPickToSelection(pick) {
  // If it's already '1', 'X', '2' format
  if (pick === '1' || pick === 'X' || pick === '2') {
    return pick
  }
  
  // Try to extract just the selection from strings like "1X2 | Full Time - 2"
  const match = String(pick).match(/[1X2]/)
  if (match) {
    return match[0]
  }
  
  // Convert common formats
  const pickLower = String(pick).toLowerCase()
  
  if (pickLower === 'home' || pickLower === '1' || pickLower === 'h' || pickLower === 'home win') {
    return '1'
  }
  if (pickLower === 'draw' || pickLower === 'x' || pickLower === 'd') {
    return 'X'
  }
  if (pickLower === 'away' || pickLower === '2' || pickLower === 'a' || pickLower === 'away win') {
    return '2'
  }
  
  // Default fallback
  return pick
}

/**
 * Place a new bet
 * @param {Array} selections - Array of selections from betStore
 * @param {number} stake - Stake amount
 * @returns {Promise<Object>} Placed bet data
 */
export const placeBet = async (selections, stake) => {
  try {
    console.log('📤 RAW SELECTIONS:', JSON.stringify(selections, null, 2))
    
    // Format selections for backend
    const formattedSelections = selections.map(sel => {
      // Get the correct selection value
      let selectionValue = sel.pick
      
      // If pick is not in correct format, convert it
      if (selectionValue && !['1', 'X', '2'].includes(selectionValue)) {
        selectionValue = convertPickToSelection(selectionValue)
      }
      
      return {
        match: {
          id: sel.matchId,
          name: sel.matchName,
          market: sel.market || '1X2',
          marketKey: sel.marketKey
        },
        selection: selectionValue, // Must be '1', 'X', or '2'
        odds: parseFloat(sel.odds)
      }
    })

    const payload = {
      selections: formattedSelections,
      stake: parseFloat(stake)
    }
    
    console.log('📤 FINAL PAYLOAD:', JSON.stringify(payload, null, 2))

    // 👇 Backend inatarajia POST /api/bets (router.post('/'))
    const response = await api.post(BET_ENDPOINTS.PLACE_BET, payload)

    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Place bet error:', error)
    console.error('Error response:', error.response?.data)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to place bet',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get user's bet history
 * @param {Object} options - Query options
 * @returns {Promise<Object>} User bets
 */
export const getUserBets = async (options = {}) => {
  try {
    const { status, result, limit = 50, offset = 0 } = options
    
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (result) params.append('result', result)
    params.append('limit', limit)
    params.append('offset', offset)
    
    // 👇 Backend inatarajia GET /api/bets/user
    const url = params.toString() 
      ? `${BET_ENDPOINTS.USER_BETS}?${params.toString()}`
      : BET_ENDPOINTS.USER_BETS
      
    const response = await api.get(url)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Get user bets error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load bets',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get user bet statistics
 * @returns {Promise<Object>} Bet stats
 */
export const getUserBetStats = async () => {
  try {
    const response = await api.get(BET_ENDPOINTS.BET_STATS)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Get bet stats error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load statistics',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Load bet by booking code
 * @param {string} bookingCode - Booking code
 * @returns {Promise<Object>} Bet data
 */
export const loadBetByBookingCode = async (bookingCode) => {
  try {
    const response = await api.get(`${BET_ENDPOINTS.LOAD_BET}/${bookingCode}`)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Load bet by booking code error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load bet',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Load ONLY active bet (OPEN + PENDING)
 * @param {string} bookingCode - Booking code
 * @returns {Promise<Object>} Active bet data
 */
export const loadActiveBetByBookingCode = async (bookingCode) => {
  try {
    const response = await api.get(`${BET_ENDPOINTS.LOAD_ACTIVE_BET}/${bookingCode}`)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Load active bet error:', error)
    
    if (error.response?.status === 400) {
      return {
        success: false,
        message: error.response.data?.message || 'Cannot load this bet',
        data: error.response.data?.data,
        canLoad: false
      }
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load bet',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Check booking code status
 * @param {string} bookingCode - Booking code
 * @returns {Promise<Object>} Status info
 */
export const checkBookingCodeStatus = async (bookingCode) => {
  try {
    const response = await api.get(`${BET_ENDPOINTS.CHECK_BOOKING_CODE}/${bookingCode}`)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Check booking code error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to check booking code',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Preview booking code
 * @param {string} bookingCode - Booking code
 * @returns {Promise<Object>} Preview data
 */
export const previewBookingCode = async (bookingCode) => {
  try {
    const response = await api.get(`${BET_ENDPOINTS.PREVIEW_BOOKING_CODE}/${bookingCode}`)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Preview booking code error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to preview bet',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get bet by ID
 * @param {string} betId - Bet ID
 * @returns {Promise<Object>} Bet data
 */
export const getBetById = async (betId) => {
  try {
    const response = await api.get(BET_ENDPOINTS.GET_BET_BY_ID(betId))
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Get bet by ID error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load bet',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Generate new booking code for existing bet
 * @param {string} betId - Bet ID
 * @returns {Promise<Object>} New booking code
 */
export const generateNewBookingCode = async (betId) => {
  try {
    const response = await api.post(BET_ENDPOINTS.GENERATE_BOOKING_CODE(betId))
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Generate booking code error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to generate new booking code',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Cancel a bet
 * @param {string} betId - Bet ID
 * @returns {Promise<Object>} Cancelled bet data
 */
export const cancelBet = async (betId) => {
  try {
    const response = await api.patch(BET_ENDPOINTS.CANCEL_BET(betId))
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Cancel bet error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to cancel bet',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get unchecked winning bets
 * @returns {Promise<Object>} Unchecked wins
 */
export const getUncheckedWins = async () => {
  try {
    const response = await api.get(BET_ENDPOINTS.UNCHECKED_WINS)
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Get unchecked wins error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load win notifications',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Format selections from backend to frontend format
 * @param {Array} selections - Backend selections format
 * @returns {Array} Frontend format
 */
export const formatSelectionsFromBackend = (selections) => {
  if (!Array.isArray(selections)) return []
  
  return selections.map(sel => ({
    matchId: sel.match?.id,
    matchName: sel.match?.name,
    market: sel.match?.market || '1X2',
    marketKey: sel.match?.marketKey,
    pick: sel.selection,
    odds: parseFloat(sel.odds),
    stake: null
  }))
}

// Export all functions as default object
export default {
  placeBet,
  getUserBets,
  getUserBetStats,
  loadBetByBookingCode,
  loadActiveBetByBookingCode,
  checkBookingCodeStatus,
  previewBookingCode,
  getBetById,
  generateNewBookingCode,
  cancelBet,
  getUncheckedWins,
  formatSelectionsFromBackend
}