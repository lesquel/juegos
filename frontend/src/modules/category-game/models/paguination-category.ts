import type { Pagination } from "@models/paguination";

export interface PaguinationCategory extends Pagination {
  search?: string;
  category_name?: string;
  category_description?: string;
  status?: string;
  created_before?: string;
  created_after?: string;
}
