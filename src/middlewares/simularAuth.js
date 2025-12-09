export function simularAuth(req, res, next) {
  const tipoHeader = req.headers["x-user-tipo"];

  // não simular cliente fixo se a rota for de agendamento
  if (req.path.startsWith("/agendamentos")) {
    req.user = null;
    return next();
  }

  const usuarios = {
    CLIENTE: {
      id: "3b4571da-efa4-49bc-ac97-21f14b73d507",
      tipo: "CLIENTE",
    },
    BARBEIRO: {
      id: "15883368-aa78-40de-b22e-e66c32959f47",
      tipo: "BARBEIRO",
    },
  };

  req.user = usuarios[tipoHeader?.toUpperCase()] || usuarios.CLIENTE;
  console.log("Usuário simulado:", req.user);
  next();
}
