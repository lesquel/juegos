import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import GameSearchComponent from "./GameSearchComponent";
import type { SearchFilters } from "@components/SearchComponent";
import type { PaginationGames } from "../models/pagination-games";
import GamesContent from "./GamesContent";
import GamesTabSelector from "./GamesTabSelector";

type GameTab = "offline" | "online" | "luck";

const DEFAULT_PAGINATION: PaginationGames = {
  page: 1,
  limit: 10,
  sort_by: "created_at",
  sort_order: "desc",
  search: "",
};

interface ListGamesContentProps {
  activeTab: GameTab;
  setActiveTab: (tab: GameTab) => void;
  updateUrl: (newTab: GameTab, additionalParams?: Record<string, any>) => void;
}

const ListGamesContent = ({
  activeTab,
  setActiveTab,
  updateUrl,
}: ListGamesContentProps) => {
  const searchParams = useSearch({ strict: false }) as any;

  // Inicializar paginación desde URL params o usar defaults
  const getInitialPagination = useCallback((tab: GameTab): PaginationGames => ({
    page: Number(searchParams?.page) || DEFAULT_PAGINATION.page,
    limit: Number(searchParams?.limit) || DEFAULT_PAGINATION.limit,
    sort_by: searchParams?.sort_by || DEFAULT_PAGINATION.sort_by,
    sort_order: searchParams?.sort_order || DEFAULT_PAGINATION.sort_order,
    search: searchParams?.search || DEFAULT_PAGINATION.search,
    game_name: searchParams?.game_name || undefined,
    game_description: searchParams?.game_description || undefined,
    category_name: searchParams?.category_name || undefined,
  }), [searchParams]);

  const [paginationOffline, setPaginationOffline] = useState<PaginationGames>(() => 
    getInitialPagination("offline")
  );
  const [paginationOnline, setPaginationOnline] = useState<PaginationGames>(() => 
    getInitialPagination("online")
  );
  const [paginationLuck, setPaginationLuck] = useState<PaginationGames>(() => 
    getInitialPagination("luck")
  );

  // Función para actualizar URL con filtros
  const updateUrlWithFilters = useCallback((newPagination: PaginationGames) => {
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
    if (newPagination.game_name) {
      params.game_name = newPagination.game_name;
    }
    if (newPagination.game_description) {
      params.game_description = newPagination.game_description;
    }
    if (newPagination.category_name) {
      params.category_name = newPagination.category_name;
    }

    updateUrl(activeTab, params);
  }, [activeTab, updateUrl]);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      const newPagination: PaginationGames = {
        page: 1,
        limit: DEFAULT_PAGINATION.limit,
        search: filters.searchTerm,
        sort_by: filters.sortBy || "created_at",
        sort_order: filters.sortOrder || "desc",
        // Limpiar filtros anteriores
        game_name: undefined,
        game_description: undefined,
        category_name: undefined,
        // Mapear filterType a campos específicos
        ...(filters.filterType === "game_name" && {
          game_name: filters.searchTerm,
        }),
        ...(filters.filterType === "game_description" && {
          game_description: filters.searchTerm,
        }),
        ...(filters.filterType === "category_name" && {
          category_name: filters.searchTerm,
        }),
      };

      // Actualizar el estado correspondiente al tab activo
      if (activeTab === "offline") {
        setPaginationOffline(newPagination);
      } else if (activeTab === "online") {
        setPaginationOnline(newPagination);
      } else {
        setPaginationLuck(newPagination);
      }

      // Actualizar URL
      updateUrlWithFilters(newPagination);
    },
    [activeTab, updateUrlWithFilters]
  );

  const handlePaginationChange = useCallback(
    (newPagination: PaginationGames) => {
      if (activeTab === "offline") {
        setPaginationOffline(newPagination);
      } else if (activeTab === "online") {
        setPaginationOnline(newPagination);
      } else {
        setPaginationLuck(newPagination);
      }
      
      // Actualizar URL
      updateUrlWithFilters(newPagination);
    },
    [activeTab, updateUrlWithFilters]
  );

  // Sincronizar estado local con URL params cuando cambien
  useEffect(() => {
    const newPagination = getInitialPagination(activeTab);
    if (activeTab === "offline") {
      setPaginationOffline(newPagination);
    } else if (activeTab === "online") {
      setPaginationOnline(newPagination);
    } else {
      setPaginationLuck(newPagination);
    }
  }, [activeTab, getInitialPagination]);

  // Preparar filtros iniciales para el componente de búsqueda
  const getCurrentPagination = () => {
    switch (activeTab) {
      case "offline": return paginationOffline;
      case "online": return paginationOnline;
      case "luck": return paginationLuck;
      default: return DEFAULT_PAGINATION;
    }
  };

  const currentPagination = getCurrentPagination();
  const searchInitialFilters = useMemo(() => {
    const filters: Partial<SearchFilters> = {
      sortBy: currentPagination.sort_by,
      sortOrder: (currentPagination.sort_order as "asc" | "desc") || "desc",
    };

    if (currentPagination.search) {
      filters.searchTerm = currentPagination.search;
    }

    // Determinar el filterType basado en los campos específicos
    if (currentPagination.game_name) {
      filters.filterType = "game_name";
      filters.searchTerm = currentPagination.game_name;
    } else if (currentPagination.game_description) {
      filters.filterType = "game_description";
      filters.searchTerm = currentPagination.game_description;
    } else if (currentPagination.category_name) {
      filters.filterType = "category_name";
      filters.searchTerm = currentPagination.category_name;
    } else if (currentPagination.search) {
      filters.filterType = "all";
    }

    return filters;
  }, [currentPagination]);

  const renderGamesContent = () => {
    switch (activeTab) {
      case "offline":
        return (
          <GamesContent
            pagination={paginationOffline}
            onPaginationChange={handlePaginationChange}
            filterType="offline"
          />
        );
      case "online":
        return (
          <GamesContent
            pagination={paginationOnline}
            onPaginationChange={handlePaginationChange}
            filterType="online"
          />
        );
      case "luck":
        return (
          <GamesContent
            pagination={paginationLuck}
            onPaginationChange={handlePaginationChange}
            filterType="luck"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mb-8">
        <GameSearchComponent 
          onSearch={handleSearch} 
          initialFilters={searchInitialFilters}
        />
        <GamesTabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {renderGamesContent()}
    </>
  );
};

export default ListGamesContent;
