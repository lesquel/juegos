import { QueryProvider } from "@providers/QueryProvider";
import { CategoryGameClientData } from "../services/categoryGameClientData";
import { CardCategoryGame } from "./CardCategoryGame";
import { LoadingComponent } from "@components/LoadingComponent";
import type { PaguinationCategory } from "../models/paguination-category";
import { useState } from "react";
import { PaguinationComponent } from "@components/PaguinationComponent";

export const ListCategoryGame = () => {
  return (
    <QueryProvider>
      <UseListCategoryGame />
    </QueryProvider>
  );
};

const UseListCategoryGame = () => {
  const [paguination, setPaguination] = useState<PaguinationCategory>({
    page: 1,
    limit: 10,
  });
  const { data, isLoading, error } =
    CategoryGameClientData.getCategoryGames(paguination);

  if (isLoading) return <LoadingComponent />;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );

  if (!data?.results || data.results.length === 0)
    return (
      <div className="text-center text-red-400">
        No hay categorías de juegos
      </div>
    );
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-white">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400">
          Categorías de Juegos
        </span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mb-6">
        {data?.results.map((category) => (
          <CardCategoryGame key={category.category_id} category={category} />
        ))}
      </div>

      <PaguinationComponent
        paguination={paguination}
        setPaguination={setPaguination}
        info={data.info}
        color="bg-purple-600"
      />
    </div>
  );
};
