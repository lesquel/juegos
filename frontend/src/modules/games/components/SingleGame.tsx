import { QueryProvider } from "@providers/QueryProvider";
import { GameClientData } from "../services/gameClientData";
import { ListTagCategoryGame } from "@modules/category-game/components/Tags/ListTagCategoryGame";

export const SingleGame = ({ id }: { id: number }) => {
  return (
    <QueryProvider>
      <UseSingleGame id={id} />
    </QueryProvider>
  );
};

const UseSingleGame = ({ id }: { id: number }) => {
  const { data, isLoading, error } = GameClientData.getGameDetail(id);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <h1>{data?.game_name}</h1>
      <img src={data?.game_img} alt={data?.game_name} />
      <p>{data?.game_description}</p>
      <a href={data?.game_url}>Jugar</a>

      <h2>Categorías</h2>
      <ListTagCategoryGame categories={data?.categories} />
    </div>
  );
};
