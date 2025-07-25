import { SearchComponent, type SearchFilters } from "@components/SearchComponent";
import { memo, useMemo } from "react";

interface MatchSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

const MatchSearchComponent = ({ onSearch, className }: MatchSearchProps) => {
  const filterOptions = useMemo(() => [
    { value: "all", label: "Todo" },
    { value: "match_name", label: "ID de partida" },
    { value: "participants", label: "ID de participantes" },
    { value: "status", label: "Estado (activa/finalizada)" },
    { value: "game_mode", label: "Modo (gratis/con apuesta)" },
  ], []);

  const sortOptions = useMemo(() => [
    { value: "created_at", label: "Fecha de creación" },
    { value: "updated_at", label: "Última actualización" },
    { value: "match_id", label: "ID de partida" },
    { value: "base_bet_amount", label: "Monto de apuesta" },
    { value: "odds_for_match", label: "Probabilidades" },
  ], []);

  return (
    <SearchComponent
      onSearch={onSearch}
      filterOptions={filterOptions}
      sortOptions={sortOptions}
      placeholder="Buscar partidas..."
      showSort={true}
      className={className}
      initialFilters={{
        sortBy: "created_at",
        sortOrder: "desc",
      }}
    />
  );
};

export default memo(MatchSearchComponent);
