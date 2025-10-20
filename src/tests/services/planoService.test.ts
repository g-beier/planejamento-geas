import { planoRepository } from "@repositories";
import { planoService } from "@services";
import { NotFoundError, ValidationError } from "@infra/errors";

jest.mock("@/domain/repositories/planoRepository");
describe("planoService", () => {
  const mockPlanos = [
    {
      id: crypto.randomUUID(),
      titulo: "Plano do Grupo",
      ano: 2025,
      prazo_final: "2025-12-30",
      criado_em: "2025-10-13",
    },
    {
      id: crypto.randomUUID(),
      titulo: "Plano do Grupo",
      ano: 2024,
      prazo_final: "2024-12-30",
      criado_em: "2024-10-13",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("listarTodos", () => {
    it("deve retornar todos os planos", async () => {
      (planoRepository.findAll as jest.Mock).mockResolvedValue(mockPlanos);

      const result = await planoService.listarTodos();

      expect(result).toEqual(mockPlanos);
      expect(planoRepository.findAll).toHaveBeenCalled();
    });
  });

  describe("buscarPorId", () => {
    it("deve retornar o plano quando encontrado", async () => {
      (planoRepository.findById as jest.Mock).mockResolvedValue(mockPlanos[0]);

      const result = await planoService.buscarPorId("1");

      expect(result).toEqual(mockPlanos[0]);
      expect(planoRepository.findById).toHaveBeenCalledWith("1");
    });
    it("deve lançar NotFoundError quando o plano não existir", async () => {
      (planoRepository.findById as jest.Mock).mockResolvedValue(null);

      expect(planoService.buscarPorId("1")).rejects.toThrow(NotFoundError);
      expect(planoRepository.findById).toHaveBeenCalledWith("1");
    });
  });

  describe("criar", () => {
    it("deve retornar o plano criado", async () => {
      (planoRepository.create as jest.Mock).mockResolvedValue(mockPlanos[0]);

      const dados = {
        titulo: "Plano do Grupo",
        ano: 2025,
        prazo_final: "2025-12-31",
      };

      const result = await planoService.criar(dados);

      expect(result).toEqual(mockPlanos[0]);
      expect(planoRepository.create).toHaveBeenCalledWith(dados);
    });
    it("deve lançar ValidationError se campos obrigatórios não estiverem preenchidos", async () => {
      (planoRepository.create as jest.Mock).mockResolvedValue(mockPlanos[0]);

      const dados = {
        titulo: "Plano do Grupo",
        prazo_final: "2025-12-31",
      };

      expect(planoService.criar(dados)).rejects.toThrow(ValidationError);
      expect(planoRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("atualizar", () => {
    it("deve retornar o plano atualizado", async () => {
      (planoRepository.update as jest.Mock).mockResolvedValue(mockPlanos[0]);

      const id = crypto.randomUUID();
      const result = await planoService.atualizar(id, { ano: 2000 });

      expect(result).toEqual(mockPlanos[0]);
      expect(planoRepository.update).toHaveBeenCalledWith(id, { ano: 2000 });
    });
    it("deve lançar NotFoundError quando o plano não existir", () => {
      (planoRepository.update as jest.Mock).mockResolvedValue(null);

      const id = crypto.randomUUID();
      expect(planoService.atualizar(id, { ano: 2000 })).rejects.toThrow(
        NotFoundError
      );
      expect(planoRepository.update).toHaveBeenCalledWith(id, { ano: 2000 });
    });
  });

  describe("remover", () => {
    it("deve chamar o repositório com o ID correto", async () => {
      (planoRepository.remove as jest.Mock).mockResolvedValue(true);

      const id = crypto.randomUUID();
      await planoService.remover(id);

      expect(planoRepository.remove).toHaveBeenCalledWith(id);
    });
    it("deve lançar NotFoundError quando o plano não existir", () => {
      (planoRepository.remove as jest.Mock).mockResolvedValue(false);

      const id = crypto.randomUUID();

      expect(planoService.remover(id)).rejects.toThrow(NotFoundError);
      expect(planoRepository.remove).toHaveBeenCalledWith(id);
    });
  });
});
