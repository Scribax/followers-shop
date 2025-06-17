import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'

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
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Placeholder.vue'),
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

