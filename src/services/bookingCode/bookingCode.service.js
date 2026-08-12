// services/bookingCode/bookingCode.service.js
import api from '../api'

export const bookingCodeService = {
  createBookingCode(selections) {
    // ============ FORMAT DATA KWA BACKEND ============
    console.log('📤 Original selections from frontend:', JSON.stringify(selections, null, 2))
    
    const formattedSelections = selections.map(sel => {
      // ============ ANGALIA MATCH ID ============
      // Jaribu kupata match_id kutoka kwenye properties mbalimbali
      const matchId = sel.matchId || sel.match_id || sel.id || sel.matchID
      
      console.log('🔍 Selection:', {
        original: sel,
        extracted_matchId: matchId,
        market: sel.market,
        pick: sel.pick
      })
      
      if (!matchId) {
        console.error('❌ No match_id found for selection:', sel)
        throw new Error('Match ID haipo kwenye selection')
      }
      // =============================================
      
      return {
        match_id: matchId,
        market_key: sel.market || '1X2',
        outcome_key: sel.pick
      }
    })
    // ==================================================
    
    console.log('📤 Formatted selections for backend:', JSON.stringify(formattedSelections, null, 2))
    
    return api.post('/code/create', { selections: formattedSelections })
  },

  getBookingCodeDetails(code) {
    return api.get(`/code/${code}`)
  }
}