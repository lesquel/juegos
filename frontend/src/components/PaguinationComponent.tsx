import type { Info } from "@models/info.model";
import type { Paguination } from "@models/paguination";

export const PaguinationComponent = ({
  paguination,
  info,
  setPaguination,
}: {
  paguination: Paguination;
  info: Info;
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

  return (
    <div className="flex justify-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            disabled={paguination.page === 1}
            onClick={() => prevPage()}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out"
          >
            Anterior
          </button>
        </div>
        <div className="flex items-center">
          <p className="text-gray-400 text-sm">
            Página {paguination.page} de {info.pages}
          </p>
        </div>
        <div className="flex items-center">
          <button
            disabled={paguination.page === info.pages}
            onClick={() => nextPage()}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
