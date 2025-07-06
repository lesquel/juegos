import type { CommentGame } from "../models/comment-game.model";
import { CardCommentGame } from "./CardCommentGame";

const NewCommentForm = () => (
  <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 border border-gray-700">
    <h3 className="text-xl font-bold text-white mb-4">Deja tu Comentario</h3>
    <div className="flex items-start space-x-4">
      <div className="flex-1">
        <textarea 
          placeholder="Escribe tu opinión sobre este juego..."
          className="w-full h-24 p-3 bg-gray-700 text-white rounded-lg placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
        ></textarea>
        <button className="mt-3 w-full sm:w-auto float-right bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out">
          Publicar Comentario
        </button>
      </div>
    </div>
  </div>
);

export const ListCommentGame = ({ commentGames }: { commentGames?: CommentGame[] }) => {
  return (
    <div className="w-full flex flex-col gap-8 container mx-auto px-6 bg-gray-800 py-6 md:py-20 mt-10 rounded-2xl lg:max-w-4xl">
      <NewCommentForm />
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Comentarios Recientes</h3>
        {(!commentGames || commentGames.length === 0) ? (
          <div className="text-center text-gray-400 py-8 bg-gray-800 bg-opacity-50 rounded-2xl">
            <p>Aún no hay comentarios. ¡Sé el primero en opinar!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {commentGames.map((commentGame: CommentGame) => (
              <CardCommentGame
                key={commentGame.comment_game_id}
                commentGame={commentGame}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};