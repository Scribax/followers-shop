import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'

// Function to check if user is admin
const isAdmin = async () => {
  const authStore = useAuthStore()
  await authStore.checkAuth()
  
  // Obtener el email de administrador de las variables de entorno
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  
  // Debug logs - Verificar autenticación y correo
  console.log('DEBUG - isAdmin check:');
  console.log('- Usuario autenticado:', authStore.isAuthenticated);
  console.log('- Email configurado como admin (desde .env):', adminEmail || 'NO CONFIGURADO');
  console.log('- Email del usuario actual:', authStore.user?.email);
  
  // Verificar si la variable de entorno está configurada
  if (!adminEmail) {
    console.error('ERROR: Variable de entorno VITE_ADMIN_EMAIL no está configurada');
    console.error('Por favor configura esta variable en el archivo .env.local');
    return false;
  }
  
  // Verificar que el usuario esté autenticado
  if (!authStore.isAuthenticated) {
    console.log('DEBUG - Fallo: Usuario no autenticado');
    return false;
  }
  
  // Verificar si el email coincide con el email de administrador (case insensitive)
  const isMatch = authStore.user?.email?.toLowerCase() === adminEmail.toLowerCase();
  console.log('DEBUG - ¿El email coincide con el admin?', isMatch);
  
  return isMatch;
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/RegisterView.vue')
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/auth/ForgotPasswordView.vue')
      },
      {
        path: 'reset-password/:token',
        name: 'ResetPassword',
        component: () => import('@/views/auth/ResetPasswordView.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/plans',
    name: 'Planes',
    component: () => import('@/views/Placeholder.vue')
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('@/views/Placeholder.vue')
  },
  {
    path: '/contact',
    name: 'Contacto',
    component: () => import('@/views/Placeholder.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check authentication status
  await authStore.checkAuth()
  
  // Check if route requires admin privileges
  if (to.meta.requiresAdmin) {
    console.log('DEBUG - Ruta requiere privilegios de admin:', to.path);
    
    const adminStatus = await isAdmin()
    console.log('DEBUG - Resultado de verificación admin:', adminStatus);
    
    if (!adminStatus) {
      // Log intento de acceso no autorizado
      console.warn('Intento de acceso no autorizado a ruta de administrador', {
        ruta: to.path,
        usuario: authStore.isAuthenticated ? authStore.user.email : 'no autenticado'
      });
      
      console.log('DEBUG - Redirigiendo a usuario no-admin');
      // Redirect to dashboard if authenticated but not admin
      if (authStore.isAuthenticated) {
        next('/dashboard')
      } else {
        next('/auth/login')
      }
      return
    } else {
      console.log('DEBUG - Acceso de administrador CONCEDIDO');
    }
  }
  
  // Standard auth check
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } else if (
    (to.path === '/auth/login' || to.path === '/auth/register') && 
    authStore.isAuthenticated
  ) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router

