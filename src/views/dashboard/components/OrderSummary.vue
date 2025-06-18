<template>
  <v-card>
    <v-card-title class="text-h5 d-flex align-center">
      <v-icon class="mr-2">mdi-shopping</v-icon>
      Mis Pedidos
    </v-card-title>
    
    <v-card-text v-if="!hasOrders">
      <v-alert type="info" class="mb-0">
        No tienes ningún pedido activo. Navega a nuestros planes para comprar seguidores de Instagram.
      </v-alert>
    </v-card-text>
    
    <v-list v-else>
      <v-list-item v-for="(order, index) in orders" :key="index" link>
        <v-list-item-content>
          <v-list-item-title>{{ order.packageName }}</v-list-item-title>
          <v-list-item-subtitle>
            <v-chip
              :color="getStatusColor(order.status)"
              size="small"
              class="mr-2"
            >
              {{ order.status }}
            </v-chip>
            Pedido #{{ order.id }} - Creado el {{ formatDate(order.createdAt) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        
        <v-list-item-action>
          <v-chip color="primary">{{ order.quantity }} seguidores</v-chip>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="text"
        :to="{ name: 'Planes' }"
      >
        Ver Planes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'pinia';
import { useOrdersStore } from '@/stores/orders';

export default {
  name: 'OrderSummary',
  computed: {
    ...mapState(useOrdersStore, ['orders', 'isLoading', 'error']),
    
    hasOrders() {
      return this.orders && this.orders.length > 0;
    }
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
    
    formatDate(dateString) {
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

