// services/betService.js
import api from './api'

/**
 * Bet Service - Handles all betting operations
 * Integrated with backend API
 */

const BET_ENDPOINTS = {
  PLACE_BET: '/bets',
  USER_BETS: '/bets/user',
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
 * Place a new bet
 * @param {Object} betData - Bet data
 * @param {Array} betData.selections - Array of selections [{ matchId, matchName, selection, odds, marketKey }]
 * @param {number} betData.stake - Stake amount in Tsh
 * @returns {Promise<Object>} Placed bet data
 */
export const placeBet = async (selections, stake) => {
  try {
    // Format selections for backend
    const formattedSelections = selections.map(sel => ({
      match: {
        id: sel.matchId,
        name: sel.matchName,
        market: sel.market,
        marketKey: sel.marketKey
      },
      selection: sel.pick, // '1', 'X', or '2'
      odds: parseFloat(sel.odds)
    }))

    const response = await api.post(BET_ENDPOINTS.PLACE_BET, {
      selections: formattedSelections,
      stake: parseFloat(stake)
    })

    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('Place bet error:', error)
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
 * @param {string} options.status - Bet status (OPEN, SETTLED, CANCELLED)
 * @param {string} options.result - Bet result (PENDING, WON, LOST)
 * @param {number} options.limit - Items per page
 * @param {number} options.offset - Pagination offset
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
    console.error('Get user bets error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load bets',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get user bet statistics
 * @returns {Promise<Object>} Bet stats (totalBets, totalStake, wonBets, lostBets, winRate, etc.)
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
    console.error('Get bet stats error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load statistics',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Load bet by booking code (any status)
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
    console.error('Load bet by booking code error:', error)
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
    console.error('Load active bet error:', error)
    
    // Handle specific error responses
    if (error.response?.status === 400) {
      return {
        success: false,
        message: error.response.data?.message || 'Cannot load this bet',
        data: error.response.data?.data, // Contains status details
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
 * Check booking code status without loading full data
 * @param {string} bookingCode - Booking code
 * @returns {Promise<Object>} Status info (exists, canLoad, status, result)
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
    console.error('Check booking code error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to check booking code',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Preview booking code (get basic info)
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
    console.error('Preview booking code error:', error)
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
    console.error('Get bet by ID error:', error)
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
    console.error('Generate booking code error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to generate new booking code',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Cancel a bet (before settlement)
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
    console.error('Cancel bet error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to cancel bet',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Get unchecked winning bets (for notifications)
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
    console.error('Get unchecked wins error:', error)
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

/**
 * Format selections from frontend to backend format
 * @param {Array} selections - Frontend selections format
 * @returns {Array} Backend format
 */
export const formatSelectionsForBackend = (selections) => {
  return selections.map(sel => ({
    match: {
      id: sel.matchId,
      name: sel.matchName,
      market: sel.market || '1X2',
      marketKey: sel.marketKey
    },
    selection: sel.pick,
    odds: parseFloat(sel.odds)
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
  formatSelectionsFromBackend,
  formatSelectionsForBackend
}