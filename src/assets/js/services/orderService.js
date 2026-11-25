/**
 * Serviço de Gestão de Pedidos e Rastreamento em Tempo Real
 * Arquivo: assets/js/services/orderService.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

window.GasFacil = window.GasFacil || {};

window.GasFacil.orderService = {
  ORDERS_KEY: 'orders',

  init() {
    if (window.GasFacil.initSeedData) {
      window.GasFacil.initSeedData();
    }

    const storage = window.GasFacil.storage;
    if (!storage.has(this.ORDERS_KEY)) {
      // Pedidos iniciais registrados no sistema
      const initialOrders = [
        {
          id: 'ORD-2026-092',
          userId: 'usr_cliente_01',
          customerName: 'Manuel Domingos',
          customerPhone: '+244 923 123 456',
          productName: 'Botijão de Gás Butano 13kg',
          productId: 'botija-13kg',
          cylinderColor: 'blue',
          cylinderBrand: 'Sonangol Gás',
          purchaseType: 'refill', // 'refill' ou 'complete'
          quantity: 1,
          unitPrice: 3500,
          deliveryFee: 1000,
          totalAmount: 4500,
          paymentMethod: 'cash_delivery',
          isKilape: false,
          status: 'in_transit', // 'received', 'preparing', 'in_transit', 'delivered', 'cancelled'
          statusLabel: 'A Caminho',
          deliveryAddress: {
            zone: 'Talatona',
            street: 'Rua das Acácias, Casa 45',
            reference: 'Perto do Kero Talatona'
          },
          driver: {
            name: 'João Baptista',
            phone: '+244 923 888 777',
            vehicle: 'Moto Triciclo LD-45-89-GH'
          },
          estimatedMinutes: 20,
          createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'ORD-2026-051',
          userId: 'usr_cliente_01',
          customerName: 'Manuel Domingos',
          customerPhone: '+244 923 123 456',
          productName: 'Botijão de Gás Butano 13kg',
          productId: 'botija-13kg',
          cylinderColor: 'blue',
          cylinderBrand: 'Sonangol Gás',
          purchaseType: 'refill',
          quantity: 1,
          unitPrice: 3500,
          deliveryFee: 1000,
          totalAmount: 4500,
          paymentMethod: 'tpa_delivery',
          isKilape: false,
          status: 'delivered',
          statusLabel: 'Entregue',
          deliveryAddress: {
            zone: 'Talatona',
            street: 'Rua das Acácias, Casa 45',
            reference: 'Perto do Kero Talatona'
          },
          driver: {
            name: 'Mateus Silva',
            phone: '+244 931 555 444',
            vehicle: 'Carrinha LD-12-34-AB'
          },
          createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          deliveredAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString()
        },
        {
          id: 'ORD-2026-018',
          userId: 'usr_cliente_02',
          customerName: 'Maria Silva',
          customerPhone: '+244 923 000 000',
          productName: 'Kit Válvula Reguladora + Mangueira',
          productId: 'kit-seguranca',
          cylinderColor: 'blue',
          cylinderBrand: 'Universal',
          purchaseType: 'complete',
          quantity: 1,
          unitPrice: 5000,
          deliveryFee: 1000,
          totalAmount: 6000,
          paymentMethod: 'cash_delivery',
          isKilape: false,
          status: 'delivered',
          statusLabel: 'Entregue',
          deliveryAddress: {
            zone: 'Maianga',
            street: 'Rua Principal, 123',
            reference: 'Próximo à padaria'
          },
          createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
          deliveredAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString()
        }
      ];

      storage.set(this.ORDERS_KEY, initialOrders);
    }
  },

  getAllOrders() {
    this.init();
    return window.GasFacil.storage.get(this.ORDERS_KEY, []);
  },

  /**
   * Obtém todos os pedidos de um utilizador específico
   */
  async getOrdersByUser(userId) {
    this.init();
    const orders = this.getAllOrders();
    const userOrders = orders
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return Promise.resolve(userOrders);
  },

  /**
   * Obtém o pedido ativo em andamento (se houver)
   */
  async getActiveOrder(userId) {
    const orders = await this.getOrdersByUser(userId);
    const active = orders.find(o => ['received', 'preparing', 'in_transit'].includes(o.status));
    return Promise.resolve(active || null);
  },

  /**
   * Cria um novo pedido no sistema
   */
  async createOrder(orderData) {
    this.init();
    const orders = this.getAllOrders();

    const currentUser = window.GasFacil.authService ? window.GasFacil.authService.getCurrentUser() : null;

    const orderNumber = Math.floor(100 + Math.random() * 900);
    const newOrder = {
      id: `ORD-2026-${orderNumber}`,
      userId: orderData.userId,
      customerName: orderData.customerName || (currentUser ? currentUser.name : 'Cliente Gás-Fácil'),
      customerPhone: orderData.customerPhone || (currentUser ? currentUser.phone : ''),
      productName: orderData.productName || 'Botijão de Gás Butano 13kg',
      productId: orderData.productId || 'botija-13kg',
      cylinderColor: orderData.cylinderColor || 'blue',
      cylinderBrand: orderData.cylinderBrand || 'Sonangol Gás',
      purchaseType: orderData.purchaseType || 'refill',
      quantity: orderData.quantity || 1,
      unitPrice: orderData.unitPrice || 3500,
      deliveryFee: orderData.deliveryFee || 1000,
      totalAmount: orderData.totalAmount || 4500,
      paymentMethod: orderData.paymentMethod || 'cash_delivery',
      isKilape: orderData.paymentMethod === 'kilape_bazou',
      kilapeDueDate: orderData.kilapeDueDate || null,
      status: 'received',
      statusLabel: 'Recebido',
      deliveryAddress: orderData.deliveryAddress || {
        zone: 'Luanda Centro',
        street: 'Endereço padrão',
        reference: ''
      },
      driver: {
        name: 'Carlos Mendes',
        phone: '+244 924 111 222',
        vehicle: 'Moto Triciclo Térmico'
      },
      estimatedMinutes: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    window.GasFacil.storage.set(this.ORDERS_KEY, orders);

    // Conceder pontos de fidelidade (1 ponto a cada 50 Kz)
    if (window.GasFacil.authService) {
      const user = window.GasFacil.authService.getCurrentUser();
      if (user && user.id === orderData.userId) {
        const earnedPoints = Math.floor(newOrder.totalAmount / 50);
        user.loyalty = user.loyalty || { points: 0, tier: 'Bronze', kilapeEligible: false };
        user.loyalty.points += earnedPoints;

        // Atualizar nível
        if (window.GasFacil.loyaltyService) {
          const tier = window.GasFacil.loyaltyService.getTier(user.loyalty.points);
          user.loyalty.tier = tier.name;
          user.loyalty.kilapeEligible = tier.kilapeAllowed;
        }

        if (newOrder.isKilape) {
          user.loyalty.activeKilape = true;
        }

        window.GasFacil.authService.updateCurrentUser(user);
      }
    }

    return Promise.resolve(newOrder);
  },

  /**
   * Obtém um pedido específico pelo seu ID
   */
  async getOrderById(orderId) {
    this.init();
    const orders = this.getAllOrders();
    const order = orders.find(o => o.id === orderId);
    return Promise.resolve(order || null);
  },

  /**
   * Atualiza o estado de um pedido (Usado pelo Gestor)
   * Estados válidos: 'received', 'preparing', 'in_transit', 'delivered', 'cancelled'
   */
  async updateOrderStatus(orderId, newStatus) {
    this.init();
    const orders = this.getAllOrders();
    const order = orders.find(o => o.id === orderId);

    if (!order) {
      return Promise.resolve({
        success: false,
        message: 'Pedido não encontrado.'
      });
    }

    const validStatuses = ['received', 'preparing', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return Promise.resolve({
        success: false,
        message: 'Estado de pedido inválido.'
      });
    }

    const statusLabels = {
      received: 'Recebido',
      preparing: 'Em Preparação',
      in_transit: 'A Caminho',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };

    order.status = newStatus;
    order.statusLabel = statusLabels[newStatus];
    order.updatedAt = new Date().toISOString();

    if (newStatus === 'delivered') {
      order.deliveredAt = new Date().toISOString();
    }

    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status: newStatus,
      statusLabel: statusLabels[newStatus],
      timestamp: new Date().toISOString()
    });

    window.GasFacil.storage.set(this.ORDERS_KEY, orders);

    return Promise.resolve({
      success: true,
      order
    });
  }
};
