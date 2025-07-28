import { QueryProvider } from "@providers/QueryProvider";
import { useState } from "react";
import GamesLayout from "./GamesLayout";
import GamesHeader from "./GamesHeader";
import ListGamesContent from "./ListGamesContent";

export type GameTab = "offline" | "online";

export const ListGames = () => {
  const [activeTab, setActiveTab] = useState<GameTab>("offline");
  return (
    <QueryProvider>
      <GamesLayout>
        <GamesHeader />
        <ListGamesContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </GamesLayout>
    </QueryProvider>
  );
};
