import React, { memo, useMemo } from "react";
import { SearchComponent, type SearchFilters } from "@components/SearchComponent";

interface MatchSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

const MatchSearchComponent: React.FC<MatchSearchProps> = memo(({ onSearch, className }) => {
  // Memoizar opciones de filtro para evitar recreaciones
  const filterOptions = useMemo(() => [
    { value: "all", label: "Todo" },
    { value: "match_name", label: "ID de partida" },
    { value: "participants", label: "ID de participantes" },
    { value: "status", label: "Estado (activa/finalizada)" },
    { value: "game_mode", label: "Modo (gratis/con apuesta)" },
  ], []);

  // Memoizar opciones de ordenamiento para evitar recreaciones
  const sortOptions = useMemo(() => [
    { value: "created_at", label: "Fecha de creación" },
    { value: "updated_at", label: "Última actualización" },
    { value: "match_id", label: "ID de partida" },
    { value: "base_bet_amount", label: "Monto de apuesta" },
    { value: "odds_for_match", label: "Probabilidades" },
  ], []);

  // Memoizar filtros iniciales
  const initialFilters = useMemo(() => ({
    sortBy: "created_at",
    sortOrder: "desc" as const,
  }), []);

  return (
    <SearchComponent
      onSearch={onSearch}
      filterOptions={filterOptions}
      sortOptions={sortOptions}
      placeholder="Buscar partidas por ID, participantes, estado o modo..."
      showSort={true}
      className={className}
      initialFilters={initialFilters}
      aria-label="Buscar y filtrar partidas"
    />
  );
});

MatchSearchComponent.displayName = "MatchSearchComponent";

export default MatchSearchComponent;
