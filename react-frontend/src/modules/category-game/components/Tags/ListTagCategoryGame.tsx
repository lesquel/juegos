import React, { memo, useMemo } from "react";
import { TagCategoryGame } from "./TagCategoryGame";
import { CategoryGameClientData } from "@modules/category-game/services/categoryGameClientData";
import { Clock, Tag } from "lucide-react";

interface ListTagCategoryGameProps {
  gameId: string;
}

export const ListTagCategoryGame: React.FC<ListTagCategoryGameProps> = memo(
  ({ gameId }) => {
    const { data, isLoading, error } =
      CategoryGameClientData.getCategoriesByGameId(gameId);

    // Memoizar estado de carga
    const loadingState = useMemo(
      () => (
        <div className="flex items-center justify-center p-6 text-white bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mr-3"></div>
          <span className="text-gray-300">Cargando categorías...</span>
        </div>
      ),
      []
    );

    // Memoizar estado de error
    const errorState = useMemo(() => {
      if (!error) return null;

      return (
        <div className="p-6 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-red-300 text-sm">
            Error al cargar categorías: {error.message}
          </p>
        </div>
      );
    }, [error]);

    // Memoizar estado vacío
    const emptyState = useMemo(
      () => (
        <div className="p-6 text-center bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl">
          <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Tag className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-300">No hay categorías asignadas</p>
        </div>
      ),
      []
    );

    // Memoizar lista de categorías
    const categoriesList = useMemo(() => {
      if (!data?.results?.length) return emptyState;

      return (
        <div className="flex flex-wrap gap-2">
          {data.results.map((category) => (
            <TagCategoryGame key={category.category_id} category={category} />
          ))}
        </div>
      );
    }, [data?.results, emptyState]);

    // Memoizar icono de header
    const headerIcon = useMemo(
      () => (
        <Tag className="h-5 w-5 text-cyan-400" />
      ),
      []
    );

    if (isLoading) return loadingState;
    if (error) return errorState;

    return (
      <section className="relative flex flex-col gap-4 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl w-full shadow-xl">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>
        
        <div className="relative">
          <header className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              {headerIcon}
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Categorías
              {data?.results?.length ? (
                <span className="ml-2 text-sm text-gray-300 font-normal">
                  ({data.results.length})
                </span>
              ) : null}
            </h2>
          </header>

          {categoriesList}
        </div>
      </section>
    );
  }
);

ListTagCategoryGame.displayName = "ListTagCategoryGame";
