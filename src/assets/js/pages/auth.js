/**
 * Controlador de Autenticação (Login e Cadastro)
 * Arquivo: assets/js/pages/auth.js
 * Padrão Namespace: funciona tanto em file:/// quanto em servidores HTTP
 */

(function() {
  const GF = window.GasFacil;

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar tema visual
    if (GF.themeSwitcher) {
      GF.themeSwitcher.initTheme();
    }

    // 2. Inicializar alternadores de visibilidade de senha
    setupPasswordToggles();

    // 3. Ajustar links cruzados para preservar parâmetro de redirecionamento (se houver)
    preserveRedirectParam();

    // 4. Inicializar formulário de login (se presente na página)
    setupLoginForm();

    // 5. Inicializar formulário de cadastro (se presente na página)
    setupRegisterForm();
  });

  /**
   * Preserva o parâmetro 'redirect' nos links de navegação entre login e cadastro
   */
  function preserveRedirectParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    if (!redirectUrl) return;

    const linkToRegister = document.querySelector('a[href="register.html"]');
    if (linkToRegister) {
      linkToRegister.href = `register.html?redirect=${encodeURIComponent(redirectUrl)}`;
    }

    const linkToLogin = document.querySelector('a[href="login.html"]');
    if (linkToLogin) {
      linkToLogin.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    }
  }

  /**
   * Alternador de visibilidade de palavra-passe (mostrar/ocultar senha)
   */
  function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('[data-toggle-password]');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-toggle-password');
        const input = document.getElementById(targetId);
        const icon = btn.querySelector('i');
        if (!input) return;

        if (input.type === 'password') {
          input.type = 'text';
          if (icon) {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
          }
        } else {
          input.type = 'password';
          if (icon) {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
          }
        }
      });
    });
  }

  /**
   * Configuração da página de Login
   */
  function setupLoginForm() {
    const loginForm = document.getElementById('formLogin');
    if (!loginForm) return;

    const phoneInput = document.getElementById('loginPhone');
    const passwordInput = document.getElementById('loginPassword');
    const alertBox = document.getElementById('loginAlert');
    const btnSubmit = document.getElementById('btnLoginSubmit');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      const phone = phoneInput ? phoneInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!phone || !password) {
        showAlert('Por favor, informe o seu número de telefone e a palavra-passe.', 'warning');
        return;
      }

      setLoading(true);

      try {
        const result = await GF.authService.login(phone, password);
        if (result.success) {
          showAlert(`Bem-vindo, ${result.user.name}! Redirecionando...`, 'success');
          setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect');

            if (result.user.role === 'manager' || result.user.role === 'admin') {
              window.location.href = 'admin.html';
            } else if (redirectUrl) {
              window.location.href = decodeURIComponent(redirectUrl);
            } else {
              window.location.href = 'dashboard.html';
            }
          }, 800);
        } else {
          showAlert(result.message || 'Dados inválidos.', 'danger');
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao efetuar login:', err);
        showAlert('Ocorreu um erro inesperado ao autenticar. Tente novamente.', 'danger');
        setLoading(false);
      }
    });

    function showAlert(msg, type = 'danger') {
      if (!alertBox) return;
      alertBox.className = `alert alert-${type} py-2 px-3 small d-flex align-items-center mb-3`;
      alertBox.innerHTML = `
        <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
        <div>${msg}</div>
      `;
      alertBox.classList.remove('d-none');
    }

    function hideAlert() {
      if (alertBox) alertBox.classList.add('d-none');
    }

    function setLoading(isLoading) {
      if (!btnSubmit) return;
      btnSubmit.disabled = isLoading;
      if (isLoading) {
        btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Entrando...`;
      } else {
        btnSubmit.innerHTML = `<i class="bi bi-box-arrow-in-right me-2" aria-hidden="true"></i>Entrar no Gás-Fácil`;
      }
    }
  }

  /**
   * Configuração da página de Cadastro
   * Campos estritos: Nome Completo, Telefone e Palavra-passe
   */
  function setupRegisterForm() {
    const registerForm = document.getElementById('formRegister');
    if (!registerForm) return;

    const nameInput = document.getElementById('regName');
    const phoneInput = document.getElementById('regPhone');
    const passwordInput = document.getElementById('regPassword');
    const alertBox = document.getElementById('registerAlert');
    const btnSubmit = document.getElementById('btnRegisterSubmit');

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!name || !phone || !password) {
        showAlert('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
      }

      setLoading(true);

      try {
        const result = await GF.authService.register({ name, phone, password });
        if (result.success) {
          showAlert(`Conta criada com sucesso! Ganhou 50 pontos de fidelidade. Acedendo ao painel...`, 'success');
          setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect');

            if (redirectUrl) {
              window.location.href = decodeURIComponent(redirectUrl);
            } else {
              window.location.href = 'dashboard.html';
            }
          }, 900);
        } else {
          showAlert(result.message || 'Não foi possível concluir o registo.', 'danger');
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao registrar:', err);
        showAlert('Ocorreu um erro inesperado ao criar a conta. Tente novamente.', 'danger');
        setLoading(false);
      }
    });

    function showAlert(msg, type = 'danger') {
      if (!alertBox) return;
      alertBox.className = `alert alert-${type} py-2 px-3 small d-flex align-items-center mb-3`;
      alertBox.innerHTML = `
        <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
        <div>${msg}</div>
      `;
      alertBox.classList.remove('d-none');
    }

    function hideAlert() {
      if (alertBox) alertBox.classList.add('d-none');
    }

    function setLoading(isLoading) {
      if (!btnSubmit) return;
      btnSubmit.disabled = isLoading;
      if (isLoading) {
        btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Criando conta...`;
      } else {
        btnSubmit.innerHTML = `<i class="bi bi-person-check-fill me-2" aria-hidden="true"></i>Criar Minha Conta`;
      }
    }
  }
})();
