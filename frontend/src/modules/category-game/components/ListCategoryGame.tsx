import { QueryProvider } from "@providers/QueryProvider";
import { CategoryGameClientData } from "../services/categoryGameClientData";
import { CardCategoryGame } from "./CardCategoryGame";
import { LoadingComponent } from "@components/LoadingComponent";

export const ListCategoryGame = () => {
  return (
    <QueryProvider>
      <UseListCategoryGame />
    </QueryProvider>
  );
};

const UseListCategoryGame = () => {
  const { data, isLoading, error } = CategoryGameClientData.getCategoryGames();
  if (isLoading) return <LoadingComponent />;
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
