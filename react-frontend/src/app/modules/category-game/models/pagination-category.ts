import type { Pagination } from "@models/pagination";

export interface PaginationCategory extends Pagination {
  search?: string;
  category_name?: string;
  category_description?: string;
  status?: string;
  created_before?: string;
  created_after?: string;
}
