import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

/**
 * Order status enum
 * @type {Object}
 */
export const ORDER_STATUS = {
  PENDING: 'Pendiente',
  PROCESSING: 'En proceso',
  COMPLETED: 'Completado',
  FAILED: 'Fallido'
}

/**
 * Store for managing orders
 */
export const useOrdersStore = defineStore('orders', {
  /**
   * State definition
   * @returns {Object} Initial state
   */
  state: () => {
    // Cargar IDs de pedidos eliminados desde localStorage al inicializar el store
    let deletedOrderIds = [];
    try {
      const savedDeletedOrderIds = localStorage.getItem('deletedOrderIds');
      if (savedDeletedOrderIds) {
        deletedOrderIds = JSON.parse(savedDeletedOrderIds);
        console.log('Pedidos eliminados cargados desde localStorage:', deletedOrderIds);
      }
    } catch (error) {
      console.error('Error cargando pedidos eliminados desde localStorage:', error);
    }
    
    return {
      /** @type {Array<Object>} List of user orders */
      orders: [],
      
      /** @type {Object|null} Currently selected/active order */
      currentOrder: null,
      
      /** @type {boolean} Loading state for API operations */
      isLoading: false,
      
      /** @type {string|null} Error message from last operation */
      error: null,
      
      /** @type {boolean} Whether orders have been loaded at least once */
      initialized: false,
      
      /** @type {boolean} Whether admin features are available */
      isAdminMode: false,
      
      /** @type {Object} Order filters for admin view */
      filters: {
        status: null,
        dateRange: null,
        searchTerm: ''
      },
      
      /** @type {boolean} Whether the last API call was successful */
      lastOperationSuccess: true,
      
      /** @type {Array<string>} IDs of orders that have been deleted */
      deletedOrderIds
    };
  },
  
  /**
   * Getters
   */
  getters: {
    /**
     * Check if user has any orders
     * @returns {boolean} True if user has orders
     */
    hasOrders: (state) => state.orders.length > 0,
    
    /**
     * Get pending orders
     * @returns {Array<Object>} Filtered list of pending orders
     */
    pendingOrders: (state) => state.orders.filter(order => 
      order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.PROCESSING
    ),
    
    /**
     * Get completed orders
     * @returns {Array<Object>} Filtered list of completed orders
     */
    completedOrders: (state) => state.orders.filter(order => 
      order.status === ORDER_STATUS.COMPLETED
    ),
    
    /**
     * Get orders sorted by creation date (newest first)
     * @returns {Array<Object>} Sorted list of orders
     */
    recentOrders: (state) => [...state.orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  },
  
  /**
   * Actions
   */
  actions: {
    /**
     * Set admin mode - enables admin-specific features
     * @param {boolean} value - Whether to enable admin mode
     */
    setAdminMode(value = true) {
      this.isAdminMode = value;
    },
    
    /**
     * Set filters for admin view
     * @param {Object} filters - Filter values
     */
    setFilters(filters = {}) {
      this.filters = {
        ...this.filters,
        ...filters
      };
    },
    
    /**
     * Base API request function
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} Response data
     * @private
     */
    async _apiRequest(endpoint, options = {}) {
      // In a real implementation, this would call the actual API
      // For now, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // This is a stub that will be replaced with real API calls
      console.log(`API ${options.method || 'GET'} request to ${endpoint}`, options);
      
      // Return mock response based on endpoint
      if (endpoint === '/orders' && options.method === 'GET') {
        return [];
      } else if (endpoint === '/orders' && options.method === 'POST') {
        return { id: `order_${Date.now()}` };
      } else if (endpoint.includes('/orders/') && options.method === 'PUT') {
        return { success: true };
      } else if (endpoint.includes('/orders/') && options.method === 'DELETE') {
        return { success: true };
      }
      
      return {};
    },
    
    /**
     * Fetch all orders for the current user
     * @returns {Promise<void>}
     */
    async fetchOrders() {
      if (this.isLoading) return;
      
      this.isLoading = true;
      this.error = null;
      this.lastOperationSuccess = true;

      try {
        // Get auth store to check authentication status
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          this.orders = [];
          return;
        }
        
        // In a real implementation, this would call the API with the user's ID
        // For now, just simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize with empty array - would be populated from API
        this.orders = [];
        
        // Set the most recent order as current if not already set
        if (this.orders.length > 0 && !this.currentOrder) {
          this.currentOrder = this.recentOrders[0];
        }
        
        this.initialized = true;
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.error = 'No se pudieron cargar los pedidos. Intenta de nuevo más tarde.';
        this.lastOperationSuccess = false;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Create a new order
     * @param {Object} orderData - Order data with package details
     * @returns {Promise<Object>} The created order
     */
    async createOrder(orderData) {
      this.isLoading = true;
      this.error = null;
      this.lastOperationSuccess = true;

      try {
        // Get auth store to check authentication status
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          throw new Error('User not authenticated');
        }
        
        // In a real implementation, this would call the API
        // For now, simulate an API call
        const response = await this._apiRequest('/orders', {
          method: 'POST',
          body: {
            ...orderData,
            userId: authStore.user?.id,
            customerEmail: authStore.user?.email,
            // Get Instagram username from localStorage or user profile
            igUsername: localStorage.getItem('ig_username') || ''
          }
        });
        
        // Create new order object
        const newOrder = {
          id: response.id || `order_${Date.now()}`,
          status: ORDER_STATUS.PENDING,
          createdAt: new Date().toISOString(),
          step: 0,
          userId: authStore.user?.id,
          customerEmail: authStore.user?.email,
          igUsername: localStorage.getItem('ig_username') || '',
          ...orderData
        };
        
        // Add to orders array
        this.orders.push(newOrder);
        
        // Set as current order
        this.currentOrder = newOrder;
        
        return newOrder;
      } catch (error) {
        console.error('Error creating order:', error);
        this.error = 'Error al crear el pedido. Intenta de nuevo más tarde.';
        this.lastOperationSuccess = false;
        throw new Error('Failed to create order');
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Poll the status of a specific order
     * @param {string} orderId - ID of the order to check
     * @returns {Promise<Object|null>} Updated order if found, null otherwise
     */
    async pollOrderStatus(orderId) {
      if (!orderId) return null;
      
      try {
        // In a real implementation, this would call the API
        // For now, simulate an API call
        await this._apiRequest(`/orders/${orderId}/status`);
        
        // Find order index
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return null;
        
        // Get order
        const order = this.orders[orderIndex];
        
        // For demo purposes, simulate a status update
        // In a real implementation, the status would come from the API
        const statuses = [
          ORDER_STATUS.PENDING,
          ORDER_STATUS.PROCESSING,
          ORDER_STATUS.COMPLETED
        ];
        const currentStatusIndex = statuses.indexOf(order.status);
        
        // Move to the next status if not completed
        if (currentStatusIndex < statuses.length - 1) { 
          order.status = statuses[currentStatusIndex + 1];
          if (order.step < 3) {
            order.step += 1;
          }
        }
        
        // Update order in store
        this.orders.splice(orderIndex, 1, { ...order });
        
        // Update currentOrder if this is the current order
        if (this.currentOrder?.id === orderId) {
          this.currentOrder = { ...order };
        }
        
        return order;
      } catch (error) {
        console.error('Error polling order status:', error);
        return null;
      }
    },
    
    /**
     * Get a specific order by ID
     * @param {string} orderId - ID of the order to get
     * @returns {Object|null} Order if found, null otherwise
     */
    getOrderById(orderId) {
      return this.orders.find(order => order.id === orderId) || null;
    },
    
    /**
     * Set a specific order as the current order
     * @param {string} orderId - ID of the order to set as current
     * @returns {boolean} True if order was found and set
     */
    setCurrentOrder(orderId) {
      const order = this.getOrderById(orderId);
      if (order) {
        this.currentOrder = order;
        return true;
      }
      return false;
    },
    
    /**
     * Fetch all orders (admin only)
     * @returns {Promise<void>}
     */
    /**
     * Load deleted order IDs from localStorage
     * @private
     */
    _loadDeletedOrderIds() {
      try {
        const savedDeletedOrderIds = localStorage.getItem('deletedOrderIds');
        if (savedDeletedOrderIds) {
          this.deletedOrderIds = JSON.parse(savedDeletedOrderIds);
        }
      } catch (error) {
        console.error('Error loading deleted order IDs:', error);
        this.deletedOrderIds = [];
      }
    },
    
    /**
     * Save deleted order IDs to localStorage
     * @private
     */
    _saveDeletedOrderIds() {
      try {
        localStorage.setItem('deletedOrderIds', JSON.stringify(this.deletedOrderIds));
      } catch (error) {
        console.error('Error saving deleted order IDs:', error);
      }
    },
    
    async fetchAllOrders() {
      if (!this.isAdminMode) {
        console.error('Admin mode required to fetch all orders');
        return;
      }
      
      if (this.isLoading) return;
      
      this.isLoading = true;
      this.error = null;
      this.lastOperationSuccess = true;

      try {
        // Verificar si ya tenemos pedidos eliminados, si no, cargarlos
        if (this.deletedOrderIds.length === 0) {
          this._loadDeletedOrderIds();
        }
        
        console.log('Filtrando pedidos con IDs eliminados:', this.deletedOrderIds);
        
        // In a real implementation, this would call the API
        // For now, simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, this would fetch all orders from backend
        // For demo purposes, we'll create some sample orders
        const sampleOrders = [
          {
            id: 'order_001',
            packageName: 'Paquete Básico',
            status: ORDER_STATUS.COMPLETED,
            quantity: 500,
            price: 9.99,
            createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
            step: 3,
            paymentId: 'pay_001',
            customerEmail: 'cliente1@example.com',
            igUsername: 'usuario1'
          },
          {
            id: 'order_002',
            packageName: 'Paquete Premium',
            status: ORDER_STATUS.PROCESSING,
            quantity: 1000,
            price: 19.99,
            createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
            step: 1,
            paymentId: 'pay_002',
            customerEmail: 'cliente2@example.com',
            igUsername: 'usuario2'
          },
          {
            id: 'order_003',
            packageName: 'Paquete Estándar',
            status: ORDER_STATUS.PENDING,
            quantity: 750,
            price: 14.99,
            createdAt: new Date().toISOString(), // Today
            step: 0,
            paymentId: 'pay_003',
            customerEmail: 'cliente3@example.com',
            igUsername: 'usuario3'
          }
        ];
        
        // Filter out deleted orders
        const filteredOrders = sampleOrders.filter(order => !this.deletedOrderIds.includes(order.id));
        console.log(`Pedidos originales: ${sampleOrders.length}, Pedidos filtrados: ${filteredOrders.length}, Pedidos eliminados: ${this.deletedOrderIds.length}`);
        
        this.orders = filteredOrders;
        this.initialized = true;
      } catch (error) {
        console.error('Error fetching all orders:', error);
        this.error = 'No se pudieron cargar los pedidos. Intenta de nuevo más tarde.';
        this.lastOperationSuccess = false;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Update order status (admin only)
     * @param {string} orderId - ID of the order to update
     * @param {string} status - New status
     * @returns {Promise<boolean>} Success status
     */
    async updateOrderStatus(orderId, status) {
      if (!this.isAdminMode) {
        console.error('Admin mode required to update order status');
        return false;
      }
      
      if (this.isLoading) return false;
      
      this.isLoading = true;
      this.error = null;
      this.lastOperationSuccess = true;

      try {
        // In a real implementation, this would call the API
        // For now, simulate an API call
        await this._apiRequest(`/orders/${orderId}`, {
          method: 'PUT',
          body: { status }
        });
        
        // Find order index
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
          this.error = 'Pedido no encontrado';
          this.lastOperationSuccess = false;
          return false;
        }
        
        // Get order
        const order = this.orders[orderIndex];
        
        // Update status
        order.status = status;
        
        // Update step based on status
        if (status === ORDER_STATUS.PENDING) {
          order.step = 0;
        } else if (status === ORDER_STATUS.PROCESSING) {
          order.step = 1;
        } else if (status === ORDER_STATUS.COMPLETED) {
          order.step = 3;
        }
        
        // Update order in store
        this.orders.splice(orderIndex, 1, { ...order });
        
        // Update currentOrder if this is the current order
        if (this.currentOrder?.id === orderId) {
          this.currentOrder = { ...order };
        }
        
        return true;
      } catch (error) {
        console.error('Error updating order status:', error);
        this.error = 'Error al actualizar el estado del pedido.';
        this.lastOperationSuccess = false;
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Delete an order (admin only)
     * @param {string} orderId - ID of the order to delete
     * @returns {Promise<boolean>} Success status
     */
    async deleteOrder(orderId) {
      if (!this.isAdminMode) {
        console.error('Admin mode required to delete order');
        return false;
      }
      
      if (this.isLoading) return false;
      
      this.isLoading = true;
      this.error = null;
      this.lastOperationSuccess = true;

      try {
        // In a real implementation, this would call the API
        // For now, simulate an API call
        await this._apiRequest(`/orders/${orderId}`, {
          method: 'DELETE'
        });
        
        // Find order index
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
          this.error = 'Pedido no encontrado';
          this.lastOperationSuccess = false;
          return false;
        }
        
        // Add the order ID to deletedOrderIds
        if (!this.deletedOrderIds.includes(orderId)) {
          this.deletedOrderIds.push(orderId);
          // Save to localStorage for persistence
          this._saveDeletedOrderIds();
        }
        
        // Remove order from store
        this.orders.splice(orderIndex, 1);
        
        // Clear currentOrder if this is the current order
        if (this.currentOrder?.id === orderId) {
          this.currentOrder = null;
        }
        
        console.log('Pedido eliminado correctamente. ID:', orderId);
        console.log('Pedidos eliminados actualizados:', this.deletedOrderIds);
        
        return true;
      } catch (error) {
        console.error('Error deleting order:', error);
        this.error = 'Error al eliminar el pedido.';
        this.lastOperationSuccess = false;
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Search orders by various criteria (admin only)
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Array<Object>>} Filtered orders
     */
    async searchOrders(criteria = {}) {
      if (!this.isAdminMode) {
        console.error('Admin mode required to search orders');
        return [];
      }
      
      // In a real implementation, this would call the API
      // For now, we'll just filter the existing orders
      let filteredOrders = [...this.orders];
      
      // Filter by status
      if (criteria.status) {
        filteredOrders = filteredOrders.filter(order => order.status === criteria.status);
      }
      
      // Filter by date range
      if (criteria.startDate && criteria.endDate) {
        const start = new Date(criteria.startDate).getTime();
        const end = new Date(criteria.endDate).getTime();
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = new Date(order.createdAt).getTime();
          return orderDate >= start && orderDate <= end;
        });
      }
      
      // Filter by search term (match against ID, email, or Instagram username)
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
          order.id.toLowerCase().includes(term) ||
          (order.customerEmail && order.customerEmail.toLowerCase().includes(term)) ||
          (order.igUsername && order.igUsername.toLowerCase().includes(term))
        );
      }
      
      return filteredOrders;
    },
    
    /**
     * Reset the store to its initial state
     */
    /**
     * Clear deleted order IDs
     * This can be used to "restaurar" orders for demo purposes
     * @returns {Promise<boolean>} Success status
     */
    async clearDeletedOrderIds() {
      if (!this.isAdminMode) {
        console.error('Admin mode required to clear deleted order IDs');
        return false;
      }
      
      try {
        console.log('Restaurando pedidos eliminados. Cantidad anterior:', this.deletedOrderIds.length);
        this.deletedOrderIds = [];
        localStorage.removeItem('deletedOrderIds');
        console.log('IDs de pedidos eliminados limpiados');
        
        // Refrescar pedidos
        await this.fetchAllOrders();
        
        return true;
      } catch (error) {
        console.error('Error clearing deleted order IDs:', error);
        return false;
      }
    },
    
    resetStore() {
      this.orders = [];
      this.currentOrder = null;
      this.isLoading = false;
      this.error = null;
      this.initialized = false;
      this.isAdminMode = false;
      this.filters = {
        status: null,
        dateRange: null,
        searchTerm: ''
      };
      this.lastOperationSuccess = true;
      // We don't reset deletedOrderIds here, as they should persist
    }
  }
});

