import { ArrowRight } from "lucide-react";
import type { CategoryGame } from "../models/category-game.model";
import { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";

interface CardCategoryGameProps {
  category: CategoryGame;
}

export const CardCategoryGame = memo(({ category }: CardCategoryGameProps) => {
  const { category_id, category_name, category_img, category_description } =
    category;

  // Memoizar URL de la categoría
  const categoryUrl = useMemo(
    () => `/category-games/${category_id}`,
    [category_id]
  );

  // Memoizar estilos complejos
  const shadowStyles = useMemo(
    () => ({
      boxShadow:
        "0 0 15px rgba(128, 90, 213, 0), 0 0 25px rgba(128, 90, 213, 0)",
    }),
    []
  );

  // Memoizar el icono para evitar recreación
  const arrowIcon = useMemo(() => <ArrowRight className="w-5 h-5 ml-2" />, []);

  return (
    <Link
      to={categoryUrl}
      className="relative block rounded-2xl overflow-hidden group transform transition-all duration-300 ease-in-out hover:scale-105 shadow-lg"
    >
      <div className="absolute inset-0 bg-black opacity-50 z-10 group-hover:opacity-60 transition-opacity duration-300"></div>
      <div
        className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-500 transition-all duration-300 z-20"
        style={shadowStyles}
      ></div>
      <img
        src={category_img}
        alt={category_name}
        loading="lazy"
        className="w-full h-64 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
          {category_name}
        </h2>
        <p className="text-gray-300 text-sm mb-4 h-10 overflow-hidden">
          {category_description}
        </p>
        <div className="flex items-center text-purple-400 font-semibold group-hover:text-purple-300 transition-colors duration-300">
          <span>Explorar Juegos</span>
          {arrowIcon}
        </div>
      </div>
    </Link>
  );
});

CardCategoryGame.displayName = "CardCategoryGame";
