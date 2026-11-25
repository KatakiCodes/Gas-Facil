/**
 * Carga Inicial de Dados de Demonstração (Seed Data)
 * Arquivo: assets/js/services/seedData.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

window.GasFacil = window.GasFacil || {};

window.GasFacil.initSeedData = function() {
  const storage = window.GasFacil.storage;
  if (!storage) return;

  // 1. Produtos com Tabela de Preços por Cor/Marca da Botija em Angola
  const initialProducts = [
    {
      id: 'botija-13kg',
      name: 'Botijão de Gás Butano 13kg',
      category: 'Doméstico',
      description: 'O tamanho mais tradicional para lares e apartamentos em Angola. Cozimento seguro e de longa duração.',
      weight: '13kg',
      // Preços por Cor / Marca
      pricesByColor: {
        blue: { refill: 3500, complete: 25000, brand: 'Sonangol Gás' },
        green: { refill: 4200, complete: 27500, brand: 'PumanGás' },
        orange: { refill: 4000, complete: 26500, brand: 'TotalEnergies' },
        yellow: { refill: 3800, complete: 26000, brand: 'Galp / Regional' }
      },
      refillPrice: 3500,
      completePrice: 25000,
      popular: true,
      features: [
        'Ideal para famílias de 3 a 6 pessoas',
        'Autonomia média: 30 a 45 dias',
        'Válvula de segurança certificada',
        'Troca imediata por qualquer marca parceira'
      ]
    },
    {
      id: 'botija-45kg',
      name: 'Cilindro Industrial 45kg',
      category: 'Comercial & Grandes Lares',
      description: 'Potência e autonomia superior para restaurantes, padarias, condomínios e grandes famílias.',
      weight: '45kg',
      // Preços por Cor / Marca
      pricesByColor: {
        blue: { refill: 14500, complete: 85000, brand: 'Sonangol Gás' },
        green: { refill: 16000, complete: 92000, brand: 'PumanGás' },
        orange: { refill: 15500, complete: 89000, brand: 'TotalEnergies' },
        yellow: { refill: 15000, complete: 88000, brand: 'Galp / Regional' }
      },
      refillPrice: 14500,
      completePrice: 85000,
      popular: false,
      features: [
        'Ideal para restaurantes, lanchonetes e padarias',
        'Alta vazão para uso contínuo e industrial',
        'Entrega com transporte e instalação especializada',
        'Substituição rápida e segura'
      ]
    },
    {
      id: 'kit-seguranca',
      name: 'Kit Válvula Reguladora + Mangueira',
      category: 'Acessórios de Segurança',
      description: 'Regulador de pressão de alta precisão com abraçadeiras e mangueira reforçada certificada.',
      weight: 'Acessório',
      // Preço unificado para o acessório
      pricesByColor: {
        blue: { refill: 5000, complete: 5000, brand: 'Universal' },
        green: { refill: 5000, complete: 5000, brand: 'Universal' },
        orange: { refill: 5000, complete: 5000, brand: 'Universal' },
        yellow: { refill: 5000, complete: 5000, brand: 'Universal' }
      },
      refillPrice: 5000,
      completePrice: 5000,
      popular: false,
      features: [
        'Manômetro de pressão integrado',
        'Mangueira padrão segurança 1.25m',
        'Abraçadeiras de aço inoxidável',
        'Instalação e teste de fuga no ato da entrega'
      ]
    }
  ];

  // Força atualização se não tiver pricesByColor
  const existingProducts = storage.get('products');
  if (!existingProducts || !existingProducts[0]?.pricesByColor) {
    storage.set('products', initialProducts);
  }

  // 2. Cobertura de Entrega em Luanda
  if (!storage.has('coverage')) {
    const coverageZones = [
      { id: 'talatona', name: 'Talatona', fee: 1000, timeMin: 25, active: true },
      { id: 'maianga', name: 'Maianga / Alvalade', fee: 1000, timeMin: 30, active: true },
      { id: 'kilamba', name: 'Centralidade do Kilamba', fee: 1500, timeMin: 35, active: true },
      { id: 'belas', name: 'Belas / Benfica / Morro Bento', fee: 1200, timeMin: 30, active: true },
      { id: 'luanda-centro', name: 'Luanda Centro / Ingombota / Miramar', fee: 1000, timeMin: 30, active: true },
      { id: 'viana', name: 'Viana / Zango', fee: 1500, timeMin: 40, active: true },
      { id: 'cazenga', name: 'Cazenga / Hoji-ya-Henda', fee: 1200, timeMin: 35, active: true }
    ];
    storage.set('coverage', coverageZones);
  }

  // 3. Utilizador Gestor do Sistema (Operações e Gestão de Pedidos)
  const defaultManager = {
    id: 'usr_gestor_01',
    name: 'Gestor Operacional',
    email: 'gestor@gasfacil.ao',
    phone: '+244 923 000 001',
    password: 'admin',
    role: 'manager',
    createdAt: '2026-11-25T08:00:00Z'
  };

  const users = storage.get('users', []);
  const managerExists = users.some(u => u.role === 'manager' || u.phone === '+244 923 000 001');
  if (!managerExists) {
    users.unshift(defaultManager);
    storage.set('users', users);
  }
};
