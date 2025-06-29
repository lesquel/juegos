import type { CommentGame } from "../models/comment-game.model";

export const CardCommentGame = ({
  commentGame,
}: {
  commentGame: CommentGame;
}) => {
  const {
    comment_game_id,
    comment_game_content,
    game_id,
    user_id,
    create_at,
    update_at,
  } = commentGame;
  return (
    <div>
      <p>{comment_game_content}</p>

      <span>
        <strong>Creado por: </strong>
        {user_id}
      </span>
      <span>
        <strong>Creado el: </strong>
        {create_at.toString()}
      </span>
      <span>
        <strong>Actualizado el: </strong>
        {update_at.toString()}
      </span>
    </div>
  );
};
