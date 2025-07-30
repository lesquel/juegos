import React, { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import type { CategoryGame } from "../../models/category-game.model";
import { Tag } from "lucide-react";

interface TagCategoryGameProps {
  category: CategoryGame;
}

export const TagCategoryGame: React.FC<TagCategoryGameProps> = memo(
  ({ category }) => {
    const { category_id, category_name } = category;

    // Memoizar URL de navegación

    // Memoizar icono de categoría
    const categoryIcon = useMemo(() => <Tag className="h-4 w-4" />, []);

    return (
      <Link
        to="/category-games/$id"
        params={{ id: category_id }}
        className="group inline-flex items-center gap-2 p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/50 rounded-xl transition-all duration-300 text-white font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        aria-label={`Ver categoría ${category_name}`}
      >
        <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
          {categoryIcon}
        </div>
        <span className="text-sm bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
          {category_name}
        </span>
      </Link>
    );
  }
);

TagCategoryGame.displayName = "TagCategoryGame";
