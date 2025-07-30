import { createFileRoute } from "@tanstack/react-router";
import MaquinaTragamonedasGame from "@all-games/marketplace/maquina-tragamonedas-react/MaquinaTragamonedasGame";

export const Route = createFileRoute("/play/marketplace/maquinaTragamonedas")({
  component: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <MaquinaTragamonedasGame />
    </div>
  ),
});
