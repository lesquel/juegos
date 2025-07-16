import type { Info } from "@models/info.model";

export interface CommentGameCreate {
  comment: string;
}

export interface CommentGame {
  created_at: Date;
  updated_at: Date;
  review_id: string;
  game_id: string;
  user_id: string;
  rating: 1;
  comment: string;
}

export interface CommentGameList {
  info: Info;
  results: CommentGame[];
}
