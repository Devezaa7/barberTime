import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('populando o banco...');

  // limpa tudo
  await prisma.agendamento.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.usuario.deleteMany();

  // cria barbeiros
  const marcelo = await prisma.usuario.create({
    data: {
      nome: 'Marcelo "Cabelin" Ferreira',
      email: 'marcelo.cabelin@barbetime.com.br',
      telefone: '21987456321',
      senha: 'barbeiro2024', // TODO: fazer hash com bcrypt
      tipo: 'BARBEIRO',
    },
  });

  const thiago = await prisma.usuario.create({
    data: {
      nome: 'Thiago Barbosa',
      email: 'thiago.barbosa@barbetime.com.br',
      telefone: '21976543210',
      senha: 'corte@123',
      tipo: 'BARBEIRO',
    },
  });

  const rafael = await prisma.usuario.create({
    data: {
      nome: 'Rafael "Tesoura de Ouro" Costa',
      email: 'rafael.costa@barbetime.com.br',
      telefone: '21965432109',
      senha: 'tesoura@2024',
      tipo: 'BARBEIRO',
    },
  });

  // cria clientes
  const lucas = await prisma.usuario.create({
    data: {
      nome: 'Lucas Mendes',
      email: 'lucas.mendes@gmail.com',
      telefone: '21998887766',
      senha: 'cliente123',
      tipo: 'CLIENTE',
    },
  });

  const fernanda = await prisma.usuario.create({
    data: {
      nome: 'Fernanda Alves',
      email: 'fe.alves@hotmail.com',
      telefone: '21997776655',
      senha: 'fe@2024',
      tipo: 'CLIENTE',
    },
  });

  const bruno = await prisma.usuario.create({
    data: {
      nome: 'Bruno Henrique',
      email: 'brunohr@outlook.com',
      telefone: '21996665544',
      senha: 'bruno#456',
      tipo: 'CLIENTE',
    },
  });

  const camila = await prisma.usuario.create({
    data: {
      nome: 'Camila Rodrigues',
      email: 'camilar@yahoo.com.br',
      telefone: '21995554433',
      senha: 'cami789',
      tipo: 'CLIENTE',
    },
  });

  console.log('usuarios ok');

  // servicos do Marcelo "Cabelin"
  const corteMasculino = await prisma.servico.create({
    data: {
      nome: 'Corte Masculino Clássico',
      descricao: 'Corte tradicional com máquina e tesoura, finalização com navalha',
      preco: 45.0,
      duracao: 40,
      barbeiroId: marcelo.id,
    },
  });

  const barbaCompleta = await prisma.servico.create({
    data: {
      nome: 'Barba Completa',
      descricao: 'Aparo, alinhamento e hidratação com toalha quente',
      preco: 35.0,
      duracao: 30,
      barbeiroId: marcelo.id,
    },
  });

  const comboExecutivo = await prisma.servico.create({
    data: {
      nome: 'Combo Executivo',
      descricao: 'Corte + Barba + Sobrancelha + Finalização Premium',
      preco: 85.0,
      duracao: 75,
      barbeiroId: marcelo.id,
    },
  });

  // serviços do Thiago
  const degradeModerno = await prisma.servico.create({
    data: {
      nome: 'Degradê Moderno',
      descricao: 'Corte degradê com risquinho e desenho personalizado',
      preco: 55.0,
      duracao: 50,
      barbeiroId: thiago.id,
    },
  });

  const barbaTerapia = await prisma.servico.create({
    data: {
      nome: 'Barba Terapia',
      descricao: 'Tratamento completo com óleos essenciais e massagem relaxante',
      preco: 60.0,
      duracao: 45,
      barbeiroId: thiago.id,
    },
  });

  // serviços do Rafael "Tesoura de Ouro"
  const corteEstiloso = await prisma.servico.create({
    data: {
      nome: 'Corte Estiloso',
      descricao: 'Corte moderno com texturização e styling',
      preco: 65.0,
      duracao: 55,
      barbeiroId: rafael.id,
    },
  });

  const sobrancelha = await prisma.servico.create({
    data: {
      nome: 'Design de Sobrancelha',
      descricao: 'Modelagem profissional com pinça e navalha',
      preco: 25.0,
      duracao: 20,
      barbeiroId: rafael.id,
    },
  });

  console.log('servicos ok');

  // alguns agendamentos realistas
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);
  const depois = new Date(hoje);
  depois.setDate(hoje.getDate() + 2);

  // Lucas agendou combo executivo com Marcelo para hoje 9h
  await prisma.agendamento.create({
    data: {
      dataHora: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 9, 0, 0),
      status: 'CONFIRMADO',
      observacao: 'Cliente preferencial - tem reunião importante às 11h',
      clienteId: lucas.id,
      barbeiroId: marcelo.id,
      servicoId: comboExecutivo.id,
    },
  });

  // Fernanda agendou design de sobrancelha com Rafael para hoje 14h
  await prisma.agendamento.create({
    data: {
      dataHora: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 0, 0),
      status: 'CONFIRMADO',
      observacao: 'Primeira vez - foi indicada pela amiga',
      clienteId: fernanda.id,
      barbeiroId: rafael.id,
      servicoId: sobrancelha.id,
    },
  });

  // Bruno agendou degradê moderno com Thiago para amanhã 10h30
  await prisma.agendamento.create({
    data: {
      dataHora: new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 10, 30, 0),
      status: 'PENDENTE',
      observacao: 'Cliente quer risco personalizado - trazer referência',
      clienteId: bruno.id,
      barbeiroId: thiago.id,
      servicoId: degradeModerno.id,
    },
  });

  // Camila agendou corte estiloso com Rafael para amanhã 16h
  await prisma.agendamento.create({
    data: {
      dataHora: new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 16, 0, 0),
      status: 'PENDENTE',
      clienteId: camila.id,
      barbeiroId: rafael.id,
      servicoId: corteEstiloso.id,
    },
  });

  // Lucas agendou barba completa com Marcelo para depois de amanhã 11h
  await prisma.agendamento.create({
    data: {
      dataHora: new Date(depois.getFullYear(), depois.getMonth(), depois.getDate(), 11, 0, 0),
      status: 'PENDENTE',
      observacao: 'Retorno - manutenção mensal',
      clienteId: lucas.id,
      barbeiroId: marcelo.id,
      servicoId: barbaCompleta.id,
    },
  });

  // Bruno agendou barba terapia com Thiago para depois de amanhã 15h
  await prisma.agendamento.create({
    data: {
      dataHora: new Date(depois.getFullYear(), depois.getMonth(), depois.getDate(), 15, 0, 0),
      status: 'PENDENTE',
      observacao: 'Cliente estressado - recomendou tratamento relaxante',
      clienteId: bruno.id,
      barbeiroId: thiago.id,
      servicoId: barbaTerapia.id,
    },
  });

  console.log('agendamentos ok');
  console.log('pronto! tudo populado 🎉');
}

main()
  .catch((e) => {
    console.error('deu ruim:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });