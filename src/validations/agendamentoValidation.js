import { z } from 'zod';

export const agendamentoSchema = z.object({
    dataHora: z.string().refine((val) => !isNaN(Date.parse(val)), "Data e hora inválidas" ),
    servicoId: z.string().uuid("ID de serviço inválido"),
    barbeiroId: z.string().uuid("ID do barbeiro inválido"),
    observacao: z.string().optional(),
})