import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null
  }),
  
  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },
  
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual API call
        const mockResponse = {
          user: {
            id: 1,
            email: credentials.email,
            name: 'Usuario Demo'
          },
          token: 'mock-jwt-token'
        }
        
        this.user = mockResponse.user
        this.token = mockResponse.token
        this.isAuthenticated = true
        
        // Store token in localStorage
        localStorage.setItem('token', mockResponse.token)
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        // TODO: Implement actual API call
        const mockResponse = {
          user: {
            id: 1,
            email: userData.email,
            name: userData.name
          },
          token: 'mock-jwt-token'
        }
        
        this.user = mockResponse.user
        this.token = mockResponse.token
        this.isAuthenticated = true
        
        // Store token in localStorage
        localStorage.setItem('token', mockResponse.token)
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
    },

    async checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        // TODO: Implement token validation with backend
        this.token = token
        this.isAuthenticated = true
        // Mock user data
        this.user = {
          id: 1,
          email: 'demo@example.com',
          name: 'Usuario Demo'
        }
      }
    }
  }
})

