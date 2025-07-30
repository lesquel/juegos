export const SingleCategoryGameSkeleton = () => {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
          <div className="h-5 w-1/3 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded shimmer"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 items-start">
          {/* Left Column: Category Details */}
          <aside className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
              {/* Fondo decorativo */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
              
              <div className="relative space-y-6">
                {/* Image skeleton */}
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-700/50 to-gray-600/50 shimmer"></div>
                </div>

                <div className="space-y-6 text-center">
                  {/* Header skeleton */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                      <div className="h-6 w-6 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded shimmer"></div>
                    </div>
                    <div className="h-10 w-2/3 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded-xl shimmer"></div>
                  </div>

                  {/* Description skeleton */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded shimmer w-full"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded shimmer w-4/5"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded shimmer w-3/5"></div>
                    </div>
                  </div>

                  {/* Stats skeleton */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4 text-center">
                      <div className="h-8 w-8 mx-auto bg-gradient-to-r from-purple-400/50 to-cyan-400/50 rounded shimmer mb-2"></div>
                      <div className="h-3 w-12 mx-auto bg-gradient-to-r from-gray-500/50 to-gray-400/50 rounded shimmer"></div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-4 text-center">
                      <div className="h-8 w-8 mx-auto bg-gradient-to-r from-yellow-400/50 to-orange-400/50 rounded shimmer mb-2"></div>
                      <div className="h-3 w-12 mx-auto bg-gradient-to-r from-gray-500/50 to-gray-400/50 rounded shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Games List skeleton */}
          <main className="lg:col-span-2 space-y-6">
            {Array.from({ length: 6 }, () => crypto.randomUUID()).map((id) => (
              <div
                key={id}
                className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
              >
                <div className="h-20 w-full bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded-xl shimmer"></div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};
