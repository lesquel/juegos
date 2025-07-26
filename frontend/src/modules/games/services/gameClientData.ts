import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GameAdapter } from "../adapters/game.adapter";
import { environment } from "@config/environment";
import type { Pagination } from "@models/paguination";
import { PaguinationCategoryAdapter } from "@adapters/paguinationCategory.adapter";
import { endpoints } from "@config/endpoints";
import type { PaguinationGames } from "../adapters/paguination-games";

// Configuración optimizada para mejor rendimiento
const QUERY_CONFIG = {
  gcTime: 1000 * 60 * 60, // 1 hora en cache
  staleTime: 1000 * 60 * 30, // 30 minutos sin refetch
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: 1, // Solo 1 reintento para fallos
  retryDelay: 1000, // 1 segundo entre reintentos
};

export class GameClientData {
  private static readonly BASE_URL = environment.BASE_URL;

  public static getGames(paguination: PaguinationGames) {
    return useQuery({
      queryKey: ["games", paguination],
      ...QUERY_CONFIG,
      queryFn: () =>
        axios
          .get(
            GameClientData.BASE_URL +
              endpoints.games.get +
              PaguinationCategoryAdapter.adaptPaguinationGames(paguination),
            {
              timeout: 5000, // 5 segundos timeout
            }
          )
          .then((response) => {
            return GameAdapter.adaptList(response.data);
          }),
    });
  }

  public static getGameDetail(id: string) {
    return useQuery({
      queryKey: ["game-detail", id],
      ...QUERY_CONFIG,
      queryFn: () =>
        axios
          .get(`${GameClientData.BASE_URL}${endpoints.games.getId(id)}`, {
            timeout: 5000,
          })
          .then((response) => {
            console.log("response", response.data);
            return GameAdapter.adaptDetail(response.data);
          }),
    });
  }

  public static getGamesByCategoryId(id: string) {
    console.log("id", id);
    console.log(
      "url",
      `${GameClientData.BASE_URL}${endpoints.games.getCategoriesByGameId(id)}`
    );
    return useQuery({
      queryKey: ["games-by-category", id],
      ...QUERY_CONFIG,
      queryFn: () =>
        axios
          .get(
            `${
              GameClientData.BASE_URL
            }${endpoints.categories.getGamesByCategoryId(id)}`,
            {
              timeout: 5000,
            }
          )
          .then((response) => {
            console.log("data game", response.data);
            return GameAdapter.adaptList(response.data);
          }),
    });
  }
}
