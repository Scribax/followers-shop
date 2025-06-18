# Followers Shop

Aplicación para la venta de seguidores de Instagram con integración de MercadoPago.

## Estado Actual del Proyecto (Junio 2025)

Actualmente, el proyecto ha implementado:

- Sistema completo de autenticación de usuarios (registro, login, recuperación de contraseña)
- Panel de usuario con visualización de pedidos
- Formulario para ingreso del usuario de Instagram
- Panel de administración para gestión de pedidos
- Integración parcial con MercadoPago (stub)
- Estructura base para la venta de paquetes de seguidores

## Estructura de la Aplicación

La aplicación está construida con Vue 3 + Vite + Vuetify y utiliza Pinia para la gestión del estado.

### Componentes Principales

- **Vistas de Autenticación** (`/src/views/auth/`)
  - Login, registro y recuperación de contraseña

- **Dashboard de Usuario** (`/src/views/dashboard/`)
  - Panel principal con resumen de pedidos
  - Formulario para ingresar nombre de usuario de Instagram
  - Visualización del estado de pedidos

- **Panel de Administración** (`/src/views/admin/`)
  - Gestión completa de pedidos
  - Estadísticas generales
  - Búsqueda y filtrado de pedidos
  - Manejo de estados de pedidos

- **Tienda** (Parcialmente implementada)
  - Visualización de planes disponibles
  - Proceso de compra (stub)

### Stores (Pinia)

- **Auth** (`/src/stores/auth.js`): Gestión de autenticación
- **Orders** (`/src/stores/orders.js`): Gestión de pedidos
- **UserInfo** (`/src/stores/userInfo.js`): Información del usuario, incluyendo nombre de usuario de Instagram

### Servicios

- **MercadoPago** (`/src/services/mercadopago.js`): Integración con MercadoPago (actualmente en modo stub)
- **Email** (`/src/services/emailService.js`): Servicio de envío de emails

## Configuración del Panel de Administración

Para acceder al panel de administración:

1. **Configuración requerida**:
   - En el archivo `.env.local`, configura la variable `VITE_ADMIN_EMAIL` con el correo electrónico que tendrá acceso de administrador.
   - Ejemplo: `VITE_ADMIN_EMAIL=admin@tudominio.com`

2. **Acceso**:
   - Registra una cuenta con el email exacto configurado en `VITE_ADMIN_EMAIL`
   - Inicia sesión con esa cuenta
   - Navega a la ruta `/admin`

3. **Seguridad**:
   - Solo el email exacto configurado en la variable de entorno tendrá acceso al panel
   - Se verifica tanto el rol como el email del usuario

## Estado de Integración con MercadoPago

- **Implementación actual**: Stub (simulación)
- **Funciones disponibles**: 
  - `initMercadoPago`: Inicialización del SDK
  - `createPreference`: Creación de preferencia de pago
  - `processNotification`: Procesamiento de webhooks (stub)
  - `getPaymentStatus`: Verificación de estado de pagos (stub)

- **Pendiente de implementar**:
  - Integración real con SDK de MercadoPago
  - Procesamiento de webhooks reales
  - Confirmación de pagos

## Próximos Pasos y Características Pendientes

1. **Integración Completa con MercadoPago**:
   - Implementar SDK completo
   - Configurar webhooks
   - Procesar notificaciones de pago

2. **Mejoras al Panel de Administración**:
   - Implementar gestión de usuarios
   - Añadir estadísticas avanzadas
   - Reportes de ventas

3. **Mejoras al Proceso de Compra**:
   - Finalizar la implementación de la página de planes
   - Mejorar la experiencia de checkout
   - Añadir confirmaciones por email

4. **Mejoras de Seguridad**:
   - Implementar autenticación de doble factor
   - Reforzar protección de rutas
   - Logs de actividad

## Configuración del Proyecto

### Instalación

```bash
npm install
```

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```
# Credenciales de SendGrid (para emails)
VITE_SENDGRID_API_KEY=tu_clave_sendgrid
VITE_EMAIL_FROM=noreply@tudominio.com

# Email de administrador (acceso único al panel admin)
VITE_ADMIN_EMAIL=tu_email_administrador@dominio.com

# MercadoPago (cuando esté listo para producción)
VITE_MERCADOPAGO_PUBLIC_KEY=tu_clave_publica_mercadopago
```

### Desarrollo local

```bash
npm run dev
```

### Compilación para producción

```bash
npm run build
```

## Notas Importantes

- El archivo `.env.local` debe tener un formato exacto sin espacios extra ni caracteres especiales.
- La aplicación usa Vuetify 3 para la interfaz de usuario.
- El panel de administración muestra datos de ejemplo para propósitos de demostración.
- Para cambiar el usuario administrador, modifica la variable `VITE_ADMIN_EMAIL` en `.env.local` y reinicia la aplicación.

## Dependencias Principales

- Vue 3
- Vuetify 3
- Pinia
- Vue Router
- Vuelidate

