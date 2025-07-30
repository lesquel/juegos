import React, { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { CategoryGameClientData } from "../services/categoryGameClientData";
import { ListTagsGames } from "@modules/games/components/tags/ListTagsGames";
import { SingleCategoryGameSkeleton } from "./SingleCategoryGameSkeleton";
import { ArrowRight, Clock, Copy } from "lucide-react";

interface SingleCategoryGameProps {
  id: string;
}

export const SingleCategoryGame: React.FC<SingleCategoryGameProps> = memo(
  ({ id }) => {
    return <UseSingleCategoryGame id={id} />;
  }
);

SingleCategoryGame.displayName = "SingleCategoryGame";

const UseSingleCategoryGame: React.FC<{ id: string }> = memo(({ id }) => {
  const { data, isLoading, error } =
    CategoryGameClientData.getCategoryGameDetail(id);

  // Memoizar estado de error
  const errorState = useMemo(() => {
    if (!error) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center bg-red-500/10 backdrop-blur-sm border border-red-500/30 p-12 rounded-3xl max-w-md shadow-2xl">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Error al cargar categoría
          </h2>
          <p className="text-red-300 mb-8 leading-relaxed">{error.message}</p>
          <Link
            to="/category-games"
            className="inline-block bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Volver a categorías
          </Link>
        </div>
      </div>
    );
  }, [error]);

  // Memoizar imagen con manejo de errores
  const categoryImage = useMemo(() => {
    if (!data?.category_img || !data?.category_name) return null;

    return (
      <div className="relative overflow-hidden rounded-2xl group">
        <img
          src={data.category_img}
          alt={`Imagen de la categoría ${data.category_name}`}
          className="w-full h-48 object-cover bg-gray-800 transform transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-category.jpg"; // Imagen de fallback
          }}
        />
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    );
  }, [data?.category_img, data?.category_name]);

  // Memoizar icono de categoría
  const categoryIcon = useMemo(() => <Copy />, []);

  // Memoizar breadcrumb
  const breadcrumb = useMemo(
    () => (
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-3 text-sm bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
          <li>
            <Link
              to="/"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              Inicio
            </Link>
          </li>
          <li>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </li>
          <li>
            <Link
              to="/category-games"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              Categorías
            </Link>
          </li>
          <li>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </li>
          <li className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-medium">{data?.category_name}</li>
        </ol>
      </nav>
    ),
    [data?.category_name]
  );

  const ListSkeleton = useMemo(
    () => <SingleCategoryGameSkeleton />,
    [isLoading, error]
  );

  if (isLoading) return ListSkeleton;
  if (error) return errorState;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {breadcrumb}

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 items-start">
          {/* Left Column (Category Details) */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start mb-8 lg:mb-0">
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
              {/* Fondo decorativo */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
              
              <div className="relative space-y-6">
                {categoryImage}

                <div className="space-y-6 text-center">
                  <header className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                      {categoryIcon}
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {data?.category_name}
                    </h1>
                  </header>

                  {data?.category_description && (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                      <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                        {data.category_description}
                      </p>
                    </div>
                  )}

                  {/* Category Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        ∞
                      </div>
                      <div className="text-xs text-gray-300">Juegos</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-4 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">★</div>
                      <div className="text-xs text-gray-300">Popular</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column (Games List) */}
          <main className="lg:col-span-2">
            {data?.category_id && (
              <ListTagsGames categoryId={data.category_id} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
});

UseSingleCategoryGame.displayName = "UseSingleCategoryGame";
