import axios from "axios";
import { CategoryGameGameAdapter } from "../adapters/category-game.adapter";
import { useQuery } from "@tanstack/react-query";
import { environment } from "@config/environment";
import type { PaginationCategory } from "../models/pagination-category";
import { PaginationCategoryAdapter } from "@adapters/paginationCategory.adapter";
import { endpoints } from "@config/endpoints";

// Configuración optimizada para datos de categorías de juegos
const CATEGORY_QUERY_CONFIG = {
  gcTime: 1000 * 60 * 60, // 1 hora en cache - las categorías cambian poco
  staleTime: 1000 * 60 * 30, // 30 minutos sin refetch
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: 2,
  retryDelay: 1000,
};

const CATEGORY_AXIOS_CONFIG = {
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
};

const BASE_URL = environment.API_URL;

export const useCategoryGames = (paguination: PaginationCategory) => {
  console.log("paguination", paguination);
  console.log(
    "url",
    `${BASE_URL}${endpoints.categories.get}`
  );
  return useQuery({
    queryKey: ["category-games", paguination],
    ...CATEGORY_QUERY_CONFIG,
    queryFn: () =>
      axios
        .get(
          BASE_URL +
            endpoints.categories.get +
            PaginationCategoryAdapter.adaptPaguinationCategory(paguination),
          CATEGORY_AXIOS_CONFIG
        )
        .then((response) => {
          return CategoryGameGameAdapter.adaptList(response.data);
        }),
  });
};

export const useCategoryGameDetail = (id: string) => {
  return useQuery({
    queryKey: ["category-games", id],
    ...CATEGORY_QUERY_CONFIG,
    queryFn: () =>
      axios
        .get(
          `${BASE_URL}${endpoints.categories.getId(id)}`,
          CATEGORY_AXIOS_CONFIG
        )
        .then((response) => {
          return CategoryGameGameAdapter.adaptDetail(response.data);
        }),
  });
};

export const useCategoriesByGameId = (id: string) => {
  return useQuery({
    queryKey: ["category-games", id],
    ...CATEGORY_QUERY_CONFIG,
    queryFn: () =>
      axios
        .get(
          `${BASE_URL}${endpoints.games.getCategoriesByGameId(id)}`,
          CATEGORY_AXIOS_CONFIG
        )
        .then((response) => {
          console.log(response.data);
          return CategoryGameGameAdapter.adaptList(response.data);
        }),
  });
};

// Clase para compatibilidad hacia atrás
export class CategoryGameClientData {
  static readonly getCategoryGames = useCategoryGames;
  static readonly getCategoryGameDetail = useCategoryGameDetail;
  static readonly getCategoriesByGameId = useCategoriesByGameId;
}
