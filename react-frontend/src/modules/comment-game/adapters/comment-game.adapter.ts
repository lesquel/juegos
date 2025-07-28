import type { CommentGame } from "../models/comment-game.model";

export class CommentGameAdapter {
  public static adapt(commentGame: any): CommentGame {
    return {
      comment_game_id: commentGame.comment_game_id,
      comment_game_content: commentGame.comment_game_content,
      game_id: commentGame.game_id,
      user_id: commentGame.user_id,
      create_at: commentGame.create_at,
      update_at: commentGame.update_at,
    };
  }
}
