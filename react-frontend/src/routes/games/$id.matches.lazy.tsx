import { ListMatchesByGameId } from "@/modules/games/components/match/ListMatchesByGameId";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/games/$id/matches")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <main className="h-full flex-grow flex items-center justify-center bg-gray-900 relative">
      <ListMatchesByGameId id={id} />
    </main>
  );
}
