<template>
  <v-app>
    <AppBar />
    
    <v-main>
      <router-view></router-view>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import AppBar from '@/components/layout/AppBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

