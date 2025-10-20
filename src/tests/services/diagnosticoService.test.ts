import { diagnosticoRepository } from "@repositories";
import { diagnosticoService } from "@services";
import { NotFoundError } from "@infra/errors";
import { StatusAvaliacaoEnum } from "@schemas";
import { Diagnostico } from "@/types";

jest.mock("@/domain/repositories/diagnosticoRepository");

describe("diagnosticoService", () => {
  const mockDiagnosticos: Diagnostico[] = [
    {
      id: crypto.randomUUID(),
      plano_id: crypto.randomUUID(),
      indicador_id: "009",
      status: StatusAvaliacaoEnum.SIM,
      justificativa: "Justificativa 001",
      criado_em: "2025-10-13",
    },
    {
      id: crypto.randomUUID(),
      plano_id: crypto.randomUUID(),
      indicador_id: "002",
      status: StatusAvaliacaoEnum.EM_PARTE,
      justificativa: "Justificativa 002",
      criado_em: "2025-10-13",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listarPorPlano", () => {
    it("deve listar todos os diagnósticos associados ao plano", async () => {
      (diagnosticoRepository.findByPlano as jest.Mock).mockResolvedValue(
        mockDiagnosticos
      );

      const result = await diagnosticoService.listarPorPlano("1");
      expect(diagnosticoRepository.findByPlano).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockDiagnosticos);
    });
  });
  describe("buscarPorId", () => {
    it("deve retornar o dignóstico quando encontrado", async () => {
      (diagnosticoRepository.findById as jest.Mock).mockResolvedValue(
        mockDiagnosticos[0]
      );

      const result = await diagnosticoService.buscarPorId("1");

      expect(diagnosticoRepository.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockDiagnosticos[0]);
    });
    it("deve lançar NotFoundError quando o diagnóstico não existir", async () => {
      (diagnosticoRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(diagnosticoService.buscarPorId("111")).rejects.toThrow(
        NotFoundError
      );
      expect(diagnosticoRepository.findById).toHaveBeenCalledWith("111");
    });
  });
  describe("criar", () => {
    it("deve retornar o diagnostico criado", async () => {
      (diagnosticoRepository.create as jest.Mock).mockResolvedValue(
        mockDiagnosticos[0]
      );

      const mock = {
        plano_id: crypto.randomUUID(),
        indicador_id: "009",
        status: StatusAvaliacaoEnum.NAO,
        justificativa: "Justificativa 001",
      };

      const result = await diagnosticoService.criar(mock);

      expect(result).toEqual(mockDiagnosticos[0]);
      expect(diagnosticoRepository.create).toHaveBeenCalledWith(mock);
    });
  });
  describe("atualizar", () => {
    it("deve retornar o diagnostico atualizado", async () => {
      const body = { status: "SIM" };
      const id = crypto.randomUUID();

      (diagnosticoRepository.update as jest.Mock).mockResolvedValue({
        id: id,
        ...body,
      });

      const result = await diagnosticoService.atualizar(id, body);

      expect(result).toEqual({ id: id, status: StatusAvaliacaoEnum.SIM });
      expect(diagnosticoRepository.update).toHaveBeenCalledWith(id, body);
    });
    it("deve lançar NotFoundError quando o diagnostico não existir", async () => {
      const id = "uuid-nao-existente";
      const body = { status: StatusAvaliacaoEnum.SIM };

      (diagnosticoRepository.update as jest.Mock).mockResolvedValue(null);

      await expect(diagnosticoService.atualizar(id, body)).rejects.toThrow(
        NotFoundError
      );

      expect(diagnosticoRepository.update).toHaveBeenCalledWith(
        id,
        expect.any(Object)
      );
    });
  });
  describe("excluir", () => {
    it("deve chamar o repositório com o ID correto", async () => {
      (diagnosticoRepository.delete as jest.Mock).mockResolvedValue(true);

      await diagnosticoService.excluir("uuid-123");

      expect(diagnosticoRepository.delete).toHaveBeenCalledTimes(1);
      expect(diagnosticoRepository.delete).toHaveBeenCalledWith("uuid-123");
    });
    it("deve lançar NotFoundError quando o diagnostico não existir", async () => {
      (diagnosticoRepository.delete as jest.Mock).mockResolvedValue(null);

      expect(diagnosticoService.excluir("uuid-123")).rejects.toThrow(
        NotFoundError
      );

      expect(diagnosticoRepository.delete).toHaveBeenCalledTimes(1);
      expect(diagnosticoRepository.delete).toHaveBeenCalledWith("uuid-123");
    });
  });
});
