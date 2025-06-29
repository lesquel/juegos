import type { C } from "node_modules/tailwindcss/dist/resolve-config-QUZ9b-Gn.d.mts";
import type { CommentGame } from "../models/comment-game.model";
import { CardCommentGame } from "./CardCommentGame";

export const ListCommentGame = ({
  commentGames,
}: {
  commentGames?: CommentGame[];
}) => {
  if (!commentGames || commentGames.length === 0) {
    return <div>No hay comentarios</div>;
  }
  return (
    <div>
      <h3>Comentarios</h3>
      {commentGames?.map((commentGame: CommentGame) => (
        <CardCommentGame
          key={commentGame.comment_game_id}
          commentGame={commentGame}
        />
      ))}
    </div>
  );
};
