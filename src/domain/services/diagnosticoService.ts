import { diagnosticoRepository } from "@/domain/repositories";
import { z } from "zod";
import { StatusAvaliacao } from "@/types/diagnostico";

const DiagnosticoCreateSchema = z.object({
  plano_id: z.string().uuid(),
  indicador_id: z.string().length(3),
  status: z.nativeEnum(StatusAvaliacao).optional(),
  justificativa: z.string().optional(),
});

const DiagnosticoUpdateSchema = DiagnosticoCreateSchema.partial();

export const diagnosticoService = {
  async listarPorPlano(planoId: string) {
    return diagnosticoRepository.listarPorPlano(planoId);
  },

  async obterPorId(id: string) {
    const diagnostico = await diagnosticoRepository.buscarPorId(id);
    if (!diagnostico) throw new Error("Diagnóstico não encontrado");
    return diagnostico;
  },

  async criar(body: unknown) {
    const parsed = DiagnosticoCreateSchema.parse(body);
    return diagnosticoRepository.criar(parsed);
  },

  async atualizar(id: string, body: unknown) {
    const parsed = DiagnosticoUpdateSchema.parse(body);
    return diagnosticoRepository.atualizar(id, parsed);
  },

  async excluir(id: string) {
    await diagnosticoRepository.excluir(id);
  },
};
