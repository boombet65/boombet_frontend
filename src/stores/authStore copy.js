// store/authStore.js
import { defineStore } from 'pinia'
import authService from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // User data
    user: {
      id: null,
      phone_number: null,
      balance: null,
      created_at: null,
      updated_at: null
    },
    
    // UI states
    isLoggedIn: false,
    isLoading: false,
    error: null,
    
    // Token (optional, tayari ipo localStorage)
    accessToken: null,
    refreshToken: null
  }),
  
  getters: {
    // Get user's phone number
    userPhone: (state) => state.user.phone_number,
    
    // Get user's balance
    userBalance: (state) => state.user.balance,
    
    // Check if user has sufficient balance
    hasSufficientBalance: (state) => (amount) => {
      return state.user.balance >= amount
    },
    
    // Format balance with TZS
    formattedBalance: (state) => {
      if (state.user.balance === null) return 'TZS 0'
      return `TZS ${state.user.balance.toLocaleString()}`
    }
  },
  
  actions: {
    // Initialize store - check if user is already logged in
    async initialize() {
      console.log('Initializing auth store...')
      
      // Check if token exists
      if (authService.isAuthenticated()) {
        // Try to get user profile
        await this.fetchUserProfile()
        await this.fetchUserBalance()
      } else {
        this.clearAuth()
      }
    },
    


    
    // REGISTER - kujiandikisha
    async register(phone_number, password) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authService.register(phone_number, password)
        
        if (result.success) {
          // Baada ya registration, ingiza mtumiaji kiotomatiki
          return await this.login(phone_number, password)
        } else {
          this.error = result.message
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    // LOGIN - kuingia
    async login(phone_number, password) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authService.login(phone_number, password)
        
        if (result.success) {
          // Update store state
          this.user.id = result.user.id
          this.user.phone_number = result.user.phone_number
          this.isLoggedIn = true
          this.accessToken = result.tokens.accessToken
          this.refreshToken = result.tokens.refreshToken
          
          // Fetch balance after login
          await this.fetchUserBalance()
          
          return { 
            success: true, 
            user: this.user,
            message: result.message 
          }
        } else {
          this.error = result.message
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    // LOGOUT - kutoka
    logout() {
      authService.logout()
      this.clearAuth()
      return { success: true, message: 'Logged out successfully' }
    },
    
    // Clear all auth data
    clearAuth() {
      this.user = {
        id: null,
        phone_number: null,
        balance: null,
        created_at: null,
        updated_at: null
      }
      this.isLoggedIn = false
      this.accessToken = null
      this.refreshToken = null
      this.error = null
    },
    
    // FETCH USER PROFILE
    async fetchUserProfile() {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Not authenticated' }
      }
      
      this.isLoading = true
      
      try {
        const result = await authService.getProfile()
        
        if (result.success) {
          this.user.id = result.user.id
          this.user.phone_number = result.user.phone_number
          this.user.created_at = result.user.created_at
          this.user.updated_at = result.user.updated_at
          this.isLoggedIn = true
          
          return { success: true, user: this.user }
        } else {
          // Token might be invalid
          this.clearAuth()
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    // FETCH USER BALANCE
    async fetchUserBalance() {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Not authenticated' }
      }
      
      try {
        const result = await authService.getBalance()
        
        if (result.success) {
          this.user.balance = result.balance
          return { success: true, balance: this.user.balance }
        } else {
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      }
    },
    
    // UPDATE BALANCE LOCALLY (baada ya deposit/withdraw)
    updateBalanceLocally(newBalance) {
      this.user.balance = newBalance
    },
    
    // DEPOSIT - weka pesa (inafungua link ya payou)
    async initiateDeposit(amount) {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Please login first' }
      }
      
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/deposit', { amount })
        
        if (response.data && response.data.data && response.data.data.paymentUrl) {
          // Fungua payment page
          window.location.href = response.data.data.paymentUrl
          return { success: true, paymentUrl: response.data.data.paymentUrl }
        } else {
          return { success: false, message: 'Failed to initiate deposit' }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Deposit failed'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    // WITHDRAW - toa pesa
    async withdraw(amount) {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Please login first' }
      }
      
      // Check if user has enough balance
      if (this.user.balance < amount) {
        return { 
          success: false, 
          message: `Insufficient balance. Your balance is TZS ${this.user.balance.toLocaleString()}` 
        }
      }
      
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/withdraw', { amount })
        
        if (response.data) {
          // Update balance locally
          if (response.data.data && response.data.data.new_balance) {
            this.user.balance = response.data.data.new_balance
          } else {
            // Fetch fresh balance
            await this.fetchUserBalance()
          }
          
          return { 
            success: true, 
            message: response.data.message,
            newBalance: this.user.balance
          }
        } else {
          return { success: false, message: 'Withdrawal failed' }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Withdrawal failed'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    // FORGOT PASSWORD - hatua ya kwanza
    async forgotPassword(phone_number) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authService.forgotPassword(phone_number)
        return result
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
    // RESET PASSWORD - hatua ya pili
    async resetPassword(userId, newPassword, confirmPassword) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authService.resetPassword(userId, newPassword, confirmPassword)
        return result
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    }
  }
})