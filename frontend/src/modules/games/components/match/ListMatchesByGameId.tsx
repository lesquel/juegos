import { MatchClientData } from "@modules/games/services/matchClientData";
import { QueryProvider } from "@providers/QueryProvider";
import { CreateMatch } from "./CreateMatch";
import { GameClientData } from "@modules/games/services/gameClientData";
import { useState, useCallback, useMemo } from "react";
import type { Game } from "@modules/games/models/game.model";
import { LoadingComponent } from "@components/LoadingComponent";
import { PaginationComponent } from "@components/PaginationComponent";
import type { Pagination } from "@models/paguination";
import type { Info } from "@models/info.model";
import { CardMatch } from "./CardMatch";
import MatchSearchComponent from "./MatchSearchComponent";
import type { SearchFilters } from "@components/SearchComponent";

export const ListMatchesByGameId = ({ id }: { id: string }) => {
  return (
    <QueryProvider>
      <UseListMatchesByGameId id={id} />
    </QueryProvider>
  );
};

const UseListMatchesByGameId = ({ id }: { id: string }) => {
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

  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
    // Actualizar la paginación con los nuevos filtros de ordenamiento
    setPagination(prev => ({
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
          return match.participant_ids?.some(participantId =>
            participantId.toLowerCase().includes(searchTerm)
          );
        case "status": {
          // Lógica para determinar el estado basado en los datos disponibles
          const status = match.winner_id ? "finished" : "active";
          return status.toLowerCase().includes(searchTerm);
        }
        case "game_mode": {
          // Podríamos usar el bet_amount para categorizar el modo
          const gameMode = match.base_bet_amount > 0 ? "with_bet" : "free";
          return gameMode.toLowerCase().includes(searchTerm);
        }
        default: { // "all"
          const allStatus = match.winner_id ? "finished" : "active";
          const allGameMode = match.base_bet_amount > 0 ? "with_bet" : "free";
          return (
            match.match_id?.toLowerCase().includes(searchTerm) ||
            match.participant_ids?.some(participantId =>
              participantId.toLowerCase().includes(searchTerm)
            ) ||
            allStatus.toLowerCase().includes(searchTerm) ||
            allGameMode.toLowerCase().includes(searchTerm)
          );
        }
      }
    });
  }, [data?.results, searchFilters]);

  if (isLoading || gameIsLoading) return <LoadingComponent />;

  if (error || gameError)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-400 text-2xl">
          Error: {error?.message || gameError?.message}
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">
            Partidas de {game?.game_name}
          </h1>
          <CreateMatch gameId={id} game={game as Game} />
        </div>

        <MatchSearchComponent onSearch={handleSearch} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((match) => (
            <CardMatch
              key={match.match_id}
              match={match}
              game={game as Game}
            />
          ))}
        </div>
      </div>

      <PaginationComponent
        pagination={pagination}
        setPagination={setPagination}
        info={data?.info as Info}
        color="bg-gradient-to-r from-teal-500 to-cyan-400"
      />
    </div>
  );
};
