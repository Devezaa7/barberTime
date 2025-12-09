# 🏗️ Arquitetura do Projeto BarberTime

## 📐 Padrão Arquitetural: MVC + Service Layer

```
Request → Route → Controller → Service → Repository (Prisma) → Database
                     ↓
                  Response
```

## 🔄 Fluxo de uma Requisição

### Exemplo: `POST /api/agendamentos`

1. **Route** (`agendamentoRoutes.js`)
   - Recebe a requisição HTTP
   - Aplica middlewares (auth, validação)
   - Direciona para o controller

2. **Controller** (`agendamentoController.js`)
   - Extrai dados da requisição (`req.body`, `req.params`)
   - Chama o Service
   - Formata e retorna a resposta

3. **Service** (`agendamentoService.js`)
   - Contém a lógica de negócio
   - Valida regras (ex: conflito de horários)
   - Faz operações no banco via Prisma
   - Retorna dados ou lança erros

4. **Prisma** (ORM)
   - Executa queries no PostgreSQL
   - Retorna resultados

5. **Error Handler** (`errorHandler.js`)
   - Captura qualquer erro no fluxo
   - Formata resposta de erro padronizada

---

## 📁 Responsabilidade de cada Camada

### 🛣️ **Routes**
- Define endpoints e métodos HTTP
- Aplica middlewares específicos
- **NÃO tem lógica de negócio**

```javascript
// ✅ CORRETO
router.post('/', authenticate, validate(schema), controller.criar);

// ❌ ERRADO - lógica na rota
router.post('/', async (req, res) => {
  const hash = await bcrypt.hash(req.body.senha, 10);
  // ...
});
```

### 🎮 **Controllers**
- Recebe e valida entrada
- Chama o Service apropriado
- Formata resposta HTTP
- **NÃO acessa banco diretamente**
- **NÃO tem lógica de negócio complexa**

```javascript
// ✅ CORRETO
export const criar = async (req, res, next) => {
  try {
    const agendamento = await agendamentoService.criar(req.body);
    res.status(201).json(agendamento);
  } catch (error) {
    next(error);
  }
};

// ❌ ERRADO - lógica no controller
export const criar = async (req, res) => {
  const existente = await prisma.agendamento.findFirst({...});
  if (existente) { /* validação complexa */ }
  // ...
};
```

### 💼 **Services**
- **TODA a lógica de negócio fica aqui**
- Validações complexas
- Operações no banco (via Prisma)
- Transformações de dados
- **Lança erros com contexto**

```javascript
// ✅ CORRETO - Service com lógica
class AgendamentoService {
  async criar(data) {
    // 1. Validar conflito de horários
    const conflito = await this.verificarConflito(data);
    if (conflito) {
      const error = new Error('Horário já ocupado');
      error.statusCode = 409;
      throw error;
    }

    // 2. Verificar se barbeiro oferece o serviço
    const servico = await prisma.servico.findFirst({
      where: { id: data.servicoId, barbeiroId: data.barbeiroId }
    });
    if (!servico) {
      const error = new Error('Barbeiro não oferece este serviço');
      error.statusCode = 400;
      throw error;
    }

    // 3. Criar agendamento
    return await prisma.agendamento.create({ data });
  }

  async verificarConflito(data) {
    // lógica complexa de verificação
  }
}
```

### 🗄️ **Prisma (Repository)**
- Acesso ao banco de dados
- Queries, inserts, updates, deletes
- Relacionamentos entre entidades

---

## 🛡️ Middlewares

### 1. **authenticate** (Dupla 2)
Verifica se o token JWT é válido.

```javascript
// Adiciona req.user com dados do usuário autenticado
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, tipo }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

### 2. **authorize** (Dupla 2)
Verifica se o usuário tem permissão (role).

```javascript
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.tipo)) {
      return res.status(403).json({ 
        error: 'Sem permissão para acessar este recurso' 
      });
    }
    next();
  };
};

// Uso:
router.post('/servicos', authenticate, authorize('ADMIN'), controller.criar);
```

### 3. **validate** (Dupla 2 e 3)
Valida body/params com Zod.

```javascript
import { z } from 'zod';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors 
      });
    }
  };
};

// Schema Zod
const criarAgendamentoSchema = z.object({
  dataHora: z.string().datetime(),
  barbeiroId: z.string().uuid(),
  servicoId: z.string().uuid(),
  observacao: z.string().optional()
});
```

### 4. **errorHandler** ✅ (Já pronto)
Captura todos os erros e retorna resposta padronizada.

---

## 🔐 Regras de Autorização

### Por Tipo de Usuário

| Recurso | CLIENTE | BARBEIRO | ADMIN |
|---------|---------|----------|-------|
| Ver próprios dados | ✅ | ✅ | ✅ |
| Ver dados de outros | ❌ | ❌ | ✅ |
| Criar agendamento | ✅ | ❌ | ✅ |
| Ver próprios agendamentos | ✅ | ✅ | ✅ |
| Ver todos agendamentos | ❌ | ✅ (seus) | ✅ |
| Criar serviço | ❌ | ❌ | ✅ |
| Editar serviço | ❌ | ❌ | ✅ |
| Deletar serviço | ❌ | ❌ | ✅ |

### Implementação no Service

```javascript
class AgendamentoService {
  async listar({ usuarioId, tipo }) {
    const where = { deletedAt: null };

    // Se for CLIENTE, só vê os próprios
    if (tipo === 'CLIENTE') {
      where.clienteId = usuarioId;
    }
    
    // Se for BARBEIRO, vê os que ele atende
    if (tipo === 'BARBEIRO') {
      where.barbeiroId = usuarioId;
    }

    // ADMIN vê todos (não adiciona filtro)

    return await prisma.agendamento.findMany({ where });
  }
}
```

---

## 🗑️ Soft Delete

**NUNCA deletar fisicamente do banco.** Sempre usar soft delete.

```javascript
// ❌ ERRADO
await prisma.usuario.delete({ where: { id } });

// ✅ CORRETO
await prisma.usuario.update({
  where: { id },
  data: { 
    deletedAt: new Date(),
    ativo: false 
  }
});
```

**Sempre filtrar `deletedAt: null` nas queries:**

```javascript
// ✅ CORRETO
await prisma.usuario.findMany({
  where: { deletedAt: null }
});

// ou usar findFirst se pode estar deletado
const usuario = await prisma.usuario.findFirst({
  where: { id, deletedAt: null }
});
```

---

## 📄 Paginação Padrão

Toda listagem deve ter paginação.

```javascript
async listar({ page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.model.findMany({
      where: { deletedAt: null },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.model.count({ where: { deletedAt: null } })
  ]);

  return {
    items,
    paginacao: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

---

## 🚨 Tratamento de Erros

### No Service (lançar erro)

```javascript
if (!usuario) {
  const error = new Error('Usuário não encontrado');
  error.statusCode = 404;
  throw error;
}
```

### No Controller (capturar)

```javascript
export const buscar = async (req, res, next) => {
  try {
    const usuario = await usuarioService.buscar(req.params.id);
    res.json(usuario);
  } catch (error) {
    next(error); // errorHandler processa
  }
};
```

### ErrorHandler (processar)

Já está pronto e captura:
- Erros do Zod
- Erros do Prisma (P2025, P2002, etc)
- Erros do JWT
- Erros customizados

---

## 🔑 Variáveis de Ambiente

Sempre acessar via `process.env.VARIAVEL`:

```javascript
// ❌ ERRADO - valor fixo
const secret = 'minha-chave-secreta';

// ✅ CORRETO
const secret = process.env.JWT_SECRET;

// ✅ AINDA MELHOR - com fallback
const port = process.env.PORT || 5555;
```

---

## 📦 Organização de Imports

Ordem sugerida:

```javascript
// 1. Libs externas
import express from 'express';
import bcrypt from 'bcrypt';

// 2. Configurações
import prisma from '../config/database.js';

// 3. Services
import usuarioService from '../services/usuarioService.js';

// 4. Middlewares
import { authenticate } from '../middlewares/auth.js';

// 5. Validações
import { criarSchema } from '../validations/usuario.js';
```

---

## ✅ Checklist para PRs

Antes de abrir um PR, verifique:

- [ ] Lógica de negócio está no **Service**, não no Controller
- [ ] Soft delete implementado (não usa `.delete()`)
- [ ] Paginação nas listagens
- [ ] Tratamento de erros com `try/catch` + `next(error)`
- [ ] Validação com Zod
- [ ] Autorização correta por tipo de usuário
- [ ] Código comentado onde necessário
- [ ] Testes manuais realizados

---

**Dúvidas? Fale com o líder (Guilhermy) antes de commitar!** 🚀