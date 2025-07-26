import React, { memo, useState, useCallback, useMemo } from "react";
import { QueryProvider } from "@providers/QueryProvider";
import { LoadingComponent } from "@components/LoadingComponent";
import { PaginationComponent } from "@components/PaginationComponent";
import { MatchClientData } from "@modules/games/services/matchClientData";
import { GameClientData } from "@modules/games/services/gameClientData";
import { CreateMatch } from "./CreateMatch";
import { CardMatch } from "./CardMatch";
import MatchSearchComponent from "./MatchSearchComponent";
import type { Game } from "@modules/games/models/game.model";
import type { PaguinationMatch } from "@modules/games/models/paguination-match";
import type { Info } from "@models/info.model";
import type { SearchFilters } from "@components/SearchComponent";
import { PersonStanding } from "lucide-react";
import { CardMatchSkeleton } from "./CardMatchSkeleton";

// Configuración de paginación por defecto con búsqueda
const DEFAULT_PAGINATION: PaguinationMatch = {
  page: 1,
  limit: 10,
  sort_by: "created_at",
  sort_order: "desc",
  search: "",
};

interface ListMatchesByGameIdProps {
  id: string;
}

export const ListMatchesByGameId: React.FC<ListMatchesByGameIdProps> = memo(
  ({ id }) => {
    return (
      <QueryProvider>
        <UseListMatchesByGameId id={id} />
      </QueryProvider>
    );
  }
);

ListMatchesByGameId.displayName = "ListMatchesByGameId";

const UseListMatchesByGameId: React.FC<{ id: string }> = memo(({ id }) => {
  const [pagination, setPagination] =
    useState<PaguinationMatch>(DEFAULT_PAGINATION);

  // Memoizar función de búsqueda que actualiza la paginación
  const handleSearch = useCallback((filters: SearchFilters) => {
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset a la primera página al buscar
      search: filters.searchTerm,
      sort_by: filters.sortBy || "created_at",
      sort_order: filters.sortOrder || "desc",
      // Mapear filterType a campos específicos según el tipo de búsqueda
      ...(filters.filterType === "user_email" && {
        user_email: filters.searchTerm,
      }),
    }));
  }, []); // Sin dependencias, la función es estable

  // Memoizar función de cambio de paginación
  const handlePaginationChange = useCallback(
    (newPagination: PaguinationMatch) => {
      setPagination(newPagination);
    },
    []
  ); // Sin dependencias, la función es estable

  const {
    data: game,
    isLoading: gameIsLoading,
    error: gameError,
  } = GameClientData.getGameDetail(id);

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    const errorText = gameError?.message;
    if (!errorText) return null;

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center bg-red-900 bg-opacity-50 p-8 rounded-lg border border-red-600 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error al cargar el juego
          </h2>
          <p className="text-red-300 mb-6">{errorText}</p>
          <a
            href="/games"
            className="inline-block bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-2 px-4 rounded-lg hover:from-teal-600 hover:to-cyan-500 transition duration-300"
          >
            Volver a juegos
          </a>
        </div>
      </div>
    );
  }, [gameError]);

  // Memoizar icono
  const matchIcon = useMemo(
    () => <PersonStanding className="h-8 w-8 text-teal-400" />,
    []
  );

  if (gameIsLoading) return <LoadingComponent />;
  if (gameError) return errorMessage;

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                {matchIcon}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Partidas de {game?.game_name}
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Únete a una partida existente o crea la tuya propia
                  </p>
                </div>
              </div>
              <CreateMatch gameId={id} game={game as Game} />
            </div>
          </header>

          {/* Search Component - Separado y estable */}
          <section className="mb-8">
            <MatchSearchComponent onSearch={handleSearch} />
          </section>

          {/* Matches Content - Componente separado que se actualiza independientemente */}
          <MatchesContent
            gameId={id}
            game={game as Game}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
          />
        </div>
      </div>
    </main>
  );
});

// Componente separado para el contenido que cambia
const MatchesContent = memo(
  ({
    gameId,
    game,
    pagination,
    onPaginationChange,
  }: {
    gameId: string;
    game: Game;
    pagination: PaguinationMatch;
    onPaginationChange: (newPagination: PaguinationMatch) => void;
  }) => {
    // La consulta ahora usa toda la información de paginación, incluyendo búsqueda
    const { data, isLoading, error } = MatchClientData.getMatchesByGameId(
      gameId,
      pagination
    );

    // Ya no necesitamos filtrado local, el backend maneja todo
    const matchCards = useMemo(() => {
      if (!data?.results) return [];

      return data.results.map((match) => (
        <CardMatch key={match.match_id} match={match} game={game} />
      ));
    }, [data?.results, game]);

    // Memoizar estadísticas
    const statsInfo = useMemo(() => {
      if (!data?.results) return null;

      const total = data.results.length;
      const active = data.results.filter((m) => !m.winner_id).length;
      const finished = data.results.filter((m) => m.winner_id).length;

      return (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-gray-400 text-sm">Total</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-green-400">{active}</div>
            <div className="text-gray-400 text-sm">Activas</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center backdrop-blur-lg">
            <div className="text-2xl font-bold text-red-400">{finished}</div>
            <div className="text-gray-400 text-sm">Finalizadas</div>
          </div>
        </div>
      );
    }, [data?.results]);

    // Mensaje para resultados vacíos
    const noResultsMessage = useMemo(() => {
      if (data?.results?.length === 0 && pagination.search) {
        return (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
              <PersonStanding className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No se encontraron partidas
            </h3>
            <p className="text-gray-400 mb-6">
              No hay partidas que coincidan con tu búsqueda:{" "}
              <strong>"{pagination.search}"</strong>
            </p>
            <button
              onClick={() =>
                onPaginationChange({ ...pagination, search: "", page: 1 })
              }
              className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-2 px-4 rounded-lg hover:from-teal-600 hover:to-cyan-500 transition duration-300"
            >
              Limpiar búsqueda
            </button>
          </div>
        );
      }
      return null;
    }, [
      data?.results?.length,
      pagination.search,
      pagination,
      onPaginationChange,
    ]);

    const ListSkeleton = useMemo(
      () => (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-8 animate-pulse">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center backdrop-blur-lg">
              <div className="h-8 bg-gray-600 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto"></div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center backdrop-blur-lg">
              <div className="h-8 bg-gray-600 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto"></div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 text-center backdrop-blur-lg">
              <div className="h-8 bg-gray-600 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CardMatchSkeleton key={i} />
            ))}
          </div>
        </div>
      ),
      [isLoading, error]
    );

    // Estados de carga y error
    if (isLoading) return ListSkeleton;

    if (error) {
      return (
        <div className="text-center bg-red-900 bg-opacity-50 p-8 rounded-lg border border-red-600 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error al cargar partidas
          </h2>
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
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <PersonStanding className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No hay partidas disponibles
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Sé el primero en crear una partida para este juego.
          </p>
          <CreateMatch gameId={gameId} game={game} />
        </div>
      );
    }

    return (
      <>
        {/* Statistics */}
        {statsInfo}

        {/* Matches Grid */}
        <section className="mb-8">
          {matchCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchCards}
            </div>
          ) : (
            noResultsMessage
          )}
        </section>

        {/* Pagination */}
        {data?.results && data.results.length > 0 && (
          <footer>
            <PaginationComponent
              pagination={pagination}
              setPagination={onPaginationChange}
              info={data.info as Info}
              color="bg-gradient-to-r from-teal-500 to-cyan-400"
            />
          </footer>
        )}
      </>
    );
  }
);

UseListMatchesByGameId.displayName = "UseListMatchesByGameId";

MatchesContent.displayName = "MatchesContent";
