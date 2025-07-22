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
    <div className="min-h-full flex-grow bg-gray-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 items-start">
          {/* Left Column (Category Details) */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start">
            <div className="space-y-6 bg-gray-900 text-white rounded-2xl p-6 shadow-xl md:max-w-3xl md:m-auto">
              <img 
                src={data?.category_img} 
                alt={`Imagen de la categoría ${data?.category_name}`}
                className="w-full h-48 object-cover rounded-lg bg-gray-800"
              />
              <div className="space-y-3 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-400">
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
      </div>
    </div>
  );
};
