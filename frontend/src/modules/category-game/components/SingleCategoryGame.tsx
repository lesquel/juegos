import { QueryProvider } from "@providers/QueryProvider";
import { CategoryGameClientData } from "../services/categoryGameClientData";

export const SingleCategoryGame = ({ id }: { id: number }) => {
  return (
    <QueryProvider>
      <UseSingleCategoryGame id={id} />
    </QueryProvider>
  );
};

const UseSingleCategoryGame = ({ id }: { id: number }) => {
  const { data, isLoading, error } =
    CategoryGameClientData.getCategoryGameDetail(id);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <h1>{data?.category_name}</h1>
      <img src={data?.category_img} alt={data?.category_name} />
      <p>{data?.category_description}</p>
      <p>Status: {data?.status ? "true" : "false"}</p>
    </div>
  );
};
