import { QueryProvider } from "@providers/QueryProvider";
import { CategoryGameClientData } from "../services/categoryGameClientData";
import { CardCategoryGame } from "./CardCategoryGame";
import type { PaguinationCategory } from "../models/paguination-category";
import { useState, useCallback, useMemo, memo } from "react";
import { PaginationComponent } from "@components/PaginationComponent";
import CategoryGameSearchComponent from "./CategoryGameSearchComponent";
import type { SearchFilters } from "@components/SearchComponent";
import type { CategoryGame } from "../models/category-game.model";
import { CardCategoryGameSkeleton } from "./CardCategoryGameSkeleton";
import { Copy } from "lucide-react";

// Configuración de paginación por defecto con búsqueda
const DEFAULT_PAGINATION: PaguinationCategory = {
  page: 1,
  limit: 10,
  sort_by: "created_at",
  sort_order: "desc",
  search: "",
};

export const ListCategoryGame = memo(() => {
  return (
    <QueryProvider>
      <UseListCategoryGame />
    </QueryProvider>
  );
});

ListCategoryGame.displayName = "ListCategoryGame";

const UseListCategoryGame = memo(() => {
  const [pagination, setPagination] =
    useState<PaguinationCategory>(DEFAULT_PAGINATION);

  // Memoizar función de búsqueda que actualiza la paginación
  const handleSearch = useCallback((filters: SearchFilters) => {
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset a la primera página al buscar
      search: filters.searchTerm,
      sort_by: filters.sortBy || "created_at",
      sort_order: filters.sortOrder || "desc",
      // Mapear filterType a campos específicos según el tipo de búsqueda
      ...(filters.filterType === "category_name" && {
        category_name: filters.searchTerm,
      }),
      ...(filters.filterType === "category_description" && {
        category_description: filters.searchTerm,
      }),
      ...(filters.filterType === "status" && { status: filters.searchTerm }),
    }));
  }, []); // Sin dependencias, la función es estable

  // Memoizar función de cambio de paginación
  const handlePaginationChange = useCallback(
    (newPagination: PaguinationCategory) => {
      setPagination(newPagination);
    },
    []
  ); // Sin dependencias, la función es estable

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-7xl mx-auto flex justify-center items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400">
              Explora Nuestras Categorías de Juegos
            </span>
          </h1>
        </div>

        {/* Search Component - Separado y estable */}
        <div className="mb-8">
          <CategoryGameSearchComponent onSearch={handleSearch} />
        </div>

        {/* Categories Content - Componente separado que se actualiza independientemente */}
        <CategoriesContent
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
});

// Componente separado para el contenido que cambia
const CategoriesContent = memo(
  ({
    pagination,
    onPaginationChange,
  }: {
    pagination: PaguinationCategory;
    onPaginationChange: (newPagination: PaguinationCategory) => void;
  }) => {
    // La consulta ahora usa toda la información de paginación, incluyendo búsqueda
    const { data, isLoading, error } =
      CategoryGameClientData.getCategoryGames(pagination);

    // Ya no necesitamos filtrado local, el backend maneja todo
    const categoryCards = useMemo(() => {
      if (!data?.results) return [];

      return data.results.map((category: CategoryGame) => (
        <CardCategoryGame key={category.category_id} category={category} />
      ));
    }, [data?.results]);

    // Mensaje para resultados vacíos
    const noResultsMessage = useMemo(() => {
      if (data?.results?.length === 0 && pagination.search) {
        return (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
              <Copy className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No se encontraron categorías
            </h3>
            <p className="text-gray-400 mb-6">
              No hay categorías que coincidan con tu búsqueda:{" "}
              <strong>"{pagination.search}"</strong>
            </p>
            <button
              onClick={() =>
                onPaginationChange({ ...pagination, search: "", page: 1 })
              }
              className="bg-gradient-to-r from-purple-500 to-teal-400 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-teal-500 transition duration-300"
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
            <CardCategoryGameSkeleton key={i} />
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
            Error al cargar categorías
          </h2>
          <p className="text-red-300 mb-6">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 to-teal-400 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-teal-500 transition duration-300"
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
            <Copy className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No hay categorías disponibles
          </h3>
          <p className="text-gray-400">
            Vuelve más tarde para ver nuevas categorías.
          </p>
        </div>
      );
    }

    return (
      <>
        {/* Categories Grid */}
        <div className="mb-8">
          {categoryCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryCards}
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
            color="bg-gradient-to-r from-purple-500 to-teal-400"
          />
        )}
      </>
    );
  }
);

UseListCategoryGame.displayName = "UseListCategoryGame";
CategoriesContent.displayName = "CategoriesContent";
