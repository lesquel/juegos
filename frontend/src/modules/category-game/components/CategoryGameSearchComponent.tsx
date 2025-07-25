import { SearchComponent, type SearchFilters } from "@components/SearchComponent";
import { memo, useMemo } from "react";

interface CategoryGameSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

const CategoryGameSearchComponent = ({ onSearch, className }: CategoryGameSearchProps) => {
  const filterOptions = useMemo(() => [
    { value: "all", label: "Todo" },
    { value: "category_name", label: "Nombre de categoría" },
    { value: "category_description", label: "Descripción" },
    { value: "status", label: "Estado" },
  ], []);

  const sortOptions = useMemo(() => [
    { value: "created_at", label: "Fecha de creación" },
    { value: "updated_at", label: "Última actualización" },
    { value: "category_name", label: "Nombre" },
    { value: "status", label: "Estado" },
  ], []);

  return (
    <SearchComponent
      onSearch={onSearch}
      filterOptions={filterOptions}
      sortOptions={sortOptions}
      placeholder="Buscar categorías..."
      showSort={true}
      className={className}
      initialFilters={{
        sortBy: "created_at",
        sortOrder: "desc",
      }}
    />
  );
};

export default memo(CategoryGameSearchComponent);
