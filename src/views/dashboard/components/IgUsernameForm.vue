<template>
  <div>
    <p class="text-body-1 mb-4">
      Ingresa tu nombre de usuario de Instagram para recibir tus seguidores
    </p>
    
    <v-form @submit.prevent="submitUsername">
      <v-text-field
        v-model="username"
        label="Usuario de Instagram"
        prepend-inner-icon="mdi-instagram"
        prepend-inner-text="@"
        :error-messages="usernameErrors"
        :disabled="isSubmitting"
        hint="Ingresa solo tu nombre de usuario, sin el símbolo @"
        persistent-hint
        variant="outlined"
        density="comfortable"
      ></v-text-field>
      
      <div class="d-flex justify-end mt-4">
        <v-btn
          color="primary"
          type="submit"
          :loading="isSubmitting"
          :disabled="!username || usernameErrors.length > 0"
        >
          Guardar
        </v-btn>
      </div>
    </v-form>
    
    <v-alert
      v-if="submissionStatus"
      :type="submissionStatus.type"
      class="mt-4"
    >
      {{ submissionStatus.message }}
    </v-alert>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useUserInfoStore } from '@/stores/userInfo';

export default {
  name: 'IgUsernameForm',
  data() {
    return {
      username: '',
      usernameErrors: [],
      isSubmitting: false,
      submissionStatus: null
    };
  },
  computed: {
    ...mapState(useUserInfoStore, ['igUsername', 'isLoading', 'error'])
  },
  watch: {
    username(val) {
      this.validateUsername(val);
    },
    // Update local username when store value changes
    igUsername: {
      immediate: true,
      handler(newVal) {
        if (newVal && !this.username) {
          this.username = newVal;
        }
      }
    }
  },
  methods: {
    ...mapActions(useUserInfoStore, ['setIgUsername']),
    
    validateUsername(username) {
      this.usernameErrors = [];
      
      if (!username) {
        this.usernameErrors.push('El nombre de usuario es requerido');
        return;
      }
      
      // Basic validation regex for Instagram usernames
      const igUsernameRegex = /^[A-Za-z0-9._]{1,30}$/;
      
      if (!igUsernameRegex.test(username)) {
        this.usernameErrors.push('Nombre de usuario inválido. Usa solo letras, números, puntos y guiones bajos.');
      }
    },
    
    async submitUsername() {
      this.validateUsername(this.username);
      
      if (this.usernameErrors.length > 0) {
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        // Use the store action to save the username
        const success = await this.setIgUsername(this.username);
        
        if (success) {
          this.submissionStatus = {
            type: 'success',
            message: 'Tu nombre de usuario ha sido guardado correctamente.'
          };
        } else {
          this.submissionStatus = {
            type: 'error',
            message: this.error || 'Error al guardar el nombre de usuario. Intenta de nuevo.'
          };
        }
      } catch (error) {
        console.error('Error saving username:', error);
        this.submissionStatus = {
          type: 'error',
          message: 'Error al guardar el nombre de usuario. Intenta de nuevo.'
        };
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

