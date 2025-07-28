import type {
  Match,
  MatchParticipants,
  MatchResponse,
  CreateMatch,
  FinishMatch,
  JoinMatch,
} from "../models/match.model";
import { InfoAdapter } from "@adapters/info.adapter";

export class MatchAdapter {
  /**
   * Adapta un objeto crudo a un Match
   */
  public static adapt(match: any): Match {
    return {
      base_bet_amount: match.base_bet_amount,
      created_at: new Date(match.created_at),
      created_by_id: match.created_by_id,
      game_id: match.game_id,
      match_id: match.match_id,
      odds_for_match: match.odds_for_match,
      participant_ids: match.participant_ids,
      updated_at: match.updated_at,
      winner_id: match.winner_id,
    };
  }

  /**
   * Adapta un array de objetos crudos a un MatchResponse
   */
  public static adaptList(matchList: any): MatchResponse {
    return {
      info: InfoAdapter.adapt(matchList.info),
      results: matchList.results.map((match: any) => this.adapt(match)),
    };
  }

  /**
   * Adapta datos crudos a un MatchParticipants
   */
  public static adaptParticipants(data: any): MatchParticipants {
    return {
      match_id: data.match_id,
      game_id: data.game_id,
      user_ids: data.user_ids,
    };
  }

  /**
   * Adapta datos para enviar al crear un match
   */
  public static toCreateMatchPayload(data: CreateMatch): any {
    return {
      base_bet_amount: data.base_bet_amount,
    };
  }

  /**
   * Adapta datos para enviar al hacer join a un match
   */
  public static toJoinMatchPayload(data: JoinMatch): any {
    return {
      bet_amount: data.bet_amount,
    };
  }

  /**
   * Adapta datos para finalizar un match
   */
  public static toFinishMatchPayload(data: FinishMatch): any {
    return {
      participants: data.participants.map((p) => ({
        user_id: p.user_id,
        score: p.score,
      })),
    };
  }
}
