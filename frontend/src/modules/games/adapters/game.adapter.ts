import { InfoAdapter } from "@adapters/info.adapter";
import type { Game, GameDetail, GameList } from "../models/game.model";
import { CategoryGameGameAdapter } from "@modules/category-game/adapters/category-game.adapter";
import { CommentGameAdapter } from "@modules/comment-game/adapters/comment-game.adapter";

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

  public static adaptDetail(game: any): GameDetail {
    return {
      game_id: game.game_id,
      game_name: game.game_name,
      game_img: game.game_img,
      game_url: game.game_url,
      game_description: game.game_description,
      create_at: new Date(game.create_at),
      update_at: new Date(game.update_at),
      categories: game.categorys
        ? game.categorys.map((category: any) =>
            CategoryGameGameAdapter.adapt(category)
          )
        : undefined,
      comments: game.comments
        ? game.comments.map((comment: any) => CommentGameAdapter.adapt(comment))
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
