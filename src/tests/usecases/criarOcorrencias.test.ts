import { criarOcorrencias } from "@usecases";
import { ValidationError, NotFoundError } from "@/infra/errors";

jest.mock("@/domain/repositories", () => ({
  acaoRepository: jest.fn(),
  ocorrenciaRepository: jest.fn(),
  ocorrenciaSecaoRepository: jest.fn(),
  secaoRepository: jest.fn(),
}));

import {
  acaoRepository,
  ocorrenciaRepository,
  ocorrenciaSecaoRepository,
  secaoRepository,
} from "@repositories";
import { Acao, NovoOcorrencia, Ocorrencia } from "@/types";

describe("UseCase: criarOcorrencias", () => {
  const mockConn = {
    transaction: jest.fn(),
  } as any;

  const mockTrx = {
    execute: jest.fn(),
  };

  const mockOcorrenciaRepo = {
    bulkCreate: jest.fn(),
  };

  const mockOcorrenciaSecaoRepo = {
    bulkCreate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (acaoRepository as jest.Mock).mockReturnValue({
      findById: jest.fn(),
    });

    (secaoRepository as jest.Mock).mockReturnValue({
      findAllByIds: jest.fn(),
    });

    (ocorrenciaRepository as jest.Mock).mockReturnValue(mockOcorrenciaRepo);
    (ocorrenciaSecaoRepository as jest.Mock).mockReturnValue(
      mockOcorrenciaSecaoRepo
    );

    mockConn.transaction.mockReturnValue({
      execute: (fn: any) => fn(mockTrx),
    });
  });

  const fakeAcao: Acao = {
    id: "b4e7c2e8-3f6d-4e3d-bf7a-123456789000",
    plano_id: "a55b2e41-4c88-4ad4-b14b-987654321000",
    descricao: "Descricao da Acao",
    frequencia: "SEMANAL",
    criado_em: new Date("2025-01-10").toISOString(),
    atualizado_em: new Date("2025-05-21").toISOString(),
  };

  const fakeOcorrencias: Array<Omit<NovoOcorrencia, "acao_id">> = [
    { descricao: "Conselho 1", ordem: 1, realizado: false },
    { descricao: "Conselho 2", ordem: 2, realizado: false },
  ];

  const fakeCriadas: Array<Ocorrencia> = fakeOcorrencias.map((o, i) => ({
    id: crypto.randomUUID(),
    ...o,
    acao_id: fakeAcao.id,
    criado_em: new Date().toISOString(),
    data_realizacao: null,
    atualizado_por: crypto.randomUUID(),
  }));

  const fakeSecoesIds = [crypto.randomUUID(), crypto.randomUUID()];

  it("deve lançar ValidationError se o input for inválido", async () => {
    const useCase = criarOcorrencias(mockConn);

    await expect(
      useCase.executar({ acao_id: "not-uuid", ocorrencias: [] } as any)
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve lançar NotFoundError se a ação não existir", async () => {
    (acaoRepository as jest.Mock).mockReturnValue({
      findById: jest.fn().mockResolvedValue(null),
    });

    const useCase = criarOcorrencias(mockConn);

    await expect(
      useCase.executar({
        acao_id: fakeAcao.id,
        ocorrencias: fakeOcorrencias,
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("deve lançar ValidationError se alguma seção for inválida", async () => {
    (acaoRepository as jest.Mock).mockReturnValue({
      findById: jest.fn().mockResolvedValue(fakeAcao),
    });

    (secaoRepository as jest.Mock).mockReturnValue({
      findAllByIds: jest.fn().mockResolvedValue([{ id: fakeSecoesIds[0] }]),
    });

    const useCase = criarOcorrencias(mockConn);

    await expect(
      useCase.executar({
        acao_id: fakeAcao.id,
        ocorrencias: fakeOcorrencias,
        secoes: fakeSecoesIds,
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("deve criar ocorrências sem seções", async () => {
    (acaoRepository as jest.Mock).mockReturnValue({
      findById: jest.fn().mockResolvedValue(fakeAcao),
    });

    mockOcorrenciaRepo.bulkCreate.mockResolvedValue(fakeCriadas);

    const useCase = criarOcorrencias(mockConn);
    const result = await useCase.executar({
      acao_id: fakeAcao.id,
      ocorrencias: fakeOcorrencias,
    });

    expect(mockOcorrenciaRepo.bulkCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          descricao: "Conselho 1",
          acao_id: fakeAcao.id,
        }),
      ])
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: fakeCriadas[0].id,
      descricao: "Conselho 1",
    });
  });

  it("deve criar ocorrências com seções válidas", async () => {
    (acaoRepository as jest.Mock).mockReturnValue({
      findById: jest.fn().mockResolvedValue(fakeAcao),
    });

    (secaoRepository as jest.Mock).mockReturnValue({
      findAllByIds: jest
        .fn()
        .mockResolvedValue(fakeSecoesIds.map((id) => ({ id }))),
    });

    mockOcorrenciaRepo.bulkCreate.mockResolvedValue(fakeCriadas);
    mockOcorrenciaSecaoRepo.bulkCreate.mockResolvedValue([
      {
        ocorrencia_id: fakeCriadas[0].id,
        secao_id: fakeSecoesIds[0],
      },
      {
        ocorrencia_id: fakeCriadas[1].id,
        secao_id: fakeSecoesIds[0],
      },
      {
        ocorrencia_id: fakeCriadas[0].id,
        secao_id: fakeSecoesIds[1],
      },
      {
        ocorrencia_id: fakeCriadas[1].id,
        secao_id: fakeSecoesIds[1],
      },
    ]);

    const useCase = criarOcorrencias(mockConn);
    const result = await useCase.executar({
      acao_id: fakeAcao.id,
      ocorrencias: fakeOcorrencias,
      secoes: fakeSecoesIds,
    });

    expect(mockOcorrenciaRepo.bulkCreate).toHaveBeenCalled();
    expect(mockOcorrenciaSecaoRepo.bulkCreate).toHaveBeenCalled();

    const payload = mockOcorrenciaSecaoRepo.bulkCreate.mock.calls[0][0];
    expect(payload).toHaveLength(4);
    expect(payload[0]).toMatchObject({
      ocorrencia_id: fakeCriadas[0].id,
      secao_id: fakeSecoesIds[0],
      realizado: false,
    });

    expect(result).toEqual([
      {
        ocorrencia_id: fakeCriadas[0].id,
        secao_id: fakeSecoesIds[0],
      },
      {
        ocorrencia_id: fakeCriadas[1].id,
        secao_id: fakeSecoesIds[0],
      },
      {
        ocorrencia_id: fakeCriadas[0].id,
        secao_id: fakeSecoesIds[1],
      },
      {
        ocorrencia_id: fakeCriadas[1].id,
        secao_id: fakeSecoesIds[1],
      },
    ]);
  });
});
