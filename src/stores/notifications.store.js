// store/notifications.store.js
import { defineStore } from 'pinia';
import notificationService from '../services/notifications.service';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    total: 0,
    isLoading: false,
    error: null,
    pagination: {
      limit: 50,
      offset: 0,
      unreadOnly: false
    }
  }),

  getters: {
    // Get all notifications
    allNotifications: (state) => state.notifications,
    
    // Get unread notifications only
    unreadNotifications: (state) => 
      state.notifications.filter(n => !n.is_read),
    
    // Get read notifications only
    readNotifications: (state) => 
      state.notifications.filter(n => n.is_read),
    
    // Check if has more notifications
    hasMore: (state) => 
      state.total > state.notifications.length,
    
    // Get notification by ID
    getNotificationById: (state) => (id) => 
      state.notifications.find(n => n.id === id)
  },

  actions: {
    // ============================================
    // USER ACTIONS
    // ============================================

    /**
     * Fetch user's notifications
     */
    async fetchMyNotifications(params = {}) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const mergedParams = { ...this.pagination, ...params };
        const response = await notificationService.getMyNotifications(mergedParams);
        
        if (response.success) {
          this.notifications = response.data.notifications || [];
          this.total = response.data.total || 0;
          this.pagination = { ...this.pagination, ...params };
        } else {
          this.error = response.message;
        }
        
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch notifications';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetch unread count
     */
    async fetchUnreadCount() {
      try {
        const response = await notificationService.getMyUnreadCount();
        if (response.success) {
          this.unreadCount = response.data.unread_count || 0;
        }
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch unread count';
        throw error;
      }
    },

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await notificationService.markAsRead(notificationId);
        
        if (response.success) {
          // Update local state
          const index = this.notifications.findIndex(n => n.id === notificationId);
          if (index !== -1) {
            this.notifications[index].is_read = true;
            // Update unread count
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
        } else {
          this.error = response.message;
        }
        
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to mark as read';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await notificationService.markAllAsRead();
        
        if (response.success) {
          // Update all notifications to read
          this.notifications.forEach(n => {
            if (!n.is_read) {
              n.is_read = true;
            }
          });
          this.unreadCount = 0;
        } else {
          this.error = response.message;
        }
        
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to mark all as read';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await notificationService.deleteNotification(notificationId);
        
        if (response.success) {
          // Remove from local state
          const index = this.notifications.findIndex(n => n.id === notificationId);
          if (index !== -1) {
            const notification = this.notifications[index];
            if (!notification.is_read) {
              this.unreadCount = Math.max(0, this.unreadCount - 1);
            }
            this.notifications.splice(index, 1);
            this.total = Math.max(0, this.total - 1);
          }
        } else {
          this.error = response.message;
        }
        
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete notification';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // ============================================
    // ADMIN ACTIONS
    // ============================================

    /**
     * Send notification to single user (Admin)
     */
    async sendToUser(data) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await notificationService.sendToUser(data);
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to send notification';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Send to multiple users (Admin)
     */
    async sendToMultipleUsers(data) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await notificationService.sendToMultipleUsers(data);
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to send notifications';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Send broadcast to all users (Admin)
     */
    async sendToAllUsers(data) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await notificationService.sendToAllUsers(data);
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to send broadcast';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Get user notifications by phone (Admin)
     */
    async fetchUserNotifications(phoneNumber, params = {}) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await notificationService.getUserNotifications(phoneNumber, params);
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch user notifications';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Get user unread count by phone (Admin)
     */
    async fetchUserUnreadCount(phoneNumber) {
      try {
        const response = await notificationService.getUserUnreadCount(phoneNumber);
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch user unread count';
        throw error;
      }
    },

    /**
     * Get all notifications with filters (Admin)
     */
    async fetchAllNotifications(params = {}) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await notificationService.getAllNotifications(params);
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch all notifications';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Check if user exists (Admin)
     */
    async checkUserExists(phoneNumber) {
      try {
        const response = await notificationService.checkUser(phoneNumber);
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to check user';
        throw error;
      }
    },

    // ============================================
    // LOCAL STATE MANAGEMENT
    // ============================================

    /**
     * Reset state
     */
    resetState() {
      this.notifications = [];
      this.unreadCount = 0;
      this.total = 0;
      this.isLoading = false;
      this.error = null;
      this.pagination = {
        limit: 50,
        offset: 0,
        unreadOnly: false
      };
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null;
    },

    /**
     * Set pagination
     */
    setPagination(params) {
      this.pagination = { ...this.pagination, ...params };
    },

    /**
     * Load more notifications (infinite scroll)
     */
    async loadMore() {
      if (!this.hasMore || this.isLoading) return;
      
      const newOffset = this.pagination.offset + this.pagination.limit;
      await this.fetchMyNotifications({ offset: newOffset });
    }
  }
});