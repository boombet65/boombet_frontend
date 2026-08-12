// services/manageUsersService.js
import api from './api'

const manageUsersService = {
  /**
   * GET /api/admin/users - Get all users with pagination and search
   * @param {Object} params - { search, limit, offset }
   */
  async getUsers(params = {}) {
    try {
      const response = await api.get('/admin/users', { params })
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }
      
      return {
        success: false,
        message: response.data?.message || 'Failed to fetch users'
      }
    } catch (error) {
      console.error('Get users error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users'
      }
    }
  },

  /**
   * GET /api/admin/users/:id - Get user by ID
   * @param {string} id - User ID
   */
  async getUserById(id) {
    try {
      const response = await api.get(`/admin/users/${id}`)
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }
      
      return {
        success: false,
        message: response.data?.message || 'User not found'
      }
    } catch (error) {
      console.error('Get user by ID error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user'
      }
    }
  },

  /**
   * GET /api/admin/users/phone/:phone - Get user by phone number
   * @param {string} phone - Phone number
   */
  async getUserByPhone(phone) {
    try {
      const response = await api.get(`/admin/users/phone/${phone}`)
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }
      
      return {
        success: false,
        message: response.data?.message || 'User not found'
      }
    } catch (error) {
      console.error('Get user by phone error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user'
      }
    }
  },

  /**
   * PATCH /api/admin/users/:id/balance - Adjust user balance
   * @param {string} id - User ID
   * @param {string} action - 'add', 'deduct', or 'set'
   * @param {number} amount - Amount to adjust
   */
  async adjustBalance(id, action, amount) {
    try {
      const response = await api.patch(`/admin/users/${id}/balance`, {
        action,
        amount
      })
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Balance updated successfully'
        }
      }
      
      return {
        success: false,
        message: response.data?.message || 'Failed to update balance'
      }
    } catch (error) {
      console.error('Adjust balance error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update balance'
      }
    }
  },

  /**
   * DELETE /api/admin/users/:id - Delete user
   * @param {string} id - User ID
   */
  async deleteUser(id) {
    try {
      const response = await api.delete(`/admin/users/${id}`)
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'User deleted successfully'
        }
      }
      
      return {
        success: false,
        message: response.data?.message || 'Failed to delete user'
      }
    } catch (error) {
      console.error('Delete user error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user'
      }
    }
  }
}

export default manageUsersService