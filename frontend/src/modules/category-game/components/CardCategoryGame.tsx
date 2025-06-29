import type { CategoryGame } from "../models/category-game.model";

export const CardCategoryGame = ({ category }: { category: CategoryGame }) => {
  const { category_id, category_name, category_img } =
    category;
  return (
    <div>
      <h2>{category_name}</h2>
      <img src={category_img} alt={category_name} />
      <a href={`/categories/${category_id}`}>Ver mas</a>
    </div>
  );
};
