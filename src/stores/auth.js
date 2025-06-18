import { defineStore } from 'pinia'
import { emailService } from '@/services/emailService'
import { useNotification, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/services/notificationService'

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
      const { showSuccess, showError } = useNotification()
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
        
        localStorage.setItem('token', mockResponse.token)
        showSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS)
        return true
      } catch (error) {
        this.error = ERROR_MESSAGES.INVALID_CREDENTIALS
        showError(this.error)
        return false
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      const { showSuccess, showError } = useNotification()
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
        
        localStorage.setItem('token', mockResponse.token)
        showSuccess(SUCCESS_MESSAGES.REGISTRATION_SUCCESS)
        return true
      } catch (error) {
        this.error = error.message
        showError(ERROR_MESSAGES.SERVER_ERROR)
        return false
      } finally {
        this.loading = false
      }
    },

    async requestPasswordReset(email) {
      const { showSuccess, showError } = useNotification()
      this.loading = true
      this.error = null
      
      try {
        // Verificar que tengamos las credenciales de SendGrid
        if (!import.meta.env.VITE_SENDGRID_API_KEY || !import.meta.env.VITE_EMAIL_FROM) {
          throw new Error('SendGrid no está configurado correctamente')
        }

        // TODO: En una implementación real, aquí se generaría el token en el backend
        const mockResetToken = 'mock-reset-token-' + Date.now()
        
        // Enviar el email de recuperación
        await emailService.sendPasswordResetEmail(email, mockResetToken)
        showSuccess(SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT)
        return true
      } catch (error) {
        this.error = error.message === 'SendGrid no está configurado correctamente'
          ? 'El servicio de emails está en mantenimiento. Por favor, intenta más tarde.'
          : ERROR_MESSAGES.EMAIL_SEND_FAILED
        showError(this.error)
        return false
      } finally {
        this.loading = false
      }
    },

    async resetPassword({ token, password }) {
      const { showSuccess, showError } = useNotification()
      this.loading = true
      this.error = null
      
      try {
        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Simular envío de email de confirmación
        if (import.meta.env.VITE_SENDGRID_API_KEY && import.meta.env.VITE_EMAIL_FROM) {
          await emailService.sendPasswordChangedEmail(this.user?.email || 'user@example.com')
        }
        
        showSuccess(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS)
        return true
      } catch (error) {
        this.error = ERROR_MESSAGES.PASSWORD_RESET_FAILED
        showError(this.error)
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      const { showSuccess } = useNotification()
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      showSuccess(SUCCESS_MESSAGES.LOGOUT_SUCCESS)
    },

    async checkAuth() {
      const { showError } = useNotification()
      const token = localStorage.getItem('token')
      
      if (token) {
        try {
          // TODO: Implement token validation with backend
          this.token = token
          this.isAuthenticated = true
          // Mock user data
          this.user = {
            id: 1,
            email: 'demo@example.com',
            name: 'Usuario Demo'
          }
        } catch (error) {
          showError(ERROR_MESSAGES.SESSION_EXPIRED)
          this.logout()
        }
      }
    }
  }
})

