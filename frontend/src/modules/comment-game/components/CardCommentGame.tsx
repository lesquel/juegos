import type { CommentGame } from "../models/comment-game.model";

export const CardCommentGame = ({ commentGame }: { commentGame: CommentGame }) => {
  const {
    comment_game_id,
    comment_game_content,
    game_id,
    user_id,
    create_at,
    update_at,
  } = commentGame;
  
  const user = (commentGame as any).user; // Cast to any to access user property if not explicitly in CommentGame interface
  
  const userName = user?.user_name || "Usuario Anónimo";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex items-start space-x-4 p-5 bg-gray-800 bg-opacity-50 rounded-2xl border border-gray-700">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
          {userInitial}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-white">{userName}</h4>
          <span className="text-xs text-gray-400">
            {new Date(create_at).toLocaleDateString("es-ES", {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </span>
        </div>
        <p className="text-gray-300 mt-1">
          {comment_game_content}
        </p>
      </div>
    </div>
  );
};
