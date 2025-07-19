import { QueryProvider } from "@providers/QueryProvider";
import { CategoryGameClientData } from "../services/categoryGameClientData";
import { LoadingComponent } from "@components/LoadingComponent";
import { ListTagsGames } from "@modules/games/components/tags/ListTagsGames";

export const SingleCategoryGame = ({ id }: { id: string }) => {
  return (
    <QueryProvider>
      <UseSingleCategoryGame id={id} />
    </QueryProvider>
  );
};

const UseSingleCategoryGame = ({ id }: { id: string }) => {
  const { data, isLoading, error } =
    CategoryGameClientData.getCategoryGameDetail(id);
  if (isLoading) return <LoadingComponent />;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <h1>{data?.category_name}</h1>
      <img src={data?.category_img} alt={data?.category_name} />
      <p>{data?.category_description}</p>
      <ListTagsGames categoryId={data?.category_id as string} />
    </div>
  );
};
