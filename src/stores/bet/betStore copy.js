// src/stores/bet/betStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import BetService from '../../services/bet/bet.service'

export const useBetStore = defineStore('betStore', () => {
  // ============ STATE ============
  const slip = ref([])
  const stake = ref(100000)
  const isPlacingBet = ref(false)
  const betHistory = ref([])
  const currentBet = ref(null)
  const isLoadingHistory = ref(false)
  const error = ref(null)

  // ============ GETTERS ============
  const slipCount = computed(() => slip.value.length)
  
  const totalOdds = computed(() => {
    return slip.value.reduce((acc, sel) => acc * (sel.odds || 1), 1)
  })
  
  const potentialWin = computed(() => {
    return stake.value * (totalOdds.value - 1)
  })
  
  const netPayout = computed(() => {
    const win = potentialWin.value
    const tax = win * 0.12
    return win - tax + stake.value
  })
  
  const isSlipValid = computed(() => {
    return slipCount.value > 0 && stake.value >= 125000
  })

  // ============ SLIP ACTIONS (Kutoka betStore ya mwanzo) ============

  /**
   * Check if a selection is already in the slip
   */
  function isSelected(matchId, marketKey) {
    return slip.value.some(b => b.matchId === matchId && b.marketKey === marketKey)
  }

  /**
   * Add selection to slip - ILIYOBORESHA KUTOKA BETSTORE YA MWANZO
   * Inashughulikia:
   * - Kuchukua matchId kutoka vyanzo mbalimbali
   * - Kuremove selection kama tayari ipo (toggle)
   * - Kubadilisha market na pick kuwa format sahihi
   */
  function addToSlip(selection) {
    console.log('📥 addToSlip received selection:', JSON.stringify(selection, null, 2))
    
    // ============ 1. GET MATCH ID ============
    const matchId = selection.matchId || selection.match_id || selection.id
    
    if (!matchId) {
      console.error('❌ No matchId found! Selection:', selection)
      return
    }
    
    // ============ 2. CHECK IF ALREADY SELECTED ============
    const alreadySelected = slip.value.some(
      b => b.matchId === matchId && b.marketKey === selection.marketKey
    )
    
    // ============ 3. TOGGLE: Remove if already exists ============
    if (alreadySelected) {
      slip.value = slip.value.filter(
        b => !(b.matchId === matchId && b.marketKey === selection.marketKey)
      )
      if (slip.value.length === 0) {
        // Optionally close slip if empty
      }
      return
    }
    
    // ============ 4. REMOVE OTHER SELECTIONS FROM SAME MATCH ============
    slip.value = slip.value.filter(b => b.matchId !== matchId)
    
    // ============ 5. PROCESS MARKET AND PICK ============
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
    
    // Kama pick ina neno la timu, chukua number tu
    const pickMatch = pick.match(/\d+$/)
    if (pickMatch) {
      pick = pickMatch[0]
    }
    
    // Kama pick ni "Home", "Draw", "Away" - badilisha
    if (pick.toLowerCase().includes('home')) pick = '1'
    else if (pick.toLowerCase().includes('draw')) pick = 'X'
    else if (pick.toLowerCase().includes('away')) pick = '2'
    
    // ============ 6. CREATE NEW SELECTION ============
    const newSelection = { 
      ...selection,
      matchId: matchId,
      matchName: selection.matchName || selection.match_name || `${selection.home_team || ''} vs ${selection.away_team || ''}`,
      market: market,
      marketKey: selection.marketKey || `${matchId}-${market}`,
      pick: pick,
      odds: selection.odds || selection.odds_value || 1,
      stake: 100 
    }
    
    console.log('✅ New selection added to slip:', JSON.stringify(newSelection, null, 2))
    
    slip.value.push(newSelection)
  }

  /**
   * Remove selection from slip
   */
  function removeFromSlip(matchId, marketKey) {
    slip.value = slip.value.filter(b => !(b.matchId === matchId && b.marketKey === marketKey))
    if (slip.value.length === 0) {
      // Optionally close slip
    }
  }

  /**
   * Clear all selections
   */
  function clearSlip() {
    slip.value = []
    stake.value = 100000
  }

  /**
   * Update stake amount
   */
  function updateStake(amount) {
    stake.value = Math.max(0, parseFloat(amount) || 0)
  }

  // ============ PLACE BET ============

  /**
   * Place bet with backend
   */
  const placeBetWithBackend = async () => {
    if (!isSlipValid.value) {
      return {
        success: false,
        error: 'Invalid slip or stake amount',
        message: !slipCount.value ? 'Add selections to your slip' : 'Minimum stake is 125,000 TZS'
      }
    }

    isPlacingBet.value = true
    error.value = null

    try {
      // Prepare selections for backend
      const selections = slip.value.map(sel => ({
        match_id: sel.matchId,
        market_key: sel.market,
        outcome_key: sel.pick
      }))

      const betData = {
        stake: stake.value,
        selections: selections,
        placed_via: 'DIRECT'
      }

      const response = await BetService.placeBet(betData)
      
      if (response.success) {
        currentBet.value = response.data
        
        // Clear slip after successful bet placement
        clearSlip()
        
        return {
          success: true,
          data: response.data,
          message: response.message || 'Bet placed successfully!'
        }
      } else {
        throw new Error(response.message || 'Failed to place bet')
      }
    } catch (err) {
      error.value = err.message || 'Something went wrong'
      return {
        success: false,
        error: error.value,
        message: err.message || 'Failed to place bet'
      }
    } finally {
      isPlacingBet.value = false
    }
  }

  // ============ BOOKING CODE ============

  /**
   * Load bet slip from booking code
   */
  const loadFromBookingCode = (bookingData) => {
    clearSlip()
    
    const selections = bookingData.selections || bookingData.matches || []
    
    selections.forEach(item => {
      // Prepare selection data
      const selection = {
        matchId: item.match_id || item.matchId || item.id,
        matchName: `${item.home_team || ''} vs ${item.away_team || ''}`,
        market: item.market_key || item.market || '1X2',
        marketKey: `${item.match_id || item.id}_${item.market_key || '1X2'}`,
        pick: item.outcome_key || item.pick || '1',
        odds: item.odds || 1,
        home_team: item.home_team,
        away_team: item.away_team,
        league: item.league
      }
      
      // Use addToSlip to add each selection
      // (it will handle the formatting)
      addToSlip(selection)
    })
    
    return {
      success: true,
      count: selections.length
    }
  }

  // ============ BET HISTORY ============

  /**
   * Get user bet history
   */
  const fetchBetHistory = async (options = {}) => {
    isLoadingHistory.value = true
    error.value = null
    
    try {
      const response = await BetService.getUserBets(options)
      
      if (response.success) {
        betHistory.value = response.data || []
        return {
          success: true,
          data: betHistory.value
        }
      } else {
        throw new Error(response.message || 'Failed to fetch bet history')
      }
    } catch (err) {
      error.value = err.message || 'Something went wrong'
      return {
        success: false,
        error: error.value
      }
    } finally {
      isLoadingHistory.value = false
    }
  }

  /**
   * Get bet details by ticket code
   */
  const fetchBetByTicket = async (ticketCode) => {
    try {
      const response = await BetService.getBetByTicketCode(ticketCode)
      
      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        throw new Error(response.message || 'Bet not found')
      }
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Failed to fetch bet details'
      }
    }
  }

  // ============ RETURN ============
  return {
    // State
    slip,
    stake,
    isPlacingBet,
    betHistory,
    currentBet,
    isLoadingHistory,
    error,
    
    // Getters
    slipCount,
    totalOdds,
    potentialWin,
    netPayout,
    isSlipValid,
    
    // Slip actions (kutoka betStore ya mwanzo)
    isSelected,
    addToSlip,
    removeFromSlip,
    clearSlip,
    updateStake,
    
    // Bet actions
    placeBetWithBackend,
    loadFromBookingCode,
    fetchBetHistory,
    fetchBetByTicket
  }
})