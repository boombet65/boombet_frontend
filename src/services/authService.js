// services/authService.js
import api from './api'

const authService = {
  // REGISTER - kujiandikisha
  async register(phone_number, password) {
    try {
      const response = await api.post('/auth/register', {
        phone_number,
        password
      })
      
      // Backend inarudisha: { message, data: { id, phone_number } }
      if (response.data && response.data.data) {
        return {
          success: true,
          user: response.data.data,
          message: response.data.message
        }
      }
      
      return {
        success: true,
        user: response.data,
        message: 'Registration successful'
      }
    } catch (error) {
      console.error('Register error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      }
    }
  },

  // LOGIN - kuingia
  async login(phone_number, password) {
    try {
      const response = await api.post('/auth/login', {
        phone_number,
        password
      })
      
      // Backend inarudisha: { message, data: { id, phone_number, accessToken, refreshToken } }
      if (response.data && response.data.data) {
        const { accessToken, refreshToken, id, phone_number: userPhone } = response.data.data
        
        // Hifadhi token kwenye localStorage
        if (accessToken) {
          localStorage.setItem('access_token', accessToken)
        }
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
        
        return {
          success: true,
          user: {
            id,
            phone_number: userPhone
          },
          tokens: {
            accessToken,
            refreshToken
          },
          message: response.data.message
        }
      }
      
      return {
        success: false,
        message: 'Invalid response from server'
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Invalid phone or password.'
      }
    }
  },

  // LOGOUT - kutoka
  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    return { success: true, message: 'Logged out successfully' }
  },

  // GET CURRENT USER PROFILE - kupata taarifa za user aliyeingia
  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      
      if (response.data && response.data.data) {
        return {
          success: true,
          user: response.data.data,
          message: response.data.message
        }
      }
      
      return {
        success: false,
        message: 'Failed to get profile'
      }
    } catch (error) {
      console.error('Get profile error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      }
    }
  },

 


  // services/authService.js
async getBalance() {
  try {
    // 👇 Badilisha kutoka '/account' kwenda '/account/balance'
    const response = await api.get('/account/balance')
    
    if (response.data && response.data.data) {
      return {
        success: true,
        balance: response.data.data.balance,
        data: response.data.data,
        message: response.data.message
      }
    }
    
    return {
      success: false,
      message: 'Failed to get balance'
    }
  } catch (error) {
    console.error('Get balance error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get balance'
    }
  }
},
  // REFRESH TOKEN - kubadilisha token iliyomalizika muda
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (!refreshToken) {
        return {
          success: false,
          message: 'No refresh token found'
        }
      }
      
      const response = await api.post('/auth/refresh', { refreshToken })
      
      if (response.data && response.data.data && response.data.data.accessToken) {
        const newAccessToken = response.data.data.accessToken
        localStorage.setItem('access_token', newAccessToken)
        
        return {
          success: true,
          accessToken: newAccessToken,
          message: 'Token refreshed successfully'
        }
      }
      
      return {
        success: false,
        message: 'Failed to refresh token'
      }
    } catch (error) {
      console.error('Refresh token error:', error)
      // Kama refresh token imekataa, fanya logout
      this.logout()
      return {
        success: false,
        message: 'Session expired. Please login again.'
      }
    }
  },

  // CHECK IF USER IS LOGGED IN - angalia kama user ameingia
  isAuthenticated() {
    const token = localStorage.getItem('access_token')
    return !!token // Inarudisha true kama token ipo
  },

  // FORGOT PASSWORD - kusahau password (hatua ya kwanza)
  async forgotPassword(phone_number) {
    try {
      const response = await api.post('/auth/forgot-password', { phone_number })
      
      return {
        success: true,
        userId: response.data.userId,
        message: response.data.message
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process request'
      }
    }
  },

  // RESET PASSWORD - kuweka password mpya (hatua ya pili)
  async resetPassword(userId, newPassword, confirmPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        userId,
        newPassword,
        confirmPassword
      })
      
      return {
        success: true,
        message: response.data.message
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password'
      }
    }
  },

  // CHANGE PASSWORD kwa moja kwa kutumia phone number
  async changePassword(phone_number, newPassword, confirmPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        phone_number,
        newPassword,
        confirmPassword
      })
      
      return {
        success: true,
        message: response.data.message
      }
    } catch (error) {
      console.error('Change password error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password'
      }
    }
  }
}

export default authService