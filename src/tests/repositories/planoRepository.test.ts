import { planoRepository } from "@repositories";
import { db } from "@infra/db";
import { NovoPlano } from "@types";

jest.mock("@infra/db", () => ({
  db: {
    selectFrom: jest.fn(),
    insertInto: jest.fn(),
    updateTable: jest.fn(),
    deleteFrom: jest.fn(),
  },
}));

describe("planoRepository", () => {
  const mockExecute = jest.fn();
  const mockExecuteTakeFirst = jest.fn();
  const mockExecuteTakeFirstOrThrow = jest.fn();
  const mockWhere = jest.fn();
  const mockSelectAll = jest.fn();
  const mockValues = jest.fn();
  const mockReturningAll = jest.fn();
  const mockSet = jest.fn();

  beforeEach(() => {
    // jest.clearAllMocks();

    (db.selectFrom as jest.Mock).mockReturnValue({
      selectAll: mockSelectAll.mockReturnThis(),
      where: mockWhere.mockReturnThis(),
      execute: mockExecute,
      executeTakeFirst: mockExecuteTakeFirst,
    });

    (db.insertInto as jest.Mock).mockReturnValue({
      values: mockValues.mockReturnThis(),
      returningAll: mockReturningAll.mockReturnThis(),
      executeTakeFirstOrThrow: mockExecuteTakeFirstOrThrow,
    });

    (db.updateTable as jest.Mock).mockReturnValue({
      set: mockSet.mockReturnThis(),
      where: mockWhere.mockReturnThis(),
      returningAll: mockReturningAll.mockReturnThis(),
      executeTakeFirst: mockExecuteTakeFirst,
    });

    (db.deleteFrom as jest.Mock).mockReturnValue({
      where: mockWhere.mockReturnThis(),
      executeTakeFirst: mockExecuteTakeFirst,
    });
  });

  const id = crypto.randomUUID();

  const mockPlanos = [
    {
      id: crypto.randomUUID(),
      titulo: "Plano de grupo",
      ano: 2025,
      criado_em: "2025-10-16",
    },
  ];

  const mockPlano = {
    titulo: "Plano de grupo",
    ano: 2025,
  };

  describe("findAll", () => {
    it("deve retornar todos os planos", async () => {
      mockExecute.mockResolvedValue(mockPlanos);

      const result = await planoRepository().findAll();

      expect(db.selectFrom).toHaveBeenCalledWith("plano");
      expect(mockExecute).toHaveBeenCalled();
      expect(result).toEqual(mockPlanos);
      expect(mockWhere).not.toHaveBeenCalled();
    });
  });
  describe("findById", () => {
    it("deve retornar um plano quando encontrado", async () => {
      mockExecuteTakeFirst.mockResolvedValue(mockPlanos[0]);

      const result = await planoRepository().findById(id);

      expect(db.selectFrom).toHaveBeenCalledWith("plano");
      expect(mockExecuteTakeFirst).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalledWith("id", "=", id);
      expect(result).toEqual(mockPlanos[0]);
    });
    it("deve retornar null quando o plano não for encontrado", async () => {
      mockExecuteTakeFirst.mockResolvedValue(undefined);

      const result = await planoRepository().findById(id);

      expect(db.selectFrom).toHaveBeenCalledWith("plano");
      expect(mockExecuteTakeFirst).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalledWith("id", "=", id);
      expect(result).toEqual(null);
    });
  });
  describe("create", () => {
    it("deve retornar o plano criado", async () => {
      const id = crypto.randomUUID();

      mockExecuteTakeFirstOrThrow.mockResolvedValue({
        ...mockPlano,
        id,
        arquivado: false,
        criado_em: "2025-10-15",
      });

      const result = await planoRepository().create(mockPlano);

      expect(db.insertInto).toHaveBeenCalledWith("plano");
      expect(mockValues).toHaveBeenCalledWith({
        arquivado: false,
        ...mockPlano,
      });
      expect(mockReturningAll).toHaveBeenCalled();
      expect(mockExecuteTakeFirstOrThrow).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockPlano,
        id,
        criado_em: "2025-10-15",
        arquivado: false,
      });
    });

    it("deve lançar um erro NoResultError em caso de falha", async () => {
      mockExecuteTakeFirstOrThrow.mockRejectedValue(new Error());

      expect(
        planoRepository().create(mockPlano as NovoPlano)
      ).rejects.toThrow();

      expect(db.insertInto).toHaveBeenCalledWith("plano");
      expect(mockValues).toHaveBeenCalledWith({
        arquivado: false,
        ...mockPlano,
      });
      expect(mockReturningAll).toHaveBeenCalled();
      expect(mockExecuteTakeFirstOrThrow).toHaveBeenCalled();
    });
  });
  describe("update", () => {
    it("deve retornar o plano atualizado, caso exista", async () => {
      mockExecuteTakeFirst.mockResolvedValue(mockPlanos[0]);

      const result = await planoRepository().update(id, mockPlano);

      expect(db.updateTable).toHaveBeenCalledWith("plano");
      expect(mockSet).toHaveBeenCalledWith(mockPlano);
      expect(mockWhere).toHaveBeenCalledWith("id", "=", id);
      expect(mockReturningAll).toHaveBeenCalled();
      expect(result).toEqual(mockPlanos[0]);
    });

    it("deve retornar null, caso não exista", async () => {
      mockExecuteTakeFirst.mockResolvedValue(undefined);

      const result = await planoRepository().update(id, mockPlano);

      expect(db.updateTable).toHaveBeenCalledWith("plano");
      expect(mockSet).toHaveBeenCalledWith(mockPlano);
      expect(mockWhere).toHaveBeenCalledWith("id", "=", id);
      expect(mockReturningAll).toHaveBeenCalled();
      expect(result).toEqual(null);
    });
  });
  describe("remove", () => {
    it("deve retornar true quando um plano é removido", async () => {
      mockExecuteTakeFirst.mockResolvedValue({ numDeletedRows: 1 });

      const id = crypto.randomUUID();
      const result = await planoRepository().remove(id);

      expect(db.deleteFrom).toHaveBeenCalledWith("plano");
      expect(mockWhere).toHaveBeenCalledWith("id", "=", id);
      expect(mockExecuteTakeFirst).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it("deve retornar false quando um plano não é encontrado", async () => {
      mockExecuteTakeFirst.mockResolvedValue({ numDeletedRows: 0 });

      const id = crypto.randomUUID();
      const result = await planoRepository().remove(id);

      expect(db.deleteFrom).toHaveBeenCalledWith("plano");
      expect(mockWhere).toHaveBeenCalledWith("id", "=", id);
      expect(mockExecuteTakeFirst).toHaveBeenCalled();
      expect(result).toEqual(false);
    });
  });
});
