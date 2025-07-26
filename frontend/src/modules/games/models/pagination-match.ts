import type { Pagination } from "@models/pagination";

export interface PaginationMatch extends Pagination {
  search?: string;
  user_email?: string;
  min_base_bet_amount?: number;
  max_base_bet_amount?: number;
  created_before?: string;
  created_after?: string;
}
