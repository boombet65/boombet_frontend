// store/useMatchStore.js
import { defineStore } from 'pinia'
import { matchService } from '../../services/match/match.service'
import { io } from 'socket.io-client'

export const useMatchStore = defineStore('match', {
  state: () => ({
    upcomingMatches: [],
    liveMatches: [],
    selectedMatch: null,
    loading: false,
    actionLoading: false,
    error: null,
    socket: null
  }),

  actions: {
    // --- FETCH ACTIONS ---
    async fetchAllMatches() {
      this.loading = true
      this.error = null
      try {
        const [upcomingRes, liveRes] = await Promise.all([
          matchService.getUpcomingMatches(),
          matchService.getLiveMatches()
        ])

        this.upcomingMatches = upcomingRes.data.data || []
            // console.log('📈 Upcoming Matches:', this.upcomingMatches)
        this.liveMatches = liveRes.data.data || []
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuleta mechi'
        console.error('[MATCH STORE ERROR]:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchMatchDetails(id) {
      this.loading = true
      this.error = null
      try {
        const response = await matchService.getMatchDetails(id)
        this.selectedMatch = response.data.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuleta maelezo ya mechi'
      } finally {
        this.loading = false
      }
    },

    // --- ADMIN ACTIONS ---

    // 1. Kutengeneza Mechi Mpya (POST)
    async createMatch(matchData) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.createMatch(matchData)
        const newMatch = response.data.data

        // Kama mechi imeundwa ikiwa UPCOMING, iongeze kwenye upcomingMatches
        if (newMatch.status === 'UPCOMING') {
          this.upcomingMatches.unshift(newMatch)
        } else if (newMatch.status === 'LIVE') {
          this.liveMatches.unshift(newMatch)
        }

        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuunda mechi'
        throw err
      } finally {
        this.actionLoading = false
      }
    },


        // --- CREATE BULK ---
    async createMultipleMatches(matchesData) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.createMultipleMatches(matchesData)
        const newMatches = response.data.data?.created || []

        newMatches.forEach(match => {
          if (match.status === 'UPCOMING') {
            this.upcomingMatches.unshift(match)
          } else if (match.status === 'LIVE') {
            this.liveMatches.unshift(match)
          }
        })

        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuunda mechi nyingi'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

        // --- UPLOAD FILE ---
    async uploadMatchesFile(file) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.uploadMatchesFile(file)
        const newMatches = response.data.data?.created || []

        newMatches.forEach(match => {
          if (match.status === 'UPCOMING') {
            this.upcomingMatches.unshift(match)
          } else if (match.status === 'LIVE') {
            this.liveMatches.unshift(match)
          }
        })

        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kuupload file'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    // 2. Kurekebisha Odds za Mechi (PATCH)
    async updateOdds(matchId, odds) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.updateMatchOdds(matchId, odds)
        const updatedMatch = response.data.data

        // Update kwenye state
        this._updateLocalMatch(updatedMatch)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kubadilisha odds'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    // 3. Kubadilisha Status ya Mechi (PATCH)
    async updateStatus(matchId, status) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.updateMatchStatus(matchId, status)
        
        // Refresh list baada ya kubadilisha status
        await this.fetchAllMatches()
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kubadilisha status'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    // --- SOCKET LISTENERS ---
    initMatchSocket() {
      if (this.socket) return

      this.socket = io('http://localhost:5000', {
        transports: ['websocket'],
        autoConnect: true
      })

      this.socket.on('match_score_update', ({ match_id, current_score, elapsed_minute }) => {
        const liveMatch = this.liveMatches.find(m => m.id === match_id)
        if (liveMatch) {
          liveMatch.current_score = current_score
          liveMatch.elapsed_minute = elapsed_minute
        } else {
          const upcomingIndex = this.upcomingMatches.findIndex(m => m.id === match_id)
          if (upcomingIndex !== -1) {
            const [movedMatch] = this.upcomingMatches.splice(upcomingIndex, 1)
            movedMatch.status = 'LIVE'
            movedMatch.current_score = current_score
            movedMatch.elapsed_minute = elapsed_minute
            this.liveMatches.push(movedMatch)
          }
        }

        if (this.selectedMatch && this.selectedMatch.id === match_id) {
          this.selectedMatch.status = 'LIVE'
          this.selectedMatch.current_score = current_score
          this.selectedMatch.elapsed_minute = elapsed_minute
        }
      })

      this.socket.on('match_finished', ({ match_id, final_score }) => {
        this.liveMatches = this.liveMatches.filter(m => m.id !== match_id)

        if (this.selectedMatch && this.selectedMatch.id === match_id) {
          this.selectedMatch.status = 'FINISHED'
          this.selectedMatch.current_score = { 
            home: final_score.homeScore, 
            away: final_score.awayScore 
          }
        }
      })
    },

    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }
    },

    // Helper ya ku-update mechi kwenye local array
    _updateLocalMatch(updatedMatch) {
      let match = this.upcomingMatches.find(m => m.id === updatedMatch.id)
      if (!match) match = this.liveMatches.find(m => m.id === updatedMatch.id)
      
      if (match) {
        Object.assign(match, updatedMatch)
      }
      if (this.selectedMatch && this.selectedMatch.id === updatedMatch.id) {
        Object.assign(this.selectedMatch, updatedMatch)
      }
    }
  }
})