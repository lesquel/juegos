import React, { useMemo, memo } from "react";
import { GameClientData } from "../services/gameClientData";
import { CardGame } from "./CardGame";
import type { Game } from "../models/game.model";
import { PaginationComponent } from "@components/PaginationComponent";
import { CardGameSkeleton } from "./CardGameSkeleton";
import { Box, Search } from "lucide-react";
import type { PaginationGames } from "../models/pagination-games";

type GameTab = "offline" | "online";

interface GamesContentProps {
  pagination: PaginationGames;
  onPaginationChange: (newPagination: PaginationGames) => void;
  filterType: GameTab;
}

const GamesContent = memo(({ pagination, onPaginationChange, filterType }: GamesContentProps) => {
  const { data, isLoading, error } = GameClientData.getGames({ ...pagination, game_type: filterType });

  const gameCards = useMemo(() => {
    if (!data?.results) return [];
    return data.results.map((game: Game) => <CardGame key={game.game_id} game={game} />);
  }, [data?.results]);

  const noResultsMessage = useMemo(() => {
    if (data?.results?.length === 0 && pagination.search) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No se encontraron juegos</h3>
          <p className="text-gray-400 mb-6">
            No hay juegos que coincidan con tu búsqueda: <strong>"{pagination.search}"</strong>
          </p>
          <button
            onClick={() => onPaginationChange({ ...pagination, search: "", page: 1 })}
            className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-2 px-4 rounded-lg hover:from-teal-600 hover:to-cyan-500 transition duration-300"
          >
            Limpiar búsqueda
          </button>
        </div>
      );
    }
    return null;
  }, [data?.results?.length, pagination.search, pagination, onPaginationChange]);

  const ListSkeleton = useMemo(
    () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <CardGameSkeleton key={i} />
        ))}
      </div>
    ),
    []
  );

  if (isLoading) return ListSkeleton;

  if (error) {
    return (
      <div className="text-center bg-red-900 bg-opacity-50 p-8 rounded-lg border border-red-600 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Error al cargar juegos</h2>
        <p className="text-red-300 mb-6">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-2 px-4 rounded-lg hover:from-teal-600 hover:to-cyan-500 transition duration-300"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!data?.results || data.results.length === 0) {
    return (
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
          <Box className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No hay juegos disponibles</h3>
        <p className="text-gray-400">Vuelve más tarde para ver nuevos juegos.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        {gameCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{gameCards}</div>
        ) : (
          noResultsMessage
        )}
      </div>

      {data?.results && data.results.length > 0 && (
        <PaginationComponent
          pagination={pagination}
          setPagination={onPaginationChange}
          info={data.info}
          color="bg-gradient-to-r from-teal-500 to-cyan-400"
        />
      )}
    </>
  );
});

GamesContent.displayName = "GamesContent";

export default GamesContent;
