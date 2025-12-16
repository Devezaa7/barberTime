const API_URL = 'https://barbertime-api.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const errorMsg = document.getElementById('error-msg');

  if (localStorage.getItem('token')) {
    window.location.href = 'dashboard.html';
    return;
  }

  if (!emailInput || !passwordInput || !loginBtn) {
    console.error('Erro ao carregar formulário de login');
    return;
  }

  loginBtn.addEventListener('click', login);
  emailInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') login();
  });
  passwordInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') login();
  });

  async function login() {
    const email = emailInput.value.trim();
    const senha = passwordInput.value.trim();

    errorMsg.style.display = 'none';

    if (!email || !senha) {
      showError('Preencha email e senha');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Email inválido');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Entrando...';

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email ou senha incorretos');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.usuario.id);
      localStorage.setItem('userName', data.usuario.nome);
      localStorage.setItem('userEmail', data.usuario.email);
      localStorage.setItem('userType', data.usuario.tipo);

      window.location.href = 'dashboard.html';

    } catch (err) {
      showError(err.message || 'Erro ao tentar login');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Entrar';
    }
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
});
