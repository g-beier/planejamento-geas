import { indicadorService } from "@services";
import { indicadorRepository } from "@repositories";
import { NotFoundError } from "@infra/errors";
import { AreaIndicadorEnum } from "@schemas";

jest.mock("@/domain/repositories/indicadorRepository");

describe("indicadorService", () => {
  const mockIndicadores = [
    {
      id: "001",
      pergunta: "Pergunta 1",
      area: "VALORES" as AreaIndicadorEnum,
      atualizado_em: new Date("2020-10-10").toISOString(),
    },
    {
      id: "002",
      pergunta: "Pergunta 2",
      area: "GESTAO" as AreaIndicadorEnum,
      atualizado_em: new Date("2020-10-10").toISOString(),
    },
  ];

  const mockFindAll = jest.fn();
  const mockFindById = jest.fn();

  beforeEach(() => {
    // jest.clearAllMocks();

    (indicadorRepository as jest.Mock).mockReturnValue({
      findAll: mockFindAll,
      findById: mockFindById,
    });
  });

  describe("listarTodos", () => {
    it("deve retornar todos os indicadores quando área não for passada", async () => {
      mockFindAll.mockResolvedValue(mockIndicadores);

      const result = await indicadorService().listarTodos();

      expect(mockFindAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockIndicadores);
    });

    it("deve retornar apenas indicadores da área especificada", async () => {
      const area = "VALORES" as AreaIndicadorEnum;
      const filtrados = mockIndicadores.filter((i) => i.area === area);
      mockFindAll.mockResolvedValue(filtrados);

      const result = await indicadorService().listarTodos(area);

      expect(mockFindAll).toHaveBeenCalledWith(area);
      expect(result).toEqual(filtrados);
    });
  });

  describe("buscarPorId", () => {
    it("deve retornar o indicador quando encontrado", async () => {
      const indicador = mockIndicadores[0];
      mockFindById.mockResolvedValue(indicador);

      const result = await indicadorService().buscarPorId(indicador.id);

      expect(mockFindById).toHaveBeenCalledWith(indicador.id);
      expect(result).toEqual(indicador);
    });

    it("deve lançar NotFoundError quando o indicador não existir", async () => {
      (mockFindById as jest.Mock).mockResolvedValue(null);

      await expect(indicadorService().buscarPorId("999")).rejects.toThrow(
        NotFoundError
      );
      expect(mockFindById).toHaveBeenCalledWith("999");
    });
  });
});
