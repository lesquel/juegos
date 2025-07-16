import { useState } from "react";
import type { CommentGame } from "../models/comment-game.model";
import { CommentGameDataClient } from "../services/commentGameDataClient";
import { CardCommentGame } from "./CardCommentGame";
export const ListCommentGame = ({
  gameId,
  hasMounted,
}: {
  gameId: string;
  hasMounted: boolean;
}) => {
  const { data, isLoading, error } = CommentGameDataClient.getCommentGames(
    gameId,
    hasMounted
  );

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );

  if (!data?.results || data.results.length === 0)
    return (
      <div>
        <h1 className="text-center text-white">No hay comentarios</h1>
      </div>
    );
  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400">
            Comentarios
          </span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {data?.results.map((commentGame: CommentGame) => (
            <CardCommentGame
              key={commentGame.review_id}
              commentGame={commentGame}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
