import type { PaguinationCategory } from "@modules/category-game/models/paguination-category";
import type { PaguinationGames } from "@modules/games/adapters/paguination-games";

export class PaguinationCategoryAdapter {
  static adaptPaguinationCategory(paguination: PaguinationCategory): string {
    return `?page=${paguination.page}&limit=${paguination.limit}`;
  }
  static adaptPaguinationGames(paguination: PaguinationGames): string {
    return `?page=${paguination.page}&limit=${paguination.limit}`;
  }
}
