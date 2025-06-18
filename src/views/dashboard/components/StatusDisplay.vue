<template>
  <v-card>
    <v-card-title class="text-h5 d-flex align-center">
      <v-icon class="mr-2">mdi-information-outline</v-icon>
      Estado de tu Pedido
    </v-card-title>
    
    <v-card-text>
      <div v-if="currentOrder">
        <div class="d-flex align-center mb-4">
          <v-avatar
            :color="getStatusColor(currentOrder.status)"
            size="32"
            class="mr-3"
          >
            <v-icon color="white">{{ getStatusIcon(currentOrder.status) }}</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6">{{ currentOrder.status }}</div>
            <div class="text-body-2">Pedido #{{ currentOrder.id }}</div>
          </div>
        </div>
        
        <v-timeline density="compact" align="start">
          <v-timeline-item
            v-for="(step, index) in orderSteps"
            :key="index"
            :dot-color="getStepColor(step, index)"
            :icon="getStepIcon(step, index)"
            :class="{ 'text-grey': !isStepCompleted(index) }"
          >
            {{ step }}
          </v-timeline-item>
        </v-timeline>
      </div>
      
      <v-alert v-else type="info" class="mb-0">
        No tienes ningún pedido activo. Cuando realices una compra, podrás ver el estado de tu pedido aquí.
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'pinia';
import { useOrdersStore } from '@/stores/orders';

export default {
  name: 'StatusDisplay',
  data() {
    return {
      orderSteps: [
        'Pedido recibido',
        'Pago confirmado',
        'Procesando seguidores',
        'Completado'
      ]
    };
  },
  computed: {
    ...mapState(useOrdersStore, ['currentOrder', 'isLoading']),
  },
  methods: {
    getStatusColor(status) {
      const statusMap = {
        'Pendiente': 'warning',
        'En proceso': 'info',
        'Completado': 'success',
        'Fallido': 'error'
      };
      
      return statusMap[status] || 'grey';
    },
    
    getStatusIcon(status) {
      const iconMap = {
        'Pendiente': 'mdi-clock-outline',
        'En proceso': 'mdi-progress-clock',
        'Completado': 'mdi-check-circle-outline',
        'Fallido': 'mdi-alert-circle-outline'
      };
      
      return iconMap[status] || 'mdi-help-circle-outline';
    },
    
    isStepCompleted(index) {
      // Assuming currentOrder.step indicates the current step (1-based)
      return index < this.currentOrder?.step;
    },
    
    getStepColor(step, index) {
      if (!this.currentOrder) return 'grey';
      
      if (index < this.currentOrder.step) {
        return 'success';
      } else if (index === this.currentOrder.step) {
        return this.getStatusColor(this.currentOrder.status);
      } else {
        return 'grey-lighten-1';
      }
    },
    
    getStepIcon(step, index) {
      if (!this.currentOrder) return 'mdi-help-circle-outline';
      
      if (index < this.currentOrder.step) {
        return 'mdi-check-circle';
      } else if (index === this.currentOrder.step) {
        return this.getStatusIcon(this.currentOrder.status);
      } else {
        return 'mdi-circle-outline';
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-AR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  }
};
</script>

