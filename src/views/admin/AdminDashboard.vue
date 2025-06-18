<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Panel de Administración</h1>
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
      <v-col cols="12" md="3">
        <v-card>
          <v-list>
            <v-list-item
              prepend-icon="mdi-view-dashboard"
              title="Resumen"
              value="dashboard"
              @click="activeTab = 'dashboard'"
              :active="activeTab === 'dashboard'"
            ></v-list-item>
            
            <v-list-item
              prepend-icon="mdi-format-list-bulleted"
              title="Pedidos"
              value="orders"
              @click="activeTab = 'orders'"
              :active="activeTab === 'orders'"
            ></v-list-item>
            
            <v-list-item
              prepend-icon="mdi-account-group"
              title="Clientes"
              value="customers"
              @click="activeTab = 'customers'"
              :active="activeTab === 'customers'"
            ></v-list-item>
            
            <v-list-item
              prepend-icon="mdi-cog"
              title="Configuración"
              value="settings"
              @click="activeTab = 'settings'"
              :active="activeTab === 'settings'"
            ></v-list-item>
            
            <v-divider class="my-2"></v-divider>
            
            <v-list-item
              prepend-icon="mdi-account"
              :title="authStore.user?.name || 'Usuario'"
              subtitle="Administrador"
              value="user"
            ></v-list-item>
            
            <v-list-item
              prepend-icon="mdi-logout"
              title="Cerrar Sesión"
              value="logout"
              @click="logout"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="9">
        <v-window v-model="activeTab">
          <v-window-item value="dashboard">
            <v-card>
              <v-card-title class="text-h5">Resumen</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-card color="primary" theme="dark">
                      <v-card-text>
                        <div class="text-h6 mb-1">Pedidos Totales</div>
                        <div class="text-h3">{{ orderStats.total }}</div>
                        <div class="text-caption">Últimos 30 días</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="12" sm="6" md="4">
                    <v-card color="success" theme="dark">
                      <v-card-text>
                        <div class="text-h6 mb-1">Completados</div>
                        <div class="text-h3">{{ orderStats.completed }}</div>
                        <div class="text-caption">Últimos 30 días</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="12" sm="6" md="4">
                    <v-card color="warning" theme="dark">
                      <v-card-text>
                        <div class="text-h6 mb-1">Pendientes</div>
                        <div class="text-h3">{{ orderStats.pending }}</div>
                        <div class="text-caption">Requieren atención</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                
                <h3 class="text-h6 mt-6 mb-4">Pedidos Recientes</h3>
                <OrderList :limit="5" />
              </v-card-text>
            </v-card>
          </v-window-item>
          
          <v-window-item value="orders">
            <v-card>
              <v-card-title class="text-h5 d-flex justify-space-between align-center">
                <span>Pedidos</span>
                <v-text-field
                  v-model="searchQuery"
                  append-icon="mdi-magnify"
                  label="Buscar pedido"
                  single-line
                  hide-details
                  density="compact"
                  style="max-width: 300px"
                  class="ml-4"
                ></v-text-field>
              </v-card-title>
              
              <v-card-text>
                <div class="d-flex mb-4">
                  <v-select
                    v-model="statusFilter"
                    :items="statusOptions"
                    label="Filtrar por estado"
                    density="compact"
                    hide-details
                    class="me-4"
                    style="max-width: 200px"
                    clearable
                  ></v-select>
                  
                  <v-spacer></v-spacer>
                  
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-refresh"
                    @click="refreshData"
                    class="mr-2"
                  >
                    Actualizar
                  </v-btn>
                  
                  <v-btn
                    color="secondary"
                    prepend-icon="mdi-restore"
                    @click="showRestoreConfirm = true"
                    variant="outlined"
                  >
                    Restaurar Pedidos
                  </v-btn>
                </div>
                
                <OrderList 
                  :search="searchQuery" 
                  :status-filter="statusFilter"
                  @order-selected="selectOrder"
                />
              </v-card-text>
            </v-card>
          </v-window-item>
          
          <v-window-item value="customers">
            <v-card>
              <v-card-title class="text-h5">Clientes</v-card-title>
              <v-card-text>
                <p class="text-body-1">La gestión de clientes estará disponible próximamente.</p>
              </v-card-text>
            </v-card>
          </v-window-item>
          
          <v-window-item value="settings">
            <v-card>
              <v-card-title class="text-h5">Configuración</v-card-title>
              <v-card-text>
                <p class="text-body-1">La configuración del sistema estará disponible próximamente.</p>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
    
    <v-dialog v-model="showOrderDetails" max-width="800">
      <OrderDetails 
        v-if="showOrderDetails"
        :order-id="selectedOrderId"
        @close="showOrderDetails = false"
        @order-updated="refreshData"
      />
    </v-dialog>
    
    <!-- Diálogo de confirmación para restaurar pedidos -->
    <v-dialog v-model="showRestoreConfirm" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Restaurar Pedidos Eliminados
        </v-card-title>
        
        <v-card-text>
          <p>Esta acción restaurará todos los pedidos eliminados previamente. ¿Estás seguro de que deseas continuar?</p>
          <p class="text-caption mt-2 text-grey-darken-1">
            <v-icon size="small" color="grey-darken-1">mdi-information-outline</v-icon>
            Esta función es solo para propósitos de demostración.
          </p>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="grey" 
            variant="text"
            @click="showRestoreConfirm = false"
            :disabled="isRestoring"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="primary" 
            @click="restoreDeletedOrders"
            :loading="isRestoring"
          >
            Confirmar Restauración
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Snackbar para feedback de operaciones -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      timeout="3000"
    >
      {{ snackbarMessage }}
      
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { useOrdersStore } from '@/stores/orders';
import { useAuthStore } from '@/stores/auth';
import { ORDER_STATUS } from '@/stores/orders';
import OrderList from './components/OrderList.vue';
import OrderDetails from './components/OrderDetails.vue';

export default {
  name: 'AdminDashboard',
  components: {
    OrderList,
    OrderDetails
  },
  data() {
    return {
      activeTab: 'dashboard',
      isLoading: true,
      error: null,
      searchQuery: '',
      statusFilter: null,
      showOrderDetails: false,
      selectedOrderId: null,
      // Para el diálogo de restauración de pedidos
      showRestoreConfirm: false,
      isRestoring: false,
      // Para mostrar mensajes de feedback
      showSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'success'
    };
  },
  computed: {
    ordersStore() {
      return useOrdersStore();
    },
    
    authStore() {
      return useAuthStore();
    },
    
    orderStats() {
      return {
        total: this.ordersStore.orders.length,
        completed: this.ordersStore.completedOrders.length,
        pending: this.ordersStore.pendingOrders.length
      };
    },
    
    statusOptions() {
      return [
        { title: 'Pendiente', value: ORDER_STATUS.PENDING },
        { title: 'En proceso', value: ORDER_STATUS.PROCESSING },
        { title: 'Completado', value: ORDER_STATUS.COMPLETED },
        { title: 'Fallido', value: ORDER_STATUS.FAILED }
      ];
    }
  },
  mounted() {
    // Enable admin mode in the orders store
    this.ordersStore.setAdminMode(true);
    
    // Fetch data
    this.fetchData();
  },
  beforeUnmount() {
    // Disable admin mode when leaving
    this.ordersStore.setAdminMode(false);
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      
      try {
        // Fetch all orders using admin mode
        await this.ordersStore.fetchAllOrders();
        
        // Apply filters
        this.applyFilters();
      } catch (error) {
        console.error('Error fetching admin data:', error);
        this.error = 'Error al cargar los datos. Por favor, recarga la página.';
      } finally {
        this.isLoading = false;
      }
    },
    
    applyFilters() {
      // Apply filters to the orders store
      this.ordersStore.setFilters({
        status: this.statusFilter,
        searchTerm: this.searchQuery
      });
    },
    
    selectOrder(orderId) {
      this.selectedOrderId = orderId;
      this.showOrderDetails = true;
    },
    
    refreshData() {
      this.fetchData();
    },
    
    /**
     * Restaurar pedidos eliminados
     * Esta función llama al método clearDeletedOrderIds del store
     * para restaurar los pedidos que fueron eliminados anteriormente
     */
    async restoreDeletedOrders() {
      this.isRestoring = true;
      
      try {
        const success = await this.ordersStore.clearDeletedOrderIds();
        
        if (success) {
          // Mostrar mensaje de éxito
          this.snackbarMessage = 'Pedidos restaurados correctamente';
          this.snackbarColor = 'success';
          this.showSnackbar = true;
          
          // Cerrar el diálogo de confirmación
          this.showRestoreConfirm = false;
          
          console.log('Pedidos restaurados exitosamente');
        } else {
          // Mostrar mensaje de error
          this.snackbarMessage = 'Error al restaurar los pedidos';
          this.snackbarColor = 'error';
          this.showSnackbar = true;
          
          console.error('Error al restaurar pedidos - operación fallida');
        }
      } catch (error) {
        // Mostrar mensaje de error con detalles
        this.snackbarMessage = `Error: ${error.message || 'Error desconocido'}`;
        this.snackbarColor = 'error';
        this.showSnackbar = true;
        
        console.error('Error al restaurar pedidos:', error);
      } finally {
        this.isRestoring = false;
      }
    },
    
    async logout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$router.push('/auth/login');
    }
  },
  watch: {
    statusFilter() {
      this.applyFilters();
    },
    
    searchQuery() {
      this.applyFilters();
    }
  }
};
</script>

