import type { CategoryGame } from "@modules/category-game/models/category-game.model";
import type { CommentGame } from "@modules/comment-game/models/comment-game.model";
import type { Info } from "@models/info.model";

export interface GameDetail {
  game_id: number;
  game_name: string;
  game_img: string;
  game_url: string;
  game_description: string;
  create_at: Date;
  update_at: Date;
  categories?: CategoryGame[];
  comments?: CommentGame[];
}

export interface Game extends Omit<GameDetail, "categories" | "comments"> {}

export interface GameList {
  info: Info;
  results: Game[];
}
