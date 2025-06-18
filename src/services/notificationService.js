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
  // Email related errors
  EMAIL_SEND_FAILED: 'No se pudo enviar el email. Por favor, intenta nuevamente más tarde.',
  INVALID_RESET_TOKEN: 'El enlace de recuperación es inválido o ha expirado.',
  
  // Password related errors
  PASSWORD_RESET_FAILED: 'No se pudo restablecer la contraseña. Por favor, intenta nuevamente.',
  WEAK_PASSWORD: 'La contraseña no cumple con los requisitos de seguridad.',
  PASSWORD_REQUIREMENTS: 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.',
  PASSWORDS_DO_NOT_MATCH: 'Las contraseñas no coinciden.',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  
  // Registration errors
  EMAIL_ALREADY_EXISTS: 'Este email ya está registrado en el sistema.',
  INVALID_EMAIL_FORMAT: 'El formato del email no es válido.',
  MISSING_REQUIRED_FIELDS: 'Todos los campos marcados con * son obligatorios.',
  
  // General errors
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  SERVER_ERROR: 'Error en el servidor. Por favor, intenta más tarde.',
  VALIDATION_ERROR: 'Por favor verifica los datos ingresados y corrige los errores señalados.'
}

// Success messages
export const SUCCESS_MESSAGES = {
  // Authentication success messages
  LOGIN_SUCCESS: 'Has iniciado sesión exitosamente.',
  LOGOUT_SUCCESS: 'Has cerrado sesión exitosamente.',
  REGISTRATION_SUCCESS: 'Tu cuenta ha sido creada exitosamente. ¡Bienvenido!',
  
  // Password related success messages
  PASSWORD_RESET_EMAIL_SENT: 'Te hemos enviado un email con las instrucciones para restablecer tu contraseña.',
  PASSWORD_RESET_SUCCESS: 'Tu contraseña ha sido actualizada exitosamente.',
  PASSWORD_CHANGED: 'Tu contraseña ha sido cambiada exitosamente.',
  
  // Profile related success messages
  PROFILE_UPDATED: 'Tu perfil ha sido actualizado exitosamente.',
  EMAIL_VERIFIED: 'Tu email ha sido verificado exitosamente.'
}

