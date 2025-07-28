export const SingleCategoryGameSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white animate-pulse">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 h-5 w-1/3 bg-gray-700 rounded"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 items-start">
          {/* Left Column: Category Details */}
          <aside className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="space-y-6 bg-gray-800 bg-opacity-50 rounded-2xl p-6 shadow-2xl border border-gray-700 backdrop-blur-lg">
              <div className="w-full h-48 bg-gray-700 rounded-lg" />

              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-8 w-8 bg-gray-600 rounded-full" />
                  <div className="h-8 w-2/3 bg-gray-600 rounded" />
                </div>

                <div className="h-16 bg-gray-700 rounded" />

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
                  <div className="text-center">
                    <div className="h-6 w-12 mx-auto bg-purple-500 rounded" />
                    <div className="h-4 w-16 mx-auto bg-gray-600 rounded mt-1" />
                  </div>
                  <div className="text-center">
                    <div className="h-6 w-12 mx-auto bg-teal-400 rounded" />
                    <div className="h-4 w-16 mx-auto bg-gray-600 rounded mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Tags or Games List */}
          <main className="lg:col-span-2 space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-full bg-gray-800 rounded-xl shadow-md"
              />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};
