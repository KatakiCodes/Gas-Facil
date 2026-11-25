/**
 * Controlador do Painel do Cliente (Dashboard)
 * Arquivo: assets/js/pages/dashboard.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

(function() {
  const GF = window.GasFacil;
  let currentUser = null;
  let cachedProducts = [];

  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializar tema
    if (GF.themeSwitcher) {
      GF.themeSwitcher.initTheme();
    }

    // 2. Verificar autenticação
    currentUser = GF.authService.getCurrentUser();
    if (!currentUser) {
      // Se não houver sessão ativa, redirecionar para o login
      window.location.href = 'login.html';
      return;
    }

    // 3. Carregar produtos
    if (GF.productService) {
      cachedProducts = await GF.productService.getProducts();
    }

    // 4. Renderizar dados do usuário e fidelidade
    renderUserData();

    // 5. Carregar e renderizar pedidos
    await loadOrders();

    // 6. Configurar listeners e modal de novo pedido
    setupNewOrderModal();
    setupLogout();

    // 7. Atualizar quando o tema visual mudar
    GF.onThemeChanged = function() {
      updateOrderModalPrices();
    };
  });

  /**
   * Renderiza os dados do perfil, pontos e elegibilidade ao Gás Bazou (Kilape)
   */
  function renderUserData() {
    if (!currentUser) return;

    // Nome e iniciais
    const userNameElements = document.querySelectorAll('[data-bind="userName"]');
    userNameElements.forEach(el => el.textContent = currentUser.name);

    const userPhoneEl = document.getElementById('userPhone');
    if (userPhoneEl) userPhoneEl.textContent = currentUser.phone;

    const userInitialsEl = document.getElementById('userInitials');
    if (userInitialsEl) {
      const parts = currentUser.name.split(' ');
      const initials = parts.length > 1 
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
      userInitialsEl.textContent = initials;
    }

    // Programa de Fidelidade
    const points = currentUser.loyalty?.points || 0;
    const pointsEl = document.getElementById('userPoints');
    if (pointsEl) pointsEl.textContent = points;

    // Nível (Tier)
    let tier = { name: 'Bronze', badgeClass: 'bg-secondary text-white', kilapeAllowed: false };
    if (GF.loyaltyService) {
      tier = GF.loyaltyService.getTier(points);
    }

    const tierBadge = document.getElementById('userTierBadge');
    if (tierBadge) {
      tierBadge.textContent = `Nível ${tier.name}`;
      tierBadge.className = `badge ${tier.badgeClass} px-2 py-1`;
    }

    // Status do "Gás Bazou" (Kilape)
    const bazouStatusContainer = document.getElementById('bazouStatusContainer');
    if (bazouStatusContainer && GF.loyaltyService) {
      const eligibility = GF.loyaltyService.checkGasBazouEligibility(currentUser);
      
      if (eligibility.eligible) {
        bazouStatusContainer.innerHTML = `
          <div class="alert alert-warning border-warning bg-warning bg-opacity-10 mb-0 py-2 px-3 small">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <i class="bi bi-lightning-charge-fill text-warning me-1"></i>
                <strong>Gás Bazou Desbloqueado!</strong> Tem crédito emergencial aprovado até 30 dias para quitação.
              </div>
              <button type="button" class="btn btn-warning btn-sm fw-bold px-3 py-1 shadow-sm" data-bs-toggle="modal" data-bs-target="#modalNewOrder" data-preset-kilape="true">
                <i class="bi bi-cart-plus me-1"></i>Pedir no Kilape
              </button>
            </div>
          </div>
        `;
      } else {
        const progressPercent = Math.min(100, Math.round((points / 200) * 100));
        bazouStatusContainer.innerHTML = `
          <div class="p-2 border rounded bg-light small">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span><i class="bi bi-lock-fill text-muted me-1"></i>Gás Bazou (Kilape Emergencial)</span>
              <span class="fw-bold">${points} / 200 pts</span>
            </div>
            <div class="progress" style="height: 6px;">
              <div class="progress-bar bg-warning" role="progressbar" style="width: ${progressPercent}%;" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="text-muted mt-1" style="font-size: 0.72rem;">
              Faça pedidos normais para acumular 200 pontos e desbloquear o pedido a crédito emergencial.
            </div>
          </div>
        `;
      }
    }
  }

  /**
   * Carrega o pedido ativo e a lista de histórico
   */
  async function loadOrders() {
    if (!currentUser || !GF.orderService) return;

    try {
      const activeOrder = await GF.orderService.getActiveOrder(currentUser.id);
      renderActiveOrder(activeOrder);

      const allOrders = await GF.orderService.getOrdersByUser(currentUser.id);
      renderOrdersHistory(allOrders);
    } catch (err) {
      console.error('Erro ao carregar pedidos do utilizador:', err);
    }
  }

  /**
   * Renderiza a seção de rastreamento do pedido ativo
   */
  function renderActiveOrder(order) {
    const activeSection = document.getElementById('activeOrderSection');
    if (!activeSection) return;

    if (!order) {
      activeSection.innerHTML = `
        <div class="card border p-4 text-center bg-white shadow-sm">
          <div class="mb-3">
            <div class="d-inline-flex align-items-center justify-content-center bg-light text-muted rounded-circle" style="width: 56px; height: 56px;">
              <i class="bi bi-clock-history fs-3"></i>
            </div>
          </div>
          <h5 class="fw-bold text-dark mb-1">Nenhum Pedido em Andamento</h5>
          <p class="text-muted small mb-3">O teu fogão precisa de gás? Solicite agora e receba em menos de 30 minutos em Luanda.</p>
          <div>
            <button type="button" class="btn btn-primary fw-semibold px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#modalNewOrder">
              <i class="bi bi-cart-plus me-1"></i>Fazer Novo Pedido
            </button>
          </div>
        </div>
      `;
      return;
    }

    // Mapear status na linha do tempo
    const steps = [
      { key: 'received', title: '1. Recebido', icon: 'bi-file-text' },
      { key: 'preparing', title: '2. Em Preparação', icon: 'bi-box-seam' },
      { key: 'in_transit', title: '3. A Caminho', icon: 'bi-truck' },
      { key: 'delivered', title: '4. Entregue', icon: 'bi-check-circle' }
    ];

    const statusWeights = { received: 1, preparing: 2, in_transit: 3, delivered: 4 };
    const currentWeight = statusWeights[order.status] || 1;

    const timelineHtml = steps.map((s, idx) => {
      const stepWeight = idx + 1;
      let stateClass = '';
      if (stepWeight < currentWeight) stateClass = 'completed';
      else if (stepWeight === currentWeight) stateClass = 'current';

      return `
        <li class="gf-tracking-step ${stateClass}">
          <div class="gf-tracking-icon">
            <i class="bi ${stateClass === 'completed' ? 'bi-check-lg' : s.icon}"></i>
          </div>
          <span class="gf-step-title">${s.title}</span>
        </li>
      `;
    }).join('');

    const formatCurrency = GF.formatters?.formatCurrency || (v => `${v} Kz`);
    const escapeHtml = GF.formatters?.escapeHtml || (s => String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'));

    activeSection.innerHTML = `
      <div class="card border p-3 p-md-4 bg-white shadow-sm">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 border-bottom pb-3 mb-3">
          <div>
            <span class="badge bg-primary text-white me-2">Pedido Ativo</span>
            <strong class="text-dark">${escapeHtml(order.id)}</strong>
            ${order.isKilape ? '<span class="badge bg-warning text-dark ms-1"><i class="bi bi-lightning-charge-fill me-1"></i>Gás Bazou (Kilape)</span>' : ''}
          </div>
          <div class="small text-muted">
            <i class="bi bi-clock me-1"></i>Previsão de Entrega: <strong class="text-dark">~${escapeHtml(order.estimatedMinutes || 25)} minutos</strong>
          </div>
        </div>

        <!-- Linha do tempo visual -->
        <ol class="gf-tracking-timeline">
          ${timelineHtml}
        </ol>

        <!-- Detalhes da Entrega e do Estafeta -->
        <div class="row g-3 mt-2 bg-light p-3 rounded">
          <div class="col-md-6 border-end-md">
            <div class="small text-muted mb-1"><i class="bi bi-fuel-pump text-primary me-1"></i>Produto Escolhido:</div>
            <div class="fw-bold text-dark">${escapeHtml(order.productName)} (${order.purchaseType === 'refill' ? 'Apenas Recarga' : 'Botija Completa'})</div>
            <div class="small text-muted">Marca da Botija: <strong class="text-primary">${escapeHtml(order.cylinderBrand || 'Sonangol Gás')}</strong></div>
            <div class="small text-muted mt-1">Total a Pagar: <strong class="text-success">${formatCurrency(order.totalAmount)}</strong></div>
          </div>
          <div class="col-md-6">
            <div class="small text-muted mb-1"><i class="bi bi-person-badge text-primary me-1"></i>Entregador em Rota:</div>
            <div class="fw-bold text-dark">${escapeHtml(order.driver?.name || 'Equipe Gás-Fácil Luanda')}</div>
            <div class="small text-muted">Veículo: ${escapeHtml(order.driver?.vehicle || 'Moto Triciclo Térmico')}</div>
            <div class="small text-muted">Contacto: <a href="tel:${escapeHtml(order.driver?.phone || '')}" class="text-decoration-none fw-semibold">${escapeHtml(order.driver?.phone || '+244 923 888 777')}</a></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza a tabela de histórico de pedidos anteriores
   */
  function renderOrdersHistory(orders) {
    const tableBody = document.getElementById('ordersHistoryTableBody');
    if (!tableBody) return;

    if (!orders || orders.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-inbox fs-2 d-block mb-1"></i>
            Ainda não realizou nenhum pedido.
          </td>
        </tr>
      `;
      return;
    }

    const formatCurrency = GF.formatters?.formatCurrency || (v => `${v} Kz`);
    const formatDateTime = GF.formatters?.formatDateTime || (d => new Date(d).toLocaleDateString('pt-AO'));
    const escapeHtml = GF.formatters?.escapeHtml || (s => String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'));

    const rowsHtml = orders.map(order => {
      let badgeClass = 'bg-secondary';
      if (order.status === 'delivered') badgeClass = 'bg-success';
      else if (order.status === 'in_transit') badgeClass = 'bg-warning text-dark';
      else if (order.status === 'preparing' || order.status === 'received') badgeClass = 'bg-primary';
      else if (order.status === 'cancelled') badgeClass = 'bg-danger';

      return `
        <tr>
          <td class="fw-bold text-dark">${escapeHtml(order.id)}</td>
          <td class="small text-muted">${formatDateTime(order.createdAt)}</td>
          <td>
            <div class="fw-semibold text-dark">${escapeHtml(order.productName)}</div>
            <small class="text-muted">${escapeHtml(order.cylinderBrand || 'Sonangol')} • ${order.purchaseType === 'refill' ? 'Recarga' : 'Completa'}</small>
          </td>
          <td class="fw-bold text-dark">${formatCurrency(order.totalAmount)}</td>
          <td>
            <span class="badge ${badgeClass} px-2 py-1">${escapeHtml(order.statusLabel || order.status)}</span>
            ${order.isKilape ? '<span class="badge bg-warning text-dark ms-1" title="Pedido emergencial Kilape">Kilape</span>' : ''}
          </td>
          <td class="text-end">
            <button type="button" class="btn btn-sm btn-outline-primary py-0 px-2 fw-semibold btn-repeat-order" data-product-id="${escapeHtml(order.productId)}" data-purchase-type="${escapeHtml(order.purchaseType)}">
              <i class="bi bi-arrow-repeat me-1"></i>Repetir
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = rowsHtml;

    // Vincular botões de "Pedir Novamente"
    tableBody.querySelectorAll('.btn-repeat-order').forEach(btn => {
      btn.addEventListener('click', () => {
        const prodId = btn.getAttribute('data-product-id');
        const purchaseType = btn.getAttribute('data-purchase-type');
        openOrderModalWithPreset(prodId, purchaseType);
      });
    });
  }

  /**
   * Abre o modal com valores pré-configurados
   */
  function openOrderModalWithPreset(productId, purchaseType, isKilape = false) {
    const modalEl = document.getElementById('modalNewOrder');
    if (!modalEl) return;

    const selectProd = document.getElementById('orderProductSelect');
    const selectType = document.getElementById('orderTypeSelect');
    const paymentSelect = document.getElementById('orderPaymentSelect');

    if (selectProd && productId) selectProd.value = productId;
    if (selectType && purchaseType) selectType.value = purchaseType;
    if (paymentSelect && isKilape) paymentSelect.value = 'kilape_bazou';

    updateOrderModalPrices();

    const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  /**
   * Configuração do modal de novo pedido
   */
  function setupNewOrderModal() {
    const modalEl = document.getElementById('modalNewOrder');
    const form = document.getElementById('formCreateOrder');
    if (!modalEl || !form) return;

    const selectProd = document.getElementById('orderProductSelect');
    const selectType = document.getElementById('orderTypeSelect');
    const paymentSelect = document.getElementById('orderPaymentSelect');

    // Ao mudar opções, recalcular preço total
    [selectProd, selectType, paymentSelect].forEach(el => {
      if (el) el.addEventListener('change', updateOrderModalPrices);
    });

    // Escutar abertura de modal com data-preset-kilape
    modalEl.addEventListener('show.bs.modal', (e) => {
      const trigger = e.relatedTarget;
      if (trigger && trigger.getAttribute('data-preset-kilape') === 'true') {
        if (paymentSelect) paymentSelect.value = 'kilape_bazou';
      }
      updateOrderModalPrices();
    });

    // Submissão do pedido
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const productId = selectProd ? selectProd.value : 'botija-13kg';
      const purchaseType = selectType ? selectType.value : 'refill';
      const paymentMethod = paymentSelect ? paymentSelect.value : 'cash_delivery';
      const zone = document.getElementById('orderZoneSelect')?.value || 'Talatona';
      const address = document.getElementById('orderAddressInput')?.value || 'Rua Principal';
      const reference = document.getElementById('orderReferenceInput')?.value || '';

      const product = cachedProducts.find(p => p.id === productId) || { name: 'Botijão de Gás Butano 13kg' };
      const currentTheme = GF.themeSwitcher ? GF.themeSwitcher.getCurrentTheme() : 'blue';
      
      let unitPrice = 3500;
      if (GF.productService && product.pricesByColor) {
        unitPrice = GF.productService.getPrice(product, currentTheme, purchaseType);
      }
      const deliveryFee = 1000;
      const totalAmount = unitPrice + deliveryFee;

      // Obter nome da marca da botija
      const brandNames = {
        blue: 'Sonangol Gás',
        green: 'PumanGás',
        orange: 'TotalEnergies',
        yellow: 'Galp/Regional'
      };
      const cylinderBrand = brandNames[currentTheme] || 'Sonangol Gás';

      const btnSubmit = document.getElementById('btnSubmitOrder');
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Confirmando...`;
      }

      try {
        await GF.orderService.createOrder({
          userId: currentUser.id,
          productId,
          productName: product.name,
          cylinderColor: currentTheme,
          cylinderBrand,
          purchaseType,
          quantity: 1,
          unitPrice,
          deliveryFee,
          totalAmount,
          paymentMethod,
          deliveryAddress: { zone, street: address, reference }
        });

        // Fechar modal
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();

        // Recarregar dados e exibir toast
        currentUser = GF.authService.getCurrentUser();
        renderUserData();
        await loadOrders();

        alert('Pedido realizado com sucesso! O estafeta já foi acionado para o seu cúbico.');
      } catch (err) {
        console.error('Erro ao criar pedido:', err);
        alert('Ocorreu um erro ao processar o pedido. Tente novamente.');
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = `<i class="bi bi-check-circle me-1"></i>Confirmar Pedido`;
        }
      }
    });

    updateOrderModalPrices();
  }

  /**
   * Atualiza os preços exibidos no modal de novo pedido
   */
  function updateOrderModalPrices() {
    const selectProd = document.getElementById('orderProductSelect');
    const selectType = document.getElementById('orderTypeSelect');
    const summaryTotal = document.getElementById('orderSummaryTotal');
    const summaryBrand = document.getElementById('orderSummaryBrand');
    const kilapeNotice = document.getElementById('orderKilapeNotice');
    const paymentSelect = document.getElementById('orderPaymentSelect');

    if (!selectProd || !selectType) return;

    const currentTheme = GF.themeSwitcher ? GF.themeSwitcher.getCurrentTheme() : 'blue';
    const brandNames = {
      blue: 'Azul (Sonangol Gás)',
      green: 'Verde (PumanGás)',
      orange: 'Laranja (TotalEnergies)',
      yellow: 'Amarela (Galp/Regional)'
    };

    if (summaryBrand) {
      summaryBrand.textContent = brandNames[currentTheme] || 'Sonangol Gás';
    }

    const productId = selectProd.value;
    const purchaseType = selectType.value;
    const product = cachedProducts.find(p => p.id === productId);

    let unitPrice = 3500;
    if (GF.productService && product) {
      unitPrice = GF.productService.getPrice(product, currentTheme, purchaseType);
    }
    const deliveryFee = 1000;
    const total = unitPrice + deliveryFee;

    const formatCurrency = GF.formatters?.formatCurrency || (v => `${v} Kz`);
    if (summaryTotal) {
      summaryTotal.textContent = formatCurrency(total);
    }

    // Exibir aviso de Kilape se selecionado
    if (kilapeNotice && paymentSelect) {
      if (paymentSelect.value === 'kilape_bazou') {
        kilapeNotice.classList.remove('d-none');
      } else {
        kilapeNotice.classList.add('d-none');
      }
    }
  }

  /**
   * Configuração do botão de Logout
   */
  function setupLogout() {
    const logoutButtons = document.querySelectorAll('[data-action="logout"]');
    logoutButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Deseja realmente terminar a sua sessão?')) {
          GF.authService.logout();
        }
      });
    });
  }
})();
