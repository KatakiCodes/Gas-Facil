/**
 * Camada de Abstração de Armazenamento Local (Data Layer)
 * Arquivo: assets/js/services/storage.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

window.GasFacil = window.GasFacil || {};

window.GasFacil.storage = (function() {
  const STORAGE_PREFIX = 'gf_';

  return {
    get(key, defaultValue = null) {
      try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        if (raw === null || raw === undefined) {
          return defaultValue;
        }
        return JSON.parse(raw);
      } catch (error) {
        console.error(`Erro ao ler chave [${STORAGE_PREFIX + key}] do localStorage:`, error);
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        return true;
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.error('Limite de armazenamento do localStorage excedido.');
        } else {
          console.error(`Erro ao gravar chave [${STORAGE_PREFIX + key}]:`, error);
        }
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(STORAGE_PREFIX + key);
      } catch (error) {
        console.error(`Erro ao remover chave [${STORAGE_PREFIX + key}]:`, error);
      }
    },

    has(key) {
      return localStorage.getItem(STORAGE_PREFIX + key) !== null;
    }
  };
})();
