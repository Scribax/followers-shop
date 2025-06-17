<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Restablecer Contraseña</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="formData.password"
                :error-messages="v$.password.$errors.map(e => e.$message)"
                label="Nueva contraseña"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                @input="handlePasswordChange"
              />

              <v-text-field
                v-model="formData.passwordConfirm"
                :error-messages="v$.passwordConfirm.$errors.map(e => e.$message)"
                label="Confirmar nueva contraseña"
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
              Cambiar contraseña
            </v-btn>
          </v-card-actions>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showPassword = ref(false)
const token = ref('')

const formData = reactive({
  password: '',
  passwordConfirm: ''
})

// Validador personalizado para confirmar contraseña
const sameAsPassword = helpers.withMessage(
  'Las contraseñas no coinciden',
  (value) => value === formData.password
)

const rules = {
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

  try {
    await authStore.resetPassword({
      token: token.value,
      password: formData.password
    })
    router.push('/auth/login')
  } catch (error) {
    // El error ya estará manejado en el store
  }
}

onMounted(() => {
  // Obtener el token de la URL
  token.value = route.params.token
  if (!token.value) {
    router.push('/auth/forgot-password')
  }
})
</script>

