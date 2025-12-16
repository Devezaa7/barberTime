// Dashboard BarberTime - VERSÃO CORRIGIDA

const API_URL = 'https://barbertime-api.onrender.com';

const NOSSOS_BARBEIROS = [
  {
    id: 1,
    nome: 'Lucas Alberto de Santana Santos',
    especialidade: 'Cortes Modernos e Degradês',
    experiencia: '8 anos de experiência',
    avaliacao: 4.9,
    foto: 'images/team/lucas.jpg',
    bio: 'Especialista em cortes modernos, degradês e barbas clássicas.'
  },
  {
    id: 2,
    nome: 'Evely Sena dos Santos',
    especialidade: 'Cortes Femininos e Escovas',
    experiencia: '10 anos de experiência',
    avaliacao: 5.0,
    foto: 'images/team/evely.jpg',
    bio: 'Especializada em cortes femininos modernos e escovas profissionais.'
  },
  {
    id: 3,
    nome: 'Guilhermy Deveza da Silva',
    especialidade: 'Cortes Tradicionais e Design Capilar',
    experiencia: '6 anos de experiência',
    avaliacao: 4.9,
    foto: 'images/team/guilhermy.jpg',
    bio: 'Expert em cortes clássicos e design capilar artístico.'
  },
  {
    id: 4,
    nome: 'Samuel da Silva Sales',
    especialidade: 'Combo Corte + Barba',
    experiencia: '7 anos de experiência',
    avaliacao: 4.8,
    foto: 'images/team/samuel.jpg',
    bio: 'Especializado em combos completos e barbas estilizadas.'
  },
  {
    id: 5,
    nome: 'Ingrid Sanuto Aguiar',
    especialidade: 'Coloração e Platinados',
    experiencia: '9 anos de experiência',
    avaliacao: 5.0,
    foto: 'images/team/ingrid.jpg',
    bio: 'Referência em coloração personalizada e platinados.'
  },
  {
    id: 6,
    nome: 'Lettícia Sabino da Conceição Eugenio',
    especialidade: 'Hidratação e Cortes Infantis',
    experiencia: '5 anos de experiência',
    avaliacao: 4.9,
    foto: 'images/team/letticia.jpg',
    bio: 'Especialista em tratamentos capilares e cortes infantis.'
  }
];

let servicosCarregados = [];
let barbeirosCarregados = [];

document.addEventListener('DOMContentLoaded', inicializarDashboard);

function inicializarDashboard() {
  verificarSeEstaLogado();
  mostrarInformacoesDoUsuario();
  ajustarMenuPorTipoDeUsuario();
  buscarMeusAgendamentos();
  mostrarNossosBarbeiros();
  carregarServicosDisponiveis();
  configurarNavegacao();
  configurarMenuMobile();
  
  const inputData = document.getElementById('date');
  if (inputData) {
    const hoje = new Date().toISOString().split('T')[0];
    inputData.setAttribute('min', hoje);
  }
}

function verificarSeEstaLogado() {
  const token = pegarTokenDoUsuario();
  if (!token) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function pegarTokenDoUsuario() {
  return localStorage.getItem('token');
}

function pegarTipoDoUsuario() {
  return localStorage.getItem('userType') || 'CLIENTE';
}

function sair() {
  if (confirm('Tem certeza que deseja sair?')) {
    localStorage.clear();
    window.location.href = 'index.html';
  }
}

function ajustarMenuPorTipoDeUsuario() {
  const tipo = pegarTipoDoUsuario();
  const sidebar = document.getElementById('sidebar');
  
  if (!sidebar) return;
  
  const itensMenu = sidebar.querySelectorAll('.nav-item');
  
  itensMenu.forEach(item => {
    const secao = item.getAttribute('data-section');
    
    if (tipo === 'CLIENTE') {
      if (secao !== 'appointments' && secao !== 'new-appointment' && secao !== 'barbers') {
        item.style.display = 'none';
      }
    }
    
    if (tipo === 'BARBEIRO') {
      if (secao === 'new-appointment') {
        item.style.display = 'none';
      }
    }
  });
  
  console.log(`👤 Dashboard configurado para: ${tipo}`);
}

function configurarNavegacao() {
  const itensDoMenu = document.querySelectorAll('.nav-item');
  const secoes = document.querySelectorAll('.content-section');
  
  itensDoMenu.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      itensDoMenu.forEach(i => i.classList.remove('active'));
      secoes.forEach(s => s.classList.remove('active'));
      
      item.classList.add('active');
      
      const nomeSecao = item.getAttribute('data-section');
      const secaoParaMostrar = document.getElementById(nomeSecao + '-section');
      
      if (secaoParaMostrar) {
        secaoParaMostrar.classList.add('active');
      }
      
      const menuLateral = document.getElementById('sidebar');
      if (menuLateral) {
        menuLateral.classList.remove('active');
      }
    });
  });
}

function configurarMenuMobile() {
  const botaoMenu = document.getElementById('mobile-menu-btn');
  const menuLateral = document.getElementById('sidebar');
  
  if (!botaoMenu || !menuLateral) return;
  
  botaoMenu.addEventListener('click', () => {
    menuLateral.classList.toggle('active');
  });
  
  document.addEventListener('click', (e) => {
    const clicouFora = !menuLateral.contains(e.target) && !botaoMenu.contains(e.target);
    if (clicouFora) {
      menuLateral.classList.remove('active');
    }
  });
}

function mostrarInformacoesDoUsuario() {
  const nome = localStorage.getItem('userName') || 'Usuário';
  const email = localStorage.getItem('userEmail') || 'email@exemplo.com';
  const tipo = pegarTipoDoUsuario();
  
  const elementoNome = document.getElementById('user-name');
  const elementoEmail = document.getElementById('user-email');
  
  if (elementoNome) {
    elementoNome.textContent = nome;
    
    const badge = document.createElement('span');
    badge.style.cssText = `
      background: #D4AF37;
      color: #0A0A0A;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      margin-left: 10px;
    `;
    badge.textContent = tipo;
    
    if (!elementoNome.querySelector('span')) {
      elementoNome.appendChild(badge);
    }
  }
  
  if (elementoEmail) elementoEmail.textContent = email;
}

async function buscarMeusAgendamentos() {
  const token = pegarTokenDoUsuario();
  const tipo = pegarTipoDoUsuario();
  const container = document.getElementById('appointments-grid');
  
  if (!container) return;
  
  container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando...</div>';
  
  try {
    const resposta = await fetch(`${API_URL}/api/agendamentos`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!resposta.ok) {
      const erroDetalhado = await resposta.json().catch(() => ({}));
      console.error('Erro da API:', erroDetalhado);
      throw new Error(erroDetalhado.message || erroDetalhado.error || `Erro ${resposta.status}`);
    }
    
    const dados = await resposta.json();
    const agendamentos = dados.data || [];
    
    console.log(`📅 ${agendamentos.length} agendamento(s) carregado(s) para ${tipo}`);
    
    if (agendamentos.length === 0) {
      const mensagem = tipo === 'CLIENTE' 
        ? 'Você ainda não tem agendamentos. Clique em "Novo Agendamento" para agendar!'
        : 'Nenhum agendamento encontrado';
        
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-times"></i>
          <h3>Nenhum agendamento</h3>
          <p>${mensagem}</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = '';
    agendamentos.forEach(agendamento => {
      const card = criarCardDeAgendamento(agendamento, tipo);
      container.appendChild(card);
    });
    
  } catch (erro) {
    console.error('❌ Erro ao buscar agendamentos:', erro);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Erro ao carregar agendamentos</h3>
        <p>${erro.message}</p>
        <button onclick="buscarMeusAgendamentos()" class="btn-primary" style="margin-top: 15px; padding: 10px 20px; background: #D4AF37; color: #0A0A0A; border: none; border-radius: 5px; cursor: pointer;">
          <i class="fas fa-sync"></i> Tentar Novamente
        </button>
      </div>
    `;
  }
}

function criarCardDeAgendamento(agendamento, tipoUsuario) {
  const card = document.createElement('div');
  card.className = 'appointment-card';
  
  const dataHora = new Date(agendamento.dataHora);
  
  const dataFormatada = dataHora.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  const horaFormatada = dataHora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const statusEmPortugues = {
    'PENDENTE': 'Pendente',
    'CONFIRMADO': 'Confirmado',
    'CANCELADO': 'Cancelado',
    'CONCLUIDO': 'Concluído'
  };
  
  const status = statusEmPortugues[agendamento.status] || agendamento.status;
  
  let infoAdicional = '';
  if (tipoUsuario === 'BARBEIRO' && agendamento.cliente) {
    infoAdicional = `<p><i class="fas fa-user"></i> Cliente: ${agendamento.cliente.nome}</p>`;
  } else if (tipoUsuario === 'CLIENTE' && agendamento.barbeiro) {
    infoAdicional = `<p><i class="fas fa-user-tie"></i> Barbeiro: ${agendamento.barbeiro.nome}</p>`;
  }
  
  card.innerHTML = `
    <div class="appointment-status">${status}</div>
    <div class="appointment-info">
      <p><i class="fas fa-calendar-day"></i> <strong>${dataFormatada}</strong></p>
      <p><i class="fas fa-clock"></i> <strong>${horaFormatada}</strong></p>
      <p><i class="fas fa-cut"></i> ${agendamento.servico?.nome || 'Serviço'}</p>
      ${infoAdicional}
      ${agendamento.observacao ? `<p><i class="fas fa-comment"></i> ${agendamento.observacao}</p>` : ''}
    </div>
    <div class="appointment-actions">
      <button class="btn-delete" onclick="cancelarAgendamento('${agendamento.id}')">
        <i class="fas fa-trash-alt"></i>
        Cancelar
      </button>
    </div>
  `;
  
  return card;
}

async function criarNovoAgendamento() {
  const token = pegarTokenDoUsuario();
  const tipo = pegarTipoDoUsuario();
  
  if (tipo === 'BARBEIRO') {
    mostrarMensagem('Barbeiros não podem criar agendamentos para si mesmos', 'error');
    return;
  }
  
  const data = document.getElementById('date').value;
  const hora = document.getElementById('time').value;
  const servicoId = document.getElementById('service').value;
  const barbeiroId = document.getElementById('barber').value;
  
  if (!data || !hora || !servicoId || !barbeiroId) {
    mostrarMensagem('⚠️ Preencha todos os campos obrigatórios', 'error');
    return;
  }
  
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  
  if (!uuidRegex.test(servicoId)) {
    mostrarMensagem('❌ ID do serviço inválido. Recarregue a página e tente novamente.', 'error');
    console.error('servicoId inválido:', servicoId);
    return;
  }
  
  if (!uuidRegex.test(barbeiroId)) {
    mostrarMensagem('❌ ID do barbeiro inválido. Recarregue a página e tente novamente.', 'error');
    console.error('barbeiroId inválido:', barbeiroId);
    return;
  }
  
  const botao = document.querySelector('.btn-submit');
  const textoOriginal = botao.innerHTML;
  botao.disabled = true;
  botao.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando...';
  
  try {
    const dataHoraCompleta = new Date(`${data}T${hora}:00`).toISOString();
    
    console.log('📤 Enviando agendamento:', {
      dataHora: dataHoraCompleta,
      servicoId,
      barbeiroId,
      usuario: tipo
    });
    
    const resposta = await fetch(`${API_URL}/api/agendamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        dataHora: dataHoraCompleta,
        servicoId: servicoId,
        barbeiroId: barbeiroId
      })
    });
    
    const resultado = await resposta.json();
    
    console.log('📥 Resposta do servidor:', resultado);
    
    if (!resposta.ok) {
      throw new Error(resultado.error || resultado.message || 'Erro ao criar agendamento');
    }
    
    mostrarMensagem('✅ Agendamento criado com sucesso!', 'success');
    
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('service').value = '';
    document.getElementById('barber').value = '';
    
    setTimeout(() => {
      buscarMeusAgendamentos();
      const botaoAgendamentos = document.querySelector('[data-section="appointments"]');
      if (botaoAgendamentos) botaoAgendamentos.click();
    }, 2000);
    
  } catch (erro) {
    console.error('❌ Erro ao criar agendamento:', erro);
    mostrarMensagem(`❌ Erro: ${erro.message}`, 'error');
  } finally {
    botao.disabled = false;
    botao.innerHTML = textoOriginal;
  }
}

async function cancelarAgendamento(id) {
  if (!confirm('❓ Tem certeza que deseja cancelar este agendamento?')) return;
  
  const token = pegarTokenDoUsuario();
  
  try {
    const resposta = await fetch(`${API_URL}/api/agendamentos/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.error || 'Erro ao cancelar');
    }
    
    alert('✅ Agendamento cancelado com sucesso!');
    buscarMeusAgendamentos();
    
  } catch (erro) {
    alert(`❌ Erro: ${erro.message}`);
  }
}

// ✅ FUNÇÃO CORRIGIDA - Extrai barbeiros dos serviços
async function carregarServicosDisponiveis() {
  const token = pegarTokenDoUsuario();
  const selectServico = document.getElementById('service');
  const selectBarbeiro = document.getElementById('barber');
  
  if (!selectServico || !selectBarbeiro) return;
  
  try {
    console.log('🔄 Carregando serviços...');
    
    const respostaServicos = await fetch(`${API_URL}/api/servicos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!respostaServicos.ok) {
      throw new Error('Erro ao carregar serviços');
    }
    
    const dadosServicos = await respostaServicos.json();
    servicosCarregados = dadosServicos.data || [];
    
    console.log('📋 Serviços recebidos:', servicosCarregados.length);
    
    // Popula select de serviços
    selectServico.innerHTML = '<option value="">Escolha o serviço</option>';
    
    // Extrai barbeiros únicos dos serviços
    const barbeirosMap = new Map();
    
    servicosCarregados.forEach(servico => {
      const opcao = document.createElement('option');
      opcao.value = servico.id;
      opcao.textContent = `${servico.nome} - R$ ${Number(servico.preco).toFixed(2)}`;
      opcao.dataset.barbeiroId = servico.barbeiroId;
      selectServico.appendChild(opcao);
      
      // Adiciona barbeiro ao Map (evita duplicatas)
      if (servico.barbeiroId && servico.barbeiro) {
        barbeirosMap.set(servico.barbeiroId, servico.barbeiro);
      }
    });
    
    // Popula select de barbeiros com os dados dos serviços
    selectBarbeiro.innerHTML = '<option value="">Selecione o barbeiro</option>';
    
    barbeirosMap.forEach((barbeiro, id) => {
      const opcao = document.createElement('option');
      opcao.value = id;
      opcao.textContent = barbeiro.nome || 'Barbeiro';
      selectBarbeiro.appendChild(opcao);
    });
    
    console.log('💈 Barbeiros encontrados:', barbeirosMap.size);
    
    // Auto-seleciona barbeiro quando escolhe serviço
    selectServico.addEventListener('change', (e) => {
      const opcaoSelecionada = e.target.options[e.target.selectedIndex];
      const barbeiroId = opcaoSelecionada.dataset.barbeiroId;
      
      console.log('🎯 Serviço selecionado:', {
        servicoNome: opcaoSelecionada.textContent,
        servicoId: opcaoSelecionada.value,
        barbeiroId: barbeiroId
      });
      
      if (barbeiroId) {
        selectBarbeiro.value = barbeiroId;
        console.log('✅ Barbeiro auto-selecionado');
      }
    });
    
    console.log('✅ Serviços e barbeiros carregados com sucesso!');
    
  } catch (erro) {
    console.error('❌ Erro ao carregar serviços:', erro);
    mostrarMensagem('Erro ao carregar serviços. Recarregue a página.', 'error');
  }
}

function mostrarNossosBarbeiros() {
  const container = document.getElementById('barbers-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  NOSSOS_BARBEIROS.forEach(barbeiro => {
    const card = document.createElement('div');
    card.className = 'barber-card';
    
    card.innerHTML = `
      <img 
        src="${barbeiro.foto}" 
        alt="${barbeiro.nome}" 
        class="barber-image"
        onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(barbeiro.nome)}&background=D4AF37&color=0A0A0A&size=200'"
      >
      <h3>${barbeiro.nome}</h3>
      <p class="barber-specialty">${barbeiro.especialidade}</p>
      <p class="barber-experience">${barbeiro.experiencia}</p>
      <div class="barber-rating">
        <i class="fas fa-star"></i>
        <span>${barbeiro.avaliacao}</span>
      </div>
      <p class="barber-description">${barbeiro.bio}</p>
    `;
    
    container.appendChild(card);
  });
}

function mostrarMensagem(texto, tipo) {
  const elementoMensagem = document.getElementById('form-message');
  if (!elementoMensagem) return;
  
  elementoMensagem.textContent = texto;
  elementoMensagem.className = `form-message ${tipo}`;
  elementoMensagem.style.display = 'block';
  
  setTimeout(() => {
    elementoMensagem.style.display = 'none';
  }, 5000);
}

window.createAppointment = criarNovoAgendamento;
window.deleteAppointment = cancelarAgendamento;
window.logout = sair;