// stores/bookingCodeStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import bookingCodeService from '../services/bookingCodeService'

export const useBookingCodeStore = defineStore('bookingCode', () => {
  // State
  const isLoading = ref(false)
  const isCreating = ref(false)
  const currentBookingCode = ref(null)
  const expiresAt = ref(null)
  const error = ref(null)
  
  // Loaded slip data
  const loadedSelections = ref([])
  const loadedExpiresAt = ref(null)
  const loadedCreatedAt = ref(null)
  
  // Check result
  const codeCheckResult = ref(null)

  /**
   * Create a new booking code from current slip selections
   * @param {Array} selections - Selections from betStore
   * @returns {Promise<Object>} Result with booking code
   */
  const createCode = async (selections) => {
    if (!selections || selections.length === 0) {
      error.value = { message: 'Add selections to create booking code' }
      return { success: false, message: 'Add selections to create booking code' }
    }
    
    isCreating.value = true
    error.value = null
    
    try {
      const result = await bookingCodeService.createBookingCode(selections)
      
      if (result.success) {
        currentBookingCode.value = result.data.bookingCode
        expiresAt.value = result.data.expiresAt
        
        return {
          success: true,
          bookingCode: result.data.bookingCode,
          expiresAt: result.data.expiresAt,
          expiresInHours: result.data.expiresInHours
        }
      } else {
        error.value = { message: result.message }
        return { success: false, message: result.message }
      }
    } catch (err) {
      error.value = { message: err.message }
      return { success: false, message: err.message }
    } finally {
      isCreating.value = false
    }
  }

  /**
   * Load booking code and get selections
   * @param {string} code - Booking code to load
   * @returns {Promise<Object>} Result with selections
   */
  const loadCode = async (code) => {
    if (!code) {
      error.value = { message: 'Booking code is required' }
      return { success: false, message: 'Booking code is required' }
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const result = await bookingCodeService.loadBookingCode(code)
      
      if (result.success) {
        loadedSelections.value = result.data.selections
        loadedExpiresAt.value = result.data.expiresAt
        loadedCreatedAt.value = result.data.createdAt
        
        return {
          success: true,
          selections: result.data.selections,
          expiresAt: result.data.expiresAt,
          createdAt: result.data.createdAt
        }
      } else {
        error.value = { message: result.message, isExpired: result.isExpired }
        return { 
          success: false, 
          message: result.message,
          isExpired: result.isExpired
        }
      }
    } catch (err) {
      error.value = { message: err.message }
      return { success: false, message: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check if a booking code exists and is active
   * @param {string} code - Booking code to check
   * @returns {Promise<Object>} Result with status
   */
  const checkCode = async (code) => {
    if (!code) {
      return { success: false, message: 'Booking code is required' }
    }
    
    try {
      const result = await bookingCodeService.checkBookingCode(code)
      
      if (result.success) {
        codeCheckResult.value = result.data
        return {
          success: true,
          exists: result.data.exists,
          isActive: result.data.isActive,
          isExpired: result.data.isExpired,
          expiresAt: result.data.expiresAt,
          selectionsCount: result.data.selectionsCount,
          message: result.data.message
        }
      } else {
        return { success: false, message: result.message }
      }
    } catch (err) {
      console.error('Check code error:', err)
      return { success: false, message: err.message }
    }
  }

  /**
   * Clear loaded selections (after applying to slip or on close)
   */
  const clearLoadedSelections = () => {
    loadedSelections.value = []
    loadedExpiresAt.value = null
    loadedCreatedAt.value = null
    codeCheckResult.value = null
  }

  /**
   * Clear current created booking code
   */
  const clearCurrentCode = () => {
    currentBookingCode.value = null
    expiresAt.value = null
  }

  /**
   * Reset all state
   */
  const reset = () => {
    isLoading.value = false
    isCreating.value = false
    currentBookingCode.value = null
    expiresAt.value = null
    error.value = null
    loadedSelections.value = []
    loadedExpiresAt.value = null
    loadedCreatedAt.value = null
    codeCheckResult.value = null
  }

  return {
    // State
    isLoading,
    isCreating,
    currentBookingCode,
    expiresAt,
    error,
    loadedSelections,
    loadedExpiresAt,
    loadedCreatedAt,
    codeCheckResult,
    
    // Actions
    createCode,
    loadCode,
    checkCode,
    clearLoadedSelections,
    clearCurrentCode,
    reset
  }
})