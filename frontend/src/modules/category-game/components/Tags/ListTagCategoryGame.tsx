import { TagCategoryGame } from "./TagCategoryGame";
import { LoadingComponent } from "@components/LoadingComponent";
import { CategoryGameClientData } from "@modules/category-game/services/categoryGameClientData";

export const ListTagCategoryGame = ({ gameId }: { gameId: string }) => {
  const { data, isLoading, error } =
    CategoryGameClientData.getCategoriesByGameId(gameId);

  // if (isLoading) return <LoadingComponent />;
  if (isLoading) return <div className="text-white texxt-center">Loading...</div>;;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );
  if (!data?.results || data.results.length === 0)
    return <div className="text-center text-red-400">No hay categorias</div>;
  return (
    <div className="flex flex-col gap-2 p-4 border-1 rounded-2xl w-full bg-gray-800 text-white">
      <h2 className="text-md font-medium">Categorías</h2>
      <div className="flex flex-wrap gap-2">
        {data?.results.map((category) => {
          return (
            <TagCategoryGame key={category.category_id} category={category} />
          );
        })}
      </div>
    </div>
  );
};
