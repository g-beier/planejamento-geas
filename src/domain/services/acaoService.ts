import {
  acaoRepository,
  diagnosticoRepository,
  acaoDiagnosticoRepository,
  responsavelRepository,
} from "@repositories";
import { AcaoCreateSchema, AcaoUpdateSchema } from "@schemas";
import { AtualizaAcao, NovoAcao } from "@/types";
import { NotFoundError, ValidationError } from "@infra/errors";
import { db } from "@infra/db";
import { acaoResponsavelRepository } from "../repositories/acaoResponsavelRepository";

export const acaoService = {
  async listarPorPlano(planoId: string) {
    return acaoRepository.findByPlano(planoId);
  },

  async buscarPorId(id: string) {
    return acaoRepository.findById(id);
  },

  async criar(data: NovoAcao) {
    const parsed = AcaoCreateSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }

    const diagnostico = await diagnosticoRepository.findById(
      parsed.data.diagnostico_id
    );
    if (!diagnostico) {
      throw new NotFoundError("Diagnóstico não encontrado.");
    }

    const acao = await db.transaction().execute(async (trx) => {
      const acao = await acaoRepository.create(parsed.data, trx);
      await acaoDiagnosticoRepository.create(
        acao.id,
        parsed.data.diagnostico_id,
        trx
      );
      return acao;
    });

    return acao;
  },

  async atualizar(id: string, data: AtualizaAcao) {
    const parsed = AcaoUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }
    const acao = acaoRepository.update(id, parsed.data);
    return acao;
  },

  async adicionarDiagnostico(acao_id: string, diagnostico_id: string) {
    const diagnostico = await diagnosticoRepository.findById(diagnostico_id);
    if (!diagnostico) {
      throw new NotFoundError("Diagnóstico não encontrado.");
    }

    const acao = await acaoRepository.findById(acao_id);
    if (!acao) {
      throw new NotFoundError("Ação não encontrada.");
    }

    const duplicado =
      await acaoDiagnosticoRepository.findByAcaoAndDiagnosticoId(
        acao_id,
        diagnostico_id
      );

    if (duplicado) {
      throw new ValidationError("Vínculo existente.");
    }

    return await acaoDiagnosticoRepository.create(acao_id, diagnostico_id);
  },

  async removerDiagnostico(acao_id: string, diagnostico_id: string) {
    const vinculo = await acaoDiagnosticoRepository.findByAcaoAndDiagnosticoId(
      acao_id,
      diagnostico_id
    );
    if (!vinculo) {
      throw new NotFoundError("Vínculo não encontrado.");
    }

    return await acaoDiagnosticoRepository.delete(vinculo.id);
  },

  async adicionarResponsavel(acao_id: string, responsavel_id: string) {
    const responsavel = await responsavelRepository.findById(responsavel_id);
    if (!responsavel) {
      throw new NotFoundError("Responsável não encontrado.");
    }

    const acao = await acaoRepository.findById(acao_id);
    if (!acao) {
      throw new NotFoundError("Ação não encontrada.");
    }

    const duplicado =
      await acaoResponsavelRepository.findByAcaoAndResponsavelId(
        acao_id,
        responsavel_id
      );

    if (duplicado) {
      throw new ValidationError("Vínculo existente.");
    }

    return await acaoResponsavelRepository.create(acao_id, responsavel_id);
  },

  async removerResponsavel(acao_id: string, responsavel_id: string) {
    const vinculo = await acaoResponsavelRepository.findByAcaoAndResponsavelId(
      acao_id,
      responsavel_id
    );
    if (!vinculo) {
      throw new NotFoundError("Vínculo não encontrado.");
    }

    return await acaoResponsavelRepository.delete(vinculo.id);
  },

  async remover(id: string) {
    return acaoRepository.delete(id);
  },
};
