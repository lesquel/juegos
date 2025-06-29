
import type {
  CategoryGame,
  CategoryGameDetail,
  CategoryGameList,
} from "../models/category-game.model";

export class CategoryGameGameAdapter {
  public static adapt(categoryGame: any): CategoryGame {
    return {
      category_id: categoryGame.category_id,
      category_name: categoryGame.category_name,
      category_img: categoryGame.category_img,
      category_description: categoryGame.category_description,
      status: categoryGame.status,
      created_at: new Date(categoryGame.created_at),
      updated_at: new Date(categoryGame.updated_at),
    };
  }

  public static adaptDetail(categoryGame: any): CategoryGameDetail {
    return {
      category_id: categoryGame.category_id,
      category_name: categoryGame.category_name,
      category_img: categoryGame.category_img,
      category_description: categoryGame.category_description,
      status: categoryGame.status,
      created_at: new Date(categoryGame.created_at),
      updated_at: new Date(categoryGame.updated_at),
    };
  }

  public static adaptList(categoryGames: any): CategoryGameList {
    return {
      info: categoryGames.info,
      results: categoryGames.results.map((categoryGame: any) =>
        this.adapt(categoryGame)
      ),
    };
  }
}
