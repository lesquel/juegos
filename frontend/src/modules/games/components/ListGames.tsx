import { QueryProvider } from "@providers/QueryProvider";
import { GameClientData } from "../services/gameClientData";
import { CardGame } from "./CardGame";
import type { Game } from "../models/game.model";
import { LoadingComponent } from "@components/LoadingComponent";
import type { Pagination } from "@models/paguination";
import { useState, useCallback, useMemo, memo } from "react";
import { PaginationComponent } from "@components/PaginationComponent";
import GameSearchComponent from "./GameSearchComponent";
import type { SearchFilters } from "@components/SearchComponent";

export const ListGames = memo(() => {
  return (
    <QueryProvider>
      <UseListGames />
    </QueryProvider>
  );
});

ListGames.displayName = "ListGames";

const UseListGames = memo(() => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
  });

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    filterType: "all",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
    setPagination((prev) => ({
      ...prev,
      page: 1,
      sort_by: filters.sortBy || "created_at",
      sort_order: filters.sortOrder || "desc",
    }));
  }, []);

  const { data, isLoading, error } = GameClientData.getGames(pagination);

  const filteredResults = useMemo(() => {
    if (!data?.results) return [];

    const term = searchFilters.searchTerm.toLowerCase().trim();

    // Si no hay término de búsqueda, devolver todos los resultados
    if (!term) return data.results;

    const type = searchFilters.filterType;

    return data.results.filter((game: Game) => {
      const name = game.game_name?.toLowerCase() || "";
      const description = game.game_description?.toLowerCase() || "";
      const gtype = game.game_type?.toLowerCase() || "";

      switch (type) {
        case "game_name":
          return name.includes(term);
        case "game_description":
          return description.includes(term);
        case "game_type":
          return gtype.includes(term);
        default:
          return (
            name.includes(term) ||
            description.includes(term) ||
            gtype.includes(term)
          );
      }
    });
  }, [data?.results, searchFilters.searchTerm, searchFilters.filterType]);

  if (isLoading) return <LoadingComponent />;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );
  if (!data?.results || data.results.length === 0)
    return <div className="text-center text-red-400">No hay juegos</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto flex justify-center items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-400">
              Explora Nuestros Juegos
            </span>
          </h1>
        </div>

        <GameSearchComponent onSearch={handleSearch} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResults.map((game: Game) => (
            <CardGame key={game.game_id} game={game} />
          ))}
        </div>
        {filteredResults.length === 0 && searchFilters.searchTerm && (
          <div className="text-center text-gray-400 py-8">
            No se encontraron juegos que coincidan con "
            {searchFilters.searchTerm}"
          </div>
        )}
      </div>

      <PaginationComponent
        pagination={pagination}
        setPagination={setPagination}
        info={data.info}
        color="bg-gradient-to-r from-teal-500 to-cyan-400"
      />
    </div>
  );
});

UseListGames.displayName = "UseListGames";
