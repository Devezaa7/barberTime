// middleware de restrição de acesso por tipo de usuário (CLIENTE/BARBEIRO)
export function verificarTipo(...tiposPermitidos) {
    return (req, res, next) => {
        const user = req.user || "2d92b846-f761-4518-b41f-6f978acefe66" //|| "15883368-aa78-40de-b22e-e66c32959f47"// depois apagar o id teste

        if (!user) {
            return res.status(403).json({error: "Usuário não autenticado"})
        }

        if (!tiposPermitidos.includes(user.tipo)) {
            return res.status(403).json({ 
                error: "Acesso negado. Usuário sem permissão",
                permitido: tiposPermitidos,
                tipoAtual: user.tipo,
            })
        }

        next();
    };


}