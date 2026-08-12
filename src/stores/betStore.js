// stores/betStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import betService from '../services/betService'
import api from '../services/api'

export const useBetStore = defineStore('bet', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const slip = ref([])
  const stake = ref(0)
  const isOpen = ref(false)
  const betType = ref('single')
  
  const userBets = ref([])
  const userBetsTotal = ref(0)
  const isLoadingBets = ref(false)
  const betStats = ref(null)
  const isLoadingStats = ref(false)
  
  const isPlacingBet = ref(false)
  const lastPlacedBet = ref(null)
  const placeBetError = ref(null)
  
  const isLoadingBookingCode = ref(false)
  const loadedBet = ref(null)
  
  const uncheckedWins = ref([])
  const hasUnreadWins = ref(false)

  // ── Computed ──────────────────────────────────────────────────────────────
  const slipCount = computed(() => slip.value.length)
  const totalOdds = computed(() => slip.value.reduce((acc, b) => acc * (b.odds || 1), 1))

  const potentialWin_1 = computed(() => stake.value * (totalOdds.value - 1))
  const tax = computed(() => potentialWin_1.value * 0.12)
  const potentialWin = computed(() => potentialWin_1.value - (tax.value + stake.value))

  const canPlaceBet = computed(() => slipCount.value > 0 && stake.value >= 125000)
  const isStakeValid = computed(() => stake.value >= 125000)

  // ── SLIP ACTIONS ──────────────────────────────────────────────────────────
  
  function isSelected(matchId, marketKey) {
    return slip.value.some(b => b.matchId === matchId && b.marketKey === marketKey)
  }

function addToSlip(selection) {
  console.log('📥 addToSlip received selection:', JSON.stringify(selection, null, 2))
  
  const matchId = selection.matchId || selection.match_id || selection.id
  
  if (!matchId) {
    console.error('❌ No matchId found! Selection:', selection)
    return
  }
  
  const alreadySelected = slip.value.some(
    b => b.matchId === matchId && b.marketKey === selection.marketKey
  )
  
  if (alreadySelected) {
    slip.value = slip.value.filter(
      b => !(b.matchId === matchId && b.marketKey === selection.marketKey)
    )
  } else {
    slip.value = slip.value.filter(b => b.matchId !== matchId)
    
    // ============ REKEBISHA MARKET NA PICK ============
    // Extract market and pick from the full text
    let market = selection.market || '1X2'
    let pick = selection.pick || '1'
    
    // Kama market ina "|", chukua sehemu ya kwanza tu
    if (market.includes('|')) {
      market = market.split('|')[0].trim()
    }
    
    // Kama pick ina "|", chukua sehemu ya mwisho tu
    if (pick.includes('|')) {
      const parts = pick.split('-')
      pick = parts[parts.length - 1].trim()
    }
    
    // Kama pick ina neno "UGGA FC" au "Malamba FC", chukua number tu
    const pickMatch = pick.match(/\d+$/)
    if (pickMatch) {
      pick = pickMatch[0]
    }
    
    // Kama pick ni "Home", "Draw", "Away" - badilisha
    if (pick.toLowerCase().includes('home')) pick = '1'
    else if (pick.toLowerCase().includes('draw')) pick = 'X'
    else if (pick.toLowerCase().includes('away')) pick = '2'
    // ==============================================
    
    const newSelection = { 
      ...selection,
      matchId: matchId,
      matchName: selection.matchName || selection.match_name || `${selection.home_team || ''} vs ${selection.away_team || ''}`,
      market: market,  // ← HII NI "1X2"
      marketKey: selection.marketKey || `${matchId}-${market}`,
      pick: pick,      // ← HII NI "1", "X", au "2"
      odds: selection.odds || selection.odds_value,
      stake: 100 
    }
    
    console.log('✅ New selection added to slip:', JSON.stringify(newSelection, null, 2))
    
    slip.value.push(newSelection)
    isOpen.value = true
  }
  
  if (slip.value.length === 0) isOpen.value = false
}

  function removeFromSlip(matchId, marketKey) {
    slip.value = slip.value.filter(b => !(b.matchId === matchId && b.marketKey === marketKey))
    if (slip.value.length === 0) isOpen.value = false
  }

  function clearSlip() {
    slip.value = []
    stake.value = 0
    isOpen.value = false
    placeBetError.value = null
  }

  function updateStake(newStake) {
    stake.value = Math.max(0, parseFloat(newStake) || 0)
  }

  // ── PLACE BET ─────────────────────────────────────────────────────────────
  
  async function placeBetWithBackend() {
    if (!canPlaceBet.value) {
      placeBetError.value = {
        message: !slipCount.value ? 'Add selections to your slip' : 'Minimum stake is 125000 Tsh'
      }
      return { success: false, error: placeBetError.value }
    }
    
    isPlacingBet.value = true
    placeBetError.value = null
    
    try {
      const result = await betService.placeBet(slip.value, stake.value)
      
      if (result.success) {
        lastPlacedBet.value = result.data
        clearSlip()
        return { success: true, data: result.data }
      } else {
        placeBetError.value = { message: result.message }
        return { success: false, error: result }
      }
    } catch (error) {
      placeBetError.value = { message: error.message || 'Failed to place bet' }
      return { success: false, error: placeBetError.value }
    } finally {
      isPlacingBet.value = false
    }
  }

  // ── USER BETS ─────────────────────────────────────────────────────────────
  
  async function loadUserBets(options = {}) {
    isLoadingBets.value = true
    
    try {
      const result = await betService.getUserBets(options)
      
      if (result.success) {
        userBets.value = result.data.bets
        userBetsTotal.value = result.data.total
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.message }
      }
    } catch (error) {
      console.error('Load user bets error:', error)
      return { success: false, error: error.message }
    } finally {
      isLoadingBets.value = false
    }
  }

  async function loadBetStats() {
    isLoadingStats.value = true
    
    try {
      const result = await betService.getUserBetStats()
      
      if (result.success) {
        betStats.value = result.data
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.message }
      }
    } catch (error) {
      console.error('Load bet stats error:', error)
      return { success: false, error: error.message }
    } finally {
      isLoadingStats.value = false
    }
  }

  // ── BOOKING CODE ──────────────────────────────────────────────────────────
  
  async function loadBetByCode(bookingCode) {
    isLoadingBookingCode.value = true
    loadedBet.value = null
    
    try {
      const result = await betService.loadActiveBetByBookingCode(bookingCode)
      
      if (result.success) {
        const formattedSelections = betService.formatSelectionsFromBackend(result.data.selections)
        loadedBet.value = {
          ...result.data,
          selections: formattedSelections
        }
        return { success: true, data: loadedBet.value }
      } else {
        return { 
          success: false, 
          message: result.message,
          canLoad: result.canLoad,
          data: result.data
        }
      }
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      isLoadingBookingCode.value = false
    }
  }

  function applyLoadedBetToSlip(loadedBetData) {
    if (!loadedBetData || !loadedBetData.selections) return false
    
    clearSlip()
    
    loadedBetData.selections.forEach(selection => {
      slip.value.push({
        matchId: selection.matchId,
        matchName: selection.matchName,
        market: selection.market || '1X2',
        marketKey: selection.marketKey,
        pick: selection.pick,
        odds: selection.odds,
        stake: loadedBetData.stake
      })
    })
    
    stake.value = parseFloat(loadedBetData.stake)
    isOpen.value = true
    
    return true
  }

  async function checkBookingCode(bookingCode) {
    try {
      const result = await betService.checkBookingCodeStatus(bookingCode)
      return result
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  async function cancelUserBet(betId) {
    try {
      const result = await betService.cancelBet(betId)
      
      if (result.success) {
        await loadUserBets()
        return { success: true, data: result.data }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  async function regenerateBookingCode(betId) {
    try {
      const result = await betService.generateNewBookingCode(betId)
      return result
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
  
  async function loadUncheckedWins() {
    try {
      const result = await betService.getUncheckedWins()
      
      if (result.success) {
        uncheckedWins.value = result.data.wins || []
        hasUnreadWins.value = result.data.hasUnreadWins || false
        return { success: true, data: result.data }
      }
      return { success: false, message: result.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  function markWinsAsNotified() {
    uncheckedWins.value = []
    hasUnreadWins.value = false
  }

  // ── ADMIN BETS ────────────────────────────────────────────────────────────
  
  async function loadAdminBets(options = {}) {
    isLoadingBets.value = true

    try {
      const { status, result, search, page = 1, limit = 20 } = options

      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (result) params.append('result', result)
      if (search) params.append('search', search)
      if (page) params.append('page', page)
      if (limit) params.append('limit', limit)

      const url = params.toString() 
        ? `/bets/admin/bets?${params.toString()}`
        : '/bets/admin/bets'

      const response = await api.get(url)

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to load bets'
      }
    } catch (error) {
      console.error('Load admin bets error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load bets'
      }
    } finally {
      isLoadingBets.value = false
    }
  }

  async function settleBet(betId, result) {
    try {
      const response = await api.patch(`/bets/admin/bets/${betId}/approve`, { result })

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to settle bet'
      }
    } catch (error) {
      console.error('Settle bet error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to settle bet'
      }
    }
  }

  // ── RETURN ──────────────────────────────────────────────────────────────────
  return {
    // State
    slip,
    stake,
    isOpen,
    betType,
    userBets,
    userBetsTotal,
    isLoadingBets,
    betStats,
    isLoadingStats,
    isPlacingBet,
    lastPlacedBet,
    placeBetError,
    isLoadingBookingCode,
    loadedBet,
    uncheckedWins,
    hasUnreadWins,
    
    // Computed
    slipCount,
    totalOdds,
    potentialWin,
    canPlaceBet,
    isStakeValid,
    
    // Slip actions
    isSelected,
    addToSlip,
    removeFromSlip,
    clearSlip,
    updateStake,
    
    // Bet actions
    placeBetWithBackend,
    loadUserBets,
    loadBetStats,
    loadBetByCode,
    applyLoadedBetToSlip,
    checkBookingCode,
    cancelUserBet,
    regenerateBookingCode,
    loadUncheckedWins,
    markWinsAsNotified,
    
    // Admin actions
    loadAdminBets,
    settleBet
  }
})