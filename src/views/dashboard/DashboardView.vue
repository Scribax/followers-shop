<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Mi Panel</h1>
      </v-col>
    </v-row>
    
    <v-row v-if="isLoading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="mt-4 text-body-1">Cargando información...</p>
      </v-col>
    </v-row>
    
    <v-row v-else>
      <!-- Order Summary Section - Takes full width on mobile, half on desktop -->
      <v-col cols="12" md="6" order="2" order-md="1">
        <OrderSummary />
      </v-col>
      
      <!-- Instagram Username Form & Status Section -->
      <v-col cols="12" md="6" order="1" order-md="2">
        <v-card class="mb-6">
          <v-card-title class="text-h5">
            Tus Datos
          </v-card-title>
          <v-card-text>
            <IgUsernameForm />
          </v-card-text>
        </v-card>
        
        <StatusDisplay />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useOrdersStore } from '@/stores/orders';
import { useUserInfoStore } from '@/stores/userInfo';
import OrderSummary from './components/OrderSummary.vue';
import IgUsernameForm from './components/IgUsernameForm.vue';
import StatusDisplay from './components/StatusDisplay.vue';

export default {
  name: 'DashboardView',
  components: {
    OrderSummary,
    IgUsernameForm,
    StatusDisplay
  },
  data() {
    return {
      isLoading: true,
      error: null
    };
  },
  async mounted() {
    await this.fetchData();
    
    // Set up polling for the current order status
    this.startOrderStatusPolling();
  },
  beforeUnmount() {
    // Clean up polling interval when component is destroyed
    this.stopOrderStatusPolling();
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      
      try {
        // Get stores
        const ordersStore = useOrdersStore();
        const userInfoStore = useUserInfoStore();
        
        // Fetch data in parallel
        await Promise.all([
          ordersStore.fetchOrders(),
          userInfoStore.fetchUserInfo()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        this.error = 'Error al cargar los datos del panel. Por favor, recarga la página.';
      } finally {
        this.isLoading = false;
      }
    },
    
    startOrderStatusPolling() {
      const ordersStore = useOrdersStore();
      
      // Poll for status updates every 10 seconds if there's a current order
      this.pollingInterval = setInterval(async () => {
        if (ordersStore.currentOrder) {
          await ordersStore.pollOrderStatus(ordersStore.currentOrder.id);
        }
      }, 10000);
    },
    
    stopOrderStatusPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
    }
  }
};
</script>

