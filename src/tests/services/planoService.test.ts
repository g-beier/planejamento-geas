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
      criado_em: "2025-10-13",
      arquivado: true,
    },
    {
      id: crypto.randomUUID(),
      titulo: "Plano do Grupo",
      ano: 2024,
      criado_em: "2024-10-13",
      arquivado: false,
    },
  ];

  const mockFindAll = jest.fn();
  const mockFindById = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    // jest.clearAllMocks();

    (planoRepository as jest.Mock).mockReturnValue({
      findAll: mockFindAll,
      findById: mockFindById,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    });
  });
  describe("listarTodos", () => {
    it("deve retornar todos os planos", async () => {
      mockFindAll.mockResolvedValue(mockPlanos);

      const result = await planoService().listarTodos();

      expect(result).toEqual(mockPlanos);
      expect(mockFindAll).toHaveBeenCalled();
    });
  });

  describe("buscarPorId", () => {
    it("deve retornar o plano quando encontrado", async () => {
      mockFindById.mockResolvedValue(mockPlanos[0]);

      const result = await planoService().buscarPorId("1");

      expect(result).toEqual(mockPlanos[0]);
      expect(mockFindById).toHaveBeenCalledWith("1");
    });
    it("deve lançar NotFoundError quando o plano não existir", async () => {
      mockFindById.mockResolvedValue(null);

      expect(planoService().buscarPorId("1")).rejects.toThrow(NotFoundError);
      expect(mockFindById).toHaveBeenCalledWith("1");
    });
  });

  describe("criar", () => {
    it("deve retornar o plano criado", async () => {
      mockCreate.mockResolvedValue(mockPlanos[0]);

      const dados = {
        titulo: "Plano do Grupo",
        ano: 2025,
      };

      const result = await planoService().criar(dados);

      expect(result).toEqual(mockPlanos[0]);
      expect(mockCreate).toHaveBeenCalledWith({ arquivado: false, ...dados });
    });
    it("deve lançar ValidationError se campos obrigatórios não estiverem preenchidos", async () => {
      mockCreate.mockResolvedValue(mockPlanos[0]);

      const dados = {
        titulo: "Plano do Grupo",
      };

      expect(planoService().criar(dados)).rejects.toThrow(ValidationError);
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("atualizar", () => {
    it("deve retornar o plano atualizado", async () => {
      mockUpdate.mockResolvedValue(mockPlanos[0]);

      const id = crypto.randomUUID();
      const result = await planoService().atualizar(id, { ano: 2000 });

      expect(result).toEqual(mockPlanos[0]);
      expect(mockUpdate).toHaveBeenCalledWith(id, { ano: 2000 });
    });
    it("deve lançar NotFoundError quando o plano não existir", () => {
      mockUpdate.mockResolvedValue(null);

      const id = crypto.randomUUID();
      expect(planoService().atualizar(id, { ano: 2000 })).rejects.toThrow(
        NotFoundError
      );
      expect(mockUpdate).toHaveBeenCalledWith(id, {
        ano: 2000,
      });
    });
  });

  describe("remover", () => {
    it("deve chamar o repositório com o ID correto", async () => {
      mockRemove.mockResolvedValue(true);

      const id = crypto.randomUUID();
      await planoService().remover(id);

      expect(mockRemove).toHaveBeenCalledWith(id);
    });
    it("deve lançar NotFoundError quando o plano não existir", () => {
      mockRemove.mockResolvedValue(false);

      const id = crypto.randomUUID();

      expect(planoService().remover(id)).rejects.toThrow(NotFoundError);
      expect(mockRemove).toHaveBeenCalledWith(id);
    });
  });
});
