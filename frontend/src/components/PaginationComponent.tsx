import type { Info } from "@models/info.model";
import type { Pagination } from "@models/paguination";

export const PaginationComponent = ({
  pagination,
  info,
  color, // Default gradient
  setPagination,
}: {
  pagination: Pagination;
  info: Info;
  color?: string; // Optional color prop
  setPagination: (pagination: any) => void;
}) => {
  const nextPage = () => {
    if (!info.next) return;
    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  };

  const prevPage = () => {
    if (!info.prev) return;
    setPagination({
      ...pagination,
      page: pagination.page - 1,
    });
  };

  // Combine classes for easier maintenance
  const buttonClasses = `w-10 h-10 flex items-center justify-center rounded-full text-white transition-all duration-300 ease-in-out hover:scale-110 hover:brightness-125 hover:shadow-lg focus:ring-white ${color} cursor-pointer`;

  return (
    <div className="flex justify-center items-center space-x-4 pt-3">
      <button
        disabled={pagination.page === 1}
        onClick={prevPage}
        className={buttonClasses}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <p className="text-gray-400 text-sm">
        Página {pagination.page} de {info.pages}
      </p>

      <button
        disabled={pagination.page === info.pages}
        onClick={nextPage}
        className={buttonClasses}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};
