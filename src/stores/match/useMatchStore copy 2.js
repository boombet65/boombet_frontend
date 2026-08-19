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
        this.liveMatches = liveRes.data.data || []
        
        console.log('📈 Upcoming Matches:', this.upcomingMatches.length)
        console.log('📡 Live Matches:', this.liveMatches.length)
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

      // ✅ LISTENER KWA MATCH SCORE UPDATE
      this.socket.on('match_score_update', ({ match_id, current_score, elapsed_minute }) => {
        console.log('⚡ Score Update:', match_id, current_score)
        
        const liveMatch = this.liveMatches.find(m => m.id === match_id)
        if (liveMatch) {
          liveMatch.current_score = current_score
          // Ikiwa backend inatuma elapsed_minute, ihifadhi
          if (elapsed_minute !== undefined) {
            liveMatch.elapsed_minute = elapsed_minute
          }
        } else {
          const upcomingIndex = this.upcomingMatches.findIndex(m => m.id === match_id)
          if (upcomingIndex !== -1) {
            const [movedMatch] = this.upcomingMatches.splice(upcomingIndex, 1)
            movedMatch.status = 'LIVE'
            movedMatch.current_score = current_score
            if (elapsed_minute !== undefined) {
              movedMatch.elapsed_minute = elapsed_minute
            }
            this.liveMatches.push(movedMatch)
            console.log('🔄 Match moved to LIVE:', movedMatch.home_team, 'vs', movedMatch.away_team)
          }
        }

        if (this.selectedMatch && this.selectedMatch.id === match_id) {
          this.selectedMatch.status = 'LIVE'
          this.selectedMatch.current_score = current_score
          if (elapsed_minute !== undefined) {
            this.selectedMatch.elapsed_minute = elapsed_minute
          }
        }
      })

      // ✅ LISTENER KWA MATCH EVENT UPDATE (KUTOKA PREDETERMINED SCRIPT)
      this.socket.on('match_event_update', ({ match_id, event_index, current_event }) => {
        console.log('📅 Event Update:', match_id, 'Event Index:', event_index)
        
        const liveMatch = this.liveMatches.find(m => m.id === match_id)
        if (liveMatch && liveMatch.predetermined_script?.events_timeline) {
          const events = liveMatch.predetermined_script.events_timeline
          
          // Kama event_index imetumwa, tumia hiyo
          if (event_index !== undefined && event_index < events.length) {
            const event = events[event_index]
            // Update current_score ikiwa event ina current_score
            if (event.current_score) {
              liveMatch.current_score = event.current_score
            }
            // Update status ikiwa ni HALF_TIME au FULL_TIME
            if (event.type === 'HALF_TIME') {
              liveMatch.status = 'HALF_TIME'
            } else if (event.type === 'FULL_TIME') {
              liveMatch.status = 'FINISHED'
              // Ongeza kwenye finished matches au remove from live
              this.liveMatches = this.liveMatches.filter(m => m.id !== match_id)
            }
          } 
          // Kama current_event imetumwa, tumia hiyo
          else if (current_event && current_event.minute !== undefined) {
            // Update current_score ikiwa ipo
            if (current_event.current_score) {
              liveMatch.current_score = current_event.current_score
            }
          }
          
          // Trigger reactivity update
          liveMatch._updated = Date.now()
        }
      })

      // ✅ LISTENER KWA MATCH FINISHED
      this.socket.on('match_finished', ({ match_id, final_score }) => {
        console.log('🏁 Match Finished:', match_id, final_score)
        
        this.liveMatches = this.liveMatches.filter(m => m.id !== match_id)

        if (this.selectedMatch && this.selectedMatch.id === match_id) {
          this.selectedMatch.status = 'FINISHED'
          this.selectedMatch.current_score = { 
            home: final_score.homeScore, 
            away: final_score.awayScore 
          }
        }
      })

      // ✅ LISTENER KWA MATCH STATUS CHANGE
      this.socket.on('match_status_change', ({ match_id, status, match_data }) => {
        console.log('🔄 Status Change:', match_id, status)
        
        if (status === 'LIVE') {
          // Tafuta kwenye upcoming na uhamishe kwenye live
          const upcomingIndex = this.upcomingMatches.findIndex(m => m.id === match_id)
          if (upcomingIndex !== -1) {
            const [movedMatch] = this.upcomingMatches.splice(upcomingIndex, 1)
            movedMatch.status = 'LIVE'
            if (match_data) {
              Object.assign(movedMatch, match_data)
            }
            this.liveMatches.push(movedMatch)
          }
        } else if (status === 'FINISHED') {
          // Ondoa kwenye live
          this.liveMatches = this.liveMatches.filter(m => m.id !== match_id)
        }
      })

      console.log('🔌 Socket initialized and listening')
    },

    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
        console.log('🔌 Socket disconnected')
      }
    },

    // ✅ HELPER KUPATA EVENT YA MWISHO KWA LIVE MATCH
    getCurrentEvent(matchId) {
      const match = this.liveMatches.find(m => m.id === matchId)
      if (!match?.predetermined_script?.events_timeline) return null
      
      const events = match.predetermined_script.events_timeline
      return events[events.length - 1] || null
    },

    // ✅ HELPER KUPATA DAKIKA YA SASA KWA LIVE MATCH
    getCurrentMinute(matchId) {
      const match = this.liveMatches.find(m => m.id === matchId)
      if (!match?.predetermined_script?.events_timeline) return null
      
      const events = match.predetermined_script.events_timeline
      const lastEvent = events[events.length - 1]
      return lastEvent?.minute || null
    },

    // ✅ HELPER KUSASISHA EVENT KWA MATCH (INAWEZA KUITWA KUTOKA ADMIN)
    advanceMatchEvent(matchId, eventIndex) {
      const match = this.liveMatches.find(m => m.id === matchId)
      if (!match?.predetermined_script?.events_timeline) return false
      
      const events = match.predetermined_script.events_timeline
      if (eventIndex >= 0 && eventIndex < events.length) {
        const event = events[eventIndex]
        
        // Update score ikiwa event ina current_score
        if (event.current_score) {
          match.current_score = event.current_score
        }
        
        // Update status ikiwa ni HALF_TIME au FULL_TIME
        if (event.type === 'HALF_TIME') {
          match.status = 'HALF_TIME'
        } else if (event.type === 'FULL_TIME') {
          match.status = 'FINISHED'
          this.liveMatches = this.liveMatches.filter(m => m.id !== matchId)
        }
        
        // Trigger reactivity
        match._updated = Date.now()
        return true
      }
      return false
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