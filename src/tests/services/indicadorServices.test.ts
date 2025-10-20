import { indicadorService } from "@services";
import { indicadorRepository } from "@repositories";
import { NotFoundError } from "@infra/errors";
import { AreaIndicadorEnum } from "@schemas";

jest.mock("@/domain/repositories/indicadorRepository");

describe("indicadorService", () => {
  const mockIndicadores = [
    { id: "001", pergunta: "Pergunta 1", area: "VALORES" as AreaIndicadorEnum },
    { id: "002", pergunta: "Pergunta 2", area: "GESTAO" as AreaIndicadorEnum },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listarTodos", () => {
    it("deve retornar todos os indicadores quando área não for passada", async () => {
      (indicadorRepository.findAll as jest.Mock).mockResolvedValue(
        mockIndicadores
      );

      const result = await indicadorService.listarTodos();

      expect(indicadorRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockIndicadores);
    });

    it("deve retornar apenas indicadores da área especificada", async () => {
      const area = "VALORES" as AreaIndicadorEnum;
      const filtrados = mockIndicadores.filter((i) => i.area === area);
      (indicadorRepository.findAll as jest.Mock).mockResolvedValue(filtrados);

      const result = await indicadorService.listarTodos(area);

      expect(indicadorRepository.findAll).toHaveBeenCalledWith(area);
      expect(result).toEqual(filtrados);
    });
  });

  describe("buscarPorId", () => {
    it("deve retornar o indicador quando encontrado", async () => {
      const indicador = mockIndicadores[0];
      (indicadorRepository.findById as jest.Mock).mockResolvedValue(indicador);

      const result = await indicadorService.buscarPorId(indicador.id);

      expect(indicadorRepository.findById).toHaveBeenCalledWith(indicador.id);
      expect(result).toEqual(indicador);
    });

    it("deve lançar NotFoundError quando o indicador não existir", async () => {
      (indicadorRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(indicadorService.buscarPorId("999")).rejects.toThrow(
        NotFoundError
      );
      expect(indicadorRepository.findById).toHaveBeenCalledWith("999");
    });
  });
});
