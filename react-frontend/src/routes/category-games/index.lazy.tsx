import { UseListCategoryGame } from "@/modules/category-game/components/ListCategoryGame";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/category-games/")({
  component: CategoryGamesIndexPage,
});

function CategoryGamesIndexPage() {
  return (
    <main className="h-full flex-grow  relative">
      <UseListCategoryGame />
    </main>
  );
}
