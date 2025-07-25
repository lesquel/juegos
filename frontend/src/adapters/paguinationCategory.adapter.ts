import type { Pagination } from "@models/paguination";
import type { PaguinationCategory } from "@modules/category-game/models/paguination-category";
import type { PaguinationGames } from "@modules/games/adapters/paguination-games";

export class PaguinationCategoryAdapter {
  static adaptPaguinationCategory(paguination: PaguinationCategory): string {
    return `?page=${paguination.page}&limit=${paguination.limit}`;
  }
  static adaptPaguinationGames(paguination: PaguinationGames): string {
    return `?page=${paguination.page}&limit=${paguination.limit}`;
  }
  static adaptPaguination(paguination: Pagination): string {
    return `?page=${paguination.page}&limit=${paguination.limit}&sort_by=${paguination.sort_by}&sort_order=${paguination.sort_order}&search=${paguination.search}&category_id=${paguination.category_id}&created_before=${paguination.created_before}`;
  }
}
