import type { Info } from "@models/info.model";
import type { Pagination } from "@models/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

interface PaginationComponentProps {
  pagination: Pagination;
  info: Info;
  color?: string;
  setPagination: (pagination: Pagination) => void;
}

export const PaginationComponent = memo(({
  pagination,
  info,
  color = "bg-gradient-to-r from-teal-500 to-cyan-400",
  setPagination,
}: PaginationComponentProps) => {
  const nextPage = useCallback(() => {
    if (!info.next) return;
    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  }, [info.next, pagination, setPagination]);

  const prevPage = useCallback(() => {
    if (!info.prev) return;
    setPagination({
      ...pagination,
      page: pagination.page - 1,
    });
  }, [info.prev, pagination, setPagination]);

  // Memoizar clases de botón
  const buttonClasses = useMemo(() =>
    `relative w-12 h-12 flex items-center justify-center rounded-xl text-white transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/20 overflow-hidden group ${color} cursor-pointer`,
    [color]
  );

  // Memoizar estado de botones
  const isFirstPage = useMemo(() => pagination.page === 1, [pagination.page]);
  const isLastPage = useMemo(() => pagination.page === info.pages, [pagination.page, info.pages]);

  // Memoizar iconos
  const prevIcon = useMemo(() => (
    <ChevronLeft />
  ), []);

  const nextIcon = useMemo(() => (
    <ChevronRight />
  ), []);

  return (
    <div className="flex justify-center items-center space-x-6 pt-6">
      <button
        disabled={isFirstPage}
        onClick={prevPage}
        className={
          isFirstPage 
            ? "relative w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 cursor-not-allowed opacity-50"
            : buttonClasses
        }
        aria-label="Página anterior"
      >
        {/* Efecto de brillo para botones activos */}
        {!isFirstPage && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        )}
        <div className="relative z-10">
          {prevIcon}
        </div>
      </button>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3">
        <p className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent text-sm font-semibold">
          Página {pagination.page} de {info.pages}
        </p>
      </div>

      <button
        disabled={isLastPage}
        onClick={nextPage}
        className={
          isLastPage 
            ? "relative w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 cursor-not-allowed opacity-50"
            : buttonClasses
        }
        aria-label="Página siguiente"
      >
        {/* Efecto de brillo para botones activos */}
        {!isLastPage && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        )}
        <div className="relative z-10">
          {nextIcon}
        </div>
      </button>
    </div>
  );
});

PaginationComponent.displayName = "PaginationComponent";
