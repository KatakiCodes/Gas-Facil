/**
 * Controlador do Painel do Gestor (Operações e Gestão de Pedidos)
 * Arquivo: assets/js/pages/admin.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

(function() {
  const GF = window.GasFacil;
  let currentManager = null;
  let allOrders = [];

  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializar tema visual
    if (GF.themeSwitcher) {
      GF.themeSwitcher.initTheme();
    }

    // 2. Verificar autenticação e permissão de Gestor
    currentManager = GF.authService.getCurrentUser();
    if (!currentManager) {
      window.location.href = 'login.html';
      return;
    }

    if (currentManager.role !== 'manager' && currentManager.role !== 'admin') {
      // Cliente normal tentando acessar área administrativa é redirecionado para o painel do cliente
      window.location.href = 'dashboard.html';
      return;
    }

    // 3. Renderizar dados do gestor
    renderManagerData();

    // 4. Carregar pedidos
    await loadOrders();

    // 5. Configurar filtros e busca
    setupFilters();

    // 6. Configurar modal de alteração de estado
    setupChangeStatusModal();

    // 7. Configurar logout e botão de atualização
    setupActions();
  });

  /**
   * Renderiza os dados do perfil do gestor no topo
   */
  function renderManagerData() {
    if (!currentManager) return;

    const nameEl = document.getElementById('adminName');
    if (nameEl) nameEl.textContent = currentManager.name;

    const avatarEl = document.getElementById('adminAvatar');
    if (avatarEl) {
      const parts = currentManager.name.split(' ');
      const initials = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
      avatarEl.textContent = initials;
    }
  }

  /**
   * Carrega todos os pedidos do sistema
   */
  async function loadOrders() {
    if (!GF.orderService) return;

    try {
      allOrders = await GF.orderService.getAllOrders();
      // Ordenar por data mais recente
      allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      updateMetrics(allOrders);
      applyFilters();
    } catch (err) {
      console.error('Erro ao carregar pedidos do sistema:', err);
      showAlert('Não foi possível carregar os pedidos.', 'danger');
    }
  }

  /**
   * Atualiza os cards de métricas no topo
   */
  function updateMetrics(orders) {
    const totalEl = document.getElementById('statTotalOrders');
    const pendingEl = document.getElementById('statPendingOrders');
    const inTransitEl = document.getElementById('statInTransitOrders');
    const deliveredEl = document.getElementById('statDeliveredOrders');

    const total = orders.length;
    const pending = orders.filter(o => o.status === 'received' || o.status === 'preparing').length;
    const inTransit = orders.filter(o => o.status === 'in_transit').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;

    if (totalEl) totalEl.textContent = total;
    if (pendingEl) pendingEl.textContent = pending;
    if (inTransitEl) inTransitEl.textContent = inTransit;
    if (deliveredEl) deliveredEl.textContent = delivered;
  }

  /**
   * Configuração dos filtros por estado e busca textual
   */
  function setupFilters() {
    const filterSelect = document.getElementById('filterStatusSelect');
    const searchInput = document.getElementById('searchInput');

    if (filterSelect) {
      filterSelect.addEventListener('change', () => applyFilters());
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => applyFilters());
    }
  }

  /**
   * Aplica filtros e renderiza a tabela
   */
  function applyFilters() {
    const filterSelect = document.getElementById('filterStatusSelect');
    const searchInput = document.getElementById('searchInput');

    const selectedStatus = filterSelect ? filterSelect.value : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let filtered = [...allOrders];

    // Filtrar por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(o => o.status === selectedStatus);
    }

    // Filtrar por busca textual
    if (searchQuery) {
      filtered = filtered.filter(o => {
        const idMatch = (o.id || '').toLowerCase().includes(searchQuery);
        const customerMatch = (o.customerName || '').toLowerCase().includes(searchQuery);
        const phoneMatch = (o.customerPhone || '').toLowerCase().includes(searchQuery);
        const productMatch = (o.productName || '').toLowerCase().includes(searchQuery);
        const zoneMatch = (o.deliveryAddress?.zone || '').toLowerCase().includes(searchQuery);
        return idMatch || customerMatch || phoneMatch || productMatch || zoneMatch;
      });
    }

    renderTable(filtered);

    const countEl = document.getElementById('resultsCount');
    if (countEl) {
      countEl.textContent = `Exibindo ${filtered.length} de ${allOrders.length} pedido(s)`;
    }
  }

  /**
   * Renderiza as linhas da tabela de pedidos
   */
  function renderTable(orders) {
    const tableBody = document.getElementById('adminOrdersTableBody');
    if (!tableBody) return;

    if (!orders || orders.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-4 text-muted">
            <i class="bi bi-inbox fs-2 d-block mb-1"></i>
            Nenhum pedido encontrado com os filtros aplicados.
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
      else if (order.status === 'preparing') badgeClass = 'bg-primary';
      else if (order.status === 'received') badgeClass = 'bg-info text-dark';
      else if (order.status === 'cancelled') badgeClass = 'bg-danger';

      const customerDisplay = order.customerName || 'Cliente';
      const phoneDisplay = order.customerPhone || 'Sem telefone';
      const addressDisplay = order.deliveryAddress?.zone || 'Luanda';

      return `
        <tr>
          <td class="fw-bold text-dark">${escapeHtml(order.id)}</td>
          <td class="small text-muted">${formatDateTime(order.createdAt)}</td>
          <td>
            <div class="fw-semibold text-dark">${escapeHtml(customerDisplay)}</div>
            <small class="text-muted"><i class="bi bi-telephone me-1"></i>${escapeHtml(phoneDisplay)}</small>
          </td>
          <td>
            <div class="fw-semibold text-dark">${escapeHtml(order.productName)}</div>
            <small class="text-muted">${escapeHtml(order.cylinderBrand || 'Sonangol')} • ${order.purchaseType === 'refill' ? 'Recarga' : 'Completa'}</small>
          </td>
          <td>
            <div class="text-dark">${escapeHtml(addressDisplay)}</div>
            <small class="text-muted">${escapeHtml(order.deliveryAddress?.street || '')}</small>
          </td>
          <td class="fw-bold text-dark">${formatCurrency(order.totalAmount)}</td>
          <td>
            <span class="badge ${badgeClass} px-2 py-1">${escapeHtml(order.statusLabel || order.status)}</span>
            ${order.isKilape ? '<span class="badge bg-warning text-dark ms-1" title="Venda no Kilape">Kilape</span>' : ''}
          </td>
          <td class="text-end">
            <button type="button" class="btn btn-sm btn-outline-primary fw-semibold py-1 px-2 btn-open-status-modal" data-order-id="${escapeHtml(order.id)}">
              <i class="bi bi-pencil-square me-1"></i>Mudar Estado
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = rowsHtml;

    // Vincular botões de alteração de estado
    tableBody.querySelectorAll('.btn-open-status-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-order-id');
        openStatusModal(orderId);
      });
    });
  }

  /**
   * Abre o modal com os dados do pedido selecionado
   */
  function openStatusModal(orderId) {
    const modalEl = document.getElementById('modalChangeStatus');
    if (!modalEl) return;

    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('modalOrderId').value = order.id;
    document.getElementById('modalOrderDisplayId').textContent = order.id;

    const badgeEl = document.getElementById('modalOrderCurrentStatusBadge');
    if (badgeEl) {
      badgeEl.textContent = order.statusLabel || order.status;
    }

    const custInfoEl = document.getElementById('modalOrderCustomerInfo');
    if (custInfoEl) {
      custInfoEl.textContent = `Cliente: ${order.customerName || 'Cliente'} (${order.customerPhone || ''})`;
    }

    const prodInfoEl = document.getElementById('modalOrderProductInfo');
    if (prodInfoEl) {
      prodInfoEl.textContent = `Produto: ${order.productName} (${order.cylinderBrand || 'Sonangol'})`;
    }

    const selectStatus = document.getElementById('selectNewStatus');
    if (selectStatus) {
      selectStatus.value = order.status || 'received';
    }

    const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  /**
   * Configuração do modal de alteração de estado
   */
  function setupChangeStatusModal() {
    const modalEl = document.getElementById('modalChangeStatus');
    const form = document.getElementById('formChangeStatus');
    if (!modalEl || !form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const orderId = document.getElementById('modalOrderId').value;
      const newStatus = document.getElementById('selectNewStatus').value;
      const btnSubmit = document.getElementById('btnConfirmStatusChange');

      if (!orderId || !newStatus) return;

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Salvando...`;
      }

      try {
        const result = await GF.orderService.updateOrderStatus(orderId, newStatus);
        if (result.success) {
          const bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();

          showAlert(`Estado do pedido ${orderId} alterado com sucesso para "${result.order.statusLabel}"!`, 'success');
          await loadOrders();
        } else {
          showAlert(result.message || 'Erro ao atualizar o estado.', 'danger');
        }
      } catch (err) {
        console.error('Erro ao atualizar status do pedido:', err);
        showAlert('Ocorreu um erro inesperado ao salvar o novo estado.', 'danger');
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = `<i class="bi bi-check2 me-1"></i>Salvar Novo Estado`;
        }
      }
    });
  }

  /**
   * Configura ações gerais (logout e atualização)
   */
  function setupActions() {
    const btnRefresh = document.getElementById('btnRefreshOrders');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', async (e) => {
        e.preventDefault();
        btnRefresh.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Atualizando...`;
        await loadOrders();
        btnRefresh.innerHTML = `<i class="bi bi-arrow-clockwise me-1"></i>Atualizar Lista`;
      });
    }

    const logoutButtons = document.querySelectorAll('[data-action="logout"]');
    logoutButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        GF.authService.logout();
      });
    });
  }

  function showAlert(msg, type = 'success') {
    const alertBox = document.getElementById('adminAlert');
    if (!alertBox) return;

    alertBox.className = `alert alert-${type} py-2 px-3 small d-flex align-items-center mb-4`;
    alertBox.innerHTML = `
      <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
      <div>${msg}</div>
    `;
    alertBox.classList.remove('d-none');

    setTimeout(() => {
      if (alertBox) alertBox.classList.add('d-none');
    }, 4000);
  }
})();
