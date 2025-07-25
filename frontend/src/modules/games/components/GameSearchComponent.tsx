import { SearchComponent, type SearchFilters } from "@components/SearchComponent";
import { memo, useMemo } from "react";

interface GameSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

const GameSearchComponent = ({ onSearch, className }: GameSearchProps) => {
  const filterOptions = useMemo(() => [
    { value: "all", label: "Todo" },
    { value: "game_name", label: "Nombre del juego" },
    { value: "game_description", label: "Descripción" },
    { value: "game_type", label: "Tipo de juego" },
  ], []);

  const sortOptions = useMemo(() => [
    { value: "created_at", label: "Fecha de creación" },
    { value: "updated_at", label: "Última actualización" },
    { value: "game_name", label: "Nombre" },
    { value: "game_type", label: "Tipo de juego" },
  ], []);

  return (
    <SearchComponent
      onSearch={onSearch}
      filterOptions={filterOptions}
      sortOptions={sortOptions}
      placeholder="Buscar juegos..."
      showSort={true}
      className={className}
      initialFilters={{
        sortBy: "created_at",
        sortOrder: "desc",
      }}
    />
  );
};

export default memo(GameSearchComponent);
