/**
 * Interatividade da Landing Page (Gás-Fácil)
 * Arquivo: assets/js/pages/home.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

(function() {
  const GF = window.GasFacil;
  let currentPurchaseType = 'refill';
  let cachedProducts = [];
  let currentTheme = 'blue';

  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Obter tema atual
    if (GF.themeSwitcher) {
      currentTheme = GF.themeSwitcher.getCurrentTheme();
      GF.themeSwitcher.initTheme();
    }

    // 2. Registrar callback de mudança de tema para atualizar preçário dinamicamente
    GF.onThemeChanged = function(newTheme) {
      currentTheme = newTheme;
      renderPricingCards();
      updateHeroPreview();
    };

    // 3. Carregar produtos e preçário
    await loadPricing();
    updateHeroPreview();

    // 4. Carregar zonas de cobertura
    await loadCoverageZones();

    // 5. Configurar eventos de filtro do preçário
    setupPricingToggle();

    // 6. Configurar simulador do "Gás Bazou" (Kilape)
    setupBazouSimulator();
  });

  async function loadPricing() {
    const container = document.getElementById('pricingCardsContainer');
    if (!container) return;

    try {
      cachedProducts = await GF.productService.getProducts();
      renderPricingCards();
    } catch (error) {
      console.error('Erro ao carregar catálogo de botijões:', error);
      container.innerHTML = `
        <div class="col-12 text-center text-danger py-4">
          <i class="bi bi-exclamation-triangle fs-2 d-block mb-2"></i>
          Não foi possível carregar os preços no momento.
        </div>
      `;
    }
  }

  /**
   * Atualiza os cards de preçário de acordo com o tipo (recarga/completo) e a cor da botija selecionada
   */
  function renderPricingCards() {
    const container = document.getElementById('pricingCardsContainer');
    if (!container || !cachedProducts.length) return;

    container.innerHTML = '';

    // Nome da marca do tema ativo
    const themeObj = GF.themeSwitcher ? GF.themeSwitcher.THEMES.find(t => t.id === currentTheme) : null;
    const currentBrandName = themeObj ? themeObj.brand : 'Sonangol Gás';

    cachedProducts.forEach(product => {
      const isGasCylinder = product.id.startsWith('botija');
      
      // Preço dinâmico obtido com base na cor da botija
      const price = GF.productService.getPrice(product, currentTheme, currentPurchaseType);
      
      const priceLabel = currentPurchaseType === 'refill' 
        ? `Recarga (${isGasCylinder ? currentBrandName : 'Item'})` 
        : `Botijão Completo (${isGasCylinder ? currentBrandName : 'Item'})`;
      
      const badgeText = isGasCylinder 
        ? (currentPurchaseType === 'refill' ? `Troca de botija vazia (${currentBrandName})` : `Vasilhame novo (${currentBrandName}) + Gás`)
        : 'Acessório de Instalação';

      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6 mb-4';

      const featuresHtml = product.features.map(f => `
        <li class="d-flex align-items-center mb-2">
          <i class="bi bi-check-circle-fill text-success me-2" aria-hidden="true"></i>
          <span>${GF.formatters.escapeHtml(f)}</span>
        </li>
      `).join('');

      col.innerHTML = `
        <div class="card h-100 gf-pricing-card ${product.popular ? 'featured' : ''} shadow-sm">
          ${product.popular ? `
            <div class="position-absolute top-0 end-0 m-3">
              <span class="badge bg-primary px-3 py-2">Mais Pedido</span>
            </div>
          ` : ''}
          <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="p-3 bg-light rounded-3 text-center">
                <!-- SVG do Botijão com preenchimento da cor do tema selecionado -->
                <svg class="gf-cylinder-svg" viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" aria-label="${GF.formatters.escapeHtml(product.name)}">
                  <rect x="30" y="8" width="40" height="12" rx="4" class="gf-cylinder-collar" />
                  <rect x="42" y="2" width="16" height="8" rx="2" fill="#64748b" />
                  <path d="M 20,30 C 20,20 80,20 80,30 L 80,105 C 80,118 20,118 20,105 Z" class="gf-cylinder-body" />
                  <ellipse cx="50" cy="115" rx="22" ry="6" class="gf-cylinder-collar" />
                  <circle cx="50" cy="65" r="14" fill="#ffffff" opacity="0.25" />
                  <text x="50" y="70" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">${product.weight}</text>
                </svg>
              </div>
              <div>
                <span class="badge bg-light text-muted border mb-1">${GF.formatters.escapeHtml(product.category)}</span>
                <h3 class="h5 card-title mb-1 fw-bold text-dark">${GF.formatters.escapeHtml(product.name)}</h3>
                <small class="text-primary fw-semibold d-block">${badgeText}</small>
              </div>
            </div>

            <p class="card-text text-muted small mb-3">${GF.formatters.escapeHtml(product.description)}</p>

            <div class="p-3 bg-light rounded-3 mb-4 text-center border">
              <span class="text-muted d-block small mb-1">${priceLabel}</span>
              <div class="h2 fw-bold text-primary mb-0">${GF.formatters.formatCurrency(price)}</div>
              <small class="text-muted">Entrega rápida ao domicílio em Luanda</small>
            </div>

            <ul class="list-unstyled mb-4 small flex-grow-1">
              ${featuresHtml}
            </ul>

            <div class="mt-auto">
              <a href="checkout.html?item=${encodeURIComponent(product.id)}&type=${currentPurchaseType}&color=${encodeURIComponent(currentTheme)}" class="btn ${product.popular ? 'btn-primary' : 'btn-outline-primary'} w-100 py-2 fw-semibold">
                <i class="bi bi-cart-plus me-1" aria-hidden="true"></i> Pedir ${isGasCylinder ? currentBrandName : 'Agora'}
              </a>
            </div>
          </div>
        </div>
      `;

      container.appendChild(col);
    });
  }

  /**
   * Atualiza o card de demonstração na Hero Section com o preço da botija da cor ativa
   */
  function updateHeroPreview() {
    const heroPriceEl = document.getElementById('heroBottlePrice');
    const heroBrandLabel = document.getElementById('heroBottleBrandName');
    
    if (cachedProducts.length > 0) {
      const prod13kg = cachedProducts.find(p => p.id === 'botija-13kg');
      if (prod13kg && heroPriceEl) {
        const price = GF.productService.getPrice(prod13kg, currentTheme, 'refill');
        heroPriceEl.textContent = GF.formatters.formatCurrency(price);
      }
    }

    if (heroBrandLabel && GF.themeSwitcher) {
      const themeObj = GF.themeSwitcher.THEMES.find(t => t.id === currentTheme);
      if (themeObj) {
        heroBrandLabel.textContent = themeObj.brand;
      }
    }
  }

  function setupPricingToggle() {
    const btnRefill = document.getElementById('btnPricingRefill');
    const btnComplete = document.getElementById('btnPricingComplete');

    if (btnRefill && btnComplete) {
      btnRefill.addEventListener('click', () => {
        currentPurchaseType = 'refill';
        btnRefill.classList.add('active', 'btn-primary');
        btnRefill.classList.remove('btn-outline-primary');
        btnComplete.classList.remove('active', 'btn-primary');
        btnComplete.classList.add('btn-outline-primary');
        renderPricingCards();
      });

      btnComplete.addEventListener('click', () => {
        currentPurchaseType = 'complete';
        btnComplete.classList.add('active', 'btn-primary');
        btnComplete.classList.remove('btn-outline-primary');
        btnRefill.classList.remove('active', 'btn-primary');
        btnRefill.classList.add('btn-outline-primary');
        renderPricingCards();
      });
    }
  }

  async function loadCoverageZones() {
    const listContainer = document.getElementById('coverageList');
    const searchInput = document.getElementById('coverageSearch');
    if (!listContainer) return;

    const zones = await GF.productService.getCoverageZones();

    function renderZones(filter = '') {
      listContainer.innerHTML = '';
      const filtered = zones.filter(z => z.name.toLowerCase().includes(filter.toLowerCase()));

      if (!filtered.length) {
        listContainer.innerHTML = `
          <div class="col-12 text-center text-muted py-3">
            Nenhuma zona encontrada com o nome "${GF.formatters.escapeHtml(filter)}". Entre em contacto para verificar disponibilidade.
          </div>
        `;
        return;
      }

      filtered.forEach(zone => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6 mb-3';
        col.innerHTML = `
          <div class="card h-100 border p-3 bg-white shadow-sm">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <i class="bi bi-geo-alt-fill text-primary me-2 fs-5" aria-hidden="true"></i>
                <div>
                  <strong class="d-block text-dark">${GF.formatters.escapeHtml(zone.name)}</strong>
                  <small class="text-muted"><i class="bi bi-clock me-1"></i>~${zone.timeMin} minutos</small>
                </div>
              </div>
              <span class="badge bg-success-subtle text-success-emphasis">Ativa</span>
            </div>
          </div>
        `;
        listContainer.appendChild(col);
      });
    }

    renderZones();

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderZones(e.target.value.trim());
      });
    }
  }

  function setupBazouSimulator() {
    const simInput = document.getElementById('simPointsInput');
    const simBtn = document.getElementById('btnSimulateBazou');
    const simResult = document.getElementById('simResultContainer');

    if (simBtn && simInput && simResult) {
      simBtn.addEventListener('click', () => {
        const points = parseInt(simInput.value, 10) || 0;
        const mockUser = {
          name: 'Cliente Simulado',
          loyalty: { points: points, activeKilape: false }
        };

        const eligibility = GF.loyaltyService.checkGasBazouEligibility(mockUser);
        const tier = GF.loyaltyService.getTier(points);

        simResult.classList.remove('d-none');

        if (eligibility.eligible) {
          simResult.className = 'alert alert-success mt-3';
          simResult.innerHTML = `
            <div class="d-flex align-items-start gap-2">
              <i class="bi bi-check-circle-fill fs-4 text-success" aria-hidden="true"></i>
              <div>
                <h5 class="alert-heading fw-bold mb-1">Elegível para "Gás Bazou"! (Nível ${tier.name})</h5>
                <p class="mb-1">${eligibility.reason}</p>
                <div class="small text-success-emphasis fw-semibold mt-2">
                  <i class="bi bi-calendar-check me-1"></i>Prazo de pagamento garantido até <strong>${eligibility.dueDateFormatted}</strong> (prazo de até 1 mês).
                  <span class="d-block text-muted mt-1"><i class="bi bi-percent me-1"></i>Taxa de juros de demora: <strong>5% do valor</strong>.</span>
                </div>
              </div>
            </div>
          `;
        } else {
          simResult.className = 'alert alert-warning mt-3';
          simResult.innerHTML = `
            <div class="d-flex align-items-start gap-2">
              <i class="bi bi-exclamation-triangle-fill fs-4 text-warning" aria-hidden="true"></i>
              <div>
                <h5 class="alert-heading fw-bold mb-1">Ainda não elegível para Kilape (Nível ${tier.name})</h5>
                <p class="mb-0">${eligibility.reason}</p>
              </div>
            </div>
          `;
        }
      });
    }
  }
})();
