import { QueryProvider } from "@providers/QueryProvider";
import { GameClientData } from "../services/gameClientData";
import { ListTagCategoryGame } from "@modules/category-game/components/Tags/ListTagCategoryGame";
import { LoadingComponent } from "@components/LoadingComponent";
import { ListCommentGame } from "@modules/comment-game/components/ListCommentGame";

export const SingleGame = ({ id }: { id: number }) => {
  return (
    <QueryProvider>
      <UseSingleGame id={id} />
    </QueryProvider>
  );
};

const UseSingleGame = ({ id }: { id: number }) => {
  const { data, isLoading, error } = GameClientData.getGameDetail(id);
  if (isLoading) return <LoadingComponent />;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="flex flex-col gap-4 h-full min-h-full items-center justify-center md:max-w-[900px] mx-auto">
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center md:items-start p-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="w-full md:w-96 h-64 flex items-center justify-center border-1 rounded-2xl overflow-hidden">
            <img src={data?.game_img} alt={data?.game_name} />
          </div>
          <a href={data?.game_url} className="p-3 w-full bg-gray-800 rounded-2xl text-white text-center">Jugar Ahora!</a>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-2xl font-bold text-center">{data?.game_name}</h1>
          <p className="text-sm opacity-70">{data?.game_description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint veritatis pariatur, dolorem dolores asperiores nihil nulla at dolor rem beatae quo, error nemo sapiente debitis dicta praesentium sit perspiciatis commodi?</p>
          <ListTagCategoryGame categories={data?.categories} />
        </div>
      </div>
      <ListCommentGame commentGames={data?.comments} />
    </div>
  );
};
