import { createLazyFileRoute } from "@tanstack/react-router";
import { TicTacGame } from "@all-games/online/tic-tac/TicTacGame";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { environment } from "@/config/environment";

export const Route = createLazyFileRoute("/play/online/tictac")({
  component: TicTacGamePage,
});

function TicTacGamePage() {
  // Get URL parameters for online mode testing
  const urlParams = new URLSearchParams(window.location.search);
  const user = useAuthStore.getState().user;
  const matchId = urlParams.get("match_id");

  // Provide fallback values if user or tokens are not available
  const authToken = user?.access_token?.access_token || "fallback_token";
  const wsUrl = environment.WS_URL + "/ws/games";

  // Redirect back if no match_id is provided since game is online-only
  if (!matchId) {
    return (
      <div className="w-full ">
        <div className="mb-4 p-4 bg-red-900/50 rounded-lg text-center text-white">
          <p className="text-sm">
            ❌ Error: match_id es requerido. El juego solo funciona en modo online.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <TicTacGame
        onBack={() => window.history.back()}
        isOnlineMode={true}
        roomCode={matchId}
        authToken={authToken}
        wsUrl={wsUrl}
      />
    </div>
  );
}
