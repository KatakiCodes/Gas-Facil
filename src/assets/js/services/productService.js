/**
 * Serviço de Catálogo e Produtos
 * Arquivo: assets/js/services/productService.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

window.GasFacil = window.GasFacil || {};

window.GasFacil.productService = {
  async getProducts() {
    if (window.GasFacil.initSeedData) {
      window.GasFacil.initSeedData();
    }
    const products = window.GasFacil.storage.get('products', []);
    return Promise.resolve(products);
  },

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find(p => p.id === id);
    return Promise.resolve(product || null);
  },

  /**
   * Obtém o preço do produto com base na cor/marca ativa
   * @param {Object} product
   * @param {string} theme - 'blue' | 'green' | 'orange' | 'yellow'
   * @param {'refill'|'complete'} type - 'refill' ou 'complete'
   * @returns {number}
   */
  getPrice(product, theme, type = 'refill') {
    if (!product) return 0;
    const currentTheme = theme || (window.GasFacil.themeSwitcher ? window.GasFacil.themeSwitcher.getCurrentTheme() : 'blue');

    if (product.pricesByColor && product.pricesByColor[currentTheme]) {
      return product.pricesByColor[currentTheme][type] || product.refillPrice;
    }
    return type === 'refill' ? product.refillPrice : product.completePrice;
  },

  async getCoverageZones() {
    if (window.GasFacil.initSeedData) {
      window.GasFacil.initSeedData();
    }
    const zones = window.GasFacil.storage.get('coverage', []);
    return Promise.resolve(zones);
  }
};
