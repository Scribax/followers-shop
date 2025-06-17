<template>
  <v-footer class="bg-surface-variant">
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12" class="text-center">
          <div class="mb-4">
            <v-btn icon class="mx-2" variant="text" href="#" target="_blank">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon class="mx-2" variant="text" href="#" target="_blank">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon class="mx-2" variant="text" href="#" target="_blank">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <v-btn icon class="mx-2" variant="text" href="#" target="_blank">
              <v-icon>mdi-tiktok</v-icon>
            </v-btn>
          </div>
          <div class="text-body-2 text-center">
            © {{ new Date().getFullYear() }} Social Boost. Todos los derechos reservados.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

