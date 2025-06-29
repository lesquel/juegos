export interface CommentGameCreate {
  comment_game_content: string;
  game_id: number;
  user_id: number;
}

export interface CommentGame extends CommentGameCreate {
  comment_game_id: number;
  create_at: Date;
  update_at: Date;
}
