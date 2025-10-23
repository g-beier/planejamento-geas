import { diagnosticoRepository } from "@repositories";
import { diagnosticoService } from "@services";
import { NotFoundError } from "@infra/errors";
import { DiagnosticoRespostaEnum } from "@schemas";
import { Diagnostico } from "@/types";

jest.mock("@/domain/repositories/diagnosticoRepository");

describe("diagnosticoService", () => {
  const mockDiagnosticos: Diagnostico[] = [
    {
      plano_id: crypto.randomUUID(),
      indicador_id: "009",
      resposta: DiagnosticoRespostaEnum.SIM,
      justificativa: "Justificativa 001",
      criado_em: "2025-10-13",
      atualizado_em: new Date().toISOString(),
    },
    {
      plano_id: crypto.randomUUID(),
      indicador_id: "002",
      resposta: DiagnosticoRespostaEnum.EM_PARTE,
      justificativa: "Justificativa 002",
      criado_em: "2025-10-13",
      atualizado_em: new Date().toISOString(),
    },
  ];

  const mockCreate = jest.fn();
  const mockFindByPlano = jest.fn();
  const mockFindById = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    // jest.clearAllMocks();

    (diagnosticoRepository as jest.Mock).mockReturnValue({
      create: mockCreate,
      findById: mockFindById,
      findByPlano: mockFindByPlano,
      update: mockUpdate,
      delete: mockDelete,
    });
  });

  describe("listarPorPlano", () => {
    it("deve listar todos os diagnósticos associados ao plano", async () => {
      mockFindByPlano.mockResolvedValue(mockDiagnosticos);

      const result = await diagnosticoService().listarPorPlano("1");
      expect(mockFindByPlano).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockDiagnosticos);
    });
  });
  describe("buscarPorId", () => {
    it("deve retornar o dignóstico quando encontrado", async () => {
      mockFindById.mockResolvedValue(mockDiagnosticos[0]);

      const result = await diagnosticoService().buscarPorId("uuid-234", "000");

      expect(mockFindById).toHaveBeenCalledWith("uuid-234", "000");
      expect(result).toEqual(mockDiagnosticos[0]);
    });
    it("deve lançar NotFoundError quando o diagnóstico não existir", async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        diagnosticoService().buscarPorId("uuid-234", "000")
      ).rejects.toThrow(NotFoundError);
      expect(mockFindById).toHaveBeenCalledWith("uuid-234", "000");
    });
  });
  describe("criar", () => {
    it("deve retornar o diagnostico criado", async () => {
      mockCreate.mockResolvedValue(mockDiagnosticos[0]);

      const { criado_em: _, atualizado_em: __, ...mock } = mockDiagnosticos[0];

      const result = await diagnosticoService().criar(mock);

      expect(result).toEqual(mockDiagnosticos[0]);
      expect(mockCreate).toHaveBeenCalledWith(mock);
    });
  });
  describe("atualizar", () => {
    it("deve retornar o diagnostico atualizado", async () => {
      const body = { resposta: "SIM" };
      const id = crypto.randomUUID();

      mockUpdate.mockResolvedValue({
        ...body,
        plano_id: id,
        indicador_id: id,
      });

      const result = await diagnosticoService().atualizar(id, id, body);

      expect(result).toEqual({
        plano_id: id,
        indicador_id: id,
        resposta: DiagnosticoRespostaEnum.SIM,
      });
      expect(mockUpdate).toHaveBeenCalledWith(id, id, body);
    });
    it("deve lançar NotFoundError quando o diagnostico não existir", async () => {
      const id = "uuid-nao-existente";
      const body = { resposta: DiagnosticoRespostaEnum.SIM };

      mockUpdate.mockResolvedValue(null);

      await expect(
        diagnosticoService().atualizar(id, id, body)
      ).rejects.toThrow(NotFoundError);

      expect(mockUpdate).toHaveBeenCalledWith(id, id, expect.any(Object));
    });
  });
  describe("excluir", () => {
    it("deve chamar o repositório com o ID correto", async () => {
      mockDelete.mockResolvedValue(true);

      await diagnosticoService().excluir("uuid-234", "000");

      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledWith("uuid-234", "000");
    });
    it("deve lançar NotFoundError quando o diagnostico não existir", async () => {
      mockDelete.mockResolvedValue(null);

      expect(diagnosticoService().excluir("uuid-234", "000")).rejects.toThrow(
        NotFoundError
      );

      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledWith("uuid-234", "000");
    });
  });
});
