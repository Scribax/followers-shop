import { defineStore } from 'pinia'
import { emailService } from '@/services/emailService'
import { useNotification, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/services/notificationService'

// Password validation helper
const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
  
  const errors = []
  
  if (password.length < minLength) {
    errors.push(`La contraseña debe tener al menos ${minLength} caracteres`)
  }
  
  if (!hasUpperCase) {
    errors.push('La contraseña debe incluir al menos una letra mayúscula')
  }
  
  if (!hasLowerCase) {
    errors.push('La contraseña debe incluir al menos una letra minúscula')
  }
  
  if (!hasNumbers) {
    errors.push('La contraseña debe incluir al menos un número')
  }
  
  if (!hasSpecialChar) {
    errors.push('La contraseña debe incluir al menos un carácter especial')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Mock user database helper
const getUsersFromStorage = () => {
  const storedUsers = localStorage.getItem('mockUsers')
  return storedUsers ? JSON.parse(storedUsers) : []
}

const saveUsersToStorage = (users) => {
  localStorage.setItem('mockUsers', JSON.stringify(users))
}

// Initialize with some mock users if empty
const initializeMockUsers = () => {
  const users = getUsersFromStorage()
  if (users.length === 0) {
    const demoUser = {
      id: 1,
      email: 'demo@example.com',
      name: 'Usuario Demo',
      password: 'Password123!' // In real app, this would be hashed
    }
    saveUsersToStorage([demoUser])
  }
}

// Call initialization
initializeMockUsers()

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
        // Input validation
        if (!credentials.email || !credentials.password) {
          throw new Error('Debes proporcionar un email y una contraseña')
        }
        
        // Get users from mock database
        const users = getUsersFromStorage()
        
        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase())
        
        // Check if user exists and password matches
        if (!user || user.password !== credentials.password) {
          throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
        }
        
        // Create user response without password
        const userResponse = {
          id: user.id,
          email: user.email,
          name: user.name
        }
        
        // Generate mock JWT token
        const token = 'mock-jwt-token-' + Date.now()
        
        this.user = userResponse
        this.token = token
        this.isAuthenticated = true
        
        localStorage.setItem('token', token)
        this._saveUserEmail(user.email)
        showSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS)
        return true
      } catch (error) {
        this.error = error.message || ERROR_MESSAGES.INVALID_CREDENTIALS
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
        // Input validation
        if (!userData.email || !userData.name || !userData.password || !userData.passwordConfirm) {
          throw new Error('Todos los campos son obligatorios')
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(userData.email)) {
          throw new Error('El formato del email no es válido')
        }
        
        // Validate password
        const passwordValidation = validatePassword(userData.password)
        if (!passwordValidation.valid) {
          throw new Error(passwordValidation.errors[0])
        }
        
        // Check if passwords match
        if (userData.password !== userData.passwordConfirm) {
          throw new Error('Las contraseñas no coinciden')
        }
        
        // Get existing users
        const users = getUsersFromStorage()
        
        // Check if user already exists
        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
          throw new Error('Este correo electrónico ya está registrado')
        }
        
        // Create new user
        const newUser = {
          id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
          email: userData.email,
          name: userData.name,
          password: userData.password // In a real app, this would be hashed
        }
        
        // Add to mock database
        users.push(newUser)
        saveUsersToStorage(users)
        
        // Create user response without password
        const userResponse = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        }
        
        // Generate mock JWT token
        const token = 'mock-jwt-token-' + Date.now()
        
        this.user = userResponse
        this.token = token
        this.isAuthenticated = true
        
        localStorage.setItem('token', token)
        this._saveUserEmail(newUser.email)
        showSuccess(SUCCESS_MESSAGES.REGISTRATION_SUCCESS)
        return true
      } catch (error) {
        this.error = error.message
        showError(this.error)
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
      localStorage.removeItem('userEmail')
      showSuccess(SUCCESS_MESSAGES.LOGOUT_SUCCESS)
    },

    async checkAuth() {
      const { showError } = useNotification()
      const token = localStorage.getItem('token')
      
      if (token) {
        try {
          // In a real app, validate token with backend
          // For mock implementation, we'll check if it starts with our prefix
          if (!token.startsWith('mock-jwt-token')) {
            throw new Error('Invalid token format')
          }
          
          // Find user based on stored email
          const storedUserEmail = localStorage.getItem('userEmail')
          if (!storedUserEmail) {
            throw new Error('User information not found')
          }
          
          const users = getUsersFromStorage()
          const user = users.find(u => u.email.toLowerCase() === storedUserEmail.toLowerCase())
          
          if (!user) {
            throw new Error('User not found')
          }
          
          this.token = token
          this.isAuthenticated = true
          this.user = {
            id: user.id,
            email: user.email,
            name: user.name
          }
        } catch (error) {
          showError(ERROR_MESSAGES.SESSION_EXPIRED)
          this.logout()
        }
      }
    },
    
    // Helper to save current user email for session restoration
    _saveUserEmail(email) {
      if (email) {
        localStorage.setItem('userEmail', email)
      }
    }
  }
})

