// services/notifications.service.js
import api from './api';

const BASE_URL = '/notifications';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Handle successful response
 */
const handleSuccess = (response) => {
  if (response.data && response.data.success !== undefined) {
    return response.data;
  }
  
  return {
    success: true,
    data: response.data?.data || response.data,
    message: response.data?.message || 'Operation successful',
    status: response.status
  };
};

/**
 * Handle error response
 */
const handleError = (error) => {
  // Network error (no response)
  if (!error.response) {
    return {
      success: false,
      message: 'Network error. Please check your internet connection.',
      status: 0,
      code: 'NETWORK_ERROR'
    };
  }

  // Server responded with error
  const { status, data } = error.response;
  
  const errorMessages = {
    400: 'Bad request. Please check your input.',
    401: 'Authentication required. Please login again.',
    403: 'Access denied. You do not have permission to perform this action.',
    404: 'Resource not found.',
    429: 'Too many requests. Please try again later.',
    500: 'Internal server error. Please try again later.',
    503: 'Service unavailable. Please try again later.'
  };

  return {
    success: false,
    message: data?.message || errorMessages[status] || 'An unexpected error occurred.',
    status: status,
    code: data?.code || 'UNKNOWN_ERROR',
    data: data?.data || null,
    errors: data?.errors || null
  };
};

/**
 * Validate UUID format
 */
const validateUUID = (id) => {
  if (!id) {
    throw new Error('Notification ID is required');
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error('Invalid notification ID format. Must be a valid UUID.');
  }
};

/**
 * Validate phone number
 */
const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    throw new Error('Phone number is required');
  }
  const cleaned = phoneNumber.replace(/\s/g, '');
  if (cleaned.length < 10) {
    throw new Error('Phone number must be at least 10 digits');
  }
};

/**
 * Validate send to user data
 */
const validateSendToUser = (data) => {
  if (!data) {
    throw new Error('Data is required');
  }
  if (!data.phone_number) {
    throw new Error('Phone number is required');
  }
  if (!data.message) {
    throw new Error('Message is required');
  }
  if (data.title && data.title.length > 100) {
    throw new Error('Title must not exceed 100 characters');
  }
  if (data.message.length > 500) {
    throw new Error('Message must not exceed 500 characters');
  }
  validatePhoneNumber(data.phone_number);
};

/**
 * Validate send to multiple users data
 */
const validateSendToMultiple = (data) => {
  if (!data) {
    throw new Error('Data is required');
  }
  if (!data.phone_numbers || !Array.isArray(data.phone_numbers) || data.phone_numbers.length === 0) {
    throw new Error('At least one phone number is required');
  }
  if (data.phone_numbers.length > 100) {
    throw new Error('Cannot send to more than 100 users at once');
  }
  if (!data.message) {
    throw new Error('Message is required');
  }
  data.phone_numbers.forEach((phone, index) => {
    try {
      validatePhoneNumber(phone);
    } catch (error) {
      throw new Error(`Invalid phone number at index ${index}: ${error.message}`);
    }
  });
};

/**
 * Validate send to all users data
 */
const validateSendToAll = (data) => {
  if (!data) {
    throw new Error('Data is required');
  }
  if (!data.message) {
    throw new Error('Message is required');
  }
  if (data.title && data.title.length > 100) {
    throw new Error('Title must not exceed 100 characters');
  }
  if (data.message.length > 500) {
    throw new Error('Message must not exceed 500 characters');
  }
};

/**
 * Get time ago string
 */
const timeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

/**
 * Get type icon
 */
const getTypeIcon = (type) => {
  const icons = {
    info: 'ℹ️',
    promotion: '🎉',
    alert: '⚠️',
    system: '⚙️',
    success: '✅',
    warning: '⚠️',
    promo: '🎉',
    default: '📢'
  };
  return icons[type] || icons.default;
};

/**
 * Get type color
 */
const getTypeColor = (type) => {
  const colors = {
    info: 'text-cyan-400 bg-cyan-500/20',
    promotion: 'text-purple-400 bg-purple-500/20',
    alert: 'text-yellow-400 bg-yellow-500/20',
    system: 'text-blue-400 bg-blue-500/20',
    success: 'text-emerald-400 bg-emerald-500/20',
    warning: 'text-yellow-400 bg-yellow-500/20',
    promo: 'text-purple-400 bg-purple-500/20',
    default: 'text-gray-400 bg-gray-500/20'
  };
  return colors[type] || colors.default;
};

/**
 * Format notification for display
 */
const formatNotification = (notification) => {
  if (!notification) return null;
  
  return {
    id: notification.id,
    title: notification.title || 'Notification',
    message: notification.message,
    type: notification.type || 'info',
    isRead: notification.is_read || false,
    createdAt: notification.created_at || notification.createdAt,
    updatedAt: notification.updated_at || notification.updatedAt,
    metadata: notification.metadata || null,
    phoneNumber: notification.phone_number || notification.phoneNumber,
    userName: notification.user_name || notification.userName,
    timeAgo: timeAgo(notification.created_at || notification.createdAt),
    typeIcon: getTypeIcon(notification.type),
    typeColor: getTypeColor(notification.type)
  };
};

/**
 * Format multiple notifications
 */
const formatNotifications = (notifications) => {
  if (!Array.isArray(notifications)) return [];
  return notifications.map(n => formatNotification(n));
};

// Cache for unread count
let unreadCountCache = null;

// ============================================
// USER ENDPOINTS
// ============================================

/**
 * Get user's notifications with pagination
 */
export const getMyNotifications = async (params = {}) => {
  try {
    const { limit = 50, offset = 0, unreadOnly = false } = params;
    const response = await api.get(`${BASE_URL}/my`, {
      params: { 
        limit: Math.min(limit, 100),
        offset: Math.max(0, offset),
        unreadOnly: unreadOnly === true || unreadOnly === 'true'
      }
    });
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get unread notifications count
 */
export const getMyUnreadCount = async () => {
  try {
    const response = await api.get(`${BASE_URL}/my/unread-count`);
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Mark a specific notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    validateUUID(notificationId);
    const response = await api.put(`${BASE_URL}/my/${notificationId}/read`);
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  try {
    const response = await api.put(`${BASE_URL}/my/read-all`);
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    validateUUID(notificationId);
    const response = await api.delete(`${BASE_URL}/my/${notificationId}`);
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * Send notification to a single user (Admin only)
 */
export const sendToUser = async (data) => {
  try {
    validateSendToUser(data);
    const response = await api.post(`${BASE_URL}/send-to-user`, data);
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Send notification to multiple users (Admin only)
 */
export const sendToMultipleUsers = async (data) => {
  try {
    validateSendToMultiple(data);
    const response = await api.post(`${BASE_URL}/send-to-multiple`, data);
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Send broadcast to all users (Admin only)
 */
export const sendToAllUsers = async (data) => {
  try {
    validateSendToAll(data);
    const response = await api.post(`${BASE_URL}/send-to-all`, data);
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get user's notifications by phone number (Admin only)
 */
export const getUserNotifications = async (phoneNumber, params = {}) => {
  try {
    validatePhoneNumber(phoneNumber);
    const { limit = 50 } = params;
    const response = await api.get(`${BASE_URL}/user/${encodeURIComponent(phoneNumber)}`, {
      params: { limit: Math.min(limit, 100) }
    });
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get user's unread count by phone number (Admin only)
 */
export const getUserUnreadCount = async (phoneNumber) => {
  try {
    validatePhoneNumber(phoneNumber);
    const response = await api.get(`${BASE_URL}/user/${encodeURIComponent(phoneNumber)}/unread-count`);
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get all notifications with filters (Admin only)
 */
export const getAllNotifications = async (params = {}) => {
  try {
    const { limit = 100, offset = 0, user_id, type, is_read } = params;
    const queryParams = {
      limit: Math.min(limit, 200),
      offset: Math.max(0, offset)
    };
    
    if (user_id) queryParams.user_id = user_id;
    if (type) queryParams.type = type;
    if (is_read !== undefined && is_read !== null) {
      queryParams.is_read = is_read === true || is_read === 'true';
    }
    
    const response = await api.get(`${BASE_URL}/all`, { params: queryParams });
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Check if user exists by phone number (Admin only)
 */
export const checkUser = async (phoneNumber) => {
  try {
    validatePhoneNumber(phoneNumber);
    const response = await api.get(`${BASE_URL}/check-user/${encodeURIComponent(phoneNumber)}`);
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

// ============================================
// UTILITY EXPORTS
// ============================================

/**
 * Get unread count with cache
 */
export const getUnreadCountCached = async () => {
  try {
    if (unreadCountCache && unreadCountCache.time > Date.now() - 30000) {
      return unreadCountCache.count;
    }
    
    const result = await getMyUnreadCount();
    const count = result.success ? result.data?.unread_count || 0 : 0;
    
    unreadCountCache = {
      count,
      time: Date.now()
    };
    
    return count;
  } catch (error) {
    return 0;
  }
};

/**
 * Clear unread count cache
 */
export const clearUnreadCountCache = () => {
  unreadCountCache = null;
};

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * Mark multiple notifications as read
 */
export const markMultipleAsRead = async (notificationIds) => {
  try {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      throw new Error('At least one notification ID is required');
    }
    
    notificationIds.forEach(id => validateUUID(id));
    
    const promises = notificationIds.map(id => markAsRead(id));
    const results = await Promise.allSettled(promises);
    
    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value.success);
    
    return {
      success: succeeded.length > 0,
      data: {
        total: notificationIds.length,
        succeeded: succeeded.length,
        failed: failed.length,
        results: results.map((r, i) => ({
          id: notificationIds[i],
          success: r.status === 'fulfilled' && r.value.success,
          ...(r.status === 'fulfilled' ? { data: r.value } : { error: r.reason })
        }))
      }
    };
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Delete multiple notifications
 */
export const deleteMultiple = async (notificationIds) => {
  try {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      throw new Error('At least one notification ID is required');
    }
    
    notificationIds.forEach(id => validateUUID(id));
    
    const promises = notificationIds.map(id => deleteNotification(id));
    const results = await Promise.allSettled(promises);
    
    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value.success);
    
    return {
      success: succeeded.length > 0,
      data: {
        total: notificationIds.length,
        succeeded: succeeded.length,
        failed: failed.length,
        results: results.map((r, i) => ({
          id: notificationIds[i],
          success: r.status === 'fulfilled' && r.value.success,
          ...(r.status === 'fulfilled' ? { data: r.value } : { error: r.reason })
        }))
      }
    };
  } catch (error) {
    return handleError(error);
  }
};

// Export all functions as default object for convenience
const notificationService = {
  getMyNotifications,
  getMyUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendToUser,
  sendToMultipleUsers,
  sendToAllUsers,
  getUserNotifications,
  getUserUnreadCount,
  getAllNotifications,
  checkUser,
  formatNotification,
  formatNotifications,
  getUnreadCountCached,
  clearUnreadCountCache,
  markMultipleAsRead,
  deleteMultiple
};

export default notificationService;