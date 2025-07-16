import { QueryProvider } from "@providers/QueryProvider";
import { GameClientData } from "../services/gameClientData";
import { ListTagCategoryGame } from "@modules/category-game/components/Tags/ListTagCategoryGame";
import { LoadingComponent } from "@components/LoadingComponent";
import { ListCommentGame } from "@modules/comment-game/components/ListCommentGame";
import { NewCommentForm } from "@modules/comment-game/components/NewCommentForm";
import { useState } from "react";

export const SingleGame = ({ id }: { id: string }) => {
  return (
    <QueryProvider>
      <UseSingleGame id={id} />
    </QueryProvider>
  );
};

const UseSingleGame = ({ id }: { id: string }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { data, isLoading, error } = GameClientData.getGameDetail(id);

  if (isLoading) return <LoadingComponent />;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );

  return (
    <div className="w-full">
      {/* Game Details Section */}
      <div className="container mx-auto px-6 lg:max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Jugar Ahora</span>
            </a>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-300">
                {data?.game_name}
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <ListTagCategoryGame categories={data?.categories} />
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {data?.game_description} Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Magnam quo id repudiandae soluta ex dolorum ad,
              tenetur sed aliquam ipsa veniam blanditiis perspiciatis esse
              facere quos. Repudiandae ducimus et officia. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Explicabo nesciunt minus,
              deserunt id, sint libero culpa vel cupiditate dolorem veniam,
              debitis odio fuga! Quasi culpa tempora recusandae, expedita sint
              odit.
            </p>
          </div>
        </div>
      </div>
      {/* Comments Section */}
      <NewCommentForm
        gameId={id}
        hasMounted={hasMounted}
        setHasMounted={setHasMounted}
      />
      <ListCommentGame gameId={id} hasMounted={hasMounted} />
    </div>
  );
};
