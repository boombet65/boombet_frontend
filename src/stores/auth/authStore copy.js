// store/authStore.js
import { defineStore } from 'pinia'
import authService from '../../services/auth/authService'

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
      if (state.user.balance === null || state.user.balance === undefined) {
        return 'TZS 0'
      }
      return `TZS ${Number(state.user.balance).toLocaleString()}`
    }
  },
  
  actions: {
    async initialize() {
      console.log('🔄 Initializing auth store...')
      
      const token = localStorage.getItem('access_token')
      
      if (token) {
        try {
          const decoded = decodeToken(token)
          console.log('🔓 Decoded token:', decoded)
          
          if (decoded) {
            this.user.id = decoded.id || decoded.userId || decoded.sub
            this.user.role = decoded.role || 'USER'
            this.isLoggedIn = true
            this.accessToken = token
            
            console.log('✅ Role from token:', this.user.role)
            
            await this.fetchUserProfile()
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
    
    async login(phone_number, password) {
      this.isLoading = true
      this.error = null
      
      try {

        console.log('📨 Login response in authStore :')
        
        const result = await authService.login(phone_number, password)


        console.log('📨 Login response in authStore :', result)
        
        if (result.success) {
          // ============ REKEBISHA HAPA ============
          // Backend inarudisha: tokens.access_token (na underscore)
          const token = result.tokens?.access_token
          console.log('🔑 Access token from response:', token )
          
          if (!token) {
            console.error('❌ No token in response:', result)
            throw new Error('No token received from server')
          }
          
          this.accessToken = token
          this.refreshToken = result.tokens?.refresh_token || null
          
          const decoded = decodeToken(token)
          console.log('🔓 Decoded token on login:', decoded)
          
          this.user = {
            id: result.user?.id || decoded?.id || decoded?.userId || decoded?.sub,
            phone_number: result.user?.phone_number || phone_number,
            role: decoded?.role || result.user?.role || 'USER',
            balance: result.user?.balance || 0,
            created_at: result.user?.created_at || result.user?.createdAt || null,
            updated_at: result.user?.updated_at || result.user?.updatedAt || null
          }
          
          this.isLoggedIn = true
          
          console.log('✅ Login successful. Role:', this.user.role)
          
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
    
    logout() {
      authService.logout()
      this.clearAuth()
      return { success: true, message: 'Logged out successfully' }
    },
    
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
    
    async fetchUserProfile() {
      if (!authService.isAuthenticated()) {
        return { success: false, message: 'Not authenticated' }
      }
      
      this.isLoading = true
      
      try {
        const result = await authService.getProfile()
        console.log('📨 Profile response:', result)
        
        if (result.success) {
          this.user.phone_number = result.user.phone_number || this.user.phone_number
          this.user.balance = result.user.balance || result.user.balance === 0 ? result.user.balance : this.user.balance
          this.user.created_at = result.user.created_at || result.user.createdAt || this.user.created_at
          this.user.updated_at = result.user.updated_at || result.user.updatedAt || this.user.updated_at
          
          // USIBADILI ROLE - Inatoka kwenye token
          // this.user.role = result.user.role // ONDOA HII!
          
          console.log('✅ Profile fetched. Role from token:', this.user.role)
          console.log('💰 Balance from profile:', this.user.balance)
          
          return { success: true, user: this.user }
        } else {
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },
    
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
    },
    
    async changePassword(phone_number, newPassword, confirmPassword) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authService.changePassword(phone_number, newPassword, confirmPassword)
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