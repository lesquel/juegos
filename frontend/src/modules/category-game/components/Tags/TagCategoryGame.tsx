import { categoryGameRoutesConfig } from "../../config/category-game.routes.config";
import type { CategoryGame } from "../../models/category-game.model";

export const TagCategoryGame = ({ category }: { category: CategoryGame }) => {
  const { category_id, category_name } = category;
  return (
    <a href={`${categoryGameRoutesConfig.base}/${category_id}`} className="p-3 bg-blue-200 rounded-2xl hover:bg-blue-300 transition-colors">
      <p className="text-sm">{category_name}</p>
    </a>
  );
};
