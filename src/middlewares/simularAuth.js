// Middleware temporário para simular autenticação (até a dupla 2 terminar o JWT)
export function simularAuth(req, res, next) {
  // Pega um cabeçalho opcional, ex: "x-user-tipo: BARBEIRO"
  const tipoHeader = req.headers["x-user-tipo"];

  // Simula dois usuários fixos do banco
  const usuarios = {
    CLIENTE: {
      id: "2d92b846-f761-4518-b41f-6f978acefe66",
      tipo: "CLIENTE",
    },
    BARBEIRO: {
      id: "15883368-aa78-40de-b22e-e66c32959f47",
      tipo: "BARBEIRO",
    },
  };

  // Se enviou o header, usa o tipo correspondente; senão assume CLIENTE por padrão
  req.user = usuarios[tipoHeader?.toUpperCase()] || usuarios.CLIENTE;

  console.log("Usuário simulado:", req.user);
  next();
}
