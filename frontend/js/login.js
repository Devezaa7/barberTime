// frontend/js/login.js

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMsg = document.getElementById('error-msg');

  // Login ao pressionar Enter
  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  loginBtn.addEventListener('click', handleLogin);

  async function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Limpar mensagem de erro
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';

    // Validar campos
    if (!email || !password) {
      showError('Preencha todos os campos!');
      return;
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
      showError('Email inválido!');
      return;
    }

    // Loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AGUARDE...';

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Email ou senha incorretos!');
      }

      // Salvar token
      localStorage.setItem('token', data.token);
      
      // Sucesso visual
      loginBtn.innerHTML = '<i class="fas fa-check-circle"></i> SUCESSO!';
      loginBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

      // Redirecionar
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);

    } catch (error) {
      console.error('Erro no login:', error);
      showError(error.message || 'Erro ao conectar ao servidor.');
      
      // Resetar botão
      loginBtn.disabled = false;
      loginBtn.innerHTML = 'ENTRAR';

      // Shake na tela
      document.querySelector('.auth-container').style.animation = 'shake 0.4s';
      setTimeout(() => {
        document.querySelector('.auth-container').style.animation = '';
      }, 400);
    }
  }

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});