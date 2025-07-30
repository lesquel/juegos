export const SingleGameSkeleton = () => {
  return (
    <div className="w-full p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Game Details Section */}
      <div className="container mx-auto pt-5 pb-10">
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Left Column: Image & Button */}
            <div className="lg:col-span-2 flex flex-col items-center gap-8">
              <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-600/50 shimmer"></div>
              </div>
              <div className="w-full h-16 rounded-2xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 shimmer shadow-2xl"></div>
            </div>

            {/* Right Column: Info */}
            <div className="lg:col-span-3 flex flex-col gap-8">
              <div className="space-y-6">
                <div className="h-14 md:h-16 lg:h-20 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-2xl shimmer w-4/5"></div>
                
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 4 }, () => crypto.randomUUID()).map((id) => (
                    <div key={id} className="h-8 w-24 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded-full shimmer"></div>
                  ))}
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded shimmer w-full"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded shimmer w-4/5"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded shimmer w-3/5"></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4">
                  <div className="h-6 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded shimmer w-2/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="h-12 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-xl shimmer w-2/5 mb-4"></div>
          <div className="h-32 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded-xl shimmer"></div>
        </div>
        
        {Array.from({ length: 3 }, () => crypto.randomUUID()).map((id) => (
          <div key={id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="h-24 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded-xl shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
