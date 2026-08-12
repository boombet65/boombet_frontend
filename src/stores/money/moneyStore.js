// src/stores/money/moneyStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import MoneyService from '../../services/money/money.service'
import { useAuthStore } from '../auth/authStore'

export const useMoneyStore = defineStore('moneyStore', () => {
  // ============ STATE ============
  const isLoading = ref(false)
  const error = ref(null)
  const transactionResult = ref(null)
  const isProcessing = ref(false)

  // ============ GETTERS ============
  const hasError = computed(() => error.value !== null)
  const isSuccess = computed(() => transactionResult.value !== null && transactionResult.value.success)

  // ============ ACTIONS ============

  /**
   * Deposit money to user account
   * @param {Object} data - Deposit data
   * @param {string} data.userId - User ID (optional, will use from auth store if not provided)
   * @param {number} data.amount - Amount to deposit
   * @returns {Promise<Object>} - Result of deposit operation
   */
  const deposit = async (data) => {
    isLoading.value = true
    error.value = null
    transactionResult.value = null

    try {
      // Get auth store to access user info
      const authStore = useAuthStore()
      
      // Use userId from auth store if not provided
      const userId = data.userId || authStore.user?.id
      
      if (!userId) {
        throw new Error('User ID is required. Please login first.')
      }

      if (!data.amount || data.amount <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      const payload = {
        userId: userId,
        amount: data.amount
      }

      const response = await MoneyService.deposit(payload)
      
      if (response.success) {
        transactionResult.value = {
          success: true,
          data: response.data,
          message: response.message || 'Deposit successful!'
        }

        // Update user balance in auth store
        if (response.data?.user?.balance !== undefined) {
          await authStore.updateUserBalance(response.data.user.balance)
        }

        return {
          success: true,
          data: response.data,
          message: response.message || 'Deposit successful!'
        }
      } else {
        throw new Error(response.message || 'Failed to deposit')
      }
    } catch (err) {
      error.value = err.message || 'Something went wrong during deposit'
      transactionResult.value = {
        success: false,
        message: error.value
      }
      return {
        success: false,
        error: error.value,
        message: error.value
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Withdraw money from user account
   * @param {Object} data - Withdraw data
   * @param {string} data.userId - User ID (optional, will use from auth store if not provided)
   * @param {number} data.amount - Amount to withdraw
   * @returns {Promise<Object>} - Result of withdraw operation
   */
  const withdraw = async (data) => {
    isLoading.value = true
    error.value = null
    transactionResult.value = null

    try {
      // Get auth store to access user info
      const authStore = useAuthStore()
      
      // Use userId from auth store if not provided
      const userId = data.userId || authStore.user?.id
      
      if (!userId) {
        throw new Error('User ID is required. Please login first.')
      }

      if (!data.amount || data.amount <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      // Check if user has enough balance
      const currentBalance = authStore.userBalance || 0
      if (currentBalance < data.amount) {
        throw new Error('Insufficient balance. You have TZS ' + currentBalance.toLocaleString())
      }

      const payload = {
        userId: userId,
        amount: data.amount
      }

      const response = await MoneyService.withdraw(payload)
      
      if (response.success) {
        transactionResult.value = {
          success: true,
          data: response.data,
          message: response.message || 'Withdrawal successful!'
        }

        // Update user balance in auth store
        if (response.data?.user?.balance !== undefined) {
          await authStore.updateUserBalance(response.data.user.balance)
        }

        return {
          success: true,
          data: response.data,
          message: response.message || 'Withdrawal successful!'
        }
      } else {
        throw new Error(response.message || 'Failed to withdraw')
      }
    } catch (err) {
      error.value = err.message || 'Something went wrong during withdrawal'
      transactionResult.value = {
        success: false,
        message: error.value
      }
      return {
        success: false,
        error: error.value,
        message: error.value
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset transaction state
   */
  const resetTransaction = () => {
    transactionResult.value = null
    error.value = null
  }

  /**
   * Clear error
   */
  const clearError = () => {
    error.value = null
  }

  // ============ RETURN ============
  return {
    // State
    isLoading,
    error,
    transactionResult,
    isProcessing,
    
    // Getters
    hasError,
    isSuccess,
    
    // Actions
    deposit,
    withdraw,
    resetTransaction,
    clearError
  }
})