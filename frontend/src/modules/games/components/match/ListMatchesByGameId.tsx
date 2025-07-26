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
import type { Pagination } from "@models/paguination";
import type { Info } from "@models/info.model";
import type { SearchFilters } from "@components/SearchComponent";
import { PersonStanding } from "lucide-react";

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
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    filterType: "all",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  // Memoizar función de búsqueda
  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
    // Actualizar la paginación con los nuevos filtros de ordenamiento
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset a la primera página
      sort_by: filters.sortBy || "created_at",
      sort_order: filters.sortOrder || "desc",
    }));
  }, []);

  const { data, isLoading, error } = MatchClientData.getMatchesByGameId(
    id,
    pagination
  );
  const {
    data: game,
    isLoading: gameIsLoading,
    error: gameError,
  } = GameClientData.getGameDetail(id);

  // Memoizar los resultados filtrados para evitar recálculos innecesarios
  const filteredResults = useMemo(() => {
    if (!data?.results) return [];

    return data.results.filter((match) => {
      if (!searchFilters.searchTerm) return true;

      const searchTerm = searchFilters.searchTerm.toLowerCase();
      const filterType = searchFilters.filterType;

      switch (filterType) {
        case "match_name":
          return match.match_id?.toLowerCase().includes(searchTerm);
        case "participants":
          return match.participant_ids?.some((participantId) =>
            participantId.toLowerCase().includes(searchTerm)
          );
        case "status": {
          const status = match.winner_id ? "finished" : "active";
          return status.toLowerCase().includes(searchTerm);
        }
        case "game_mode": {
          const gameMode = match.base_bet_amount > 0 ? "with_bet" : "free";
          return gameMode.toLowerCase().includes(searchTerm);
        }
        default: {
          // "all"
          const allStatus = match.winner_id ? "finished" : "active";
          const allGameMode = match.base_bet_amount > 0 ? "with_bet" : "free";
          return (
            match.match_id?.toLowerCase().includes(searchTerm) ||
            match.participant_ids?.some((participantId) =>
              participantId.toLowerCase().includes(searchTerm)
            ) ||
            allStatus.toLowerCase().includes(searchTerm) ||
            allGameMode.toLowerCase().includes(searchTerm)
          );
        }
      }
    });
  }, [data?.results, searchFilters]);

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    const errorText = error?.message || gameError?.message;
    if (!errorText) return null;

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center bg-red-900 bg-opacity-50 p-8 rounded-lg border border-red-600 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error al cargar datos
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
  }, [error, gameError]);

  // Memoizar iconos
  const matchIcon = useMemo(
    () => <PersonStanding className="h-8 w-8 text-teal-400" />,
    []
  );

  // Memoizar estado vacío
  const emptyState = useMemo(
    () => (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
          {matchIcon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          No hay partidas disponibles
        </h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          {searchFilters.searchTerm
            ? "No se encontraron partidas que coincidan con tu búsqueda."
            : "Sé el primero en crear una partida para este juego."}
        </p>
        {!searchFilters.searchTerm && game && (
          <CreateMatch gameId={id} game={game as Game} />
        )}
      </div>
    ),
    [matchIcon, searchFilters.searchTerm, game, id]
  );

  // Memoizar grid de partidas
  const matchesGrid = useMemo(() => {
    if (filteredResults.length === 0) {
      return emptyState;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((match) => (
          <CardMatch key={match.match_id} match={match} game={game as Game} />
        ))}
      </div>
    );
  }, [filteredResults, game, emptyState]);

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

  if (isLoading || gameIsLoading) return <LoadingComponent />;
  if (error || gameError) return errorMessage;

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

            {statsInfo}
          </header>

          {/* Search */}
          <section className="mb-8">
            <MatchSearchComponent onSearch={handleSearch} />
          </section>

          {/* Matches Grid */}
          <section className="mb-8">{matchesGrid}</section>

          {/* Pagination */}
          {filteredResults.length > 0 && (
            <footer>
              <PaginationComponent
                pagination={pagination}
                setPagination={setPagination}
                info={data?.info as Info}
                color="bg-gradient-to-r from-teal-500 to-cyan-400"
              />
            </footer>
          )}
        </div>
      </div>
    </main>
  );
});

UseListMatchesByGameId.displayName = "UseListMatchesByGameId";
