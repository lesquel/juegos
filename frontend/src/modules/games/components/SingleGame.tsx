import { QueryProvider } from "@providers/QueryProvider";
import { GameClientData } from "../services/gameClientData";
import { ListTagCategoryGame } from "@modules/category-game/components/Tags/ListTagCategoryGame";
import { LoadingComponent } from "@components/LoadingComponent";
import { ListCommentGame } from "@modules/comment-game/components/ListCommentGame";
import { NewCommentForm } from "@modules/comment-game/components/NewCommentForm";
import { PlayCircle } from "lucide-react";

export const SingleGame = ({ id }: { id: string }) => {
  return (
    <QueryProvider>
      <UseSingleGame id={id} />
    </QueryProvider>
  );
};

const UseSingleGame = ({ id }: { id: string }) => {
  const { data, isLoading, error } = GameClientData.getGameDetail(id);

  if (isLoading) return <LoadingComponent />;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );

  console.log(data);
  return (
    <div className="w-full p-10">
      {/* Game Details Section */}
      <div className="container mx-auto px-6 lg:max-w-5xl pt-5 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left Column: Image & Play Button */}
          <div className="lg:col-span-2 flex flex-col items-center gap-6">
            <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800">
              <img
                src={data?.game_img}
                alt={data?.game_name}
                className="w-full h-full object-cover"
              />
            </div>
            <a
              href={data?.game_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out text-xl transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <PlayCircle className="w-6 h-6" />
              <span>Jugar Ahora</span>
            </a>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight break-words">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-300 ">
                {data?.game_name}
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <ListTagCategoryGame gameId={data?.game_id as string} />{" "}
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {data?.game_description}
            </p>

            <p>
              <span className="text-white">Tipo de juego:</span> {data?.game_type}
            </p>
          </div>
        </div>
      </div>
      {/* Comments Section */}
      <NewCommentForm gameId={id} />
      <ListCommentGame gameId={id} />
    </div>
  );
};
