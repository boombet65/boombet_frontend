import { defineStore } from 'pinia';
import { financialService } from '../services/financial.service';
import { useAuthStore } from './authStore'; // Ili ku-update balance kwenye auth store pia ikibidi

export const useFinancialStore = defineStore('financial', {
  state: () => ({
    loading: false,
    error: null,
    success: null,
    currentTransaction: null,
    pendingPayments: []
  }),

  actions: {
    /**
     * Trigger Mongike Deposit Push Prompt
     */
    async initiateDeposit({ amount, phoneNumber }) {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        const result = await financialService.deposit({ amount, phoneNumber });
        
        if (result && result.data) {
          this.currentTransaction = result.data;
          return result.data; // Itarudisha order_id na expires_at
        }
        return null;
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindwa kuanzisha muamala. Jaribu tena.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Check current state of the pending payment
     */
    async checkPaymentStatus(orderId) {
      try {
        const result = await financialService.checkStatus(orderId);
        if (result && result.success && result.status === 'completed') {
          // Kama malipo yamekamilika, update balance ya user hapa au kwenye auth store
          const authStore = useAuthStore();
          if (authStore.user) {
            authStore.user.balance = result.data.new_balance;
          }
        }
        return result;
      } catch (err) {
        console.error('Error checking payment status:', err);
        return { success: false, status: 'error' };
      }
    },

    clearMessages() {
      this.error = null;
      this.success = null;
    }
  }
});