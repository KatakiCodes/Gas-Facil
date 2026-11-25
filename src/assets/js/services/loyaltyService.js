/**
 * Serviço de Programa de Fidelidade e Regras do "Gás Bazou" (Kilape)
 * Arquivo: assets/js/services/loyaltyService.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

window.GasFacil = window.GasFacil || {};

window.GasFacil.loyaltyService = {
  POINTS_PER_KZ: 0.02, // 1 ponto a cada 50 Kz
  MIN_POINTS_FOR_KILAPE: 200, // Pontuação mínima para desbloquear o "Gás Bazou"
  KILAPE_DAYS_LIMIT: 30, // Prazo em dias para pagamento do Kilape (até 1 mês)
  LATE_FEE_PERCENT: 5, // Taxa de juros de demora de 5%

  getTier(points) {
    if (points >= 500) {
      return {
        name: 'Ouro',
        badgeClass: 'bg-warning text-dark',
        kilapeAllowed: true,
        maxKilapeOrders: 2
      };
    } else if (points >= 200) {
      return {
        name: 'Prata',
        badgeClass: 'bg-secondary text-white',
        kilapeAllowed: true,
        maxKilapeOrders: 1
      };
    } else {
      return {
        name: 'Bronze',
        badgeClass: 'bg-light text-dark border',
        kilapeAllowed: false,
        maxKilapeOrders: 0
      };
    }
  },

  checkGasBazouEligibility(user) {
    if (!user) {
      return {
        eligible: false,
        reason: 'É necessário ter conta cadastrada e histórico de compras para acionar o Gás Bazou.'
      };
    }

    const points = user.loyalty?.points || 0;
    const hasActiveKilape = user.loyalty?.activeKilape === true;

    if (hasActiveKilape) {
      return {
        eligible: false,
        reason: 'Já possui um pedido em Kilape pendente de quitação. Quite o anterior para liberar nova solicitação.'
      };
    }

    if (points < this.MIN_POINTS_FOR_KILAPE) {
      const missing = this.MIN_POINTS_FOR_KILAPE - points;
      return {
        eligible: false,
        reason: `Necessita de pelo menos ${this.MIN_POINTS_FOR_KILAPE} pontos de fidelidade para desbloquear o Kilape. Faltam ${missing} pontos (aproximadamente ${Math.ceil(missing / this.POINTS_PER_KZ)} Kz em pedidos normais).`
      };
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + this.KILAPE_DAYS_LIMIT);

    return {
      eligible: true,
      reason: `Parabéns! Pelo seu nível de fidelidade, tem direito a pedir no Kilape com prazo de pagamento de até 1 mês (${this.KILAPE_DAYS_LIMIT} dias), com taxa de 5% do valor como juros de demora.`,
      dueDate: dueDate.toISOString(),
      dueDateFormatted: dueDate.toLocaleDateString('pt-AO'),
      lateFeePercent: this.LATE_FEE_PERCENT
    };
  }
};
