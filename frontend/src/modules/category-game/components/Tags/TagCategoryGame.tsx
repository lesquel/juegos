import { categoryGameRoutesConfig } from "../../config/category-game.routes.config";
import type { CategoryGame } from "../../models/category-game.model";

export const TagCategoryGame = ({ category }: { category: CategoryGame }) => {
  const { category_id, category_name } = category;
  return (
    <a href={`${categoryGameRoutesConfig.base}/${category_id}`}>
      <h2>{category_name}</h2>
    </a>
  );
};
