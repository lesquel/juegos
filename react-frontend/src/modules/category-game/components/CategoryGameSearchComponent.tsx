import { SearchComponent, type SearchFilters } from "@components/SearchComponent";
import { memo, useMemo } from "react";

interface CategoryGameSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
  initialFilters?: Partial<SearchFilters>;
}

const CategoryGameSearchComponent = ({ onSearch, className, initialFilters: externalInitialFilters }: CategoryGameSearchProps) => {
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

  const initialFilters = useMemo(() => ({
    sortBy: "created_at",
    sortOrder: "desc" as const,
    ...externalInitialFilters,
  }), [externalInitialFilters]);

  return (
    <SearchComponent
      onSearch={onSearch}
      filterOptions={filterOptions}
      sortOptions={sortOptions}
      placeholder="Buscar categorías..."
      showSort={true}
      className={className}
      initialFilters={initialFilters}
    />
  );
};

export default memo(CategoryGameSearchComponent);
