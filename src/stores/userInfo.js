import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

/**
 * Store for managing user profile information
 */
export const useUserInfoStore = defineStore('userInfo', {
  /**
   * State definition
   * @returns {Object} Initial state
   */
  state: () => ({
    /** @type {string} Instagram username without @ */
    igUsername: '',
    
    /** @type {boolean} Whether the user profile is complete */
    profileComplete: false,
    
    /** @type {boolean} Loading state for API operations */
    isLoading: false,
    
    /** @type {string|null} Error message from last operation */
    error: null,
    
    /** @type {boolean} Whether profile has been loaded at least once */
    initialized: false,
    
    /** @type {Object|null} Additional profile data */
    profileData: null
  }),
  
  /**
   * Getters
   */
  getters: {
    /**
     * Check if user has set an Instagram username
     * @returns {boolean} True if username is set
     */
    hasIgUsername: (state) => !!state.igUsername,
    
    /**
     * Check if user profile is complete
     * @returns {boolean} True if profile is complete
     */
    isProfileComplete: (state) => state.profileComplete,
    
    /**
     * Get the formatted Instagram username with @
     * @returns {string} Formatted username
     */
    formattedIgUsername: (state) => state.igUsername ? `@${state.igUsername}` : '',
    
    /**
     * Get user's full name from auth store
     * @returns {string} User's full name
     */
    fullName() {
      const authStore = useAuthStore();
      return authStore.user?.name || '';
    },
    
    /**
     * Get user's email from auth store
     * @returns {string} User's email
     */
    email() {
      const authStore = useAuthStore();
      return authStore.user?.email || '';
    }
  },
  
  /**
   * Actions
   */
  actions: {
    /**
     * Fetch user profile information
     * @returns {Promise<void>}
     */
    async fetchUserInfo() {
      // Make sure user is authenticated first
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.resetStore();
        return;
      }
      
      if (this.isLoading) return;
      
      this.isLoading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Try to get from localStorage first
        const storedUsername = localStorage.getItem('ig_username');
        
        if (storedUsername) {
          this.igUsername = storedUsername;
          this.profileComplete = true;
        } else {
          // Mock API call would happen here
          this.igUsername = '';
          this.profileComplete = false;
        }
        
        // Mock profile data
        this.profileData = {
          joinDate: new Date(Date.now() - 30 * 86400000).toISOString(), // 30 days ago
          totalOrders: 2,
          lastActivityDate: new Date().toISOString()
        };
        
        this.initialized = true;
      } catch (error) {
        console.error('Error fetching user info:', error);
        this.error = 'No se pudo cargar la información del perfil.';
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Set the Instagram username
     * @param {string} username - Instagram username without @
     * @returns {Promise<boolean>} Success status
     */
    async setIgUsername(username) {
      if (!username) {
        this.error = 'El nombre de usuario es requerido.';
        return false;
      }
      
      // Validate username format
      const igUsernameRegex = /^[A-Za-z0-9._]{1,30}$/;
      if (!igUsernameRegex.test(username)) {
        this.error = 'Nombre de usuario inválido. Usa solo letras, números, puntos y guiones bajos.';
        return false;
      }
      
      this.isLoading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update state
        this.igUsername = username;
        this.profileComplete = true;
        
        // Save to localStorage for persistence
        localStorage.setItem('ig_username', username);
        
        return true;
      } catch (error) {
        console.error('Error setting Instagram username:', error);
        this.error = 'Error al guardar el nombre de usuario. Intenta de nuevo.';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Clear user Instagram username
     * @returns {Promise<boolean>} Success status
     */
    async clearIgUsername() {
      this.isLoading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update state
        this.igUsername = '';
        this.profileComplete = false;
        
        // Remove from localStorage
        localStorage.removeItem('ig_username');
        
        return true;
      } catch (error) {
        console.error('Error clearing Instagram username:', error);
        this.error = 'Error al borrar el nombre de usuario.';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Update profile data
     * @param {Object} data - Profile data to update
     * @returns {Promise<boolean>} Success status
     */
    async updateProfileData(data) {
      this.isLoading = true;
      this.error = null;

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update profile data
        this.profileData = {
          ...this.profileData,
          ...data
        };
        
        return true;
      } catch (error) {
        console.error('Error updating profile data:', error);
        this.error = 'Error al actualizar el perfil.';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Clear user information (called on logout)
     */
    clearUserInfo() {
      this.igUsername = '';
      this.profileComplete = false;
      this.profileData = null;
      this.initialized = false;
      
      // Clear localStorage
      localStorage.removeItem('ig_username');
    },
    
    /**
     * Reset the store to its initial state
     */
    resetStore() {
      this.igUsername = '';
      this.profileComplete = false;
      this.isLoading = false;
      this.error = null;
      this.initialized = false;
      this.profileData = null;
    }
  }
});

