// Define the Match model

import type { Info } from "@models/info.model";

//  Define the MatchParticipants model
export interface MatchParticipants {
  match_id: string;
  game_id: string;
  user_ids: string[];
}

// Define el modelo para unirte a un match con el metodo post
export interface JoinMatch {
  bet_amount?: number;
}

// define la respuesta de una creacion de match (creacion de match, finalizacion de match, join match)
export interface Match {
  base_bet_amount: number;
  created_at: string | Date; // ISO date string
  created_by_id: string;
  game_id: string;
  match_id: string;
  odds_for_match: number;
  participant_ids: string[];
  updated_at: string; // ISO date string
  winner_id: string;
}

// Define el modelo para finalizar un match con el metodo put
export interface FinishMatch {
  participants: {
    user_id: string;
    score: number;
  }[];
}

// Define el modelo para el metodo post crear match
export interface CreateMatch {
  base_bet_amount: number;
}

export interface MatchResponse {
  info: Info;
  results: Match[];
}
