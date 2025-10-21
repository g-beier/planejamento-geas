import {
  acaoRepository,
  diagnosticoRepository,
  acaoDiagnosticoRepository,
  responsavelRepository,
} from "@repositories";
import { AcaoCreateSchema, AcaoSchema, AcaoUpdateSchema } from "@schemas";
import { AtualizaAcao, NovoAcao } from "@/types";
import { NotFoundError, ValidationError } from "@infra/errors";
import { db, DBConnection } from "@infra/db";
import { acaoResponsavelRepository } from "../repositories/acaoResponsavelRepository";

export const acaoService = (conn: DBConnection = db) => {
  const acaoRepo = acaoRepository(conn);
  const diagnosticoRepo = diagnosticoRepository(conn);
  const responsavelRepo = responsavelRepository(conn);
  const acaoDiagRepo = acaoDiagnosticoRepository(conn);
  const acaoRespRepo = acaoResponsavelRepository(conn);

  return {
    async listarPorPlano(planoId: string) {
      return acaoRepo.findByPlano(planoId);
    },

    async buscarPorId(id: string) {
      const acao = acaoRepo.findById(id);
      if (!acao) throw new NotFoundError("Ação não encontrada.");
      return AcaoSchema.parse(acao);
    },

    async criar(data: NovoAcao) {
      const parsed = AcaoCreateSchema.safeParse(data);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const diagnostico = await diagnosticoRepo.findById(
        parsed.data.diagnostico_id
      );
      if (!diagnostico) {
        throw new NotFoundError("Diagnóstico não encontrado.");
      }

      const acao = await acaoRepository(conn).create(parsed.data);
      await acaoDiagnosticoRepository(conn).create(
        acao.id,
        parsed.data.diagnostico_id
      );

      return acao;
    },

    async atualizar(id: string, data: AtualizaAcao) {
      const parsed = AcaoUpdateSchema.safeParse(data);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }
      const acao = acaoRepo.update(id, parsed.data);
      return acao;
    },

    async adicionarDiagnostico(acao_id: string, diagnostico_id: string) {
      const diagnostico = await diagnosticoRepo.findById(diagnostico_id);
      if (!diagnostico) {
        throw new NotFoundError("Diagnóstico não encontrado.");
      }

      const acao = await acaoRepo.findById(acao_id);
      if (!acao) {
        throw new NotFoundError("Ação não encontrada.");
      }

      const duplicado = await acaoDiagRepo.findByAcaoAndDiagnosticoId(
        acao_id,
        diagnostico_id
      );

      if (duplicado) {
        throw new ValidationError("Vínculo existente.");
      }

      return await acaoDiagRepo.create(acao_id, diagnostico_id);
    },

    async removerDiagnostico(acao_id: string, diagnostico_id: string) {
      const vinculo = await acaoDiagRepo.findByAcaoAndDiagnosticoId(
        acao_id,
        diagnostico_id
      );
      if (!vinculo) {
        throw new NotFoundError("Vínculo não encontrado.");
      }

      return await acaoDiagRepo.delete(vinculo.id);
    },

    async adicionarResponsavel(acao_id: string, responsavel_id: string) {
      const responsavel = await responsavelRepo.findById(responsavel_id);
      if (!responsavel) {
        throw new NotFoundError("Responsável não encontrado.");
      }

      const acao = await acaoRepo.findById(acao_id);
      if (!acao) {
        throw new NotFoundError("Ação não encontrada.");
      }

      const duplicado = await acaoRespRepo.findByAcaoAndResponsavelId(
        acao_id,
        responsavel_id
      );

      if (duplicado) {
        throw new ValidationError("Vínculo existente.");
      }

      return await acaoRespRepo.create(acao_id, responsavel_id);
    },

    async removerResponsavel(acao_id: string, responsavel_id: string) {
      const vinculo = await acaoRespRepo.findByAcaoAndResponsavelId(
        acao_id,
        responsavel_id
      );
      if (!vinculo) {
        throw new NotFoundError("Vínculo não encontrado.");
      }

      return await acaoRespRepo.delete(vinculo.id);
    },

    async remover(id: string) {
      return acaoRepo.delete(id);
    },
  };
};
