import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    path: '/login',
    name: 'Iniciar Sesión',
    component: () => import('@/views/Placeholder.vue')
  },
  {
    path: '/register',
    name: 'Registro',
    component: () => import('@/views/Placeholder.vue')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})

