<template>
  <v-card>
    <v-card-title class="text-h5 d-flex justify-space-between align-center">
      <span>Detalles del Pedido #{{ order?.id || 'N/A' }}</span>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    
    <v-divider></v-divider>
    
    <v-card-text v-if="isLoading">
      <div class="d-flex justify-center align-center" style="height: 200px">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </v-card-text>
    
    <template v-else-if="order">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-3">Información del Pedido</h3>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-identifier</v-icon>
                </template>
                <v-list-item-title>ID</v-list-item-title>
                <v-list-item-subtitle>{{ order.id }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-calendar</v-icon>
                </template>
                <v-list-item-title>Fecha</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(order.createdAt) }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-package-variant-closed</v-icon>
                </template>
                <v-list-item-title>Producto</v-list-item-title>
                <v-list-item-subtitle>{{ order.packageName }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-counter</v-icon>
                </template>
                <v-list-item-title>Cantidad</v-list-item-title>
                <v-list-item-subtitle>{{ order.quantity }} seguidores</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-currency-usd</v-icon>
                </template>
                <v-list-item-title>Precio</v-list-item-title>
                <v-list-item-subtitle>${{ order.price.toFixed(2) }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-credit-card</v-icon>
                </template>
                <v-list-item-title>ID de Pago</v-list-item-title>
                <v-list-item-subtitle>{{ order.paymentId || 'N/A' }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
          
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-3">Información del Cliente</h3>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-email</v-icon>
                </template>
                <v-list-item-title>Email</v-list-item-title>
                <v-list-item-subtitle>{{ order.customerEmail || 'N/A' }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-instagram</v-icon>
                </template>
                <v-list-item-title>Instagram</v-list-item-title>
                <v-list-item-subtitle>{{ order.igUsername ? '@' + order.igUsername : 'N/A' }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            
            <h3 class="text-h6 mb-3 mt-6">Estado del Pedido</h3>
            
            <div class="d-flex align-center mb-4">
              <v-avatar
                :color="getStatusColor(order.status)"
                size="32"
                class="mr-3"
              >
                <v-icon color="white">{{ getStatusIcon(order.status) }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-h6">{{ order.status }}</div>
              </div>
            </div>
            
            <v-select
              v-model="selectedStatus"
              :items="statusOptions"
              label="Cambiar Estado"
              item-title="text"
              item-value="value"
              return-object
              variant="outlined"
              density="comfortable"
              :disabled="isUpdating"
            ></v-select>
            
            <div class="d-flex justify-space-between mt-6">
              <v-btn
                color="error"
                :loading="isDeleting"
                @click="confirmDelete"
                prepend-icon="mdi-delete"
              >
                Eliminar Pedido
              </v-btn>
              
              <v-btn
                color="info"
                prepend-icon="mdi-credit-card-check"
                @click="checkPayment"
                :loading="isCheckingPayment"
              >
                Verificar Pago
              </v-btn>
            </div>
          </v-col>
        </v-row>
        
        <v-row v-if="paymentDetails" class="mt-4">
          <v-col cols="12">
            <v-card color="grey-lighten-4">
              <v-card-title class="text-h6">
                Detalles del Pago
              </v-card-title>
              <v-card-text>
                <v-list density="compact">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title>Estado</v-list-item-title>
                    <v-list-item-subtitle>{{ paymentDetails.status }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-calendar</v-icon>
                    </template>
                    <v-list-item-title>Fecha de Pago</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(paymentDetails.date_approved) }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-credit-card</v-icon>
                    </template>
                    <v-list-item-title>Método de Pago</v-list-item-title>
                    <v-list-item-subtitle>{{ paymentDetails.payment_method_id }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-currency-usd</v-icon>
                    </template>
                    <v-list-item-title>Monto</v-list-item-title>
                    <v-list-item-subtitle>${{ paymentDetails.transaction_amount.toFixed(2) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :loading="isUpdating"
          :disabled="!statusChanged"
          @click="updateOrderStatus"
        >
          Actualizar Estado
        </v-btn>
      </v-card-actions>
    </template>
    
    <v-card-text v-else>
      <v-alert type="error">
        No se pudo cargar la información del pedido.
      </v-alert>
    </v-card-text>
    
    <!-- Confirmation Dialog -->
    <v-dialog v-model="showDeleteConfirm" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="showDeleteConfirm = false">
            Cancelar
          </v-btn>
          <v-btn color="error" @click="deleteOrder" :loading="isDeleting">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { useOrdersStore, ORDER_STATUS } from '@/stores/orders';
import { getPaymentStatus } from '@/services/mercadopago';

export default {
  name: 'OrderDetails',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: true,
      isUpdating: false,
      isDeleting: false,
      isCheckingPayment: false,
      showDeleteConfirm: false,
      error: null,
      selectedStatus: null,
      paymentDetails: null
    };
  },
  computed: {
    ordersStore() {
      return useOrdersStore();
    },
    
    order() {
      return this.ordersStore.getOrderById(this.orderId);
    },
    
    statusOptions() {
      return [
        { text: 'Pendiente', value: ORDER_STATUS.PENDING },
        { text: 'En proceso', value: ORDER_STATUS.PROCESSING },
        { text: 'Completado', value: ORDER_STATUS.COMPLETED },
        { text: 'Fallido', value: ORDER_STATUS.FAILED }
      ];
    },
    
    statusChanged() {
      return this.selectedStatus && this.selectedStatus !== this.order?.status;
    }
  },
  watch: {
    orderId: {
      immediate: true,
      handler() {
        this.loadOrder();
      }
    }
  },
  methods: {
    async loadOrder() {
      this.isLoading = true;
      
      try {
        // Set the current order in the store
        this.ordersStore.setCurrentOrder(this.orderId);
        
        // Initialize selected status
        if (this.order) {
          this.selectedStatus = this.order.status;
        }
      } catch (error) {
        console.error('Error loading order details:', error);
        this.error = 'Error al cargar los detalles del pedido.';
      } finally {
        this.isLoading = false;
      }
    },
    
    getStatusColor(status) {
      const statusMap = {
        [ORDER_STATUS.PENDING]: 'warning',
        [ORDER_STATUS.PROCESSING]: 'info',
        [ORDER_STATUS.COMPLETED]: 'success',
        [ORDER_STATUS.FAILED]: 'error'
      };
      
      return statusMap[status] || 'grey';
    },
    
    getStatusIcon(status) {
      const iconMap = {
        [ORDER_STATUS.PENDING]: 'mdi-clock-outline',
        [ORDER_STATUS.PROCESSING]: 'mdi-progress-clock',
        [ORDER_STATUS.COMPLETED]: 'mdi-check-circle-outline',
        [ORDER_STATUS.FAILED]: 'mdi-alert-circle-outline'
      };
      
      return iconMap[status] || 'mdi-help-circle-outline';
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },
    
    async updateOrderStatus() {
      if (!this.statusChanged) return;
      
      this.isUpdating = true;
      
      try {
        // Update order status using the store action
        const success = await this.ordersStore.updateOrderStatus(
          this.orderId, 
          this.selectedStatus
        );
        
        if (success) {
          // Emit event to parent component
          this.$emit('order-updated');
        } else {
          // Show error
          this.error = this.ordersStore.error || 'Error al actualizar el estado del pedido.';
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        this.error = 'Error al actualizar el estado del pedido.';
      } finally {
        this.isUpdating = false;
      }
    },
    
    confirmDelete() {
      this.showDeleteConfirm = true;
    },
    
    async deleteOrder() {
      this.isDeleting = true;
      
      try {
        // Delete order using the store action
        const success = await this.ordersStore.deleteOrder(this.orderId);
        
        if (success) {
          // Close dialogs and emit event
          this.showDeleteConfirm = false;
          this.$emit('order-updated');
          this.$emit('close');
        } else {
          // Show error
          this.error = this.ordersStore.error || 'Error al eliminar el pedido.';
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        this.error = 'Error al eliminar el pedido.';
      } finally {
        this.isDeleting = false;
      }
    },
    
    async checkPayment() {
      if (!this.order?.paymentId) {
        this.error = 'No hay ID de pago asociado a este pedido.';
        return;
      }
      
      this.isCheckingPayment = true;
      
      try {
        // Get payment details from MercadoPago service
        this.paymentDetails = await getPaymentStatus(this.order.paymentId);
      } catch (error) {
        console.error('Error checking payment status:', error);
        this.error = 'Error al verificar el estado del pago.';
      } finally {
        this.isCheckingPayment = false;
      }
    }
  }
};
</script>

