// src/stores/bet/betStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import BetService from '../../services/bet/bet.service'

export const useBetStore = defineStore('betStore', () => {
  // ============ STATE ============
  const slip = ref([])
  const stake = ref()
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
  
  const isSlipValid = computed(() => {
    return slipCount.value > 0 && stake.value >= 125000
  })

  // ============ SLIP ACTIONS ============

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
      return
    }
    
    slip.value = slip.value.filter(b => b.matchId !== matchId)
    
    let market = selection.market || '1X2'
    let pick = selection.pick || '1'
    
    if (market.includes('|')) {
      market = market.split('|')[0].trim()
    }
    
    if (pick.includes('|')) {
      const parts = pick.split('-')
      pick = parts[parts.length - 1].trim()
    }
    
    const pickMatch = pick.match(/\d+$/)
    if (pickMatch) {
      pick = pickMatch[0]
    }
    
    if (pick.toLowerCase().includes('home')) pick = '1'
    else if (pick.toLowerCase().includes('draw')) pick = 'X'
    else if (pick.toLowerCase().includes('away')) pick = '2'
    
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

  function removeFromSlip(matchId, marketKey) {
    slip.value = slip.value.filter(b => !(b.matchId === matchId && b.marketKey === marketKey))
  }

  function clearSlip() {
    slip.value = []
    stake.value = 100000
  }

  function updateStake(amount) {
    stake.value = Math.max(0, parseFloat(amount) || 0)
  }

  // ============ PLACE BET ============

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
        // ============ FIX: Transform backend response to frontend format ============
        const bet = response.data
        
        // Map backend fields to frontend format
        const formattedBet = {
          id: bet.id,
          ticket_code: bet.ticket_code,
          stake: bet.stake,
          total_odds: bet.total_odds,
          possible_win: bet.possible_win,
          tax: bet.tax,
          payout: bet.payout,
          // ============ IMPORTANT FIX: Map status and result ============
          status: bet.status, // 'PENDING' or 'SETTLED'
          result: bet.result, // 'OPEN', 'WON', 'LOST', 'CANCELLED'
          selections: bet.selections || [],
          created_at: bet.createdAt || bet.created_at,
          updated_at: bet.updatedAt || bet.updated_at
        }
        
        currentBet.value = formattedBet
        
        // ============ FIX: Add to betHistory immediately ============
        betHistory.value.unshift(formattedBet)
        
        clearSlip()
        
        return {
          success: true,
          data: formattedBet,
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

  const loadFromBookingCode = (bookingData) => {
    clearSlip()
    
    const selections = bookingData.selections || bookingData.matches || []
    
    selections.forEach(item => {
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
      
      addToSlip(selection)
    })
    
    return {
      success: true,
      count: selections.length
    }
  }

  // ============ BET HISTORY ============

  const fetchBetHistory = async (options = {}) => {
    isLoadingHistory.value = true
    error.value = null
    
    try {
      const response = await BetService.getUserBets(options)
      
      if (response.success) {
        // ============ FIX: Transform all bets to frontend format ============
        const formattedBets = (response.data || []).map(bet => ({
          id: bet.id,
          ticket_code: bet.ticket_code,
          stake: bet.stake,
          total_odds: bet.total_odds,
          possible_win: bet.possible_win,
          tax: bet.tax,
          payout: bet.payout,
          status: bet.status, // 'PENDING' or 'SETTLED'
          result: bet.result, // 'OPEN', 'WON', 'LOST', 'CANCELLED'
          selections: bet.selections || [],
          created_at: bet.createdAt || bet.created_at,
          updated_at: bet.updatedAt || bet.updated_at
        }))
        
        betHistory.value = formattedBets
        
        return {
          success: true,
          data: formattedBets
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

  const fetchBetByTicket = async (ticketCode) => {
    try {
      const response = await BetService.getBetByTicketCode(ticketCode)
      
      if (response.success) {
        const bet = response.data
        const formattedBet = {
          id: bet.id,
          ticket_code: bet.ticket_code,
          stake: bet.stake,
          total_odds: bet.total_odds,
          possible_win: bet.possible_win,
          tax: bet.tax,
          payout: bet.payout,
          status: bet.status,
          result: bet.result,
          selections: bet.selections || [],
          created_at: bet.createdAt || bet.created_at,
          updated_at: bet.updatedAt || bet.updated_at
        }
        
        return {
          success: true,
          data: formattedBet
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
    isSlipValid,
    
    // Slip actions
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