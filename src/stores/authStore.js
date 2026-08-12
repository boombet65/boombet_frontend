// store/authStore.js
import { defineStore } from 'pinia'
import authService from '../services/authService'
import api from '../services/api'

// ── Helper: Decode JWT token ──────────────────────────────────────────────
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      id: null,
      phone_number: null,
      role: null,
      balance: null,
      created_at: null,
      updated_at: null
    },
    isLoggedIn: false,
    isLoading: false,
    error: null,
    accessToken: null,
    refreshToken: null
  }),
  
  getters: {
    userPhone: (state) => state.user.phone_number,
    userRole: (state) => state.user.role,
    isAdmin: (state) => state.user.role === 'ADMIN',
    isAgent: (state) => state.user.role === 'AGENT',
    isUser: (state) => state.user.role === 'USER',
    hasRole: (state) => (role) => {
      if (Array.isArray(role)) {
        return role.includes(state.user.role)
      }
      return state.user.role === role
    },
    userBalance: (state) => state.user.balance,
    hasSufficientBalance: (state) => (amount) => {
      return state.user.balance >= amount
    },
    formattedBalance: (state) => {
      if (state.user.balance === null) return 'TZS 0'
      return `TZS ${state.user.balance.toLocaleString()}`
    }
  },
  
  actions: {
    // ── INITIALIZE ──────────────────────────────────────────────────────────
    async initialize() {
      console.log('🔄 Initializing auth store...')
      
      const token = localStorage.getItem('access_token')
      
      if (token) {
        try {
          // 👇 DECODE TOKEN FIRST to get role
          const decoded = decodeToken(token)
          console.log('🔓 Decoded token:', decoded)
          
          if (decoded) {
            // 👇 SET ROLE FROM TOKEN
            this.user.id = decoded.id || decoded.userId || decoded.sub
            this.user.role = decoded.role || 'USER'
            this.isLoggedIn = true
            this.accessToken = token
            
            console.log('✅ Role from token:', this.user.role)
            
            // 👇 FETCH PROFILE - BUT DON'T OVERWRITE ROLE
            await this.fetchUserProfile()
            
            // Fetch balance
            await this.fetchUserBalance()
          } else {
            this.clearAuth()
          }
        } catch (error) {
          console.error('❌ Init error:', error)
          this.clearAuth()
        }
      } else {
        this.clearAuth()
      }
    },
    
    // ── REGISTER ────────────────────────────────────────────────────────────
    async register(phone_number, password) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authService.register(phone_number, password)
        
        if (result.success) {
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
    
    // ── LOGIN ───────────────────────────────────────────────────────────────
    async login(phone_number, password) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authService.login(phone_number, password)
        console.log('📨 Login response:', result)
        
        if (result.success) {
          const token = result.tokens?.accessToken || result.accessToken || result.token
          
          if (!token) {
            throw new Error('No token received from server')
          }
          
          this.accessToken = token
          this.refreshToken = result.tokens?.refreshToken || null
          
          // ── DECODE TOKEN to get role ──────────────────────────────────
          const decoded = decodeToken(token)
          console.log('🔓 Decoded token on login:', decoded)
          
          // 👇 SET USER FROM TOKEN (ROLE INAPOTOKA TOKEN)
          this.user.id = decoded.id || decoded.userId || decoded.sub
          this.user.phone_number = phone_number
          this.user.role = decoded.role || 'USER'
          this.isLoggedIn = true
          
          console.log('✅ Login successful. Role from token:', this.user.role)
          
          // 👇 FETCH PROFILE - BUT DON'T OVERWRITE ROLE
          await this.fetchUserProfile()
          
          // Fetch balance
          await this.fetchUserBalance()
          
          return { 
            success: true, 
            user: this.user,
            message: result.message || 'Login successful'
          }
        } else {
          this.error = result.message || 'Login failed'
          return { success: false, message: this.error }
        }
      } catch (error) {
        console.error('❌ Login error:', error)
        this.error = error.message || 'Login failed'
        return { success: false, message: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    // ── LOGOUT ──────────────────────────────────────────────────────────────
    logout() {
      authService.logout()
      this.clearAuth()
      return { success: true, message: 'Logged out successfully' }
    },
    
    // ── CLEAR AUTH ──────────────────────────────────────────────────────────
    clearAuth() {
      this.user = {
        id: null,
        phone_number: null,
        role: null,
        balance: null,
        created_at: null,
        updated_at: null
      }
      this.isLoggedIn = false
      this.accessToken = null
      this.refreshToken = null
      this.error = null
    },
    
    // ── FETCH USER PROFILE (USI-OVERWRITE ROLE) ──────────────────────────
    async fetchUserProfile() {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Not authenticated' }
      }
      
      this.isLoading = true
      
      try {
        const result = await authService.getProfile()
        console.log('📨 Profile response:', result)
        
        if (result.success) {
          // 👇 UPDATE OTHER FIELDS BUT KEEP ROLE FROM TOKEN
          this.user.phone_number = result.user.phone_number
          this.user.created_at = result.user.created_at
          this.user.updated_at = result.user.updated_at
          
          // 👇 USIBADILI ROLE - TAYARI IPO KUTOKA TOKEN
          // this.user.role = result.user.role || 'USER' // ONDOA HII!
          
          console.log('✅ Profile fetched. Keeping role from token:', this.user.role)
          
          return { success: true, user: this.user }
        } else {
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
    
    // ── FETCH USER BALANCE ──────────────────────────────────────────────────
    async fetchUserBalance() {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Not authenticated' }
      }
      
      try {
        const result = await authService.getBalance()
        console.log('💰 Balance response:', result)
        
        if (result.success) {
          this.user.balance = result.balance || result.data?.balance || 0
          return { success: true, balance: this.user.balance }
        } else {
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      }
    },
    
    // ── UPDATE BALANCE LOCALLY ─────────────────────────────────────────────
    updateBalanceLocally(newBalance) {
      this.user.balance = newBalance
    },
    
    // ── DEPOSIT ─────────────────────────────────────────────────────────────
    async initiateDeposit(amount) {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Please login first' }
      }
      
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/deposit', { amount })
        
        if (response.data && response.data.data && response.data.data.paymentUrl) {
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
    
    // ── WITHDRAW ────────────────────────────────────────────────────────────
    async withdraw(amount) {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Please login first' }
      }
      
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
          if (response.data.data && response.data.data.new_balance) {
            this.user.balance = response.data.data.new_balance
          } else {
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
    
    // ── FORGOT PASSWORD ─────────────────────────────────────────────────────
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
    
    // ── RESET PASSWORD ──────────────────────────────────────────────────────
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