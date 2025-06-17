<template>
  <v-app>
    <AppBar />
    
    <v-main>
      <router-view></router-view>
    </v-main>

    <AppFooter />

    <!-- Global Notification -->
    <v-snackbar
      v-model="notification.show"
      :color="notification.type"
      :timeout="notification.timeout"
      location="top"
    >
      {{ notification.message }}

      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="hideNotification"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import AppBar from '@/components/layout/AppBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useNotification } from '@/services/notificationService'

const { notification, hideNotification } = useNotification()
</script>

