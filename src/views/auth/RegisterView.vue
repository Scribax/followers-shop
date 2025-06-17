<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Crear Cuenta</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="formData.name"
                :error-messages="v$.name.$errors.map(e => e.$message)"
                label="Nombre completo"
                prepend-icon="mdi-account"
                @input="v$.name.$touch"
              />

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
                @input="handlePasswordChange"
              />

              <v-text-field
                v-model="formData.passwordConfirm"
                :error-messages="v$.passwordConfirm.$errors.map(e => e.$message)"
                label="Confirmar contraseña"
                prepend-icon="mdi-lock-check"
                :type="showPassword ? 'text' : 'password'"
                @input="handleConfirmPasswordChange"
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
              Registrarse
            </v-btn>
          </v-card-actions>

          <v-card-text class="text-center pt-0">
            <v-btn variant="text" to="/auth/login">
              ¿Ya tienes cuenta? Inicia sesión
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
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

// Validador personalizado para confirmar contraseña
const sameAsPassword = helpers.withMessage(
  'Las contraseñas no coinciden',
  (value) => value === formData.password
)

const rules = {
  name: { required: helpers.withMessage('El nombre es requerido', required) },
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
  },
  passwordConfirm: { 
    required: helpers.withMessage('Debe confirmar la contraseña', required),
    sameAsPassword
  }
}

const v$ = useVuelidate(rules, formData)

const isFormValid = computed(() => {
  return !v$.value.$invalid && formData.password === formData.passwordConfirm
})

function handlePasswordChange() {
  v$.value.password.$touch()
  if (formData.passwordConfirm) {
    v$.value.passwordConfirm.$touch()
  }
}

function handleConfirmPasswordChange() {
  v$.value.passwordConfirm.$touch()
}

async function handleSubmit() {
  const formIsValid = await v$.value.$validate()
  if (!formIsValid) return

  const success = await authStore.register(formData)
  if (success) {
    router.push('/dashboard')
  }
}
</script>

