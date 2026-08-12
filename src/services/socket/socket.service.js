// services/socket.service.js
import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    if (this.socket) return

    // Tumia URL ile ile ya backend yako (bila '/api')
    this.socket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
    })

    this.socket.on('connect', () => {
      console.log('[SOCKET] Connected to Live Betting Engine')
    })

    this.socket.on('disconnect', () => {
      console.warn('[SOCKET] Disconnected')
    })
  }

  // Listener ya Mabadiliko ya Score (LIVE)
  onScoreUpdate(callback) {
    if (this.socket) {
      this.socket.on('match_score_update', callback)
    }
  }

  // Listener ya Mechi Ikimalizika (FINISHED)
  onMatchFinished(callback) {
    if (this.socket) {
      this.socket.on('match_finished', callback)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export default new SocketService()