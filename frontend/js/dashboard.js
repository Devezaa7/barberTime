// frontend/js/dashboard.js

const API_URL = 'http://localhost:3000';

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadUserInfo();
  loadAppointments();
  loadBarbers();
  setupNavigation();
  setupMobileMenu();
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').setAttribute('min', today);
});

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
  // Em produção, buscar do backend: GET /api/user
  document.getElementById('user-name').textContent = 'Usuário';
  document.getElementById('user-email').textContent = 'usuario@email.com';
}

// ===================================
// AGENDAMENTOS
// ===================================
async function loadAppointments() {
  const token = getToken();
  const grid = document.getElementById('appointments-grid');
  
  grid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando...</div>';
  
  try {
    const response = await fetch(`${API_URL}/appointments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Erro ao carregar agendamentos');
    
    const appointments = await response.json();
    
    if (appointments.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <h3>Nenhum agendamento</h3>
          <p>Você ainda não possui agendamentos.</p>
        </div>
      `;
      return;
    }
    
    grid.innerHTML = '';
    appointments.forEach(apt => {
      const card = createAppointmentCard(apt);
      grid.appendChild(card);
    });
    
  } catch (error) {
    console.error('Erro:', error);
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Erro ao carregar</h3>
        <p>Tente recarregar a página</p>
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
    <div class="appointment-status">${apt.status || 'Confirmado'}</div>
    <div class="appointment-info">
      <p><i class="fas fa-calendar-day"></i> <strong>${formattedDate}</strong></p>
      <p><i class="fas fa-clock"></i> <strong>${apt.time}</strong></p>
      <p><i class="fas fa-cut"></i> ${apt.service}</p>
      ${apt.barber ? `<p><i class="fas fa-user-tie"></i> ${apt.barber}</p>` : ''}
    </div>
    <div class="appointment-actions">
      <button class="btn-delete" onclick="deleteAppointment(${apt.id})">
        <i class="fas fa-trash-alt"></i>
        Cancelar
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
  const barber = document.getElementById('barber').value;
  const messageEl = document.getElementById('form-message');
  
  if (!date || !time || !service) {
    showMessage('Preencha todos os campos obrigatórios!', 'error');
    return;
  }
  
  const submitBtn = document.querySelector('.btn-submit');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESSANDO...';
  
  try {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        date, 
        time, 
        service,
        barberId: barber ? parseInt(barber) : null
      })
    });
    
    if (!response.ok) throw new Error('Erro ao criar agendamento');
    
    showMessage('✓ Agendamento realizado com sucesso!', 'success');
    
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('service').value = '';
    document.getElementById('barber').value = '';
    
    setTimeout(() => {
      loadAppointments();
      document.querySelector('[data-section="appointments"]').click();
    }, 2000);
    
  } catch (error) {
    console.error('Erro:', error);
    showMessage('✗ Erro ao criar agendamento.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> CONFIRMAR AGENDAMENTO';
  }
}

async function deleteAppointment(id) {
  if (!confirm('Deseja realmente cancelar este agendamento?')) return;
  
  const token = getToken();
  
  try {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Erro ao deletar');
    
    alert('Agendamento cancelado!');
    loadAppointments();
    
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao cancelar agendamento.');
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
// BARBEIROS
// ===================================
async function loadBarbers() {
  const grid = document.getElementById('barbers-grid');
  const selectBarber = document.getElementById('barber');
  
  try {
    // Tentar buscar da API
    const response = await fetch(`${API_URL}/barbers`);
    
    let barbers = [];
    
    if (response.ok) {
      barbers = await response.json();
    } else {
      // Fallback: dados padrão
      barbers = [
        {
          id: 1,
          name: 'João Silva',
          specialty: 'Cortes Modernos',
          experience: '8 anos',
          rating: 4.9,
          image: 'https://randomuser.me/api/portraits/men/32.jpg',
          description: 'Especialista em cortes modernos e degradês.'
        },
        {
          id: 2,
          name: 'Pedro Costa',
          specialty: 'Barbas Clássicas',
          experience: '10 anos',
          rating: 4.8,
          image: 'https://randomuser.me/api/portraits/men/45.jpg',
          description: 'Mestre em barbas e cortes tradicionais.'
        },
        {
          id: 3,
          name: 'Lucas Ferreira',
          specialty: 'Design Capilar',
          experience: '6 anos',
          rating: 4.7,
          image: 'https://randomuser.me/api/portraits/men/67.jpg',
          description: 'Expert em design capilar personalizado.'
        }
      ];
    }
    
    // Preencher grid
    grid.innerHTML = '';
    barbers.forEach(barber => {
      const card = document.createElement('div');
      card.className = 'barber-card';
      
      card.innerHTML = `
        <img src="${barber.image}" alt="${barber.name}" class="barber-image" onerror="this.src='https://ui-avatars.com/api/?name=${barber.name}&background=D4AF37&color=0A0A0A&size=120'">
        <h3>${barber.name}</h3>
        <p class="barber-specialty">${barber.specialty}</p>
        <p class="barber-experience">${barber.experience} de experiência</p>
        <div class="barber-rating">
          <i class="fas fa-star"></i>
          <span>${barber.rating}</span>
        </div>
        <p class="barber-description">${barber.description}</p>
      `;
      
      grid.appendChild(card);
    });
    
    // Preencher select
    barbers.forEach(barber => {
      const option = document.createElement('option');
      option.value = barber.id;
      option.textContent = barber.name;
      selectBarber.appendChild(option);
    });
    
  } catch (error) {
    console.error('Erro:', error);
    grid.innerHTML = '<p class="error">Erro ao carregar barbeiros</p>';
  }
}

// ===================================
// HELPERS
// ===================================
function checkAuth() {
  if (!isLogged()) {
    window.location.href = 'index.html';
  }
}