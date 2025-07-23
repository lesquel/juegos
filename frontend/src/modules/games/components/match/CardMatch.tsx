import type { Match } from "@modules/games/models/match.model";
import { CardParticipant } from "./CardParticipant";
import { JoinMatch } from "./JoinMatch";
import type { Game } from "@modules/games/models/game.model";

export const CardMatch = ({ match, game }: { match: Match; game: Game }) => {
  return (
    <li className="border-b border-gray-700">
      <div>
        <div> Game ID: {match.game_id}</div>
        <div>
          {match.participant_ids.length > 0 ? (
            match.participant_ids.map((id, key) => (
              <div key={id}>
                User {key + 1}: <CardParticipant id={id} />
              </div>
            ))
          ) : (
            <div>No participants</div>
          )}
        </div>
        {match.winner_id ? (
          <div>
            Winner: <CardParticipant id={match.winner_id} />
          </div>
        ) : (
          <div>No winner</div>
        )}
        <div> Base Bet Amount: {match.base_bet_amount}</div>
        {/* <div>{match.created_by_id}</div> */}
        <div> Odds For Match: {match.odds_for_match}</div>
        <div> Created At: {match.created_at.toLocaleString()}</div>
      </div>
      <div>
        <JoinMatch match={match} game={game} />
      </div>
    </li>
  );
};
