import React, { memo, useMemo } from "react";
import { QueryProvider } from "@providers/QueryProvider";
import { CategoryGameClientData } from "../services/categoryGameClientData";
import { LoadingComponent } from "@components/LoadingComponent";
import { ListTagsGames } from "@modules/games/components/tags/ListTagsGames";

interface SingleCategoryGameProps {
  id: string;
}

export const SingleCategoryGame: React.FC<SingleCategoryGameProps> = memo(({ id }) => {
  return (
    <QueryProvider>
      <UseSingleCategoryGame id={id} />
    </QueryProvider>
  );
});

SingleCategoryGame.displayName = "SingleCategoryGame";

const UseSingleCategoryGame: React.FC<{ id: string }> = memo(({ id }) => {
  const { data, isLoading, error } = CategoryGameClientData.getCategoryGameDetail(id);

  // Memoizar estado de error
  const errorState = useMemo(() => {
    if (!error) return null;
    
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center bg-red-900 bg-opacity-50 p-8 rounded-lg border border-red-600 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error al cargar categoría</h2>
          <p className="text-red-300 mb-6">{error.message}</p>
          <a 
            href="/categories" 
            className="inline-block bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-2 px-4 rounded-lg hover:from-teal-600 hover:to-cyan-500 transition duration-300"
          >
            Volver a categorías
          </a>
        </div>
      </div>
    );
  }, [error]);

  // Memoizar imagen con manejo de errores
  const categoryImage = useMemo(() => {
    if (!data?.category_img || !data?.category_name) return null;
    
    return (
      <img 
        src={data.category_img} 
        alt={`Imagen de la categoría ${data.category_name}`}
        className="w-full h-48 object-cover rounded-lg bg-gray-800 transform transition-transform duration-300 hover:scale-105"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder-category.jpg'; // Imagen de fallback
        }}
      />
    );
  }, [data?.category_img, data?.category_name]);

  // Memoizar icono de categoría
  const categoryIcon = useMemo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ), []);

  // Memoizar breadcrumb
  const breadcrumb = useMemo(() => (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            Inicio
          </a>
        </li>
        <li>
          <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </li>
        <li>
          <a href="/categories" className="text-gray-400 hover:text-white transition-colors">
            Categorías
          </a>
        </li>
        <li>
          <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </li>
        <li className="text-white font-medium">
          {data?.category_name}
        </li>
      </ol>
    </nav>
  ), [data?.category_name]);

  if (isLoading) return <LoadingComponent />;
  if (error) return errorState;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {breadcrumb}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 items-start">
          {/* Left Column (Category Details) */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start mb-8 lg:mb-0">
            <div className="space-y-6 bg-gray-800 bg-opacity-50 rounded-2xl p-6 shadow-2xl border border-gray-700 backdrop-blur-lg">
              {categoryImage}
              
              <div className="space-y-4 text-center">
                <header className="flex items-center justify-center gap-3 mb-4">
                  {categoryIcon}
                  <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 to-teal-400 bg-clip-text text-transparent">
                    {data?.category_name}
                  </h1>
                </header>
                
                {data?.category_description && (
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {data.category_description}
                  </p>
                )}
                
                {/* Category Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {/* Podríamos agregar un contador de juegos aquí */}
                      ∞
                    </div>
                    <div className="text-xs text-gray-400">Juegos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-400">
                      ★
                    </div>
                    <div className="text-xs text-gray-400">Popular</div>
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
