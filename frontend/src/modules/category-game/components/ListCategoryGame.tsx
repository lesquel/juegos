import { QueryProvider } from "@providers/QueryProvider";
import { CategoryGameClientData } from "../services/categoryGameClientData";
import { CardCategoryGame } from "./CardCategoryGame";
import { LoadingComponent } from "@components/LoadingComponent";
import type { PaguinationCategory } from "../models/paguination-category";
import { useState, useCallback, useMemo, memo } from "react";
import { PaginationComponent } from "@components/PaginationComponent";
import CategoryGameSearchComponent from "./CategoryGameSearchComponent";
import type { SearchFilters } from "@components/SearchComponent";
import type { CategoryGame } from "../models/category-game.model";

// Configuraciones por defecto memoizadas
const DEFAULT_PAGINATION: PaguinationCategory = {
  page: 1,
  limit: 10,
};

const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  searchTerm: "",
  filterType: "all",
  sortBy: "created_at",
  sortOrder: "desc",
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
  const [pagination, setPagination] = useState<PaguinationCategory>(DEFAULT_PAGINATION);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);

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

  const handlePaginationChange = useCallback((newPagination: any) => {
    setPagination(newPagination);
  }, []);

  const { data, isLoading, error } =
    CategoryGameClientData.getCategoryGames(pagination);

  // Memoizar los resultados filtrados para evitar recálculos innecesarios
  const filteredResults = useMemo(() => {
    if (!data?.results) return [];

    return data.results.filter((category: CategoryGame) => {
      if (!searchFilters.searchTerm) return true;

      const searchTerm = searchFilters.searchTerm.toLowerCase();
      const filterType = searchFilters.filterType;

      switch (filterType) {
        case "category_name":
          return category.category_name?.toLowerCase().includes(searchTerm);
        case "category_description":
          return category.category_description?.toLowerCase().includes(searchTerm);
        case "status": {
          const status = category.status ? "activo" : "inactivo";
          return status.toLowerCase().includes(searchTerm);
        }
        default: { // "all"
          const status = category.status ? "activo" : "inactivo";
          return (
            category.category_name?.toLowerCase().includes(searchTerm) ||
            category.category_description?.toLowerCase().includes(searchTerm) ||
            status.toLowerCase().includes(searchTerm)
          );
        }
      }
    });
  }, [data?.results, searchFilters]);

  // Memoizar componentes pesados
  const categoryCards = useMemo(() => {
    return filteredResults.map((category: CategoryGame) => (
      <CardCategoryGame key={category.category_id} category={category} />
    ));
  }, [filteredResults]);

  const noResultsMessage = useMemo(() => {
    if (filteredResults.length === 0 && searchFilters.searchTerm) {
      return (
        <div className="text-center text-gray-400 py-8">
          No se encontraron categorías que coincidan con "{searchFilters.searchTerm}"
        </div>
      );
    }
    return null;
  }, [filteredResults.length, searchFilters.searchTerm]);

  if (isLoading) return <LoadingComponent />;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );

  if (!data?.results || data.results.length === 0)
    return (
      <div className="text-center text-red-400">
        No hay categorías de juegos
      </div>
    );
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto flex justify-center items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400">
              Explora Nuestras Categorías de Juegos
            </span>
          </h1>
        </div>


        <CategoryGameSearchComponent onSearch={handleSearch} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryCards}
        </div>
        {noResultsMessage}
      </div>

      <PaginationComponent
        pagination={pagination}
        setPagination={handlePaginationChange}
        info={data.info}
        color="bg-gradient-to-r from-purple-500 to-teal-400"
      />
    </div>
  );
});

UseListCategoryGame.displayName = "UseListCategoryGame";
