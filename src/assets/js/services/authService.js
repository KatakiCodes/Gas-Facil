/**
 * Serviço de Autenticação e Gestão de Sessão (Auth Service)
 * Arquivo: assets/js/services/authService.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

window.GasFacil = window.GasFacil || {};

window.GasFacil.authService = {
  SESSION_KEY: 'session',
  USERS_KEY: 'users',

  /**
   * Inicializa dados padrão caso ainda não existam
   */
  init() {
    if (window.GasFacil.initSeedData) {
      window.GasFacil.initSeedData();
    }
  },

  /**
   * Normaliza números de telefone para comparação segura
   * Ex: "+244 923 123 456" -> "923123456"
   */
  normalizePhone(phone) {
    if (!phone) return '';
    return String(phone)
      .replace(/\D/g, '') // remove não dígitos
      .replace(/^244/, ''); // remove prefixo de Angola se presente
  },

  /**
   * Obtém a lista completa de usuários cadastrados
   */
  getUsers() {
    this.init();
    return window.GasFacil.storage.get(this.USERS_KEY, []);
  },

  /**
   * Realiza login por telefone e palavra-passe
   * @param {string} phone 
   * @param {string} password 
   * @returns {Promise<{success: boolean, message?: string, user?: Object}>}
   */
  async login(phone, password) {
    this.init();
    const cleanPhone = this.normalizePhone(phone);
    const cleanPass = String(password || '').trim();

    if (!cleanPhone || !cleanPass) {
      return Promise.resolve({
        success: false,
        message: 'Por favor, informe o número de telefone e a palavra-passe.'
      });
    }

    const users = this.getUsers();
    const user = users.find(u => {
      const uPhone = this.normalizePhone(u.phone);
      return uPhone === cleanPhone && String(u.password).trim() === cleanPass;
    });

    if (!user) {
      return Promise.resolve({
        success: false,
        message: 'Telefone ou palavra-passe incorretos. Verifique os dados digitados.'
      });
    }

    // Criar sessão de autenticação
    const sessionData = {
      userId: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email || '',
      role: user.role || 'customer',
      loggedAt: new Date().toISOString()
    };

    window.GasFacil.storage.set(this.SESSION_KEY, sessionData);

    return Promise.resolve({
      success: true,
      user
    });
  },

  /**
   * Realiza o cadastro de um novo utilizador
   * @param {Object} data - { name, phone, password }
   * @returns {Promise<{success: boolean, message?: string, user?: Object}>}
   */
  async register({ name, phone, password }) {
    this.init();
    const trimmedName = String(name || '').trim();
    const cleanPhone = this.normalizePhone(phone);
    const cleanPass = String(password || '').trim();

    // Validações básicas
    if (!trimmedName || trimmedName.length < 3) {
      return Promise.resolve({
        success: false,
        message: 'Por favor, informe o seu nome completo (mínimo de 3 caracteres).'
      });
    }

    if (!cleanPhone || cleanPhone.length < 9) {
      return Promise.resolve({
        success: false,
        message: 'Por favor, informe um número de telefone válido com pelo menos 9 dígitos.'
      });
    }

    if (!cleanPass || cleanPass.length < 3) {
      return Promise.resolve({
        success: false,
        message: 'A palavra-passe deve ter pelo menos 3 caracteres.'
      });
    }

    const users = this.getUsers();

    // Verificar se já existe utilizador com este telefone
    const existingUser = users.find(u => this.normalizePhone(u.phone) === cleanPhone);
    if (existingUser) {
      return Promise.resolve({
        success: false,
        message: 'Já existe uma conta cadastrada com este número de telefone. Faça login ou utilize outro número.'
      });
    }

    // Formatar telefone amigável com prefixo de Angola
    const formattedPhone = cleanPhone.length === 9 
      ? `+244 ${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`
      : phone;

    // Criar novo utilizador com pontos de boas-vindas
    const newUser = {
      id: 'usr_' + Date.now(),
      name: trimmedName,
      phone: formattedPhone,
      password: cleanPass,
      role: 'customer',
      loyalty: {
        points: 50, // 50 pontos de boas-vindas
        tier: 'Bronze',
        kilapeEligible: false,
        activeKilape: false
      },
      addresses: [
        {
          id: 'addr_' + Date.now(),
          title: 'Residência Principal',
          zone: 'luanda-centro',
          street: 'Luanda, Angola',
          reference: ''
        }
      ],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    window.GasFacil.storage.set(this.USERS_KEY, users);

    // Iniciar sessão automaticamente
    const sessionData = {
      userId: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: '',
      role: newUser.role,
      loggedAt: new Date().toISOString()
    };
    window.GasFacil.storage.set(this.SESSION_KEY, sessionData);

    return Promise.resolve({
      success: true,
      user: newUser
    });
  },

  /**
   * Obtém os dados completos do utilizador atualmente autenticado
   */
  getCurrentUser() {
    this.init();
    const session = window.GasFacil.storage.get(this.SESSION_KEY);
    if (!session || !session.userId) {
      return null;
    }

    const users = this.getUsers();
    const user = users.find(u => u.id === session.userId);
    return user || null;
  },

  /**
   * Verifica se há sessão ativa
   */
  isAuthenticated() {
    const session = window.GasFacil.storage.get(this.SESSION_KEY);
    return !!(session && session.userId);
  },

  /**
   * Encerra a sessão do utilizador
   */
  logout() {
    window.GasFacil.storage.remove(this.SESSION_KEY);
    window.location.href = 'login.html';
  },

  /**
   * Atualiza os dados do utilizador corrente no localStorage
   */
  updateCurrentUser(updatedData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    const users = this.getUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index === -1) return false;

    users[index] = { ...users[index], ...updatedData };
    window.GasFacil.storage.set(this.USERS_KEY, users);
    return true;
  }
};
