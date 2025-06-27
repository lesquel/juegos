import { QueryProvider } from "@providers/QueryProvider";
import { CategoryGameClientData } from "../services/categoryGameClientData";
import { CardCategoryGame } from "./CardCategoryGame";

export const ListCategoryGame = () => {
  return (
    <QueryProvider>
      <UseListCategoryGame />
    </QueryProvider>
  );
};

const UseListCategoryGame = () => {
  const { data, isLoading, error } = CategoryGameClientData.getCategoryGames();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      {data?.results.map((category) => {
        return (
          <CardCategoryGame key={category.category_id} category={category} />
        );
      })}
    </div>
  );
};
