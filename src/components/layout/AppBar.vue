<template>
  <v-app-bar app flat>
    <v-app-bar-title class="font-weight-bold">
      Social Boost
    </v-app-bar-title>

    <!-- Desktop Navigation -->
    <v-toolbar-items class="d-none d-md-flex">
      <v-btn variant="text" to="/">Inicio</v-btn>
      <v-btn variant="text" to="/plans">Planes</v-btn>
      <v-btn variant="text" to="/faq">FAQ</v-btn>
      <v-btn variant="text" to="/contact">Contacto</v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <!-- Auth Buttons -->
    <div class="d-none d-md-flex">
      <template v-if="!authStore.isAuthenticated">
        <v-btn variant="text" to="/auth/login" class="mr-2">
          Iniciar sesión
        </v-btn>
        <v-btn color="primary" to="/auth/register">
          Registrarse
        </v-btn>
      </template>
      <template v-else>
        <v-btn variant="text" to="/dashboard" class="mr-2">
          Dashboard
        </v-btn>
        <v-btn color="error" @click="handleLogout">
          Cerrar sesión
        </v-btn>
      </template>
    </div>

    <!-- Mobile Menu -->
    <v-app-bar-nav-icon
      class="d-flex d-md-none"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
    >
      <v-list>
        <v-list-item to="/" title="Inicio"></v-list-item>
        <v-list-item to="/plans" title="Planes"></v-list-item>
        <v-list-item to="/faq" title="FAQ"></v-list-item>
        <v-list-item to="/contact" title="Contacto"></v-list-item>
        <v-divider class="my-2"></v-divider>
        
        <!-- Auth Items -->
        <template v-if="!authStore.isAuthenticated">
          <v-list-item to="/auth/login" title="Iniciar sesión"></v-list-item>
          <v-list-item to="/auth/register" title="Registrarse"></v-list-item>
        </template>
        <template v-else>
          <v-list-item to="/dashboard" title="Dashboard"></v-list-item>
          <v-list-item @click="handleLogout" title="Cerrar sesión"></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(false)

async function handleLogout() {
  authStore.logout()
  drawer.value = false
  router.push('/')
}
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>

