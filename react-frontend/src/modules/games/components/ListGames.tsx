import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import GamesLayout from "./GamesLayout";
import GamesHeader from "./GamesHeader";
import ListGamesContent from "./ListGamesContent";

export type GameTab = "offline" | "online" | "luck";

export const ListGames = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as any;
  
  // Inicializar tab desde URL params o usar default
  const initialTab = useMemo((): GameTab => {
    return searchParams?.tab || "offline";
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState<GameTab>(initialTab);

  // Función para actualizar URL cuando cambie el tab
  const updateUrl = useCallback((newTab: GameTab, additionalParams?: Record<string, any>) => {
    const params: Record<string, any> = {
      tab: newTab,
      ...additionalParams,
    };

    // Solo incluir tab si no es el default
    if (newTab === "offline") {
      delete params.tab;
    }

    navigate({
      to: '/games',
      search: params,
      replace: true,
    });
  }, [navigate]);

  // Función para cambiar tab que también actualiza la URL
  const handleSetActiveTab = useCallback((newTab: GameTab) => {
    setActiveTab(newTab);
    updateUrl(newTab);
  }, [updateUrl]);

  // Sincronizar estado local con URL params cuando cambien
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <GamesLayout>
      <GamesHeader />
      <ListGamesContent 
        activeTab={activeTab} 
        setActiveTab={handleSetActiveTab}
        updateUrl={updateUrl}
      />
    </GamesLayout>
  );
};
