import type { CategoryGame } from "@modules/category-game/models/category-game.model";
import type { Info } from "src/models/info.model";

export interface GameDetail {
  game_id: number;
  game_name: string;
  game_img: string;
  game_url: string;
  game_description: string;
  create_at: Date;
  update_at: Date;
  categories?: CategoryGame[];
}

export interface Game extends Omit<GameDetail, "categories"> {}

export interface GameList {
  info: Info;
  results: Game[];
}
