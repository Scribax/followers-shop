import sgMail from '@sendgrid/mail'

// Configurar API key de SendGrid
const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY
const FROM_EMAIL = import.meta.env.VITE_EMAIL_FROM

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

export const emailService = {
  isConfigured() {
    return Boolean(SENDGRID_API_KEY && FROM_EMAIL)
  },

  async sendPasswordResetEmail(to, resetToken) {
    if (!this.isConfigured()) {
      throw new Error('SendGrid no está configurado correctamente')
    }

    const resetLink = `${window.location.origin}/auth/reset-password/${resetToken}`
    
    const msg = {
      to,
      from: FROM_EMAIL,
      subject: 'Recuperación de contraseña - Social Boost',
      text: `
        Has solicitado restablecer tu contraseña.
        
        Haz clic en el siguiente enlace para crear una nueva contraseña:
        ${resetLink}
        
        Si no solicitaste este cambio, puedes ignorar este email.
        
        El enlace expirará en 1 hora.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6200EA;">Recuperación de contraseña</h2>
          <p>Has solicitado restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <p style="margin: 25px 0;">
            <a href="${resetLink}" 
               style="background-color: #6200EA;
                      color: white;
                      padding: 12px 24px;
                      text-decoration: none;
                      border-radius: 4px;
                      display: inline-block;">
              Restablecer contraseña
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Si no solicitaste este cambio, puedes ignorar este email.<br>
            El enlace expirará en 1 hora.
          </p>
        </div>
      `
    }

    try {
      await sgMail.send(msg)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      if (error.response) {
        console.error(error.response.body)
      }
      throw new Error('No se pudo enviar el email de recuperación')
    }
  },

  async sendPasswordChangedEmail(to) {
    if (!this.isConfigured()) {
      throw new Error('SendGrid no está configurado correctamente')
    }

    const msg = {
      to,
      from: FROM_EMAIL,
      subject: 'Tu contraseña ha sido actualizada - Social Boost',
      text: `
        Tu contraseña ha sido actualizada exitosamente.
        
        Si no realizaste este cambio, por favor contacta con nuestro soporte inmediatamente.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6200EA;">Cambio de contraseña exitoso</h2>
          <p>Tu contraseña ha sido actualizada exitosamente.</p>
          <p style="color: #666; font-size: 14px;">
            Si no realizaste este cambio, por favor contacta con nuestro soporte inmediatamente.
          </p>
        </div>
      `
    }

    try {
      await sgMail.send(msg)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      if (error.response) {
        console.error(error.response.body)
      }
      throw new Error('No se pudo enviar el email de confirmación')
    }
  }
}

