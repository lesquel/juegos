import React, { useMemo, memo } from "react";
import { GameClientData } from "../services/gameClientData";
import { CardGame } from "./CardGame";
import type { Game } from "../models/game.model";
import { PaginationComponent } from "@components/PaginationComponent";
import { CardGameSkeleton } from "./CardGameSkeleton";
import { Box, Search } from "lucide-react";
import type { PaginationGames } from "../models/pagination-games";
import type { GameTab } from "./ListGames";


interface GamesContentProps {
  pagination: PaginationGames;
  onPaginationChange: (newPagination: PaginationGames) => void;
  filterType: GameTab;
}

const GamesContent = memo(
  ({ pagination, onPaginationChange, filterType }: GamesContentProps) => {
    const { data, isLoading, error } = GameClientData.getGames({
      ...pagination,
      game_type: filterType,
    });


    const gameCards = useMemo(() => {
      if (!data?.results) return [];
      return data.results.map((game: Game) => (
        <CardGame key={game.game_id} game={game} />
      ));
    }, [data?.results]);

    const noResultsMessage = useMemo(() => {
      if (data?.results?.length === 0 && pagination.search) {
        return (
          <div className="text-center py-16 sm:py-20 lg:py-24 px-6 sm:px-8">
            <div className="relative">
              {/* Fondo decorativo */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl"></div>
              
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-10 sm:p-12 lg:p-16 max-w-lg mx-auto">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-8 sm:mb-10 lg:mb-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center backdrop-blur-sm border border-cyan-400/30">
                  <Search className="h-14 w-14 sm:h-16 sm:w-16 text-cyan-400" />
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 sm:mb-8">
                  No se encontraron juegos
                </h3>
                <p className="text-gray-300 text-lg sm:text-xl mb-10 sm:mb-12 leading-relaxed">
                  No hay juegos que coincidan con tu búsqueda:{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                    "{pagination.search}"
                  </span>
                </p>
                <button
                  onClick={() =>
                    onPaginationChange({ ...pagination, search: "", page: 1 })
                  }
                  className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold py-4 sm:py-5 px-8 sm:px-12 rounded-2xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg sm:text-xl"
                >
                  Limpiar búsqueda
                </button>
              </div>
            </div>
          </div>
        );
      }
      return null;
    }, [
      data?.results?.length,
      pagination,
      onPaginationChange,
    ]);

    const ListSkeleton = useMemo(
      () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8">
          {Array.from({ length: 8 }, () => crypto.randomUUID()).map((id) => (
            <CardGameSkeleton key={id} />
          ))}
        </div>
      ),
      []
    );

    if (isLoading) return ListSkeleton;

    if (error) {
      return (
        <div className="text-center py-16 sm:py-20 lg:py-24 px-6 sm:px-8">
          <div className="relative">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-orange-500/5 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-red-500/10 backdrop-blur-sm border border-red-500/30 p-10 sm:p-12 lg:p-16 rounded-3xl max-w-lg mx-auto">
              <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-8 sm:mb-10 lg:mb-12 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm border border-red-400/30">
                <svg className="w-14 h-14 sm:w-16 sm:h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-6 sm:mb-8">
                Error al cargar juegos
              </h2>
              <p className="text-red-300 text-lg sm:text-xl mb-10 sm:mb-12 leading-relaxed">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white font-bold py-4 sm:py-5 px-8 sm:px-12 rounded-2xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg sm:text-xl"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!data?.results || data.results.length === 0) {
      return (
        <div className="text-center py-16 sm:py-20 lg:py-24 px-6 sm:px-8">
          <div className="relative">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-slate-500/5 to-zinc-500/5 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-10 sm:p-12 lg:p-16 max-w-lg mx-auto">
              <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-8 sm:mb-10 lg:mb-12 rounded-full bg-gradient-to-br from-gray-500/20 to-slate-500/20 flex items-center justify-center backdrop-blur-sm border border-gray-400/30">
                <Box className="h-14 w-14 sm:h-16 sm:w-16 text-gray-400" />
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-400 to-slate-400 bg-clip-text text-transparent mb-6 sm:mb-8">
                No hay juegos disponibles
              </h3>
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
                Vuelve más tarde para ver nuevos juegos.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8">
          {gameCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
              {gameCards}
            </div>
          ) : (
            noResultsMessage
          )}
        </div>

        {data?.results && data.results.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <PaginationComponent
              pagination={pagination}
              setPagination={onPaginationChange}
              info={data.info}
              color="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
            />
          </div>
        )}
      </>
    );
  }
);

GamesContent.displayName = "GamesContent";

export default GamesContent;
