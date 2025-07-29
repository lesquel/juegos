import { useState, useCallback } from "react";
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
}

const ListGamesContent = ({
  activeTab,
  setActiveTab,
}: ListGamesContentProps) => {
  const [paginationOffline, setPaginationOffline] =
    useState<PaginationGames>(DEFAULT_PAGINATION);
  const [paginationOnline, setPaginationOnline] =
    useState<PaginationGames>(DEFAULT_PAGINATION);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      const newPagination = {
        page: 1,
        search: filters.searchTerm,
        sort_by: filters.sortBy || "created_at",
        sort_order: filters.sortOrder || "desc",
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

      if (activeTab === "offline") {
        setPaginationOffline((prev) => ({ ...prev, ...newPagination }));
      } else {
        setPaginationOnline((prev) => ({ ...prev, ...newPagination }));
      }
    },
    [activeTab]
  );

  const handlePaginationChange = useCallback(
    (newPagination: PaginationGames) => {
      if (activeTab === "offline") {
        setPaginationOffline(newPagination);
      } else {
        setPaginationOnline(newPagination);
      }
    },
    [activeTab]
  );

  return (
    <>
      <div className="mb-8">
        <GameSearchComponent onSearch={handleSearch} />
        <GamesTabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === "offline" ? (
        <GamesContent
          pagination={paginationOffline}
          onPaginationChange={handlePaginationChange}
          filterType="offline"
        />
      ) : (
        <GamesContent
          pagination={paginationOnline}
          onPaginationChange={handlePaginationChange}
          filterType="online"
        />
      )}
    </>
  );
};

export default ListGamesContent;
