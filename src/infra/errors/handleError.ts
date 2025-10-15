import { AppError } from "./AppError";

/**
 * Traduz exceções em respostas HTTP adequadas
 * para uso nas rotas Next.js.
 */
export function handleError(error: unknown): Response {
  if (error instanceof AppError) {
    return Response.json(
      { error: error.message, type: error.name },
      { status: error.status }
    );
  }

  // Erros de validação JSON mal-formado, etc.
  if (error instanceof SyntaxError) {
    return Response.json(
      { error: "Corpo da requisição inválido (JSON mal-formado)." },
      { status: 400 }
    );
  }

  console.error("Erro não tratado:", error);
  return Response.json({ error: "Erro interno do servidor." }, { status: 500 });
}
