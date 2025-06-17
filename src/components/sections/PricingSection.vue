<template>
  <section class="py-16">
    <v-container>
      <h2 class="text-h4 text-center mb-12 font-weight-bold">
        Planes y precios
      </h2>
      <v-row>
        <v-col cols="12" md="4" v-for="plan in plans" :key="plan.title">
          <v-card class="mx-auto hover-scale" max-width="400">
            <v-card-item>
              <v-card-title class="text-h5 text-center d-block">
                {{ plan.title }}
              </v-card-title>
              <div class="text-center mt-4">
                <div class="text-h3 font-weight-bold">
                  ${{ plan.price }}
                </div>
                <div class="text-caption text-medium-emphasis">por mes</div>
              </div>
            </v-card-item>
            <v-card-text>
              <v-list density="compact" lines="one">
                <v-list-item
                  v-for="feature in plan.features"
                  :key="feature"
                  :title="feature"
                  prepend-icon="mdi-check"
                  class="text-body-2"
                ></v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn
                block
                :color="plan.featured ? 'primary' : undefined"
                :variant="plan.featured ? 'flat' : 'outlined'"
                class="mb-4"
              >
                Elegir plan
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
const plans = [
  {
    title: 'Básico',
    price: '29',
    features: [
      '1,000 seguidores',
      'Entrega en 24-48h',
      'Soporte por email',
      'Garantía de 30 días'
    ],
    featured: false
  },
  {
    title: 'Pro',
    price: '59',
    features: [
      '5,000 seguidores',
      'Entrega en 24h',
      'Soporte prioritario',
      'Garantía de 60 días',
      'Seguidores premium'
    ],
    featured: true
  },
  {
    title: 'Enterprise',
    price: '99',
    features: [
      '10,000 seguidores',
      'Entrega instantánea',
      'Soporte 24/7',
      'Garantía de 90 días',
      'Seguidores premium',
      'Panel de analytics'
    ],
    featured: false
  }
]
</script>

