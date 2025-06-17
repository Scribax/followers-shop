<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="formData.email"
                :error-messages="v$.email.$errors.map(e => e.$message)"
                label="Email"
                prepend-icon="mdi-email"
                type="email"
                @input="v$.email.$touch"
              />

              <v-text-field
                v-model="formData.password"
                :error-messages="v$.password.$errors.map(e => e.$message)"
                label="Contraseña"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                @input="v$.password.$touch"
                @keyup.enter="handleSubmit"
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
              Iniciar Sesión
            </v-btn>
          </v-card-actions>

          <v-card-text class="text-center pt-0">
            <v-btn variant="text" to="/auth/register" class="mb-2">
              ¿No tienes cuenta? Regístrate
            </v-btn>
            <br>
            <v-btn variant="text" to="/auth/forgot-password">
              ¿Olvidaste tu contraseña?
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, helpers } from '@vuelidate/validators'

const router = useRouter()
const authStore = useAuthStore()
const showPassword = ref(false)

const formData = reactive({
  email: '',
  password: ''
})

const rules = {
  email: { 
    required: helpers.withMessage('El email es requerido', required),
    email: helpers.withMessage('Email inválido', email)
  },
  password: { 
    required: helpers.withMessage('La contraseña es requerida', required),
    minLength: helpers.withMessage(
      'La contraseña debe tener al menos 6 caracteres',
      minLength(6)
    )
  }
}

const v$ = useVuelidate(rules, formData)

const isFormValid = computed(() => {
  return !v$.value.$invalid
})

async function handleSubmit() {
  const formIsValid = await v$.value.$validate()
  if (!formIsValid) return

  const success = await authStore.login(formData)
  if (success) {
    router.push('/dashboard')
  }
}
</script>

