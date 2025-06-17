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
      <v-btn variant="text" to="/login" class="mr-2">
        Iniciar sesión
      </v-btn>
      <v-btn color="primary" to="/register">
        Registrarse
      </v-btn>
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
        <v-list-item to="/login" title="Iniciar sesión"></v-list-item>
        <v-list-item to="/register" title="Registrarse"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>

