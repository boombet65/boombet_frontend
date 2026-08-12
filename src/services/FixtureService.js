import api from './api'

class FixtureService {
  /**
   * Get all fixtures with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of items per page
   * @param {number} params.offset - Offset for pagination
   * @param {string} params.search - Search term
   * @param {string} params.sport - Filter by sport
   * @param {string} params.status - Filter by status
   * @returns {Promise<Object>} - List of fixtures
   */
  async getFixtures(params = {}) {
    try {
      const response = await api.get('/fixtures', { params })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get a single fixture by ID
   * @param {string} id - Fixture ID
   * @returns {Promise<Object>} - Fixture data
   */
  async getFixtureById(id) {
    try {
      const response = await api.get(`/fixtures/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Create a new fixture
   * @param {Object} data - Fixture data
   * @param {string} data.sport - Sport type (football, basketball, etc)
   * @param {string} data.home_team - Home team name
   * @param {string} data.away_team - Away team name
   * @param {string} data.league - League/Tournament name
   * @param {string} data.start_time - ISO datetime string
   * @param {Object} data.odds - Odds object { home, draw, away }
   * @param {string} data.status - Fixture status
   * @returns {Promise<Object>} - Created fixture
   */
  async createFixture(data) {
    try {
      const response = await api.post('/fixtures', data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update an existing fixture
   * @param {string} id - Fixture ID
   * @param {Object} data - Updated fixture data
   * @returns {Promise<Object>} - Updated fixture
   */
  async updateFixture(id, data) {
    try {
      const response = await api.put(`/fixtures/${id}`, data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update fixture odds
   * @param {string} id - Fixture ID
   * @param {Object} odds - Odds object { home, draw, away }
   * @returns {Promise<Object>} - Updated fixture
   */
  async updateOdds(id, odds) {
    try {
      const response = await api.patch(`/fixtures/${id}/odds`, odds)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update fixture status
   * @param {string} id - Fixture ID
   * @param {string} status - New status (upcoming, live, finished, cancelled)
   * @returns {Promise<Object>} - Updated fixture
   */
  async updateStatus(id, status) {
    try {
      const response = await api.patch(`/fixtures/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update fixture results (scores)
   * @param {string} id - Fixture ID
   * @param {Object} result - Result object { home_score, away_score }
   * @returns {Promise<Object>} - Updated fixture
   */
  async updateResult(id, result) {
    try {
      const response = await api.patch(`/fixtures/${id}/result`, result)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete a fixture
   * @param {string} id - Fixture ID
   * @returns {Promise<Object>} - Deletion response
   */
  async deleteFixture(id) {
    try {
      const response = await api.delete(`/fixtures/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Bulk create fixtures
   * @param {Array} fixtures - Array of fixture data objects
   * @returns {Promise<Object>} - Bulk creation response
   */
  async bulkCreateFixtures(fixtures) {
    try {
      const response = await api.post('/fixtures/bulk', { fixtures })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get fixture statistics
   * @returns {Promise<Object>} - Statistics about fixtures
   */
  async getFixtureStats() {
    try {
      const response = await api.get('/fixtures/stats')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get upcoming fixtures (for public display)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - List of upcoming fixtures
   */
  async getUpcomingFixtures(params = {}) {
    try {
      const response = await api.get('/fixtures/upcoming', { params })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get live fixtures (for public display)
   * @returns {Promise<Object>} - List of live fixtures
   */
  async getLiveFixtures() {
    try {
      const response = await api.get('/fixtures/live')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error object
   * @returns {Error} - Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     'An error occurred'
      return new Error(message)
    } else if (error.request) {
      // Request made but no response
      return new Error('Network error - please check your connection')
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred')
    }
  }
}

// Export singleton instance
export default new FixtureService()