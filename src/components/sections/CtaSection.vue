<template>
  <section class="cta-section py-16">
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="text-h3 font-weight-bold mb-4 text-white">
            ¿Listo para crecer?
          </h2>
          <p class="text-h6 mb-8 text-white text-opacity-70">
            Únete a miles de creadores que ya han impulsado su presencia en redes sociales
          </p>
          <v-btn
            size="x-large"
            color="white"
            class="hover-scale"
            to="/register"
          >
            <span class="text-primary">Empezar ahora</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.cta-section {
  background: linear-gradient(to right, #6200EA, #2196F3);
}
</style>

