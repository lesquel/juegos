import { GameClientData } from "../services/gameClientData";
import { ListTagCategoryGame } from "@modules/category-game/components/Tags/ListTagCategoryGame";
import { ListCommentGame } from "@modules/comment-game/components/ListCommentGame";
import { NewCommentForm } from "@modules/comment-game/components/NewCommentForm";
import { PlayCircle } from "lucide-react";
import { GameType } from "../models/game.model";
import { memo, useMemo } from "react";
import { SingleGameSkeleton } from "./SingleGameSkeleton";
import { Link } from "@tanstack/react-router";

interface SingleGameProps {
  id: string;
}

export const SingleGame = memo(({ id }: SingleGameProps) => {
  return <UseSingleGame id={id} />;
});

SingleGame.displayName = "SingleGame";

const UseSingleGame = memo(({ id }: SingleGameProps) => {
  console.log("🎯 SingleGame component rendering with ID:", id);

  const { data, isLoading, error } = GameClientData.getGameDetail(id);

  // Memoizar la URL del juego
  const gameUrl = useMemo(() => {
    if (!data) return "/"; // Default or loading state URL
    return data.game_type === GameType.online ? `matches` : "/" + data.game_url;
  }, [data?.game_type, data?.game_id, data?.game_url]);

  // Memoizar el icono del botón play
  const playIcon = useMemo(() => <PlayCircle className="w-6 h-6" />, []);

  console.log("📊 SingleGame data state:", {
    hasData: !!data,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message,
  });

  if (isLoading) {
    console.log("⏳ SingleGame showing loading state");
    return <SingleGameSkeleton />;
  }

  if (error) {
    console.log("❌ SingleGame showing error state:", error);
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <div className="text-center bg-red-500/10 backdrop-blur-sm border border-red-500/30 p-8 rounded-2xl max-w-md shadow-2xl">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Error loading game
          </h2>
          <p className="text-red-300 mb-6">{error.message}</p>
          <p className="text-gray-400 text-sm">Game ID: {id}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    console.log("📭 SingleGame no data available");
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <div className="text-center bg-white/5 backdrop-blur-sm border border-white/20 p-8 rounded-2xl max-w-md shadow-2xl">
          <div className="mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent mb-4">
            No game data found
          </h2>
          <p className="text-gray-400">Game ID: {id}</p>
        </div>
      </div>
    );
  }

  console.log("✅ SingleGame rendering with data:", data.game_name);

  return (
    <div className="w-full p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Game Details Section */}
      <div className="container mx-auto pt-5 pb-10">
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Left Column: Image & Play Button */}
            <div className="lg:col-span-2 flex flex-col items-center gap-8">
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl group">
                {/* Contenedor de imagen con efectos */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={data.game_img}
                  alt={data.game_name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay con efectos de cristal */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
              </div>
              
              <Link
                to={gameUrl}
                className="relative w-full text-center bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-500 text-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group overflow-hidden"
              >
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative z-10 flex items-center gap-3">
                  {playIcon}
                  <span>Jugar Ahora</span>
                </div>
              </Link>
            </div>

            {/* Right Column: Info */}
            <div className="lg:col-span-3 flex flex-col gap-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight break-words leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {data.game_name}
                  </span>
                </h1>
                
                <div className="flex flex-wrap items-center gap-3">
                  <ListTagCategoryGame gameId={data.game_id} />
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {data.game_description}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4">
                  <p className="text-white flex items-center gap-2">
                    <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                      Tipo de juego:
                    </span> 
                    <span className="text-gray-200 font-medium">{data.game_type}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="space-y-8">
        <NewCommentForm gameId={id} />
        <ListCommentGame gameId={id} />
      </div>
    </div>
  );
});
