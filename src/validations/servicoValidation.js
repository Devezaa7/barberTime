import { z } from "zod";

// Criar Serviço
export const criarServicoValidation = z.object({
    nome: z
    .string({
      required_error: "O nome é obrigatório",
      invalid_type_error: "O nome deve ser uma string",
    })
    .min(3, "O nome teve ter pelo menos 3 caracteres"),

    descricao: z
    .string({
        required_error: "A descrição é obrigatória",
        invalid_type_error: "A descrição deve ser uma string",
     })
    .min(5, "A descrição deve ter pelo menos 5 caracteres"),

    preco: z
    .number({
        required_error: "O preço é obrigatório",
        invalid_type_error: "O preço deve ser um número",
    })
    .positive("O preço deve ser maior que zero"),

    duracao: z
    .number({
        required_error: "A duração é obrigatória",
        invalid_type_error: "A duração deve ser um número",
    })
    .int("A duração deve ser um número inteiro")
    .positive("A duração deve ser um número maior que zero"),

    barbeiroId: z
    .string({
      required_error: "O barbeiroId é obrigatório",
      invalid_type_error: "O barbeiroId deve ser uma string UUID",
    })
    .uuid("O barbeiroId deve ser um UUID válido"), 

    
});
// atualizar serviço com campos opcionais
    export const atualizarServicoValidation = criarServicoValidation.partial()
