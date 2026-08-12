import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAviatorStore = defineStore('aviator', () => {
  const phase      = ref('waiting')
  const multiplier = ref(1.00)
  const history    = ref([])
  const countdown  = ref(5)
  const myBet      = ref(null)
  const myBet2     = ref(null)

  let animFrame    = null
  let countdownInt = null
  let flightStart  = null
  let crashPoint   = 1.00

  const isWaiting = computed(() => phase.value === 'waiting')
  const isFlying  = computed(() => phase.value === 'flying')
  const isCrashed = computed(() => phase.value === 'crashed')
  const multiplierFormatted = computed(() => multiplier.value.toFixed(2))
  const multiplierColor = computed(() => {
    const m = multiplier.value
    if (m < 2)  return '#00e676'
    if (m < 5)  return '#ffc107'
    if (m < 10) return '#ff9800'
    return '#ff1744'
  })

  function generateCrashPoint() {
    const r = Math.random()
    if (r < 0.01) return 1.00
    return Math.max(1.00, parseFloat((0.99 / (1 - r)).toFixed(2)))
  }

  const K = 0.00006

  function flyTick() {
    if (phase.value !== 'flying') return
    const elapsed = Date.now() - flightStart
    const m = Math.exp(K * elapsed)
    multiplier.value = parseFloat(m.toFixed(2))
    if (m >= crashPoint) {
      multiplier.value = parseFloat(crashPoint.toFixed(2))
      crash()
      return
    }
    animFrame = requestAnimationFrame(flyTick)
  }

  function startCountdown() {
    phase.value      = 'waiting'
    multiplier.value = 1.00
    countdown.value  = 5
    crashPoint       = generateCrashPoint()
    countdownInt = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) { clearInterval(countdownInt); startFlight() }
    }, 1000)
  }

  function startFlight() {
    phase.value = 'flying'
    flightStart = Date.now()
    animFrame   = requestAnimationFrame(flyTick)
  }

  function crash() {
    cancelAnimationFrame(animFrame)
    phase.value = 'crashed'
    history.value.unshift(parseFloat(crashPoint.toFixed(2)))
    if (history.value.length > 20) history.value.pop()
    if (myBet.value  && !myBet.value.cashedOut)  myBet.value  = null
    if (myBet2.value && !myBet2.value.cashedOut) myBet2.value = null
    setTimeout(startCountdown, 3000)
  }

  function placeBet(slot, amount) {
    if (!isWaiting.value) return false
    const obj = { amount, cashedOut: false, cashoutAt: null, profit: 0 }
    if (slot === 1) myBet.value  = obj
    if (slot === 2) myBet2.value = obj
    return true
  }

  function cashOut(slot) {
    if (!isFlying.value) return false
    const bet = slot === 1 ? myBet.value : myBet2.value
    if (!bet || bet.cashedOut) return false
    bet.cashedOut = true
    bet.cashoutAt = multiplier.value
    bet.profit    = parseFloat((bet.amount * multiplier.value - bet.amount).toFixed(2))
    return { cashoutAt: bet.cashoutAt, profit: bet.profit }
  }

  function init()    { startCountdown() }
  function destroy() { cancelAnimationFrame(animFrame); clearInterval(countdownInt) }

  return {
    phase, multiplier, history, countdown, myBet, myBet2,
    isWaiting, isFlying, isCrashed, multiplierFormatted, multiplierColor,
    placeBet, cashOut, init, destroy,
  }
})