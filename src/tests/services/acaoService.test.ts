import { acaoRepository } from "@/domain/repositories";
import { acaoService } from "@/domain/services/acaoService";
import { Acao } from "@/types";

jest.mock("@/domain/repositories/acaoRepository");

describe("acaoService", () => {
  const mockAcoes: Acao[] = [
    {
      id: crypto.randomUUID(),
      plano_id: crypto.randomUUID(),
      descricao: "Ação #001: vamos fazer um acampamento",
      frequencia: "OUTUBRO",
      criado_em: null,
    },
    {
      id: crypto.randomUUID(),
      plano_id: crypto.randomUUID(),
      descricao: "Ação #002: vamos fazer um fórum de jovens",
      frequencia: "até NOVEMBRO",
      criado_em: null,
    },
    {
      id: crypto.randomUUID(),
      plano_id: crypto.randomUUID(),
      descricao: "Ação #003: vamos fazer um conselho de pais",
      frequencia: "a cada ciclo de programa",
      criado_em: null,
    },
  ];

  const id = crypto.randomUUID();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listarPorPlano", () => {
    it("deve retornar todas as ações associadas ao plano", async () => {
      (acaoRepository.findByPlano as jest.Mock).mockResolvedValue(mockAcoes);

      const result = await acaoService.listarPorPlano(id);
      expect(acaoRepository.findByPlano).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockAcoes);
    });
  });
  describe("buscarPorId", () => {});
  describe("criar", () => {});
  describe("atualizar", () => {});
  describe("remover", () => {});
});
