import React, { memo, useMemo } from "react";
import type { CommentGame } from "../models/comment-game.model";
import { CommentGameDataClient } from "../services/commentGameDataClient";
import { CardCommentGame } from "./CardCommentGame";
import { LoadingComponent } from "@components/LoadingComponent";
import { MessageCircleCode, MessageCircleMore } from "lucide-react";

interface ListCommentGameProps {
  gameId: string;
}

export const ListCommentGame: React.FC<ListCommentGameProps> = memo(
  ({ gameId }) => {
    const { data, isLoading, error } = CommentGameDataClient.getCommentGames(
      gameId
    );

    // Memoizar mensaje de error
    const errorMessage = useMemo(() => {
      if (!error) return null;
      return (
        <div className="text-center bg-red-900 bg-opacity-50 p-6 rounded-lg border border-red-600 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-red-400 mb-2">
            Error al cargar comentarios
          </h3>
          <p className="text-red-300">{error.message}</p>
        </div>
      );
    }, [error]);

    // Memoizar estado vacío
    const emptyState = useMemo(
      () => (
        <section className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <MessageCircleMore className="h-10 w-10 text-gray-500" />

          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Sé el primero en comentar
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            ¡Comparte tu experiencia con este juego! Tu opinión ayuda a otros
            jugadores a decidir.
          </p>
        </section>
      ),
      []
    );

    // Memoizar icono de comentarios
    const commentsIcon = useMemo(
      () => <MessageCircleCode className="h-6 w-6 text-teal-400" />,
      []
    );

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
              {count} {count === 1 ? "comentario" : "comentarios"}
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
  }
);

ListCommentGame.displayName = "ListCommentGame";
