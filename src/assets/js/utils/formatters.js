/**
 * Funções Utilitárias de Formatação
 * Arquivo: assets/js/utils/formatters.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

window.GasFacil = window.GasFacil || {};

window.GasFacil.formatters = {
  /**
   * Formata valores numéricos para Kwanza (Kz)
   * @param {number} value
   * @returns {string} Ex: "3.500,00 Kz"
   */
  formatCurrency(value) {
    if (typeof value !== 'number' || isNaN(value)) {
      return '0,00 Kz';
    }
    return value.toLocaleString('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' Kz';
  },

  /**
   * Formata data para exibição amigável
   * @param {string|Date} dateInput
   * @returns {string}
   */
  formatDateTime(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Sanitiza texto simples para exibição segura no DOM
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
