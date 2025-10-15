export interface Plano {
  /** Identificador único do plano (UUID) */
  id: string | null;

  /** Título do plano de grupo */
  titulo: string;

  /** Ano de referência do plano */
  ano: number;

  /** Data limite de execução (formato ISO: YYYY-MM-DD) */
  prazo_final: string;

  /** Data de criação (gerada automaticamente) */
  criado_em: string | null;
}

/**
 * Tipagem para criação de novos planos (entrada da API)
 */
export type PlanoCreateInput = Omit<Plano, "id" | "criado_em">;

/**
 * Tipagem para atualização de planos existentes (entrada da API)
 */
export type PlanoUpdateInput = Partial<PlanoCreateInput>;
