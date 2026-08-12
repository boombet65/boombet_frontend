// stores/bookingCode/useBookingCodeStore.js
import { defineStore } from 'pinia'
import { bookingCodeService } from '../../services/bookingCode/bookingCode.service'

export const useBookingCodeStore = defineStore('bookingCode', {
  state: () => ({
    currentBookingCode: null,
    bookingCodeDetails: null,
    isLoading: false,
    isCreating: false,
    isFetching: false,
    error: null,
    recentCodes: []
  }),

  getters: {
    hasBookingCode: (state) => !!state.currentBookingCode?.code,
    formattedCode: (state) => state.currentBookingCode?.code || null,
    totalOdds: (state) => state.currentBookingCode?.totalOdds || 0,
    potentialWinnings: (state) => state.currentBookingCode?.potentialWinnings || 0,
    selectionCount: (state) => state.currentBookingCode?.matches?.length || 0,
    isValid: (state) => state.currentBookingCode?.status === 'ACTIVE' || 
             state.currentBookingCode?.status === 'PENDING'
  },

  actions: {
    async createBookingCode(selections) {
      console.log('🚀 createBookingCode STARTED')
      console.log('📤 Original selections:', selections)
      
      this.isCreating = true
      this.error = null
      
      try {
        if (!selections || selections.length === 0) {
          throw new Error('Tafadhali chagua angalau mechi moja.')
        }
        
        if (selections.length > 20) {
          throw new Error('Huwezi kuchagua zaidi ya mechi 20 kwa booking code moja.')
        }

        const response = await bookingCodeService.createBookingCode(selections)
        console.log('📨 API Response:', response.data)
        
        if (response.data?.data) {
          this.currentBookingCode = response.data.data
          
          this.recentCodes.unshift({
            code: response.data.data.code,
            selections: selections.length,
            createdAt: new Date().toISOString()
          })
          
          if (this.recentCodes.length > 10) {
            this.recentCodes = this.recentCodes.slice(0, 10)
          }
          
          return {
            success: true,
            data: response.data.data,
            bookingCode: response.data.data.code,
            message: response.data.message || 'Booking code imetengenezwa kikamilifu.'
          }
        }
        
        return {
          success: false,
          message: 'Failed to create booking code'
        }
        
      } catch (error) {
        console.error('[BOOKING CODE STORE] Create error:', error)
        console.error('error.response:', error.response)
        console.error('error.response?.data:', error.response?.data)
        
        this.error = error.response?.data?.message || error.message || 'Imeshindikana kuunda booking code'
        return {
          success: false,
          message: this.error
        }
      } finally {
        this.isCreating = false
      }
    },

    async fetchBookingCodeDetails(code) {
      console.log('🚀 fetchBookingCodeDetails STARTED with:', code)
      
      this.isFetching = true
      this.error = null
      
      try {
        if (!code) {
          throw new Error('Tafadhali ingiza booking code.')
        }

        const response = await bookingCodeService.getBookingCodeDetails(code)
        console.log('📨 API Response:', response.data)
        
        if (response.data?.data) {
          this.bookingCodeDetails = response.data.data
          return {
            success: true,
            data: response.data.data,
            message: response.data.message || 'Booking code imepatikana.'
          }
        }
        
        return {
          success: false,
          message: 'Booking code haijapatikana.'
        }
        
      } catch (error) {
        console.error('[BOOKING CODE STORE] Fetch error:', error)
        this.error = error.response?.data?.message || error.message || 'Imeshindikana kupata booking code'
        return {
          success: false,
          message: this.error
        }
      } finally {
        this.isFetching = false
      }
    },

    clearBookingCode() {
      this.currentBookingCode = null
      this.bookingCodeDetails = null
      this.error = null
    },

    async validateBookingCode(code) {
      try {
        const result = await this.fetchBookingCodeDetails(code)
        return result.success && this.bookingCodeDetails?.status === 'ACTIVE'
      } catch (error) {
        return false
      }
    },

    getSelectionDisplay() {
      if (!this.currentBookingCode?.matches) return '0 mechi'
      const count = this.currentBookingCode.matches.length
      return `${count} mechi ${count > 1 ? '' : ''}`
    },

    resetState() {
      this.currentBookingCode = null
      this.bookingCodeDetails = null
      this.error = null
      this.isLoading = false
      this.isCreating = false
      this.isFetching = false
    }
  }
})