import api from './api'; // Hakikisha hii ni axios instance yako iliyopo tayari

export const financialService = {
  /**
   * Initiate Mobile Money Deposit via Mongike
   */
  async deposit({ amount, phoneNumber, feePayer = 'MERCHANT' }) {
    const response = await api.post('/financial/deposit', {
      amount,
      phone_number: phoneNumber,
      fee_payer: feePayer
    });
    return response.data;
  },

  /**
   * Check Status of a specific transaction
   */
  async checkStatus(reference) {
    const response = await api.get(`/financial/payment/${reference}`);
    return response.data;
  },

  /**
   * Get all active pending payments for the user
   */
  async getPendingPayments() {
    const response = await api.get('/financial/payments/pending');
    return response.data;
  },

  /**
   * Fetch current user balance
   */
  async getBalance() {
    const response = await api.get('/financial/balance');
    return response.data;
  }
};