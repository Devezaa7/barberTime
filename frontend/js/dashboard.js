// frontend/js/dashboard.js - VERSÃO 100% FUNCIONAL

const API_URL = 'http://localhost:3000';

// ===================================
// DADOS DOS BARBEIROS COM FOTOS
// ===================================
const BARBERS_DATA = [
  {
    id: 1,
    name: 'João Silva',
    specialty: 'Cortes Modernos e Degradês',
    experience: '8 anos de experiência',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    description: 'Especialista em cortes modernos, degradês e estilos contemporâneos. Atualizado com as últimas tendências internacionais.'
  },
  {
    id: 2,
    name: 'Pedro Costa',
    specialty: 'Barbas Clássicas e Tradicionais',
    experience: '10 anos de experiência',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    description: 'Mestre em barbas tradicionais, navalha e cortes clássicos. Referência em técnicas tradicionais de barbearia.'
  },
  {
    id: 3,
    name: 'Lucas Ferreira',
    specialty: 'Design Capilar e Estilo Livre',
    experience: '6 anos de experiência',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    description: 'Expert em design capilar personalizado, desenhos e cortes criativos. Especializado em estilos únicos e ousados.'
  }
];

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Dashboard inicializando...');
  
  checkAuth();
  loadUserInfo();
  loadAppointments();
  loadBarbers();
  setupNavigation();
  setupMobileMenu();
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').setAttribute('min', today);
  
  console.log('✅ Dashboard pronto!');
});

// ===================================
// AUTENTICAÇÃO
// ===================================
function checkAuth() {
  const token = getToken();
  if (!token) {
    console.log('❌ Não autenticado, redirecionando...');
    window.location.href = 'index.html';
  }
}

function getToken() {
  return localStorage.getItem('token');
}

function logout() {
  if (confirm('Deseja realmente sair?')) {
    localStorage.clear();
    window.location.href = 'index.html';
  }
}

// ===================================
// NAVEGAÇÃO
// ===================================
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));
      
      item.classList.add('active');
      const sectionId = item.getAttribute('data-section');
      document.getElementById(`${sectionId}-section`).classList.add('active');
      
      document.getElementById('sidebar').classList.remove('active');
    });
  });
}

function setupMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
  
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });
}

// ===================================
// USUÁRIO
// ===================================
function loadUserInfo() {
  const userName = localStorage.getItem('userName') || 'Usuário';
  const userEmail = localStorage.getItem('userEmail') || 'usuario@email.com';
  
  document.getElementById('user-name').textContent = userName;
  document.getElementById('user-email').textContent = userEmail;
  
  console.log('👤 Usuário carregado:', userName);
}

// ===================================
// AGENDAMENTOS
// ===================================
async function loadAppointments() {
  const token = getToken();
  const grid = document.getElementById('appointments-grid');
  
  grid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando agendamentos...</div>';
  
  try {
    console.log('📅 Buscando agendamentos...');
    
    const response = await fetch(`${API_URL}/appointments`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    const appointments = await response.json();
    console.log('📦 Agendamentos recebidos:', appointments);
    
    if (!Array.isArray(appointments) || appointments.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <h3>Nenhum agendamento</h3>
          <p>Você ainda não possui agendamentos. Clique em "Novo Agendamento" para criar um!</p>
        </div>
      `;
      return;
    }
    
    grid.innerHTML = '';
    appointments.forEach(apt => {
      const card = createAppointmentCard(apt);
      grid.appendChild(card);
    });
    
    console.log(`✅ ${appointments.length} agendamento(s) carregado(s)`);
    
  } catch (error) {
    console.error('❌ Erro ao carregar agendamentos:', error);
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Erro ao carregar agendamentos</h3>
        <p>${error.message}</p>
        <p style="margin-top: 10px; font-size: 14px;">Verifique se o backend está rodando em ${API_URL}</p>
      </div>
    `;
  }
}

function createAppointmentCard(apt) {
  const card = document.createElement('div');
  card.className = 'appointment-card';
  
  const date = new Date(apt.date);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  card.innerHTML = `
    <div class="appointment-status">${apt.status || 'Agendado'}</div>
    <div class="appointment-info">
      <p><i class="fas fa-calendar-day"></i> <strong>${formattedDate}</strong></p>
      <p><i class="fas fa-clock"></i> <strong>${apt.time}</strong></p>
      <p><i class="fas fa-cut"></i> ${apt.service}</p>
      ${apt.barber ? `<p><i class="fas fa-user-tie"></i> ${apt.barber.name || apt.barber}</p>` : ''}
    </div>
    <div class="appointment-actions">
      <button class="btn-delete" onclick="deleteAppointment(${apt.id})">
        <i class="fas fa-trash-alt"></i>
        Cancelar Agendamento
      </button>
    </div>
  `;
  
  return card;
}

async function createAppointment() {
  const token = getToken();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const service = document.getElementById('service').value;
  const barberId = document.getElementById('barber').value;
  const messageEl = document.getElementById('form-message');
  
  if (!date || !time || !service) {
    showMessage('Preencha data, horário e serviço!', 'error');
    return;
  }
  
  const submitBtn = document.querySelector('.btn-submit');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CRIANDO...';
  
  try {
    console.log('📅 Criando agendamento...', { date, time, service, barberId });
    
    const body = { 
      date, 
      time, 
      service
    };
    
    // Adicionar barberId apenas se selecionado
    if (barberId) {
      body.barberId = parseInt(barberId);
    }
    
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    console.log('📡 Status:', response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro ao criar agendamento');
    }
    
    console.log('✅ Agendamento criado:', data);
    
    showMessage('✓ Agendamento realizado com sucesso!', 'success');
    
    // Limpar form
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('service').value = '';
    document.getElementById('barber').value = '';
    
    // Recarregar e voltar
    setTimeout(() => {
      loadAppointments();
      document.querySelector('[data-section="appointments"]').click();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erro:', error);
    showMessage(`✗ ${error.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> CONFIRMAR AGENDAMENTO';
  }
}

async function deleteAppointment(id) {
  if (!confirm('Deseja realmente cancelar este agendamento?')) return;
  
  const token = getToken();
  
  try {
    console.log('🗑️ Deletando agendamento:', id);
    
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao deletar');
    }
    
    console.log('✅ Agendamento deletado');
    alert('Agendamento cancelado com sucesso!');
    loadAppointments();
    
  } catch (error) {
    console.error('❌ Erro:', error);
    alert('Erro ao cancelar: ' + error.message);
  }
}

function showMessage(text, type) {
  const messageEl = document.getElementById('form-message');
  messageEl.textContent = text;
  messageEl.className = `form-message ${type}`;
  messageEl.style.display = 'block';
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 5000);
}

// ===================================
// BARBEIROS COM FOTOS
// ===================================
function loadBarbers() {
  const grid = document.getElementById('barbers-grid');
  const selectBarber = document.getElementById('barber');
  
  console.log('💈 Carregando barbeiros...');
  
  // Preencher grid com fotos
  grid.innerHTML = '';
  BARBERS_DATA.forEach(barber => {
    const card = document.createElement('div');
    card.className = 'barber-card';
    
    card.innerHTML = `
      <img 
        src="${barber.image}" 
        alt="${barber.name}" 
        class="barber-image"
        onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(barber.name)}&background=D4AF37&color=0A0A0A&size=200'"
      >
      <h3>${barber.name}</h3>
      <p class="barber-specialty">${barber.specialty}</p>
      <p class="barber-experience">${barber.experience}</p>
      <div class="barber-rating">
        <i class="fas fa-star"></i>
        <span>${barber.rating}</span>
      </div>
      <p class="barber-description">${barber.description}</p>
    `;
    
    grid.appendChild(card);
  });
  
  // Preencher select
  BARBERS_DATA.forEach(barber => {
    const option = document.createElement('option');
    option.value = barber.id;
    option.textContent = `${barber.name} - ${barber.specialty}`;
    selectBarber.appendChild(option);
  });
  
  console.log(`✅ ${BARBERS_DATA.length} barbeiros carregados`);
}