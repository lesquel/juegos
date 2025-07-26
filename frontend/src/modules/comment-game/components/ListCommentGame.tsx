import React, { memo, useMemo } from "react";
import type { CommentGame } from "../models/comment-game.model";
import { CommentGameDataClient } from "../services/commentGameDataClient";
import { useHasMountedComment } from "../store/hasMountedComment";
import { CardCommentGame } from "./CardCommentGame";
import { LoadingComponent } from "@components/LoadingComponent";

interface ListCommentGameProps {
  gameId: string;
}

export const ListCommentGame: React.FC<ListCommentGameProps> = memo(({ gameId }) => {
  const hasMounted = useHasMountedComment((state) => state.hasMounted);
  const { data, isLoading, error } = CommentGameDataClient.getCommentGames(
    gameId,
    // hasMounted
  );

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return (
      <div className="text-center bg-red-900 bg-opacity-50 p-6 rounded-lg border border-red-600 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-red-400 mb-2">Error al cargar comentarios</h3>
        <p className="text-red-300">{error.message}</p>
      </div>
    );
  }, [error]);

  // Memoizar estado vacío
  const emptyState = useMemo(() => (
    <section className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">
        Sé el primero en comentar
      </h3>
      <p className="text-gray-400 max-w-md mx-auto">
        ¡Comparte tu experiencia con este juego! Tu opinión ayuda a otros jugadores a decidir.
      </p>
    </section>
  ), []);

  // Memoizar icono de comentarios
  const commentsIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-teal-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2-5V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586"
      />
    </svg>
  ), []);

  // Memoizar lista de comentarios
  const commentsList = useMemo(() => {
    if (!data?.results || data.results.length === 0) {
      return emptyState;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl w-full">
        {data.results.map((commentGame: CommentGame) => (
          <CardCommentGame
            key={commentGame.review_id}
            commentGame={commentGame}
          />
        ))}
      </div>
    );
  }, [data?.results, emptyState]);

  // Memoizar título con contador
  const titleWithCount = useMemo(() => {
    const count = data?.results?.length || 0;
    return (
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white flex items-center justify-center gap-4">
          {commentsIcon}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400">
            Comentarios
          </span>
        </h1>
        {count > 0 && (
          <p className="text-gray-400 text-lg">
            {count} {count === 1 ? 'comentario' : 'comentarios'}
          </p>
        )}
      </header>
    );
  }, [data?.results?.length, commentsIcon]);

  if (isLoading) return <LoadingComponent />;
  if (error) return errorMessage;

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-10 flex flex-col items-center">
        {titleWithCount}
        {commentsList}
      </div>
    </main>
  );
});

ListCommentGame.displayName = "ListCommentGame";
