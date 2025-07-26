import type { Pagination } from "@models/paguination";

export interface PaguinationMatch extends Pagination {
  search?: string;
  user_email?: string;
  min_base_bet_amount?: number;
  max_base_bet_amount?: number;
  created_before?: string;
  created_after?: string;
}
