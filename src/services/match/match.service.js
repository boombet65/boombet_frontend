// services/match.service.js
import api from '../api'

export const matchService = {
  // --- PUBLIC ENDPOINTS ---
  getUpcomingMatches() {
    return api.get('/match/upcoming')
  },

  getLiveMatches() {
    return api.get('/match/live')
  },

  getMatchDetails(id) {
    return api.get(`/match/${id}`)
  },

  // --- ADMIN / MANAGEMENT ENDPOINTS ---
  
  // Create Match (POST /api/match)
  createMatch(matchData) {
    // matchData = { home_team, away_team, date, time, league, odds }
    return api.post('/match', matchData)
  },

  createMultipleMatches(matchesData) {
    return api.post('/match/bulk', { matches: matchesData })
  },

  uploadMatchesFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post('/match/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Update Match Odds (PATCH /api/match/:id/odds)
  updateMatchOdds(id, odds) {
    return api.patch(`/match/${id}/odds`, { odds })
  },

  // Update Match Status (PATCH /api/match/:id/status)
  updateMatchStatus(id, status) {
    return api.patch(`/match/${id}/status`, { status })
  }
}