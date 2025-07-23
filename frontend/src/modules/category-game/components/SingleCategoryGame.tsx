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
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 items-start container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 min-h-full">
      {/* Left Column (Category Details) */}
      <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start ">
        <div className="space-y-6 bg-gray-800 text-white rounded-2xl p-6 shadow-2xl border border-gray-700 md:max-w-3xl md:m-auto">
          <img 
            src={data?.category_img} 
            alt={`Imagen de la categoría ${data?.category_name}`}
            className="w-full h-48 object-cover rounded-lg bg-gray-800 transform transition-transform duration-300 hover:scale-105"
          />
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 to-teal-400 bg-clip-text text-transparent">
              {data?.category_name}
            </h1>
            <p className="text-white leading-relaxed">
              {data?.category_description}
            </p>
          </div>
        </div>
      </aside>

      {/* Right Column (Scrollable Content) */}
      <main className="lg:col-span-2 mt-12 lg:mt-0">
        <ListTagsGames categoryId={data?.category_id as string} />
      </main>

    </div>
  );
};
