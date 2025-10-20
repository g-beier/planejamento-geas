import { DB } from "@infra/db";
import { Selectable } from "kysely";

export type IndicadorTable = DB["indicador"];
export type Indicador = Selectable<IndicadorTable>;
