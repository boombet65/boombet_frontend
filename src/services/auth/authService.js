// services/authService.js
import api from '../api'

const authService = {
  async register(phone_number, password) {
    try {
      const response = await api.post('/auth/register', {
        phone_number,
        password
      })
      
      console.log('🔍 Register response:', response.data)
      
      if (response.data?.data) {
        const { user, tokens } = response.data.data
        
        if (tokens?.access_token) {
          localStorage.setItem('access_token', tokens.access_token)
        }
        if (tokens?.refresh_token) {
          localStorage.setItem('refresh_token', tokens.refresh_token)
        }
        
        return {
          success: true,
          user: user,
          tokens: tokens,
          message: response.data.message
        }
      }
      
      return { success: false, message: 'Invalid response' }
    } catch (error) {
      console.error('Register error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  },

  async login(phone_number, password) {
    console.log('🚀 ===== AUTH SERVICE LOGIN CALLED =====')
    console.log('📞 Phone:', phone_number)
    console.log('🔑 Password:', password)
    
    try {
      console.log('⏳ Calling API: POST /auth/login')
      
      const response = await api.post('/auth/login', {
        phone_number,
        password
      })
      
      console.log('✅ ===== API RESPONSE RECEIVED =====')
      console.log('📦 Full response object:', response)
      console.log('📦 response.status:', response.status)
      console.log('📦 response.data:', response.data)
      console.log('📦 response.data.data:', response.data?.data)
      
      // Check if response has data
      if (response.data?.data) {
        const user = response.data.data.user
        const tokens = response.data.data.tokens
        
        console.log('👤 User data:', user)
        console.log('🔑 Tokens data:', tokens)
        console.log('🔑 access_token:', tokens?.access_token)
        console.log('🔑 refresh_token:', tokens?.refresh_token)
        
        // Save tokens to localStorage
        if (tokens?.access_token) {
          localStorage.setItem('access_token', tokens.access_token)
          console.log('💾 access_token saved to localStorage')
        }
        if (tokens?.refresh_token) {
          localStorage.setItem('refresh_token', tokens.refresh_token)
          console.log('💾 refresh_token saved to localStorage')
        }
        
        // Return success with data
        const result = {
          success: true,
          user: user,
          tokens: {
            access_token: tokens?.access_token,
            refresh_token: tokens?.refresh_token
          },
          message: response.data.message || 'Login successful'
        }
        
        console.log('📤 Returning from authService:', result)
        return result
      }
      
      // If no data in response
      console.error('❌ No data in response:', response.data)
      return {
        success: false,
        message: response.data?.message || 'Invalid response from server'
      }
      
    } catch (error) {
      console.error('❌ ===== LOGIN ERROR =====')
      console.error('❌ Error object:', error)
      console.error('❌ error.message:', error.message)
      console.error('❌ error.response:', error.response)
      console.error('❌ error.response?.data:', error.response?.data)
      console.error('❌ error.response?.status:', error.response?.status)
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed. Please try again.'
      }
    }
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    return { success: true }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      
      if (response.data?.data) {
        return {
          success: true,
          user: response.data.data,
          message: response.data.message
        }
      }
      
      return { success: false, message: 'Failed to get profile' }
    } catch (error) {
      console.error('Get profile error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      }
    }
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (!refreshToken) {
        return { success: false, message: 'No refresh token' }
      }
      
      const response = await api.post('/auth/refresh', { refreshToken })
      
      if (response.data?.data?.accessToken) {
        const newAccessToken = response.data.data.accessToken
        localStorage.setItem('access_token', newAccessToken)
        
        return {
          success: true,
          accessToken: newAccessToken,
          message: response.data.message
        }
      }
      
      return { success: false, message: 'Failed to refresh' }
    } catch (error) {
      console.error('Refresh token error:', error)
      this.logout()
      return {
        success: false,
        message: 'Session expired'
      }
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  async forgotPassword(phone_number) {
    try {
      const response = await api.post('/auth/forgot-password', { phone_number })
      
      return {
        success: true,
        userId: response.data?.userId,
        message: response.data?.message || 'Reset link sent'
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process request'
      }
    }
  },

  async resetPassword(userId, newPassword, confirmPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        userId,
        newPassword,
        confirmPassword
      })
      
      return {
        success: true,
        message: response.data?.message || 'Password reset successfully'
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password'
      }
    }
  },

  async changePassword(phone_number, newPassword, confirmPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        phone_number,
        newPassword,
        confirmPassword
      })
      
      return {
        success: true,
        message: response.data?.message || 'Password changed successfully'
      }
    } catch (error) {
      console.error('Change password error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password'
      }
    }
  },

  async getBalance() {
    try {
      const response = await api.get('/auth/profile')
      
      if (response.data?.data) {
        return {
          success: true,
          balance: response.data.data.balance || 0,
          data: response.data.data,
          message: response.data.message
        }
      }
      
      return { success: false, message: 'Failed to get balance' }
    } catch (error) {
      console.error('Get balance error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get balance'
      }
    }
  },


}

export default authService