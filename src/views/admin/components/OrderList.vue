<template>
  <div>
    <v-data-table
      v-if="hasOrders"
      :headers="headers"
      :items="filteredOrders"
      :loading="ordersStore.isLoading"
      :search="search"
      :items-per-page="limit || 10"
      :sort-by="[{ key: 'createdAt', order: 'desc' }]"
      class="elevation-1"
    >
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
        >
          {{ item.status }}
        </v-chip>
      </template>
      
      <template v-slot:item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>
      
      <template v-slot:item.price="{ item }">
        ${{ item.price.toFixed(2) }}
      </template>
      
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon
          size="small"
          variant="text"
          color="primary"
          @click="viewOrder(item.id)"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    
    <v-alert v-else type="info" class="mb-0">
      No hay pedidos registrados en el sistema.
    </v-alert>
  </div>
</template>

<script>
import { useOrdersStore, ORDER_STATUS } from '@/stores/orders';

export default {
  name: 'OrderList',
  props: {
    limit: {
      type: Number,
      default: null
    },
    search: {
      type: String,
      default: ''
    },
    statusFilter: {
      type: String,
      default: null
    }
  },
  computed: {
    ordersStore() {
      return useOrdersStore();
    },
    
    hasOrders() {
      return this.ordersStore.orders && this.ordersStore.orders.length > 0;
    },
    
    filteredOrders() {
      let orders = [...this.ordersStore.orders];
      
      // Apply status filter if provided
      if (this.statusFilter) {
        orders = orders.filter(order => order.status === this.statusFilter);
      }
      
      // Apply limit if provided
      if (this.limit && orders.length > this.limit) {
        orders = orders.slice(0, this.limit);
      }
      
      return orders;
    },
    
    headers() {
      return [
        { title: 'ID', key: 'id', sortable: true },
        { title: 'Cliente', key: 'customerEmail', sortable: true },
        { title: 'Instagram', key: 'igUsername', sortable: true },
        { title: 'Producto', key: 'packageName', sortable: true },
        { title: 'Cantidad', key: 'quantity', sortable: true, align: 'end' },
        { title: 'Precio', key: 'price', sortable: true, align: 'end' },
        { title: 'Estado', key: 'status', sortable: true },
        { title: 'Fecha', key: 'createdAt', sortable: true },
        { title: 'Acciones', key: 'actions', sortable: false, align: 'center' }
      ];
    }
  },
  methods: {
    getStatusColor(status) {
      const statusMap = {
        [ORDER_STATUS.PENDING]: 'warning',
        [ORDER_STATUS.PROCESSING]: 'info',
        [ORDER_STATUS.COMPLETED]: 'success',
        [ORDER_STATUS.FAILED]: 'error'
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
    },
    
    viewOrder(orderId) {
      // Emit event to parent component
      this.$emit('order-selected', orderId);
    }
  }
};
</script>

