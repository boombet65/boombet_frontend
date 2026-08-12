// src/services/bet.service.js

import api from '../api'

const BetService = {
  /**
   * Place a bet
   * @param {Object} betData - Bet data
   * @param {number} betData.stake - Stake amount in TZS
   * @param {Array} betData.selections - Array of selections
   * @param {string} betData.selections[].match_id - Match ID
   * @param {string} betData.selections[].market_key - Market key (e.g., '1X2', 'DC')
   * @param {string} betData.selections[].outcome_key - Outcome key (e.g., 'home', 'draw', 'away')
   * @param {string} [betData.placed_via] - How bet was placed ('DIRECT' or 'BOOKING_CODE')
   * @param {string} [betData.booking_code_used] - Booking code if used
   * @returns {Promise<Object>} - Bet response
   */
  placeBet: async (betData) => {
    try {
      const response = await api.post('/bet/place', betData)
      return response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw {
        success: false,
        message: error.message || 'Failed to place bet. Please try again.'
      }
    }
  },

  /**
   * Get user's bet history
   * @param {Object} options - Query options
   * @param {number} [options.limit] - Limit results
   * @param {number} [options.offset] - Offset for pagination
   * @returns {Promise<Object>} - List of bets
   */
  getUserBets: async (options = {}) => {
    try {
      const params = new URLSearchParams()
      if (options.limit) params.append('limit', options.limit)
      if (options.offset) params.append('offset', options.offset)
      
      const queryString = params.toString()
      const url = `/bet/my-bets${queryString ? `?${queryString}` : ''}`
      
      const response = await api.get(url)
      return response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw {
        success: false,
        message: error.message || 'Failed to fetch bet history.'
      }
    }
  },

  /**
   * Get bet details by ticket code
   * @param {string} ticketCode - Ticket code (e.g., TK-12345678)
   * @returns {Promise<Object>} - Bet details
   */
  getBetByTicketCode: async (ticketCode) => {
    try {
      const response = await api.get(`/bet/ticket/${ticketCode}`)
      return response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw {
        success: false,
        message: error.message || 'Failed to fetch bet details.'
      }
    }
  }
}

export default BetService