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
  const [paginationLuck, setPaginationLuck] =
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
      } else if (activeTab === "online") {
        setPaginationOnline((prev) => ({ ...prev, ...newPagination }));
      } else {
        setPaginationLuck((prev) => ({ ...prev, ...newPagination }));
      }
    },
    [activeTab]
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
    },
    [activeTab]
  );

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
        <GameSearchComponent onSearch={handleSearch} />
        <GamesTabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {renderGamesContent()}
    </>
  );
};

export default ListGamesContent;
