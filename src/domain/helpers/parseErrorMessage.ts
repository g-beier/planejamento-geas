export function parseErrorMessage(
  error: unknown,
  fallback = "Erro interno"
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  ) {
    return error.message as string;
  }

  return fallback;
}
