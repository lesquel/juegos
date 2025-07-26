import React, { memo, useMemo } from "react";
import { categoryGameRoutesConfig } from "../../config/category-game.routes.config";
import type { CategoryGame } from "../../models/category-game.model";

interface TagCategoryGameProps {
  category: CategoryGame;
}

export const TagCategoryGame: React.FC<TagCategoryGameProps> = memo(({ category }) => {
  const { category_id, category_name } = category;
  
  // Memoizar URL de navegación
  const categoryUrl = useMemo(() => 
    `${categoryGameRoutesConfig.base}/${category_id}`, 
    [category_id]
  );

  // Memoizar icono de categoría
  const categoryIcon = useMemo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ), []);

  return (
    <a
      href={categoryUrl}
      className="inline-flex items-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl transition-all duration-200 text-white font-medium shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label={`Ver categoría ${category_name}`}
    >
      {categoryIcon}
      <span className="text-sm">{category_name}</span>
    </a>
  );
});

TagCategoryGame.displayName = "TagCategoryGame";
