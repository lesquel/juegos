import { InfoAdapter } from "@adapters/info.adapter";
import type { Game, GameDetail, GameList } from "../models/game.model";
import { CategoryGameGameAdapter } from "@modules/category-game/adapters/category-game.adapter";

export class GameAdapter {
  public static adapt(game: any): Game {
    return {
      game_id: game.game_id,
      game_name: game.game_name,
      game_img: game.game_img,
      game_url: game.game_url,
      game_description: game.game_description,
      house_odds: game.house_odds,
      create_at: new Date(game.create_at),
      update_at: new Date(game.update_at),
      game_type: game.game_type,
      game_capacity: game.game_capacity,
    };
  }

  public static adaptDetail(game: any): GameDetail {
    return {
      game_id: game.game_id,
      game_name: game.game_name,
      game_img: game.game_img,
      game_url: game.game_url,
      game_type: game.game_type,
      game_description: game.game_description,
      house_odds: game.house_odds,
      create_at: new Date(game.created_at),
      update_at: new Date(game.updated_at),
      game_capacity: game.game_capacity,
      categories: game.category_ids // Asumiendo que category_ids son los IDs de las categorías
        ? game.category_ids.map((categoryId: string) => ({
            category_id: categoryId,
            category_name: "", // Puedes rellenar esto con una llamada adicional si necesitas el nombre
            category_img: "",
            category_description: "",
          }))
        : undefined,
    };
  }

  public static adaptList(games: any): GameList {
    return {
      info: InfoAdapter.adapt(games.info),
      results: games.results.map((game: any) => this.adapt(game)),
    };
  }
}
