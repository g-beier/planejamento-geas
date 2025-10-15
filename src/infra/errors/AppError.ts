/**
 * Classe base para todos os erros da aplicação.
 * Inclui um código HTTP e uma mensagem amigável.
 */
export class AppError extends Error {
  public readonly status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
