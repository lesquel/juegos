import type { Paguination } from "@models/paguination";

export interface PaguinationCategory extends Paguination {
  page: number;
  limit: number;
}
