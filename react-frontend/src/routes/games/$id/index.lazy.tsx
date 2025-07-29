import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SingleGame } from "@/modules/games/components/SingleGame";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/games/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <ErrorBoundary>
      <main className="h-full flex-grow bg-gray-900 relative">
        <SingleGame id={id} />
      </main>
    </ErrorBoundary>
  );
}
