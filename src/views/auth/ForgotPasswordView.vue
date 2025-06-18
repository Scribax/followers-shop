<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Recuperar Contraseña</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <p class="text-body-2 mb-4">
              Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="formData.email"
                :error-messages="v$.email.$errors.map(e => e.$message)"
                label="Email"
                prepend-icon="mdi-email"
                type="email"
                @input="v$.email.$touch"
              />
            </v-form>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-btn
              color="primary"
              block
              :loading="authStore.loading"
              :disabled="authStore.loading || !isFormValid"
              @click="handleSubmit"
            >
              Enviar instrucciones
            </v-btn>
          </v-card-actions>

          <v-card-text class="text-center pt-0">
            <v-btn variant="text" to="/auth/login">
              Volver al inicio de sesión
            </v-btn>
          </v-card-text>
        </v-card>

        <v-alert
          v-if="authStore.error"
          type="error"
          class="mt-4"
        >
          {{ authStore.error }}
        </v-alert>

        <v-alert
          v-if="successMessage"
          type="success"
          class="mt-4"
        >
          {{ successMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

const router = useRouter()
const authStore = useAuthStore()
const successMessage = ref('')

const formData = reactive({
  email: ''
})

const rules = {
  email: { 
    required: helpers.withMessage('El email es requerido', required),
    email: helpers.withMessage('Email inválido', email)
  }
}

const v$ = useVuelidate(rules, formData)

const isFormValid = computed(() => {
  return !v$.value.$invalid
})

async function handleSubmit() {
  const formIsValid = await v$.value.$validate()
  if (!formIsValid) return

  try {
    await authStore.requestPasswordReset(formData.email)
    successMessage.value = 'Te hemos enviado un email con las instrucciones para restablecer tu contraseña.'
    formData.email = ''
    v$.value.$reset()
  } catch (error) {
    // El error ya estará manejado en el store
  }
}
</script>

