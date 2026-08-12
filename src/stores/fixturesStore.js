import { defineStore } from 'pinia'
import fixtureService from '../services/FixtureService'

export const useFixturesStore = defineStore('fixtures', {
  state: () => ({
    fixtures: [],
    totalFixtures: 0,
    isLoading: false,
    hasError: false,
    errorMessage: '',
    pagination: {
      offset: 0,
      limit: 20,
      hasMore: false
    }
  }),

  actions: {
    async fetchFixtures(params = {}) {
      this.isLoading = true
      this.hasError = false
      
      try {
        const response = await fixtureService.getFixtures({
          limit: this.pagination.limit,
          offset: this.pagination.offset,
          search: params.search || '',
          sport: params.sport || '',
          status: params.status || ''
        })
        
        this.fixtures = response.fixtures || []
        this.totalFixtures = response.total || 0
        this.pagination.hasMore = response.hasMore || false
        
        return { success: true }
      } catch (error) {
        this.hasError = true
        this.errorMessage = error.message || 'Failed to load fixtures'
        return { success: false, message: this.errorMessage }
      } finally {
        this.isLoading = false
      }
    },

    async resetAndFetch() {
      this.pagination.offset = 0
      return await this.fetchFixtures()
    },

    async loadNextPage() {
      if (!this.pagination.hasMore) return
      this.pagination.offset += this.pagination.limit
      return await this.fetchFixtures()
    },

    async createFixture(data) {
      this.isLoading = true
      try {
        const response = await fixtureService.createFixture(data)
        await this.resetAndFetch()
        return { success: true, data: response }
      } catch (error) {
        return { 
          success: false, 
          message: error.message || 'Failed to create fixture' 
        }
      } finally {
        this.isLoading = false
      }
    },

    async updateFixture(id, data) {
      this.isLoading = true
      try {
        const response = await fixtureService.updateFixture(id, data)
        await this.resetAndFetch()
        return { success: true, data: response }
      } catch (error) {
        return { 
          success: false, 
          message: error.message || 'Failed to update fixture' 
        }
      } finally {
        this.isLoading = false
      }
    },

    async updateFixtureOdds(id, home, draw, away) {
      this.isLoading = true
      try {
        const response = await fixtureService.updateOdds(id, { home, draw, away })
        await this.resetAndFetch()
        return { success: true, data: response }
      } catch (error) {
        return { 
          success: false, 
          message: error.message || 'Failed to update odds' 
        }
      } finally {
        this.isLoading = false
      }
    },

    async updateFixtureStatus(id, status) {
      this.isLoading = true
      try {
        const response = await fixtureService.updateStatus(id, status)
        await this.resetAndFetch()
        return { success: true, data: response }
      } catch (error) {
        return { 
          success: false, 
          message: error.message || 'Failed to update status' 
        }
      } finally {
        this.isLoading = false
      }
    },

    async removeFixture(id) {
      this.isLoading = true
      try {
        await fixtureService.deleteFixture(id)
        await this.resetAndFetch()
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.message || 'Failed to delete fixture' 
        }
      } finally {
        this.isLoading = false
      }
    },

    // Reset store state
    reset() {
      this.fixtures = []
      this.totalFixtures = 0
      this.isLoading = false
      this.hasError = false
      this.errorMessage = ''
      this.pagination = {
        offset: 0,
        limit: 20,
        hasMore: false
      }
    }
  },

  // Getters
  getters: {
    // Get fixtures by status
    getUpcomingFixtures: (state) => {
      return state.fixtures.filter(f => f.status === 'upcoming')
    },
    getLiveFixtures: (state) => {
      return state.fixtures.filter(f => f.status === 'live')
    },
    getFinishedFixtures: (state) => {
      return state.fixtures.filter(f => f.status === 'finished')
    },
    getCancelledFixtures: (state) => {
      return state.fixtures.filter(f => f.status === 'cancelled')
    },

    // Get fixture by ID
    getFixtureById: (state) => (id) => {
      return state.fixtures.find(f => f.id === id)
    },

    // Total bets on all fixtures
    totalBetsOnFixtures: (state) => {
      return state.fixtures.reduce((sum, f) => sum + (f.totalBets || 0), 0)
    },

    // Count by status
    upcomingCount: (state) => {
      return state.fixtures.filter(f => f.status === 'upcoming').length
    },
    liveCount: (state) => {
      return state.fixtures.filter(f => f.status === 'live').length
    },
    finishedCount: (state) => {
      return state.fixtures.filter(f => f.status === 'finished').length
    },
    cancelledCount: (state) => {
      return state.fixtures.filter(f => f.status === 'cancelled').length
    }
  }
})