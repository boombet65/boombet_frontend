// stores/manageUsersStore.js
import { defineStore } from 'pinia'
import manageUsersService from '../services/manageUsersService'

export const useManageUsersStore = defineStore('manageUsers', {
  state: () => ({
    users: [],
    total: 0,
    loading: false,
    error: null,
    pagination: {
      limit: 50,
      offset: 0,
      hasMore: false
    }
  }),

  getters: {
    // Get all users
    allUsers: (state) => state.users,
    
    // Get total count
    totalUsers: (state) => state.total,
    
    // Check if loading
    isLoading: (state) => state.loading,
    
    // Check if has error
    hasError: (state) => !!state.error,
    
    // Get error message
    errorMessage: (state) => state.error,
    
    // Check if there are more users to load
    hasMoreUsers: (state) => state.pagination.hasMore
  },

  actions: {
    /**
     * Fetch all users with pagination and search
     * @param {Object} params - { search, limit, offset }
     */
    async fetchUsers(params = {}) {
      this.loading = true
      this.error = null

      try {
        const result = await manageUsersService.getUsers({
          limit: this.pagination.limit,
          offset: this.pagination.offset,
          ...params
        })

        if (result.success) {
          this.users = result.data.users || []
          this.total = result.data.total || 0
          this.pagination.hasMore = result.data.hasMore || false
          
          return { success: true, data: result.data }
        } else {
          this.error = result.message
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message || 'Failed to fetch users'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch user by ID
     * @param {string} id - User ID
     */
    async fetchUserById(id) {
      this.loading = true
      this.error = null

      try {
        const result = await manageUsersService.getUserById(id)

        if (result.success) {
          return { success: true, data: result.data }
        } else {
          this.error = result.message
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message || 'Failed to fetch user'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch user by phone number
     * @param {string} phone - Phone number
     */
    async fetchUserByPhone(phone) {
      this.loading = true
      this.error = null

      try {
        const result = await manageUsersService.getUserByPhone(phone)

        if (result.success) {
          return { success: true, data: result.data }
        } else {
          this.error = result.message
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message || 'Failed to fetch user'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Adjust user balance
     * @param {string} id - User ID
     * @param {string} action - 'add', 'deduct', or 'set'
     * @param {number} amount - Amount to adjust
     */
    async updateUserBalance(id, action, amount) {
      this.loading = true
      this.error = null

      try {
        const result = await manageUsersService.adjustBalance(id, action, amount)

        if (result.success) {
          // Update user in local list
          const index = this.users.findIndex(u => u.id === id)
          if (index !== -1 && result.data) {
            this.users[index] = {
              ...this.users[index],
              balance: result.data.new_balance
            }
          }
          
          return { success: true, data: result.data }
        } else {
          this.error = result.message
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message || 'Failed to update balance'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete user
     * @param {string} id - User ID
     */
    async removeUser(id) {
      this.loading = true
      this.error = null

      try {
        const result = await manageUsersService.deleteUser(id)

        if (result.success) {
          // Remove user from local list
          this.users = this.users.filter(u => u.id !== id)
          this.total = this.total - 1
          
          return { success: true, data: result.data }
        } else {
          this.error = result.message
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = error.message || 'Failed to delete user'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Search users by phone number or name
     * @param {string} query - Search query
     */
    async searchUsers(query) {
      if (!query || query.length < 2) {
        return await this.fetchUsers({ search: '' })
      }
      
      return await this.fetchUsers({ search: query })
    },

    /**
     * Reset pagination and fetch first page
     */
    async resetAndFetch() {
      this.pagination.offset = 0
      return await this.fetchUsers()
    },

    /**
     * Load next page
     */
    async loadNextPage() {
      if (!this.pagination.hasMore) {
        return { success: false, message: 'No more users to load' }
      }

      this.pagination.offset = this.pagination.offset + this.pagination.limit
      return await this.fetchUsers()
    },

    /**
     * Clear store state
     */
    clear() {
      this.users = []
      this.total = 0
      this.loading = false
      this.error = null
      this.pagination = {
        limit: 50,
        offset: 0,
        hasMore: false
      }
    }
  }
})