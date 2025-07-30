export const CardCategoryGameSkeleton = () => {
  return (
    <div className="relative block rounded-3xl overflow-hidden shadow-2xl">
      {/* Contenedor de imagen con parallax */}
      <div className="relative h-64 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-600/50 shimmer"></div>
        
        {/* Overlay base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Bordes con efecto glass */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl"></div>
      </div>

      {/* Contenido */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
        <div className="relative">
          {/* Fondo glassmorphism para el contenido */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 -m-4 p-4"></div>
          
          <div className="relative space-y-3">
            <div className="h-7 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded-lg shimmer w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded shimmer w-full"></div>
              <div className="h-4 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded shimmer w-2/3"></div>
            </div>
            <div className="h-5 bg-gradient-to-r from-gray-500/50 to-gray-400/50 rounded shimmer w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
