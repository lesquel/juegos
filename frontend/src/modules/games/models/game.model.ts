import type { Info } from "src/models/info.model";

export interface Game {
  game_id: number;
  game_name: string;
  game_img: string;
  game_url: string;
  game_description: string;
  create_at: Date;
  update_at: Date;
}

export interface GameList {
  info: Info;
  results: Game[];
}