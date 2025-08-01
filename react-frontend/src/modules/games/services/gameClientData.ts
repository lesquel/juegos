import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GameAdapter } from "../adapters/game.adapter";
import { environment } from "@config/environment";
import { PaginationCategoryAdapter } from "@adapters/paginationCategory.adapter";
import { endpoints } from "@config/endpoints";
import type { PaginationGames } from "../models/pagination-games";

// Configuración optimizada para mejor rendimiento
const QUERY_CONFIG = {
  gcTime: 1000 * 60 * 60, // 1 hora en cache
  staleTime: 1000 * 60 * 30, // 30 minutos sin refetch
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: 3, // Aumentado a 3 reintentos
  retryDelay: 2000, // Aumentado a 2 segundos entre reintentos
};

const BASE_URL = environment.API_URL;

export const useGames = (paguination: PaginationGames) => {
  return useQuery({
    queryKey: ["games", paguination],
    ...QUERY_CONFIG,
    queryFn: () =>
      axios
        .get(
          BASE_URL +
            endpoints.games.get +
            PaginationCategoryAdapter.adaptPaginationGames(paguination),
          {
            timeout: 10000, // Aumentado a 10 segundos timeout
          }
        )
        .then((response) => {
          console.log("response", response.data);
          return GameAdapter.adaptList(response.data);
        }),
  });
};

export const useGameDetail = (id: string) => {
  return useQuery({
    queryKey: ["game-detail", id],
    ...QUERY_CONFIG,
    enabled: !!id, // Solo habilitar la consulta si el ID es válido
    queryFn: () =>
      axios
        .get(`${BASE_URL}${endpoints.games.getId(id)}`, {
          timeout: 10000, // Aumentado a 10 segundos timeout
        })
        .then((response) => {
          console.log("response", response.data);
          return GameAdapter.adaptDetail(response.data);
        }),
  });
};

export const useGamesByCategoryId = (id: string) => {
  console.log("id", id);
  console.log(
    "url",
    `${BASE_URL}${endpoints.games.getCategoriesByGameId(id)}`
  );
  return useQuery({
    queryKey: ["games-by-category", id],
    ...QUERY_CONFIG,
    queryFn: () =>
      axios
        .get(
          `${BASE_URL}${endpoints.categories.getGamesByCategoryId(id)}`,
          {
            timeout: 10000, // Aumentado a 10 segundos timeout
          }
        )
        .then((response) => {
          console.log("data game", response.data);
          return GameAdapter.adaptList(response.data);
        }),
  });
};

// Clase para compatibilidad hacia atrás
export class GameClientData {
  static readonly getGames = useGames;
  static readonly getGameDetail = useGameDetail;
  static readonly getGamesByCategoryId = useGamesByCategoryId;
}
