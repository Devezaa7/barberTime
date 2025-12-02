import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('populando o banco...');

  // limpa antes (ordem importa por causa das FKs)
  await prisma.agendamento.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.usuario.deleteMany();

  // cria barbeiros
  const joao = await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      email: 'joao@barbearia.com',
      telefone: '11987654321',
      senha: '123456', // TODO: fazer hash com bcrypt
      tipo: 'BARBEIRO',
    },
  });

  const carlos = await prisma.usuario.create({
    data: {
      nome: 'Carlos Santos',
      email: 'carlos@barbearia.com',
      telefone: '11987654322',
      senha: '123456',
      tipo: 'BARBEIRO',
    },
  });

  // cria clientes
  const pedro = await prisma.usuario.create({
    data: {
      nome: 'Pedro Oliveira',
      email: 'pedro@email.com',
      telefone: '11912345678',
      senha: '123456',
      tipo: 'CLIENTE',
    },
  });

  const ana = await prisma.usuario.create({
    data: {
      nome: 'Ana Costa',
      email: 'ana@email.com',
      telefone: '11912345679',
      senha: '123456',
      tipo: 'CLIENTE',
    },
  });

  console.log('usuarios ok');

  // servicos do João
  const corte = await prisma.servico.create({
    data: {
      nome: 'Corte Masculino',
      descricao: 'Corte simples',
      preco: 35.0,
      duracao: 30,
      barbeiroId: joao.id, // agora precisa do barbeiro
    },
  });

  const barba = await prisma.servico.create({
    data: {
      nome: 'Barba',
      descricao: 'Aparar barba',
      preco: 25.0,
      duracao: 20,
      barbeiroId: joao.id,
    },
  });

  const combo = await prisma.servico.create({
    data: {
      nome: 'Corte + Barba',
      preco: 55.0,
      duracao: 50,
      barbeiroId: joao.id,
    },
  });

  // serviço do Carlos
  await prisma.servico.create({
    data: {
      nome: 'Sobrancelha',
      preco: 15.0,
      duracao: 15,
      barbeiroId: carlos.id,
    },
  });

  console.log('servicos ok');

  // alguns agendamentos
  const agora = new Date();
  const amanha = new Date();
  amanha.setDate(agora.getDate() + 1);

  // Pedro agendou corte+barba com o João pra hoje 10h
  await prisma.agendamento.create({
    data: {
      dataHora: new Date(agora.setHours(10, 0, 0, 0)),
      status: 'CONFIRMADO',
      observacao: 'cliente vip',
      clienteId: pedro.id,    // quem agendou
      barbeiroId: joao.id,    // quem vai atender
      servicoId: combo.id,
    },
  });

  // Ana agendou corte com o João pra hoje 14h30
  await prisma.agendamento.create({
    data: {
      dataHora: new Date(agora.setHours(14, 30, 0, 0)),
      status: 'PENDENTE',
      clienteId: ana.id,
      barbeiroId: joao.id,
      servicoId: corte.id,
    },
  });

  // Pedro agendou barba com o Carlos pra amanhã 11h
  await prisma.agendamento.create({
    data: {
      dataHora: new Date(amanha.setHours(11, 0, 0, 0)),
      status: 'PENDENTE',
      clienteId: pedro.id,
      barbeiroId: carlos.id,
      servicoId: barba.id,
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