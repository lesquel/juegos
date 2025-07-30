import React, { memo, useMemo } from "react";
import type { CommentGame } from "../models/comment-game.model";
import { useCommentGames } from "../services/commentGameDataClient";
import { CardCommentGame } from "./CardCommentGame";
import { LoadingComponent } from "@components/LoadingComponent";
import { MessageCircleCode, MessageCircleMore } from "lucide-react";

interface ListCommentGameProps {
  gameId: string;
}

export const ListCommentGame: React.FC<ListCommentGameProps> = memo(
  ({ gameId }) => {
    const { data, isLoading, error } = useCommentGames(gameId);

    // Memoizar mensaje de error
    const errorMessage = useMemo(() => {
      if (!error) return null;
      return (
        <div className="text-center bg-red-500/10 backdrop-blur-md border border-red-400/30 p-8 rounded-2xl max-w-md mx-auto">
          <h3 className="text-xl font-bold text-red-400 mb-3">
            Error al cargar comentarios
          </h3>
          <p className="text-red-300">{error.message}</p>
        </div>
      );
    }, [error]);

    // Memoizar estado vacío
    const emptyState = useMemo(
      () => (
        <section className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <MessageCircleMore className="h-12 w-12 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Sé el primero en comentar
          </h3>
          <p className="text-gray-300 max-w-md mx-auto text-lg">
            ¡Comparte tu experiencia con este juego! Tu opinión ayuda a otros
            jugadores a decidir.
          </p>
        </section>
      ),
      []
    );

    // Memoizar icono de comentarios
    const commentsIcon = useMemo(
      () => <MessageCircleCode className="h-7 w-7 text-cyan-400" />,
      []
    );

    // Memoizar lista de comentarios
    const commentsList = useMemo(() => {
      if (!data?.results || data.results.length === 0) {
        return emptyState;
      }

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
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
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              {commentsIcon}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Comentarios
            </h1>
          </div>
          {count > 0 && (
            <p className="text-gray-300 text-lg">
              {count} {count === 1 ? "comentario" : "comentarios"}
            </p>
          )}
        </header>
      );
    }, [data?.results?.length, commentsIcon]);

    if (isLoading) return <LoadingComponent />;
    if (error) return errorMessage;

    return (
      <section className="relative">
        <div className="px-4 py-12 flex flex-col items-center max-w-6xl mx-auto">
          {titleWithCount}
          {commentsList}
        </div>
      </section>
    );
  }
);

ListCommentGame.displayName = "ListCommentGame";
