import { QueryProvider } from "@providers/QueryProvider";
import { GameClientData } from "../services/gameClientData";
import { ListTagCategoryGame } from "@modules/category-game/components/Tags/ListTagCategoryGame";
import { ListCommentGame } from "@modules/comment-game/components/ListCommentGame";
import { NewCommentForm } from "@modules/comment-game/components/NewCommentForm";
import { PlayCircle } from "lucide-react";
import { GameType } from "../models/game.model";
import { memo, useMemo } from "react";
import { SingleGameSkeleton } from "./SingleGameSkeleton";

interface SingleGameProps {
  id: string;
}

export const SingleGame = memo(({ id }: SingleGameProps) => {
  return (
    <QueryProvider>
      <UseSingleGame id={id} />
    </QueryProvider>
  );
});

SingleGame.displayName = "SingleGame";

const UseSingleGame = memo(({ id }: SingleGameProps) => {
  const { data, isLoading, error } = GameClientData.getGameDetail(id);

  // Memoizar la URL del juego
  const gameUrl = useMemo(() => {
    if (!data) return "#";
    return data.game_type === GameType.online
      ? `${data.game_id}/matches`
      : "/" + data.game_url;
  }, [data?.game_type, data?.game_id, data?.game_url]);

  // Memoizar el icono del botón play
  const playIcon = useMemo(() => <PlayCircle className="w-6 h-6" />, []);

  // Memoizar el contenido del juego
  const gameContent = useMemo(() => {
    if (!data) return null;

    return (
      <div className="w-full p-10 max-w-6xl">
        {/* Game Details Section */}
        <div className="container mx-auto pt-5 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Left Column: Image & Play Button */}
            <div className="lg:col-span-2 flex flex-col items-center gap-6">
              <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800">
                <img
                  src={data.game_img}
                  alt={data.game_name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <a
                href={gameUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out text-xl transform hover:scale-105 flex items-center justify-center gap-3"
              >
                {playIcon}
                <span>Jugar Ahora</span>
              </a>
            </div>

            {/* Right Column: Info */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight break-words">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-300">
                  {data.game_name}
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <ListTagCategoryGame gameId={data.game_id} />
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {data.game_description}
              </p>
              <p className="text-white">
                <span className="font-bold">Tipo de juego:</span>{" "}
                {data.game_type}
              </p>
            </div>
          </div>
        </div>
        {/* Comments Section */}
        <NewCommentForm gameId={id} />
        <ListCommentGame gameId={id} />
      </div>
    );
  }, [data, gameUrl, playIcon, id]);

  const ListSkeleton = useMemo(
    () => <SingleGameSkeleton />,
    [isLoading, error]
  );

  if (isLoading) return ListSkeleton;
  if (error)
    return (
      <div className="text-center text-red-400 p-8">Error: {error.message}</div>
    );

  return gameContent;
});

UseSingleGame.displayName = "UseSingleGame";
