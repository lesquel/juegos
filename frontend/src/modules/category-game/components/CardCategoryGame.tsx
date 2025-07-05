import type { CategoryGame } from "../models/category-game.model";

export const CardCategoryGame = ({ category }: { category: CategoryGame }) => {
  const { category_id, category_name, category_img } =
    category;
  return (
    <a href={`/categories/${category_id}`}
      className="block text-white rounded-lg overflow-hidden
                transform transition-all duration-300 ease-in-out hover:scale-102 group">
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
        <img src={category_img} alt={category_name} className="w-full h-full object-cover"/>
      </div>
      <div className="p-4 bg-gray-700">
        <h2 className="text-purple-400 text-lg font-medium mb-1">{category_name}</h2>
        <p>Ver la vaina</p>
      </div>
    </a>
  );
};
