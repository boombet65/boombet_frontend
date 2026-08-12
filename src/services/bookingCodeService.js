// services/bookingCodeService.js
import api from './api'

const BOOKING_CODE_ENDPOINTS = {
  CREATE: '/booking-codes/create',
  LOAD: (code) => `/booking-codes/${code}/load`,
  CHECK: (code) => `/booking-codes/${code}/check`
}

/**
 * Format selections for backend
 * Converts betStore slip format to backend expected format
 */
const formatSelectionsForBackend = (selections) => {
  return selections.map(sel => ({
    matchId: sel.matchId,
    matchName: sel.matchName,
    market: sel.market || '1X2',
    marketKey: sel.marketKey,
    selection: sel.pick,
    odds: parseFloat(sel.odds)
  }))
}

/**
 * Format selections from backend to frontend format
 */
const formatSelectionsFromBackend = (selections) => {
  if (!Array.isArray(selections)) return []
  
  return selections.map(sel => ({
    matchId: sel.matchId,
    matchName: sel.matchName,
    market: sel.market || '1X2',
    marketKey: sel.marketKey,
    pick: sel.selection,
    odds: parseFloat(sel.odds),
    stake: null
  }))
}

/**
 * Create a new booking code
 * @param {Array} selections - Array of selections from betStore
 * @returns {Promise<Object>} Created booking code data
 */
export const createBookingCode = async (selections) => {
  try {
    if (!selections || selections.length === 0) {
      return {
        success: false,
        message: 'Add selections to create booking code'
      }
    }

    const formattedSelections = formatSelectionsForBackend(selections)
    
    console.log('Creating booking code with selections:', formattedSelections)

    const response = await api.post(BOOKING_CODE_ENDPOINTS.CREATE, {
      selections: formattedSelections
    })

    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    }

    return {
      success: false,
      message: response.data?.message || 'Failed to create booking code'
    }
  } catch (error) {
    console.error('Create booking code error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create booking code',
      error: error.response?.data || error.message
    }
  }
}

/**
 * Load booking code by code
 * @param {string} code - Booking code
 * @returns {Promise<Object>} Loaded selections
 */
export const loadBookingCode = async (code) => {
  try {
    if (!code) {
      return {
        success: false,
        message: 'Booking code is required'
      }
    }

    const response = await api.get(BOOKING_CODE_ENDPOINTS.LOAD(code))

    if (response.data && response.data.success) {
      const selections = formatSelectionsFromBackend(response.data.data.selections)
      
      return {
        success: true,
        data: {
          selections: selections,
          expiresAt: response.data.data.expiresAt,
          createdAt: response.data.data.createdAt
        },
        message: response.data.message
      }
    }

    return {
      success: false,
      message: response.data?.message || 'Failed to load booking code'
    }
  } catch (error) {
    console.error('Load booking code error:', error)
    
    // Handle specific error messages
    const errorMessage = error.response?.data?.message || 'Failed to load booking code'
    const isExpired = errorMessage.toLowerCase().includes('expired')
    
    return {
      success: false,
      message: errorMessage,
      isExpired: isExpired,
      error: error.response?.data || error.message
    }
  }
}

/**
 * Check booking code status
 * @param {string} code - Booking code
 * @returns {Promise<Object>} Status info
 */
export const checkBookingCode = async (code) => {
  try {
    if (!code) {
      return {
        success: false,
        message: 'Booking code is required'
      }
    }

    const response = await api.get(BOOKING_CODE_ENDPOINTS.CHECK(code))

    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    }

    return {
      success: false,
      message: response.data?.message || 'Failed to check booking code'
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

export default {
  createBookingCode,
  loadBookingCode,
  checkBookingCode,
  formatSelectionsForBackend,
  formatSelectionsFromBackend
}