export const SingleGameSkeleton = () => {
  return (
    <div className="w-full p-10 max-w-6xl animate-pulse">
      {/* Game Details Section */}
      <div className="container mx-auto pt-5 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left Column: Image & Button */}
          <div className="lg:col-span-2 flex flex-col items-center gap-6">
            <div className="w-full aspect-square rounded-3xl bg-gray-700 shadow-2xl border-4 border-gray-800" />
            <div className="w-full h-14 rounded-full bg-gray-700 shadow-lg" />
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="h-12 md:h-16 bg-gray-700 rounded w-3/4" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 w-20 bg-gray-600 rounded-full" />
              ))}
            </div>
            <div className="h-24 bg-gray-700 rounded" />
            <div className="h-6 w-1/3 bg-gray-600 rounded" />
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <div className="h-10 bg-gray-700 rounded w-1/2" />
        <div className="h-24 bg-gray-800 rounded-lg" />
        <div className="h-24 bg-gray-800 rounded-lg" />
        <div className="h-24 bg-gray-800 rounded-lg" />
      </div>
    </div>
  );
};
