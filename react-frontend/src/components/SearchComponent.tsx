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
      <div className={`relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl ${className}`}>
        {/* Fondo decorativo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>
        
        {/* Grid responsivo para los controles */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 items-end">
          {/* Search Input - ocupa toda la fila en mobile, 2 columnas en tablet+, 2 columnas en desktop, 3 en XL */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-3">
            <label
              htmlFor={searchId}
              className="block text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3"
            >
              Término de búsqueda
            </label>
            <div className="relative group">
              <input
                id={searchId}
                type="text"
                value={filters.searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 pr-14 transition-all duration-300 group-hover:bg-white/15"
              />
              <button
                type="button"
                onClick={handleManualSearch}
                className="absolute inset-y-0 right-3 flex items-center p-2 text-gray-300 hover:text-cyan-400 hover:bg-white/10 rounded-lg transition-all duration-300 group-hover:scale-105"
                title="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Type - 1 columna en mobile, 1 en tablet+, 1 en desktop, 1 en XL */}
          <div className="col-span-1">
            <label
              htmlFor={filterTypeId}
              className="block text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3"
            >
              Buscar por
            </label>
            <div className="relative group">
              <select
                id={filterTypeId}
                value={filters.filterType}
                onChange={(e) => handleFilterTypeChange(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-sm appearance-none cursor-pointer transition-all duration-300 group-hover:bg-white/15"
              >
                {memoizedFilterOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sort Options - Solo cuando showSort es true */}
          {showSort && memoizedSortOptions.length > 0 && (
            <>
              {/* Sort By - 1 columna */}
              <div className="col-span-1">
                <label
                  htmlFor={sortById}
                  className="block text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3"
                >
                  Ordenar por
                </label>
                <div className="relative group">
                  <select
                    id={sortById}
                    value={filters.sortBy}
                    onChange={(e) => handleSortChange("sortBy", e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-sm appearance-none cursor-pointer transition-all duration-300 group-hover:bg-white/15"
                  >
                    {memoizedSortOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-cyan-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sort Order - 1 columna */}
              <div className="col-span-1">
                <label
                  htmlFor={sortOrderId}
                  className="block text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3"
                >
                  Orden
                </label>
                <div className="relative group">
                  <select
                    id={sortOrderId}
                    value={filters.sortOrder}
                    onChange={(e) =>
                      handleSortChange("sortOrder", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-sm appearance-none cursor-pointer transition-all duration-300 group-hover:bg-white/15"
                  >
                    <option value="desc" className="bg-gray-800">Desc</option>
                    <option value="asc" className="bg-gray-800">Asc</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Clear Button - Se ajusta automáticamente según el espacio disponible */}
          <div className="col-span-1">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-400/30 hover:border-red-400/50 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium backdrop-blur-sm hover:scale-105 active:scale-95"
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
            <div className="relative mt-6 pt-6 border-t border-white/20">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-medium">
                  Filtros activos:
                </span>
                {filters.searchTerm && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-200 font-medium backdrop-blur-sm">
                    "{filters.searchTerm}"
                  </span>
                )}
                {filters.filterType !== memoizedFilterOptions[0]?.value && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-200 font-medium backdrop-blur-sm">
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
