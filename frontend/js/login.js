// frontend/js/login.js - VERSÃO CORRIGIDA

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado!');
  
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const errorDiv = document.getElementById('error-msg');
  
  if (!emailInput || !senhaInput || !loginBtn) {
    console.error('Elementos não encontrados!');
    return;
  }
  
  console.log('Elementos encontrados com sucesso!');
  
  // Função de login
  async function realizarLogin() {
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    
    if (!email || !senha) {
      if (errorDiv) {
        errorDiv.textContent = 'Preencha email e senha!';
        errorDiv.style.display = 'block';
      }
      return;
    }
    
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
    
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENTRANDO...';
    
    try {
      console.log('Tentando login com:', email);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });
      
      const data = await response.json();
      console.log('Resposta do servidor:', data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro ao fazer login');
      }
      
      // Salvar token e dados do usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.usuario.id);
      localStorage.setItem('userName', data.usuario.nome);
      localStorage.setItem('userEmail', data.usuario.email);
      localStorage.setItem('userType', data.usuario.tipo);
      
      console.log('Login realizado com sucesso!');
      
      // Redirecionar para dashboard
      window.location.href = 'dashboard.html';
      
    } catch (error) {
      console.error('Erro no login:', error);
      
      if (errorDiv) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
      } else {
        alert('Erro: ' + error.message);
      }
      
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> ENTRAR';
    }
  }
  
  // Click no botão
  loginBtn.addEventListener('click', realizarLogin);
  
  // Enter nos campos
  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') realizarLogin();
  });
  
  senhaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') realizarLogin();
  });
});
