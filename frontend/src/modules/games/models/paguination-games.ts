import type { Pagination } from "@models/paguination";

export interface PaguinationGames extends Pagination {
  search?: string;
  game_name?: string;
  game_description?: string;
  game_type?: string;
  created_before?: string;
  created_after?: string;
  status?: string;
  user_id?: string;
}
