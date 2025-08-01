import type { CategoryGame } from "@modules/category-game/models/category-game.model";
import type { Info } from "@models/info.model";

export enum GameType {
  offline = "offline",
  online = "online",
  luck = "luck",
}

export interface GameDetail {
  game_id: string;
  game_name: string;
  game_img: string;
  game_url: string;
  game_description: string;
  create_at: Date;
  update_at: Date;
  house_odds: number;
  categories?: CategoryGame[];
  game_type: GameType;
  game_capacity?: number;
}

export interface Game extends Omit<GameDetail, "categories"> { }

export interface GameList {
  info: Info;
  results: Game[];
}
