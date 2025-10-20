import { indicadorRepository } from "@repositories";
import { db } from "@infra/db";
import { AreaIndicador } from "@types";

jest.mock("@infra/db", () => ({
  db: {
    selectFrom: jest.fn(),
  },
}));

describe("indicadorRepository", () => {
  const mockExecute = jest.fn();
  const mockExecuteTakeFirst = jest.fn();
  const mockWhere = jest.fn();
  const mockSelectAll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (db.selectFrom as jest.Mock).mockReturnValue({
      selectAll: mockSelectAll.mockReturnThis(),
      where: mockWhere.mockReturnThis(),
      execute: mockExecute,
      executeTakeFirst: mockExecuteTakeFirst,
    });
  });

  describe("findAll", () => {
    it("deve retornar todos os indicadores quando nenhuma área é informada", async () => {
      const mockIndicadores = [
        { id: "001", pergunta: "Pergunta 1", area: "VALORES" },
        { id: "002", pergunta: "Pergunta 2", area: "GESTAO" },
      ];

      mockExecute.mockResolvedValue(mockIndicadores);

      const result = await indicadorRepository.findAll();

      expect(db.selectFrom).toHaveBeenCalledWith("indicador");
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockIndicadores);
      expect(mockWhere).not.toHaveBeenCalled();
    });

    it("deve filtrar os indicadores pela área informada", async () => {
      const area = "gestao";
      const mockIndicadores = [
        { id: "002", pergunta: "Pergunta 2", area: "GESTAO" },
      ];

      mockExecute.mockResolvedValue(mockIndicadores);

      const result = await indicadorRepository.findAll(area);

      expect(db.selectFrom).toHaveBeenCalledWith("indicador");
      expect(mockWhere).toHaveBeenCalledWith(
        "area",
        "=",
        area.toUpperCase() as AreaIndicador
      );
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockIndicadores);
    });
  });

  describe("findById", () => {
    it("deve retornar um indicador quando encontrado", async () => {
      const mockIndicador = {
        id: "001",
        pergunta: "Pergunta 1",
        area: "VALORES",
      };

      mockExecuteTakeFirst.mockResolvedValue(mockIndicador);

      const result = await indicadorRepository.findById("001");

      expect(db.selectFrom).toHaveBeenCalledWith("indicador");
      expect(mockWhere).toHaveBeenCalledWith("id", "=", "001");
      expect(result).toEqual(mockIndicador);
    });

    it("deve retornar null quando o indicador não for encontrado", async () => {
      mockExecuteTakeFirst.mockResolvedValue(undefined);

      const result = await indicadorRepository.findById("999");

      expect(db.selectFrom).toHaveBeenCalledWith("indicador");
      expect(mockWhere).toHaveBeenCalledWith("id", "=", "999");
      expect(result).toBeNull();
    });
  });
});
