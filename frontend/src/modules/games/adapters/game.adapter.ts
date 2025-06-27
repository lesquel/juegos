import { InfoAdapter } from "@adapters/info.adapter";
import type { Game, GameList } from "../models/game.model";

export class GameAdapter {
  public static adapt(game: any): Game {
    return {
      game_id: game.game_id,
      game_name: game.game_name,
      game_img: game.game_img,
      game_url: game.game_url,
      game_description: game.game_description,
      create_at: new Date(game.create_at),
      update_at: new Date(game.update_at),
    };
  }

  public static adaptList(games: any): GameList {
    return {
      info: InfoAdapter.adapt(games.info),
      results: games.results.map((game: any) => this.adapt(game)),
    };
  }
}
