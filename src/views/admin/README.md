# Guía de Acceso al Panel de Administración

Esta guía explica cómo acceder y utilizar el panel de administración de Followers Shop.

## Acceso al Panel de Administración

Para acceder al panel de administración, debes tener una cuenta con privilegios de administrador. Por motivos de seguridad, solo una dirección de correo electrónico específica (configurada en las variables de entorno) tiene acceso como administrador.

### Pasos para acceder:

1. **Configurar la cuenta de administrador:**
   - En el archivo `.env` del proyecto, asegúrate de que la variable `VITE_ADMIN_EMAIL` contenga el correo electrónico del administrador.
   - Por defecto, este valor es `admin@followersshop.com`, pero debes cambiarlo a un correo electrónico personal y seguro.

2. **Crear la cuenta de administrador:**
   - Navega a la página de registro (/auth/register)
   - Registra una cuenta con exactamente el mismo correo configurado en `VITE_ADMIN_EMAIL`
   - Completa el registro con una contraseña segura

2. **Iniciar sesión como administrador:**
   - Navega a la página de inicio de sesión (/auth/login)
   - Ingresa las credenciales de la cuenta de administrador que creaste
   - Al iniciar sesión, el sistema detectará automáticamente que es una cuenta de administrador

3. **Acceder al panel de administración:**
   - Una vez iniciada la sesión, navega a la URL del panel de administración: `/admin`
   - Si tienes los privilegios adecuados, verás el panel de administración
   - Si no tienes privilegios de administrador, serás redirigido al dashboard de usuario normal

## Funcionalidades del Panel de Administración

El panel de administración incluye las siguientes secciones:

### Resumen
Muestra estadísticas generales de la tienda:
- Total de pedidos
- Pedidos completados
- Pedidos pendientes
- Lista de pedidos recientes

### Pedidos
Gestión completa de pedidos:
- Ver todos los pedidos
- Filtrar por estado (Pendiente, En proceso, Completado, Fallido)
- Buscar pedidos por ID, correo electrónico o usuario de Instagram
- Ver detalles de cada pedido
- Actualizar el estado de los pedidos
- Verificar pagos a través de MercadoPago
- Eliminar pedidos

### Clientes
(En desarrollo) Permitirá gestionar los usuarios registrados.

### Configuración
(En desarrollo) Permitirá configurar parámetros generales de la tienda.

## Notas Importantes

- **Seguridad**: 
  - El acceso de administrador está restringido a una única dirección de correo electrónico.
  - Nunca compartas tus credenciales de administrador.
  - En caso de compromiso, cambia inmediatamente la variable `VITE_ADMIN_EMAIL` y crea una nueva cuenta.
  - En un entorno de producción, considera implementar sistemas de autenticación de doble factor.
- **Desarrollo**: Este panel está en desarrollo activo y se agregarán más funcionalidades en futuras versiones.
- **Datos de prueba**: Los pedidos que ves actualmente son datos de ejemplo para demostración.

