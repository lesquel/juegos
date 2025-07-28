import { GameClientData } from "../services/gameClientData";
import { memo } from "react";

interface SingleGameProps {
  id: string;
}

export const SingleGameDebug = memo(({ id }: SingleGameProps) => {
  console.log('🎯 SingleGameDebug component rendering with ID:', id);
  
  const { data, isLoading, error } = GameClientData.getGameDetail(id);

  console.log('📊 SingleGameDebug data state:', { 
    hasData: !!data, 
    isLoading, 
    hasError: !!error,
    errorMessage: error ? String(error) : null
  });

  if (isLoading) {
    console.log('⏳ SingleGameDebug showing loading state');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl">Loading game...</h2>
          <p className="text-gray-400">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('❌ SingleGameDebug showing error state:', error);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center bg-red-900 bg-opacity-50 p-8 rounded-lg border border-red-600 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error loading game</h2>
          <p className="text-red-300 mb-6">{String(error)}</p>
          <p className="text-gray-400 text-sm">Game ID: {id}</p>
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
    console.log('📭 SingleGameDebug no data available');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No game data found</h2>
          <p className="text-gray-400">Game ID: {id}</p>
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

  console.log('✅ SingleGameDebug rendering with data:', data.game_name);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{data.game_name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <img
              src={data.game_img}
              alt={data.game_name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Game Details</h2>
            <p className="text-gray-300">{data.game_description}</p>
            
            <div className="mt-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                {data.game_type}
              </span>
            </div>
            
            <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
              Play Game
            </button>
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

SingleGameDebug.displayName = "SingleGameDebug";
