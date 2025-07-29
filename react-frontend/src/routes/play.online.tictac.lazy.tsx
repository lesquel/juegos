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
  const isOnlineMode = !!matchId;
  
  // Provide fallback values if user or tokens are not available
  const authToken = user?.access_token?.access_token || "fallback_token";
  const wsUrl = environment.WS_URL + "/ws/games";

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!matchId && (
          <div className="mb-4 p-4 bg-blue-900/50 rounded-lg text-center text-white">
            <p className="text-sm">🎮 Modo offline - Añade ?match_id=test123 para modo online</p>
          </div>
        )}
        <TicTacGame
          onBack={() => window.history.back()}
          isOnlineMode={isOnlineMode}
          roomCode={matchId || undefined}
          authToken={authToken}
          wsUrl={wsUrl}
        />
      </div>
    </div>
  );
}
