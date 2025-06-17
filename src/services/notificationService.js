import { ref } from 'vue'

const notification = ref({
  show: false,
  type: 'info', // 'success', 'error', 'info', 'warning'
  message: '',
  timeout: 5000
})

export const useNotification = () => {
  const showNotification = (message, type = 'info', timeout = 5000) => {
    notification.value = {
      show: true,
      type,
      message,
      timeout
    }

    // Auto hide
    setTimeout(() => {
      notification.value.show = false
    }, timeout)
  }

  const hideNotification = () => {
    notification.value.show = false
  }

  const showSuccess = (message) => showNotification(message, 'success')
  const showError = (message) => showNotification(message, 'error')
  const showInfo = (message) => showNotification(message, 'info')
  const showWarning = (message) => showNotification(message, 'warning')

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}

// Global error messages
export const ERROR_MESSAGES = {
  EMAIL_SEND_FAILED: 'No se pudo enviar el email. Por favor, intenta nuevamente más tarde.',
  INVALID_RESET_TOKEN: 'El enlace de recuperación es inválido o ha expirado.',
  PASSWORD_RESET_FAILED: 'No se pudo restablecer la contraseña. Por favor, intenta nuevamente.',
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  SERVER_ERROR: 'Error en el servidor. Por favor, intenta más tarde.',
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
}

// Success messages
export const SUCCESS_MESSAGES = {
  PASSWORD_RESET_EMAIL_SENT: 'Te hemos enviado un email con las instrucciones para restablecer tu contraseña.',
  PASSWORD_RESET_SUCCESS: 'Tu contraseña ha sido actualizada exitosamente.',
  REGISTRATION_SUCCESS: 'Tu cuenta ha sido creada exitosamente.',
  LOGIN_SUCCESS: 'Has iniciado sesión exitosamente.',
  LOGOUT_SUCCESS: 'Has cerrado sesión exitosamente.'
}

