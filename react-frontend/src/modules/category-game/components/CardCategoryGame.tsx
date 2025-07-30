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

  // Memoizar el icono para evitar recreación
  const arrowIcon = useMemo(() => <ArrowRight className="w-5 h-5 ml-2" />, []);

  return (
    <Link
      to={categoryUrl}
      className="relative block rounded-3xl overflow-hidden group transform transition-all duration-500 ease-out hover:scale-105 shadow-2xl hover:shadow-cyan-500/25 h-full"
    >
      {/* Contenedor de imagen con parallax */}
      <div className="relative h-80 sm:h-96 lg:h-[28rem] overflow-hidden">
        <img
          src={category_img}
          alt={category_name}
          loading="lazy"
          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Overlay base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Overlay de hover con efectos de cristal */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-purple-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Bordes con efecto glass */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Contenido */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 sm:p-10 lg:p-12">
        <div className="relative space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Fondo glassmorphism para el contenido */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -m-6 p-6"></div>
          
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent drop-shadow-lg leading-tight">
              {category_name}
            </h2>
            <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-6 sm:mb-7 lg:mb-8 line-clamp-3 leading-relaxed font-medium">
              {category_description}
            </p>
            <div className="flex items-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-bold text-lg sm:text-xl group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
              <span>Explorar Juegos</span>
              <div className="text-current transition-transform duration-300 group-hover:translate-x-1">
                {arrowIcon}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-30"></div>
    </Link>
  );
});

CardCategoryGame.displayName = "CardCategoryGame";
