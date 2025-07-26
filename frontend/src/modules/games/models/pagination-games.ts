import type { Pagination } from "@models/pagination";

export interface PaginationGames extends Pagination {
    search?: string;
    game_name?: string;
    game_description?: string;
    game_type?: string;
    category_name?: string;
    created_before?: string;
    created_after?: string;
    status?: string;
    user_id?: string;
}
