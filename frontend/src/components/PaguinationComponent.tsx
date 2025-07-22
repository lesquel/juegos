import type { Info } from "@models/info.model";
import type { Paguination } from "@models/paguination";

export const PaguinationComponent = ({
  paguination,
  info,
  color, // Default gradient
  setPaguination,
}: {
  paguination: Paguination;
  info: Info;
  color?: string; // Optional color prop
  setPaguination: (paguination: any) => void;
}) => {
  const nextPage = () => {
    if (!info.next) return;
    setPaguination({
      ...paguination,
      page: paguination.page + 1,
    });
  };

  const prevPage = () => {
    if (!info.prev) return;
    setPaguination({
      ...paguination,
      page: paguination.page - 1,
    });
  };

  // Combine classes for easier maintenance
  const buttonClasses = `w-10 h-10 flex items-center justify-center rounded-full text-white disabled:opacity-50 transition-all duration-300 ease-in-out hover:scale-110 hover:brightness-125 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ${color} cursor-pointer`;

  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        disabled={paguination.page === 1}
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
        Página {paguination.page} de {info.pages}
      </p>

      <button
        disabled={paguination.page === info.pages}
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
