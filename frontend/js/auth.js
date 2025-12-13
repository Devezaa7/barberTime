// frontend/js/auth.js

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function isLogged() {
  return !!getToken();
}

function logout() {
  if (confirm('Deseja realmente sair?')) {
    removeToken();
    window.location.href = 'index.html';
  }
}

// Redirecionar para login se não estiver autenticado
function checkAuth() {
  if (!isLogged() && !window.location.pathname.includes('index.html')) {
    window.location.href = 'index.html';
  }
}

// Executar verificação ao carregar página
if (typeof window !== 'undefined') {
  checkAuth();
}