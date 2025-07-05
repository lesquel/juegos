import type { CategoryGame } from "@modules/category-game/models/category-game.model";
import { TagCategoryGame } from "./TagCategoryGame";

export const ListTagCategoryGame = ({
  categories,
}: {
  categories?: CategoryGame[];
}) => {
  if (!categories || categories.length === 0)
    return <div>No hay categorias</div>;
  return (
    <div className="flex flex-col gap-2 p-4 border-1 rounded-2xl">
      <h2 className="text-md font-medium">Categorías</h2>
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => {
          return (
            <TagCategoryGame key={category.category_id} category={category} />
          );
        })}
      </div>
    </div>
  );
};
