import { CategoryGameClientData } from "../services/categoryGameClientData";
import { memo } from "react";

interface SingleCategoryGameProps {
  id: string;
}

export const SingleCategoryGameDebug = memo(({ id }: SingleCategoryGameProps) => {
  console.log('🏷️ SingleCategoryGameDebug component rendering with ID:', id);
  
  const { data, isLoading, error } = CategoryGameClientData.getCategoryGameDetail(id);

  console.log('📊 SingleCategoryGameDebug data state:', { 
    hasData: !!data, 
    isLoading, 
    hasError: !!error,
    errorMessage: error ? String(error) : null
  });

  if (isLoading) {
    console.log('⏳ SingleCategoryGameDebug showing loading state');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl">Loading category...</h2>
          <p className="text-gray-400">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('❌ SingleCategoryGameDebug showing error state:', error);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center bg-red-900 bg-opacity-50 p-8 rounded-lg border border-red-600 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error loading category</h2>
          <p className="text-red-300 mb-6">{String(error)}</p>
          <p className="text-gray-400 text-sm">Category ID: {id}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    console.log('📭 SingleCategoryGameDebug no data available');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No category data found</h2>
          <p className="text-gray-400">Category ID: {id}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ SingleCategoryGameDebug rendering with data:', data.category_name);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{data.category_name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <img
              src={data.category_img}
              alt={data.category_name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Category Details</h2>
            <p className="text-gray-300">{data.category_description}</p>
            
            <div className="mt-4">
              <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm">
                Category Details
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Debug Info</h3>
          <pre className="text-sm text-gray-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
});

SingleCategoryGameDebug.displayName = "SingleCategoryGameDebug";
