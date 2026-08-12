// src/services/money/money.service.js

import api from '../api'

const MoneyService = {
  /**
   * Deposit money to user account
   * @param {Object} data - Deposit data
   * @param {string} data.userId - User ID
   * @param {number} data.amount - Amount to deposit
   * @returns {Promise<Object>} - Response with updated user data
   */
  deposit: async (data) => {
    try {
      const response = await api.post('/money/deposite', data)
      return response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw {
        success: false,
        message: error.message || 'Failed to deposit. Please try again.'
      }
    }
  },

  /**
   * Withdraw money from user account
   * @param {Object} data - Withdraw data
   * @param {string} data.userId - User ID
   * @param {number} data.amount - Amount to withdraw
   * @returns {Promise<Object>} - Response with updated user data
   */
  withdraw: async (data) => {
    try {
      const response = await api.post('/money/withdraw', data)
      return response.data
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data
      }
      throw {
        success: false,
        message: error.message || 'Failed to withdraw. Please try again.'
      }
    }
  }
}

export default MoneyService