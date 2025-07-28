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
    `w-10 h-10 flex items-center justify-center rounded-full text-white transition-all duration-300 ease-in-out hover:scale-110 hover:brightness-125 hover:shadow-lg focus:ring-white ${color} cursor-pointer`,
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
    <div className="flex justify-center items-center space-x-4 pt-3">
      <button
        disabled={isFirstPage}
        onClick={prevPage}
        className={buttonClasses}
        aria-label="Página anterior"
      >
        {prevIcon}
      </button>

      <p className="text-gray-400 text-sm">
        Página {pagination.page} de {info.pages}
      </p>

      <button
        disabled={isLastPage}
        onClick={nextPage}
        className={buttonClasses}
        aria-label="Página siguiente"
      >
        {nextIcon}
      </button>
    </div>
  );
});

PaginationComponent.displayName = "PaginationComponent";
