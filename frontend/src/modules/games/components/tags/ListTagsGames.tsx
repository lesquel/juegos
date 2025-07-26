import React, { memo, useMemo } from "react";
import { GameClientData } from "@modules/games/services/gameClientData";
import { CardTagsGame } from "./CardTagsGame";
import { Box, Clock, Play } from "lucide-react";

interface ListTagsGamesProps {
  categoryId: string;
}

export const ListTagsGames: React.FC<ListTagsGamesProps> = memo(
  ({ categoryId }) => {
    const { data, isLoading, error } =
      GameClientData.getGamesByCategoryId(categoryId);

    const resultsCount = data?.results?.length ?? 0;

    const isPlural = resultsCount !== 1;
    const juegosTexto = isPlural ? "juegos" : "juego";
    const encontradosTexto = isPlural ? "encontrados" : "encontrado";

    const resultsLabel =
      resultsCount > 0
        ? `${resultsCount} ${juegosTexto} ${encontradosTexto}`
        : "Explorando categoría";

    // Memoizar estado de carga
    const loadingState = useMemo(
      () => (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <span className="ml-3 text-white text-lg">Cargando juegos...</span>
        </div>
      ),
      []
    );

    // Memoizar estado de error
    const errorState = useMemo(() => {
      if (!error) return null;

      return (
        <div className="text-center py-12">
          <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-6 max-w-md mx-auto">
            <Clock className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-red-400 font-semibold text-lg mb-2">
              Error al cargar
            </h3>
            <p className="text-red-300">{error.message}</p>
          </div>
        </div>
      );
    }, [error]);

    // Memoizar estado vacío
    const emptyState = useMemo(
      () => (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <Box className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No hay juegos disponibles
          </h3>
          <p className="text-gray-400">
            Esta categoría aún no tiene juegos publicados.
          </p>
        </div>
      ),
      []
    );

    // Memoizar grid de juegos
    const gamesGrid = useMemo(() => {
      if (!data?.results?.length) return emptyState;

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.results.map((game) => (
            <CardTagsGame key={game.game_id} game={game} />
          ))}
        </div>
      );
    }, [data?.results, emptyState]);

    if (isLoading) return loadingState;
    if (error) return errorState;

    return (
      <section className="space-y-6">
        <header className="flex items-center gap-4">
          <Play className="h-8 w-8 text-teal-400" />
          <div>
            <h2 className="text-3xl font-bold text-white">
              Juegos Disponibles
            </h2>
            <p className="text-gray-400 mt-1">{resultsLabel}</p>
          </div>
        </header>

        {gamesGrid}
      </section>
    );
  }
);

ListTagsGames.displayName = "ListTagsGames";
