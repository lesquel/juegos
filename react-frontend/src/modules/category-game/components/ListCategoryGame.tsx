import { memo, useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { PaginationCategory } from "../models/pagination-category";
import { SearchFilters } from "@/components/SearchComponent";
import CategoryGameSearchComponent from "./CategoryGameSearchComponent";
import { CategoryGameClientData } from "../services/categoryGameClientData";
import { CategoryGame } from "../models/category-game.model";
import { CardCategoryGame } from "./CardCategoryGame";
import { Copy } from "lucide-react";
import { CardCategoryGameSkeleton } from "./CardCategoryGameSkeleton";
import { PaginationComponent } from "@/components/PaginationComponent";


// Configuración de paginación por defecto con búsqueda
const DEFAULT_PAGINATION: PaginationCategory = {
  page: 1,
  limit: 10,
  sort_by: "created_at",
  sort_order: "desc",
  search: "",
};

export const UseListCategoryGame = memo(() => {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as any;
  
  // Inicializar paginación desde URL params o usar defaults
  const initialPagination = useMemo((): PaginationCategory => ({
    page: Number(searchParams?.page) || DEFAULT_PAGINATION.page,
    limit: Number(searchParams?.limit) || DEFAULT_PAGINATION.limit,
    sort_by: searchParams?.sort_by || DEFAULT_PAGINATION.sort_by,
    sort_order: searchParams?.sort_order || DEFAULT_PAGINATION.sort_order,
    search: searchParams?.search || DEFAULT_PAGINATION.search,
    category_name: searchParams?.category_name || undefined,
    category_description: searchParams?.category_description || undefined,
    status: searchParams?.status || undefined,
  }), [searchParams]);

  const [pagination, setPagination] = useState<PaginationCategory>(initialPagination);

  // Actualizar URL cuando cambie la paginación
  const updateUrl = useCallback((newPagination: PaginationCategory) => {
    const params: Record<string, any> = {};
    
    // Solo incluir parámetros que no sean los default
    if (newPagination.page !== DEFAULT_PAGINATION.page) {
      params.page = newPagination.page;
    }
    if (newPagination.limit !== DEFAULT_PAGINATION.limit) {
      params.limit = newPagination.limit;
    }
    if (newPagination.sort_by !== DEFAULT_PAGINATION.sort_by) {
      params.sort_by = newPagination.sort_by;
    }
    if (newPagination.sort_order !== DEFAULT_PAGINATION.sort_order) {
      params.sort_order = newPagination.sort_order;
    }
    if (newPagination.search && newPagination.search !== DEFAULT_PAGINATION.search) {
      params.search = newPagination.search;
    }
    if (newPagination.category_name) {
      params.category_name = newPagination.category_name;
    }
    if (newPagination.category_description) {
      params.category_description = newPagination.category_description;
    }
    if (newPagination.status) {
      params.status = newPagination.status;
    }

    navigate({
      to: '/category-games',
      search: params,
      replace: true, // Usar replace para no crear nueva entrada en el historial
    });
  }, [navigate]);

  // Memoizar función de búsqueda que actualiza la paginación y URL
  const handleSearch = useCallback((filters: SearchFilters) => {
    const newPagination: PaginationCategory = {
      ...pagination,
      page: 1, // Reset a la primera página al buscar
      search: filters.searchTerm,
      sort_by: filters.sortBy || "created_at",
      sort_order: filters.sortOrder || "desc",
      // Limpiar filtros anteriores
      category_name: undefined,
      category_description: undefined,
      status: undefined,
      // Mapear filterType a campos específicos según el tipo de búsqueda
      ...(filters.filterType === "category_name" && {
        category_name: filters.searchTerm,
      }),
      ...(filters.filterType === "category_description" && {
        category_description: filters.searchTerm,
      }),
      ...(filters.filterType === "status" && { status: filters.searchTerm }),
    };
    
    setPagination(newPagination);
    updateUrl(newPagination);
  }, [pagination, updateUrl]);

  // Memoizar función de cambio de paginación
  const handlePaginationChange = useCallback(
    (newPagination: PaginationCategory) => {
      setPagination(newPagination);
      updateUrl(newPagination);
    },
    [updateUrl]
  );

  // Sincronizar estado local con URL params cuando cambien
  useEffect(() => {
    setPagination(initialPagination);
  }, [initialPagination]);

  // Preparar filtros iniciales para el componente de búsqueda
  const searchInitialFilters = useMemo(() => {
    const filters: Partial<SearchFilters> = {
      sortBy: pagination.sort_by,
      sortOrder: (pagination.sort_order as "asc" | "desc") || "desc",
    };

    if (pagination.search) {
      filters.searchTerm = pagination.search;
    }

    // Determinar el filterType basado en los campos específicos
    if (pagination.category_name) {
      filters.filterType = "category_name";
      filters.searchTerm = pagination.category_name;
    } else if (pagination.category_description) {
      filters.filterType = "category_description";
      filters.searchTerm = pagination.category_description;
    } else if (pagination.status) {
      filters.filterType = "status";
      filters.searchTerm = pagination.status;
    } else if (pagination.search) {
      filters.filterType = "all";
    }

    return filters;
  }, [pagination]);

  return (
    <div className="container mx-auto px-8 sm:px-10 lg:px-16 xl:px-24 py-12 sm:py-16 lg:py-20 xl:py-28 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-7xl mx-auto flex justify-center items-center mb-16 sm:mb-20 lg:mb-24 xl:mb-32">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-center text-white leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400">
              Explora Nuestras Categorías de Juegos
            </span>
          </h1>
        </div>

        {/* Search Component - Separado y estable */}
        <div className="mb-16 sm:mb-20 lg:mb-24 xl:mb-32">
          <CategoryGameSearchComponent 
            onSearch={handleSearch} 
            initialFilters={searchInitialFilters}
          />
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

UseListCategoryGame.displayName = "UseListCategoryGame";

// Componente separado para el contenido que cambia
const CategoriesContent = memo(
  ({
    pagination,
    onPaginationChange,
  }: {
    pagination: PaginationCategory;
    onPaginationChange: (newPagination: PaginationCategory) => void;
  }) => {
    // La consulta ahora usa toda la información de paginación, incluyendo búsqueda
    const { data, isLoading, error } =
      CategoryGameClientData.getCategoryGames(pagination);

    // Ya no necesitamos filtrado local, el backend maneja
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
          <div className="text-center py-24 sm:py-28 lg:py-32 xl:py-40">
            <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 xl:w-48 xl:h-48 mx-auto mb-10 sm:mb-12 lg:mb-14 xl:mb-16 rounded-full bg-gray-800 flex items-center justify-center">
              <Copy className="h-16 w-16 sm:h-18 sm:w-18 lg:h-20 lg:w-20 xl:h-24 xl:w-24 text-gray-400" />
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
              No se encontraron categorías
            </h3>
            <p className="text-gray-400 mb-10 sm:mb-12 lg:mb-14 xl:mb-16 text-lg sm:text-xl lg:text-2xl xl:text-3xl max-w-2xl mx-auto leading-relaxed">
              No hay categorías que coincidan con tu búsqueda:{" "}
              <strong>"{pagination.search}"</strong>
            </p>
            <button
              onClick={() => {
                const clearedPagination = { ...pagination, search: "", page: 1, category_name: undefined, category_description: undefined, status: undefined };
                onPaginationChange(clearedPagination);
              }}
              className="bg-gradient-to-r from-purple-500 to-teal-400 text-white font-bold py-6 px-12 sm:py-7 sm:px-14 lg:py-8 lg:px-16 xl:py-10 xl:px-20 rounded-2xl hover:from-purple-600 hover:to-teal-500 transition duration-300 text-lg sm:text-xl lg:text-2xl xl:text-3xl shadow-2xl hover:shadow-purple-500/25"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        <div className="text-center bg-red-900 bg-opacity-50 p-12 sm:p-16 lg:p-20 xl:p-24 rounded-3xl border border-red-600 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-red-400 mb-8 sm:mb-10 lg:mb-12 xl:mb-14">
            Error al cargar categorías
          </h2>
          <p className="text-red-300 mb-10 sm:mb-12 lg:mb-14 xl:mb-16 text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-relaxed">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 to-teal-400 text-white font-bold py-6 px-12 sm:py-7 sm:px-14 lg:py-8 lg:px-16 xl:py-10 xl:px-20 rounded-2xl hover:from-purple-600 hover:to-teal-500 transition duration-300 text-lg sm:text-xl lg:text-2xl xl:text-3xl shadow-2xl hover:shadow-purple-500/25"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }

    if (!data?.results || data.results.length === 0) {
      return (
        <div className="text-center py-24 sm:py-28 lg:py-32 xl:py-40">
          <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 xl:w-48 xl:h-48 mx-auto mb-10 sm:mb-12 lg:mb-14 xl:mb-16 rounded-full bg-gray-800 flex items-center justify-center">
            <Copy className="h-16 w-16 sm:h-18 sm:w-18 lg:h-20 lg:w-20 xl:h-24 xl:w-24 text-gray-400" />
          </div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
            No hay categorías disponibles
          </h3>
          <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl xl:text-3xl max-w-2xl mx-auto leading-relaxed">
            Vuelve más tarde para ver nuevas categorías.
          </p>
        </div>
      );
    }

    return (
      <>
        {/* Categories Grid */}
        <div className="mb-16 sm:mb-20 lg:mb-24 xl:mb-32">
          {categoryCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
              {categoryCards}
            </div>
          ) : (
            noResultsMessage
          )}
        </div>

        {/* Pagination */}
        {data?.results && data.results.length > 0 && (
          <div className="mt-16 sm:mt-20 lg:mt-24 xl:mt-32">
            <PaginationComponent
              pagination={pagination}
              setPagination={onPaginationChange}
              info={data.info}
              color="bg-gradient-to-r from-purple-500 to-teal-400"
            />
          </div>
        )}
      </>
    );
  }
);

CategoriesContent.displayName = "CategoriesContent";
