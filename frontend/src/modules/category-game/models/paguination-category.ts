import type { Pagination } from "@models/paguination";

export interface PaguinationCategory extends Pagination {
  page: number;
  limit: number;
}
