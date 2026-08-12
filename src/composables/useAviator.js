import { onMounted, onUnmounted } from 'vue'
import { useAviatorStore } from '../stores/aviatorStore'

export function useAviator() {
  const aviatorStore = useAviatorStore()

  onMounted(()   => aviatorStore.init())
  onUnmounted(() => aviatorStore.destroy())

  function placeBet(slot, amount) { return aviatorStore.placeBet(slot, amount) }
  function cashOut(slot)          { return aviatorStore.cashOut(slot) }

  return { aviatorStore, placeBet, cashOut }
}