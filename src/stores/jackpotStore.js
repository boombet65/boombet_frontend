import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useJackpotStore = defineStore('jackpot', () => {
  const jackpots = ref([])
  const loading  = ref(false)
  // TODO: fetch from jackpotService
  return { jackpots, loading }
})