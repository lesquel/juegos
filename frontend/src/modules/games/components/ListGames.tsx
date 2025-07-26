import { QueryProvider } from "@providers/QueryProvider";
import { GameClientData } from "../services/gameClientData";
import { CardGame } from "./CardGame";
import type { Game } from "../models/game.model";
import { useState, useCallback, useMemo, memo } from "react";
import { PaginationComponent } from "@components/PaginationComponent";
import GameSearchComponent from "./GameSearchComponent";
import type { SearchFilters } from "@components/SearchComponent";
import type { PaguinationGames } from "../models/paguination-games";
import { CardGameSkeleton } from "./CardGameSkeleton";
import { Box, Search } from "lucide-react";

// Configuración de paginación por defecto con búsqueda
const DEFAULT_PAGINATION: PaguinationGames = {
  page: 1,
  limit: 10,
  sort_by: "created_at",
  sort_order: "desc",
  search: "",
};

export const ListGames = memo(() => {
  return (
    <QueryProvider>
      <UseListGames />
    </QueryProvider>
  );
});

ListGames.displayName = "ListGames";

const UseListGames = memo(() => {
  const [pagination, setPagination] =
    useState<PaguinationGames>(DEFAULT_PAGINATION);

  // Memoizar función de búsqueda que actualiza la paginación
  const handleSearch = useCallback((filters: SearchFilters) => {
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset a la primera página al buscar
      search: filters.searchTerm,
      sort_by: filters.sortBy || "created_at",
      sort_order: filters.sortOrder || "desc",
      // Mapear filterType a campos específicos según el tipo de búsqueda
      ...(filters.filterType === "game_name" && {
        game_name: filters.searchTerm,
      }),
      ...(filters.filterType === "game_description" && {
        game_description: filters.searchTerm,
      }),
    }));
  }, []); // Sin dependencias, la función es estable

  // Memoizar función de cambio de paginación
  const handlePaginationChange = useCallback(
    (newPagination: PaguinationGames) => {
      setPagination(newPagination);
    },
    []
  ); // Sin dependencias, la función es estable

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-400">
                Explora Nuestros Juegos
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Descubre una amplia selección de juegos emocionantes y divertidos
              para todos los gustos
            </p>
          </div>

          {/* Search Component - Separado y estable */}
          <div className="mb-8">
            <GameSearchComponent onSearch={handleSearch} />
          </div>

          {/* Games Content - Componente separado que se actualiza independientemente */}
          <GamesContent
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
          />
        </div>
      </div>
    </div>
  );
});

// Componente separado para el contenido que cambia
const GamesContent = memo(
  ({
    pagination,
    onPaginationChange,
  }: {
    pagination: PaguinationGames;
    onPaginationChange: (newPagination: PaguinationGames) => void;
  }) => {
    // La consulta ahora usa toda la información de paginación, incluyendo búsqueda
    const { data, isLoading, error } = GameClientData.getGames(pagination);

    // Ya no necesitamos filtrado local, el backend maneja 
    const gameCards = useMemo(() => {
      if (!data?.results) return [];

      return data.results.map((game: Game) => (
        <CardGame key={game.game_id} game={game} />
      ));
    }, [data?.results]);

    // Mensaje para resultados vacíos
    const noResultsMessage = useMemo(() => {
      if (data?.results?.length === 0 && pagination.search) {
        return (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No se encontraron juegos
            </h3>
            <p className="text-gray-400 mb-6">
              No hay juegos que coincidan con tu búsqueda:{" "}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <CardGameSkeleton key={i} />
          ))}
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
            Error al cargar juegos
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
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <Box className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No hay juegos disponibles
          </h3>
          <p className="text-gray-400">
            Vuelve más tarde para ver nuevos juegos.
          </p>
        </div>
      );
    }

    return (
      <>
        {/* Games Grid */}
        <div className="mb-8">
          {gameCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gameCards}
            </div>
          ) : (
            noResultsMessage
          )}
        </div>

        {/* Pagination */}
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
  }
);

UseListGames.displayName = "UseListGames";

GamesContent.displayName = "GamesContent";
