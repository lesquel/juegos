import type { Match } from "@modules/games/models/match.model";
import { UserClientData } from "@modules/user/services/userClientData";

export const CardMatch = ({ match }: { match: Match }) => {
  const {} = UserClientData.getUser(match.created_by_id);
  return (
    <li key={match.match_id} className="border-b border-gray-700">
      <div> Game ID: {match.game_id}</div>
      <div>{match.participant_ids}</div>
      <div>{match.winner_id}</div>
      <div>{match.base_bet_amount}</div>
      <div>{match.odds_for_match}</div>
      <div>{match.created_by_id}</div>
      <div> Created At: {match.created_at}</div>
    </li>
  );
};
