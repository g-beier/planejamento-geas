import { AppError } from "./AppError";

/**
 * Erro 400 - dados inválidos
 */
export class ValidationError extends AppError {
  constructor(message = "Dados inválidos.") {
    super(message, 400);
  }
}

/**
 * Erro 404 - recurso não encontrado
 */
export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado.") {
    super(message, 404);
  }
}

/**
 * Erro 403 - acesso negado
 */
export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado.") {
    super(message, 403);
  }
}

/**
 * Erro 401 - autenticação necessária
 */
export class UnauthorizedError extends AppError {
  constructor(message = "Autenticação necessária.") {
    super(message, 401);
  }
}

/**
 * Erro 409 - conflito de dados (duplicação, etc.)
 */
export class ConflictError extends AppError {
  constructor(message = "Conflito de dados.") {
    super(message, 409);
  }
}
