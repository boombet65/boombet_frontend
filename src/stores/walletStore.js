import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWalletStore = defineStore('wallet', () => {
  const transactions = ref([])
  const loading      = ref(false)

  // TODO: fetch from walletService
  function fetchTransactions() {}

  return { transactions, loading, fetchTransactions }
})