import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpa dados existentes (ordem importante por causa das FKs)
  await prisma.agendamento.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('🗑️  Dados antigos removidos');

  // Hash padrão para todas as senhas (senha123)
  const senhaHash = await bcrypt.hash('senha123', 10);

  // 1️⃣ Criar Usuários (1 Admin, 2 Barbeiros, 3 Clientes)
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Admin Sistema',
      email: 'admin@barbertime.com',
      telefone: '(11) 99999-0000',
      senha: senhaHash,
      tipo: 'ADMIN',
    }
  });

  const barbeiro1 = await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      email: 'joao@barbertime.com',
      telefone: '(11) 98888-1111',
      senha: senhaHash,
      tipo: 'BARBEIRO',
    }
  });

  const barbeiro2 = await prisma.usuario.create({
    data: {
      nome: 'Carlos Mendes',
      email: 'carlos@barbertime.com',
      telefone: '(11) 98888-2222',
      senha: senhaHash,
      tipo: 'BARBEIRO',
    }
  });

  const cliente1 = await prisma.usuario.create({
    data: {
      nome: 'Pedro Santos',
      email: 'pedro@email.com',
      telefone: '(11) 97777-1111',
      senha: senhaHash,
      tipo: 'CLIENTE',
    }
  });

  const cliente2 = await prisma.usuario.create({
    data: {
      nome: 'Maria Oliveira',
      email: 'maria@email.com',
      telefone: '(11) 97777-2222',
      senha: senhaHash,
      tipo: 'CLIENTE',
    }
  });

  const cliente3 = await prisma.usuario.create({
    data: {
      nome: 'Ana Costa',
      email: 'ana@email.com',
      telefone: '(11) 97777-3333',
      senha: senhaHash,
      tipo: 'CLIENTE',
    }
  });

  console.log('✅ Usuários criados (senha padrão: senha123)');

  // 2️⃣ Criar Serviços
  const servicosJoao = await prisma.servico.createMany({
    data: [
      {
        nome: 'Corte Masculino',
        descricao: 'Corte tradicional masculino com máquina e tesoura',
        preco: 35.00,
        duracao: 30,
        barbeiroId: barbeiro1.id,
      },
      {
        nome: 'Barba Completa',
        descricao: 'Barba com navalha, toalha quente e finalização',
        preco: 25.00,
        duracao: 20,
        barbeiroId: barbeiro1.id,
      },
      {
        nome: 'Corte + Barba',
        descricao: 'Combo completo de corte e barba',
        preco: 55.00,
        duracao: 50,
        barbeiroId: barbeiro1.id,
      }
    ]
  });

  const servicosCarlos = await prisma.servico.createMany({
    data: [
      {
        nome: 'Corte Degrade',
        descricao: 'Corte moderno com degradê',
        preco: 45.00,
        duracao: 40,
        barbeiroId: barbeiro2.id,
      },
      {
        nome: 'Pigmentação de Barba',
        descricao: 'Pigmentação profissional para barba',
        preco: 40.00,
        duracao: 30,
        barbeiroId: barbeiro2.id,
      },
      {
        nome: 'Platinado',
        descricao: 'Descoloração completa do cabelo',
        preco: 120.00,
        duracao: 90,
        barbeiroId: barbeiro2.id,
      }
    ]
  });

  console.log('✅ Serviços criados');

  // 3️⃣ Buscar serviços criados para usar nos agendamentos
  const todosServicos = await prisma.servico.findMany();

  // 4️⃣ Criar Agendamentos (variados status)
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  const depoisAmanha = new Date(hoje);
  depoisAmanha.setDate(depoisAmanha.getDate() + 2);

  await prisma.agendamento.createMany({
    data: [
      // Agendamentos CONFIRMADOS
      {
        dataHora: new Date(amanha.setHours(10, 0, 0, 0)),
        status: 'CONFIRMADO',
        observacao: 'Cliente preferencial',
        clienteId: cliente1.id,
        barbeiroId: barbeiro1.id,
        servicoId: todosServicos[0].id, // Corte Masculino
      },
      {
        dataHora: new Date(amanha.setHours(14, 0, 0, 0)),
        status: 'CONFIRMADO',
        clienteId: cliente2.id,
        barbeiroId: barbeiro2.id,
        servicoId: todosServicos[3].id, // Corte Degrade
      },
      
      // Agendamentos PENDENTES
      {
        dataHora: new Date(depoisAmanha.setHours(9, 0, 0, 0)),
        status: 'PENDENTE',
        clienteId: cliente3.id,
        barbeiroId: barbeiro1.id,
        servicoId: todosServicos[2].id, // Corte + Barba
      },
      {
        dataHora: new Date(depoisAmanha.setHours(16, 0, 0, 0)),
        status: 'PENDENTE',
        observacao: 'Primeira vez na barbearia',
        clienteId: cliente1.id,
        barbeiroId: barbeiro2.id,
        servicoId: todosServicos[4].id, // Pigmentação
      },

      // Agendamento CONCLUIDO (passado)
      {
        dataHora: new Date(hoje.setDate(hoje.getDate() - 2)),
        status: 'CONCLUIDO',
        clienteId: cliente2.id,
        barbeiroId: barbeiro1.id,
        servicoId: todosServicos[1].id, // Barba
      },

      // Agendamento CANCELADO
      {
        dataHora: new Date(hoje.setDate(hoje.getDate() + 3)),
        status: 'CANCELADO',
        observacao: 'Cliente cancelou - imprevistos',
        clienteId: cliente3.id,
        barbeiroId: barbeiro2.id,
        servicoId: todosServicos[5].id, // Platinado
      }
    ]
  });

  console.log('✅ Agendamentos criados');

  // 5️⃣ Mostrar resumo
  const totalUsuarios = await prisma.usuario.count();
  const totalServicos = await prisma.servico.count();
  const totalAgendamentos = await prisma.agendamento.count();

  console.log('\n📊 Resumo do Seed:');
  console.log(`   👥 Usuários: ${totalUsuarios}`);
  console.log(`   💈 Serviços: ${totalServicos}`);
  console.log(`   📅 Agendamentos: ${totalAgendamentos}`);
  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n🔐 Credenciais de teste:');
  console.log('   Admin: admin@barbertime.com / senha123');
  console.log('   Barbeiro 1: joao@barbertime.com / senha123');
  console.log('   Barbeiro 2: carlos@barbertime.com / senha123');
  console.log('   Cliente 1: pedro@email.com / senha123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });