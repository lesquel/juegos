import React, { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { categoryGameRoutesConfig } from "../../config/category-game.routes.config";
import type { CategoryGame } from "../../models/category-game.model";
import { Tag } from "lucide-react";

interface TagCategoryGameProps {
  category: CategoryGame;
}

export const TagCategoryGame: React.FC<TagCategoryGameProps> = memo(
  ({ category }) => {
    const { category_id, category_name } = category;

    // Memoizar icono de categoríategory }) => {
    const { category_id, category_name } = category;

    // Memoizar icono de categoría useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { categoryGameRoutesConfig } from "../../config/category-game.routes.config";
import type { CategoryGame } from "../../models/category-game.model";
import { Tag } from "lucide-react";

interface TagCategoryGameProps {
  category: CategoryGame;
}

export const TagCategoryGame: React.FC<TagCategoryGameProps> = memo(
  ({ category }) => {
    const { category_id, category_name } = category;

    // Memoizar URL de navegación
    const categoryUrl = useMemo(
      () => `${categoryGameRoutesConfig.base}/${category_id}`,
      [category_id]
    );

    // Memoizar icono de categoría
    const categoryIcon = useMemo(() => <Tag className="h-4 w-4" />, []);

    return (
      <Link
        to="/category-games/$id"
        params={{ id: category_id }}
        className="inline-flex items-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl transition-all duration-200 text-white font-medium shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label={`Ver categoría ${category_name}`}
      >
        {categoryIcon}
        <span className="text-sm">{category_name}</span>
      </Link>
    );
  }
);

TagCategoryGame.displayName = "TagCategoryGame";
