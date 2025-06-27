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
    <div>
      <h2>Categorías</h2>

      {categories?.map((category) => {
        return (
          <TagCategoryGame key={category.category_id} category={category} />
        );
      })}
    </div>
  );
};
