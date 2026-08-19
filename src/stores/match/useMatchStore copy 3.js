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
    async createMatch(matchData) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.createMatch(matchData)
        const newMatch = response.data.data

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

    async updateOdds(matchId, odds) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.updateMatchOdds(matchId, odds)
        const updatedMatch = response.data.data

        this._updateLocalMatch(updatedMatch)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Imeshindikana kubadilisha odds'
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async updateStatus(matchId, status) {
      this.actionLoading = true
      this.error = null
      try {
        const response = await matchService.updateMatchStatus(matchId, status)
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

      // ✅ LISTENER KWA MATCH SCORE & MINUTE UPDATE
      this.socket.on('match_score_update', ({ match_id, current_score, elapsed_minute }) => {
        console.log('⚡ Score/Minute Update:', match_id, current_score, elapsed_minute)
        
        const liveIndex = this.liveMatches.findIndex(m => m.id === match_id)
        if (liveIndex !== -1) {
          // Trigger reactivity kwa kureplace object au kuipamba upya
          const updated = { ...this.liveMatches[liveIndex] }
          if (current_score) updated.current_score = current_score
          if (elapsed_minute !== undefined) updated.elapsed_minute = elapsed_minute
          updated._updatedAt = Date.now()
          
          this.liveMatches.splice(liveIndex, 1, updated)
        } else {
          const upcomingIndex = this.upcomingMatches.findIndex(m => m.id === match_id)
          if (upcomingIndex !== -1) {
            const [movedMatch] = this.upcomingMatches.splice(upcomingIndex, 1)
            movedMatch.status = 'LIVE'
            if (current_score) movedMatch.current_score = current_score
            if (elapsed_minute !== undefined) movedMatch.elapsed_minute = elapsed_minute
            movedMatch._updatedAt = Date.now()
            
            this.liveMatches.push(movedMatch)
            console.log('🔄 Match moved to LIVE:', movedMatch.home_team, 'vs', movedMatch.away_team)
          }
        }

        if (this.selectedMatch && this.selectedMatch.id === match_id) {
          this.selectedMatch = {
            ...this.selectedMatch,
            status: 'LIVE',
            current_score: current_score || this.selectedMatch.current_score,
            elapsed_minute: elapsed_minute !== undefined ? elapsed_minute : this.selectedMatch.elapsed_minute
          }
        }
      })

      // ✅ LISTENER KWA MATCH EVENT UPDATE
      this.socket.on('match_event_update', ({ match_id, event_index, current_event }) => {
        console.log('📅 Event Update:', match_id, 'Event Index:', event_index)
        
        const liveIndex = this.liveMatches.findIndex(m => m.id === match_id)
        if (liveIndex !== -1) {
          const liveMatch = { ...this.liveMatches[liveIndex] }
          const events = liveMatch.predetermined_script?.events_timeline || []
          
          if (event_index !== undefined && event_index < events.length) {
            const event = events[event_index]
            if (event.current_score) liveMatch.current_score = event.current_score
            if (event.minute !== undefined) liveMatch.elapsed_minute = event.minute
            
            if (event.type === 'HALF_TIME') {
              liveMatch.status = 'HALF_TIME'
            } else if (event.type === 'FULL_TIME') {
              liveMatch.status = 'FINISHED'
              this.liveMatches = this.liveMatches.filter(m => m.id !== match_id)
              return
            }
          } else if (current_event) {
            if (current_event.current_score) liveMatch.current_score = current_event.current_score
            if (current_event.minute !== undefined) liveMatch.elapsed_minute = current_event.minute
          }
          
          liveMatch._updatedAt = Date.now()
          this.liveMatches.splice(liveIndex, 1, liveMatch)
        }
      })

      // ✅ LISTENER KWA MATCH FINISHED
      this.socket.on('match_finished', ({ match_id, final_score }) => {
        console.log('🏁 Match Finished:', match_id, final_score)
        
        this.liveMatches = this.liveMatches.filter(m => m.id !== match_id)

        if (this.selectedMatch && this.selectedMatch.id === match_id) {
          this.selectedMatch.status = 'FINISHED'
          if (final_score) {
            this.selectedMatch.current_score = { 
              home: final_score.homeScore, 
              away: final_score.awayScore 
            }
          }
        }
      })

      // ✅ LISTENER KWA MATCH STATUS CHANGE
      this.socket.on('match_status_change', ({ match_id, status, match_data }) => {
        console.log('🔄 Status Change:', match_id, status)
        
        if (status === 'LIVE') {
          const upcomingIndex = this.upcomingMatches.findIndex(m => m.id === match_id)
          if (upcomingIndex !== -1) {
            const [movedMatch] = this.upcomingMatches.splice(upcomingIndex, 1)
            movedMatch.status = 'LIVE'
            if (match_data) Object.assign(movedMatch, match_data)
            this.liveMatches.push(movedMatch)
          }
        } else if (status === 'FINISHED') {
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

    getCurrentEvent(matchId) {
      const match = this.liveMatches.find(m => m.id === matchId)
      if (!match?.predetermined_script?.events_timeline) return null
      const events = match.predetermined_script.events_timeline
      return events[events.length - 1] || null
    },

    getCurrentMinute(matchId) {
      const match = this.liveMatches.find(m => m.id === matchId)
      if (match?.elapsed_minute !== undefined) return match.elapsed_minute
      if (!match?.predetermined_script?.events_timeline) return null
      const events = match.predetermined_script.events_timeline
      const lastEvent = events[events.length - 1]
      return lastEvent?.minute || null
    },

    advanceMatchEvent(matchId, eventIndex) {
      const liveIndex = this.liveMatches.findIndex(m => m.id === matchId)
      if (liveIndex === -1) return false
      
      const match = { ...this.liveMatches[liveIndex] }
      const events = match.predetermined_script?.events_timeline || []
      
      if (eventIndex >= 0 && eventIndex < events.length) {
        const event = events[eventIndex]
        if (event.current_score) match.current_score = event.current_score
        if (event.minute !== undefined) match.elapsed_minute = event.minute
        
        if (event.type === 'HALF_TIME') {
          match.status = 'HALF_TIME'
        } else if (event.type === 'FULL_TIME') {
          match.status = 'FINISHED'
          this.liveMatches = this.liveMatches.filter(m => m.id !== matchId)
          return true
        }
        
        match._updatedAt = Date.now()
        this.liveMatches.splice(liveIndex, 1, match)
        return true
      }
      return false
    },

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