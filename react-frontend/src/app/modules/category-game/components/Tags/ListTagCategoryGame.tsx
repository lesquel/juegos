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
        <div className="flex items-center justify-center p-4 text-white">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
          <span>Cargando categorías...</span>
        </div>
      ),
      []
    );

    // Memoizar estado de error
    const errorState = useMemo(() => {
      if (!error) return null;

      return (
        <div className="p-4 bg-red-900 bg-opacity-50 border border-red-600 rounded-lg text-center">
          <Clock className="h-6 w-6 text-red-400 mx-auto mb-2" />
          <p className="text-red-300 text-sm">
            Error al cargar categorías: {error.message}
          </p>
        </div>
      );
    }, [error]);

    // Memoizar estado vacío
    const emptyState = useMemo(
      () => (
        <div className="p-4 text-center text-gray-400">
          <Tag className="h-8 w-8 mx-auto mb-2 text-gray-500" />
          <p className="text-sm">No hay categorías asignadas</p>
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
        <Tag className="h-5 w-5 text-blue-400" />
      ),
      []
    );

    if (isLoading) return loadingState;
    if (error) return errorState;

    return (
      <section className="flex flex-col gap-3 p-4 border border-gray-700 rounded-2xl w-full bg-gray-800 bg-opacity-50 text-white backdrop-blur-lg">
        <header className="flex items-center gap-2">
          {headerIcon}
          <h2 className="text-md font-medium">
            Categorías
            {data?.results?.length ? (
              <span className="ml-2 text-sm text-gray-400">
                ({data.results.length})
              </span>
            ) : null}
          </h2>
        </header>

        {categoriesList}
      </section>
    );
  }
);

ListTagCategoryGame.displayName = "ListTagCategoryGame";
