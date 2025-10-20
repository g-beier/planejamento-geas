import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  ConflictError,
} from "@infra/errors/errorTypes";
import { AppError } from "@infra/errors/AppError";

describe("errorTypes", () => {
  const testCases = [
    {
      ErrorClass: ValidationError,
      expectedStatus: 400,
      defaultMessage: "Dados inválidos.",
    },
    {
      ErrorClass: NotFoundError,
      expectedStatus: 404,
      defaultMessage: "Recurso não encontrado.",
    },
    {
      ErrorClass: ForbiddenError,
      expectedStatus: 403,
      defaultMessage: "Acesso negado.",
    },
    {
      ErrorClass: UnauthorizedError,
      expectedStatus: 401,
      defaultMessage: "Autenticação necessária.",
    },
    {
      ErrorClass: ConflictError,
      expectedStatus: 409,
      defaultMessage: "Conflito de dados.",
    },
  ];

  testCases.forEach(({ ErrorClass, expectedStatus, defaultMessage }) => {
    describe(ErrorClass.name, () => {
      it("deve herdar de AppError e ter o nome correto", () => {
        const error = new ErrorClass();
        expect(error).toBeInstanceOf(AppError);
        expect(error.name).toBe(ErrorClass.name); // ✅ cada classe mantém seu próprio nome
      });

      it("deve ter status e mensagem padrão corretos", () => {
        const error = new ErrorClass();
        expect(error.status).toBe(expectedStatus);
        expect(error.message).toBe(defaultMessage);
      });

      it("deve permitir mensagem customizada", () => {
        const customMessage = "Mensagem personalizada";
        const error = new ErrorClass(customMessage);
        expect(error.message).toBe(customMessage);
        expect(error.status).toBe(expectedStatus);
      });
    });
  });
});
