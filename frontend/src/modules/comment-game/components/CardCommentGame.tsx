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
    <div className="flex items-start space-x-4 p-4">
      {comment_game_id && (
        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
          {comment_game_id} {/* Aca deberia de ser la imagen del user, pero dudo que haya eso, entonces ya pues, toco el id del comentario */}
        </div> 
      )}

      {/* Contenido del comentario */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-900 text-base mb-2">
          {comment_game_content}
        </p>
        <span className="text-gray-600 text-sm block mb-1">
          <strong>Creado por: </strong>
          {user_id}
        </span>
        <span className="text-gray-600 text-sm min-w-2.5 flex items-center gap-0.5">
          {/* Icono de reloj SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 inline-block align-middle mr-1 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {new Date(create_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};
