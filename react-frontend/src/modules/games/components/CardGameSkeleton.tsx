
export const CardGameSkeleton = () => {
  return (
    <div className="relative block rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl h-80 animate-pulse">
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm z-10"></div>
      
      {/* Imagen placeholder con shimmer */}
      <div className="relative h-80 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
      </div>

      {/* Contenido del card */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
        <div className="space-y-4">
          {/* Título del juego */}
          <div className="h-8 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-xl w-3/4 animate-shimmer"></div>
          
          {/* Descripción */}
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-lg w-full animate-shimmer"></div>
            <div className="h-4 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-lg w-2/3 animate-shimmer"></div>
          </div>

          {/* Footer con información y botón */}
          <div className="flex items-center justify-between pt-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="h-3 w-16 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 rounded mb-2 animate-shimmer"></div>
              <div className="h-5 w-12 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 rounded animate-shimmer"></div>
            </div>
            
            <div className="h-12 w-32 rounded-xl bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
