/**
 * Módulo de Gestão de Temas das Botijas (White-Label Dinâmico)
 * Arquivo: assets/js/utils/themeSwitcher.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

window.GasFacil = window.GasFacil || {};

(function() {
  const THEMES = [
    { id: 'blue', name: 'Azul', hex: '#0B5ED7', brand: 'Azul Sonangol', description: 'Preço Oficial Subvencionado' },
    { id: 'green', name: 'Verde', hex: '#0A6C38', brand: 'Verde PumanGás', description: 'Rede Pumangol' },
    { id: 'orange', name: 'Laranja', hex: '#E65100', brand: 'Laranja Total', description: 'Rede TotalEnergies' },
    { id: 'yellow', name: 'Amarela', hex: '#D98200', brand: 'Amarela Regional', description: 'Galp e Marcas Regionais' }
  ];

  const THEME_STORAGE_KEY = 'gf_theme';

  function applyTheme(themeId) {
    const validThemes = THEMES.map(t => t.id);
    const selectedTheme = validThemes.includes(themeId) ? themeId : 'blue';

    document.documentElement.setAttribute('data-theme', selectedTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
    } catch (error) {
      console.warn('Não foi possível salvar o tema no localStorage:', error);
    }

    // Atualizar os botões do seletor
    document.querySelectorAll('.gf-theme-dot').forEach(dot => {
      if (dot.getAttribute('data-set-theme') === selectedTheme) {
        dot.classList.add('active');
        dot.setAttribute('aria-pressed', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-pressed', 'false');
      }
    });

    // Atualizar os rótulos de marca e indicação de botija ativa
    const themeObj = THEMES.find(t => t.id === selectedTheme) || THEMES[0];
    document.querySelectorAll('[data-bind-theme="brand"]').forEach(el => {
      el.textContent = themeObj.brand;
    });

    const brandLabel = document.getElementById('activeThemeBrandName');
    if (brandLabel) {
      brandLabel.textContent = themeObj.brand;
    }

    const priceThemeInfo = document.getElementById('pricingActiveThemeNotice');
    if (priceThemeInfo) {
      priceThemeInfo.textContent = `Preçário ativo para botijas ${themeObj.brand} (${themeObj.description})`;
    }

    // Notificar os listeners (home.js, etc.) para recalcularem preços
    if (window.GasFacil && typeof window.GasFacil.onThemeChanged === 'function') {
      window.GasFacil.onThemeChanged(selectedTheme);
    }

    document.dispatchEvent(new CustomEvent('gf:themeChanged', { detail: { theme: selectedTheme, themeObj } }));
  }

  function initTheme() {
    let savedTheme = 'blue';
    try {
      savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'blue';
    } catch (e) {
      console.warn('Erro ao ler tema salvo:', e);
    }

    applyTheme(savedTheme);

    // Adicionar escuta de cliques aos seletores
    document.querySelectorAll('.gf-theme-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTheme = dot.getAttribute('data-set-theme');
        if (targetTheme) {
          applyTheme(targetTheme);
        }
      });
    });

    // Fallback de delegação de evento no documento
    document.addEventListener('click', (e) => {
      const dot = e.target.closest('.gf-theme-dot');
      if (dot) {
        e.preventDefault();
        const targetTheme = dot.getAttribute('data-set-theme');
        if (targetTheme) {
          applyTheme(targetTheme);
        }
      }
    });
  }

  // Executar imediatamente a leitura inicial para evitar piscada na tela
  let currentEarlyTheme = 'blue';
  try {
    currentEarlyTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'blue';
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', currentEarlyTheme);

  // Vincular eventos após o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  window.GasFacil.themeSwitcher = {
    THEMES,
    applyTheme,
    initTheme,
    getCurrentTheme() {
      try {
        return localStorage.getItem(THEME_STORAGE_KEY) || 'blue';
      } catch (e) {
        return 'blue';
      }
    }
  };
})();
