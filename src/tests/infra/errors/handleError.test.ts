import { handleError } from "@infra/errors/handleError";
import { AppError } from "@infra/errors/AppError";

describe("handleError", () => {
  const mockConsoleError = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar uma resposta JSON adequada para AppError", async () => {
    const error = new AppError("Recurso não encontrado", 404);
    const response = handleError(error);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body).toEqual({
      error: "Recurso não encontrado",
      type: "AppError",
    });
  });

  it("deve retornar 400 para SyntaxError", async () => {
    const error = new SyntaxError("Unexpected token");
    const response = handleError(error);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("JSON mal-formado");
  });

  it("deve retornar 500 para erros genéricos e logar o erro", async () => {
    const error = new Error("Erro inesperado");
    const response = handleError(error);

    expect(response.status).toBe(500);
    expect(mockConsoleError).toHaveBeenCalledWith("Erro não tratado:", error);

    const body = await response.json();
    expect(body.error).toBe("Erro interno do servidor.");
  });
});
