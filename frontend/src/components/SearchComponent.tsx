import { Search, X } from "lucide-react";
import { useState, useCallback, useMemo, useEffect, useRef, memo } from "react";

// Hook personalizado para debounce
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchFilters {
  searchTerm: string;
  filterType: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface SearchComponentProps {
  onSearch: (filters: SearchFilters) => void;
  filterOptions: FilterOption[];
  placeholder?: string;
  showSort?: boolean;
  sortOptions?: FilterOption[];
  initialFilters?: Partial<SearchFilters>;
  className?: string;
}

export const SearchComponent = memo(
  ({
    onSearch,
    filterOptions,
    placeholder = "Buscar...",
    showSort = false,
    sortOptions = [],
    initialFilters = {},
    className = "",
  }: SearchComponentProps) => {
    const [filters, setFilters] = useState<SearchFilters>({
      searchTerm: "",
      filterType: filterOptions[0]?.value || "",
      sortBy: sortOptions[0]?.value || "",
      sortOrder: "desc",
      ...initialFilters,
    });

    // Usar debounce solo para el término de búsqueda
    const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

    // Ref para evitar el primer render en el useEffect
    const isFirstRender = useRef(true);
    const filtersRef = useRef(filters);

    // Mantener la referencia actualizada
    filtersRef.current = filters;

    // Memoizar las opciones de filtro para evitar re-renderizados
    const memoizedFilterOptions = useMemo(() => filterOptions, [filterOptions]);
    const memoizedSortOptions = useMemo(() => sortOptions, [sortOptions]);

    // Callback optimizado para el cambio de input
    const handleInputChange = useCallback((value: string) => {
      setFilters((prev) => ({ ...prev, searchTerm: value }));
    }, []);

    // Callback optimizado para búsqueda manual (botón)
    const handleManualSearch = useCallback(() => {
      const searchFilters = { ...filtersRef.current };
      onSearch(searchFilters);
    }, [onSearch]);

    // Callback optimizado para el cambio de tipo de filtro
    const handleFilterTypeChange = useCallback(
      (value: string) => {
        const newFilters = { ...filtersRef.current, filterType: value };
        setFilters(newFilters);
        onSearch(newFilters);
      },
      [onSearch]
    );

    // Callback optimizado para el cambio de ordenamiento
    const handleSortChange = useCallback(
      (field: "sortBy" | "sortOrder", value: string) => {
        const newFilters = { ...filtersRef.current, [field]: value };
        setFilters(newFilters);
        onSearch(newFilters);
      },
      [onSearch]
    );

    // Callback optimizado para limpiar filtros
    const clearFilters = useCallback(() => {
      const clearedFilters = {
        searchTerm: "",
        filterType: memoizedFilterOptions[0]?.value || "",
        sortBy: memoizedSortOptions[0]?.value || "",
        sortOrder: "desc" as const,
      };
      setFilters(clearedFilters);
      onSearch(clearedFilters);
    }, [memoizedFilterOptions, memoizedSortOptions, onSearch]);

    // Effect para manejar el debounce del término de búsqueda
    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      // Usar la referencia para evitar dependencias
      const newFilters = {
        ...filtersRef.current,
        searchTerm: debouncedSearchTerm,
      };
      onSearch(newFilters);
    }, [debouncedSearchTerm, onSearch]); // Sin 'filters' en dependencias

    // Generar IDs únicos para accesibilidad
    const searchId = useMemo(
      () => `search-${Math.random().toString(36).substring(2, 9)}`,
      []
    );
    const filterTypeId = useMemo(
      () => `filter-type-${Math.random().toString(36).substring(2, 9)}`,
      []
    );
    const sortById = useMemo(
      () => `sort-by-${Math.random().toString(36).substring(2, 9)}`,
      []
    );
    const sortOrderId = useMemo(
      () => `sort-order-${Math.random().toString(36).substring(2, 9)}`,
      []
    );

    return (
      <div className={`bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 ${className}`}>
        {/* Grid responsivo para los controles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
          {/* Search Input - ocupa toda la fila en mobile, 2 columnas en tablet+, 2 columnas en desktop, 3 en XL */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-3">
            <label
              htmlFor={searchId}
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Término de búsqueda
            </label>
            <div className="relative">
              <input
                id={searchId}
                type="text"
                value={filters.searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                placeholder={placeholder}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={handleManualSearch}
                className="absolute inset-y-0 right-2 flex items-center p-1 hover:bg-gray-600 rounded transition-colors duration-200"
                title="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Type - 1 columna en mobile, 1 en tablet+, 1 en desktop, 1 en XL */}
          <div className="col-span-1">
            <label
              htmlFor={filterTypeId}
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Buscar por
            </label>
            <select
              id={filterTypeId}
              value={filters.filterType}
              onChange={(e) => handleFilterTypeChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {memoizedFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options - Solo cuando showSort es true */}
          {showSort && memoizedSortOptions.length > 0 && (
            <>
              {/* Sort By - 1 columna */}
              <div className="col-span-1">
                <label
                  htmlFor={sortById}
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Ordenar por
                </label>
                <select
                  id={sortById}
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {memoizedSortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order - 1 columna */}
              <div className="col-span-1">
                <label
                  htmlFor={sortOrderId}
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Orden
                </label>
                <select
                  id={sortOrderId}
                  value={filters.sortOrder}
                  onChange={(e) =>
                    handleSortChange("sortOrder", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </>
          )}

          {/* Clear Button - Se ajusta automáticamente según el espacio disponible */}
          <div className="col-span-1">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Limpiar</span>
              <span className="sm:hidden">Clear</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display - Responsivo con mejor spacing */}
        {(filters.searchTerm ||
          filters.filterType !== memoizedFilterOptions[0]?.value) && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-300 font-medium">
                Filtros activos:
              </span>
              {filters.searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-600 text-white font-medium">
                  "{filters.searchTerm}"
                </span>
              )}
              {filters.filterType !== memoizedFilterOptions[0]?.value && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-600 text-white font-medium">
                  {
                    memoizedFilterOptions.find(
                      (opt) => opt.value === filters.filterType
                    )?.label
                  }
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchComponent.displayName = "SearchComponent";
