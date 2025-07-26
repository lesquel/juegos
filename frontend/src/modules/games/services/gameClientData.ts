import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GameAdapter } from "../adapters/game.adapter";
import { environment } from "@config/environment";
import type { Pagination } from "@models/paguination";
import { PaguinationCategoryAdapter } from "@adapters/paguinationCategory.adapter";
import { endpoints } from "@config/endpoints";

export class GameClientData {
  private static readonly BASE_URL = environment.BASE_URL;

  public static getGames(paguination: Pagination) {
    return useQuery({
      queryKey: ["games", paguination],
      gcTime: 1000 * 60 * 30, // 30 minutos en cache
      staleTime: 1000 * 60 * 15, // 15 minutos sin refetch
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      queryFn: () =>
        axios
          .get(
            GameClientData.BASE_URL +
              endpoints.games.get +
              PaguinationCategoryAdapter.adaptPaguinationGames(paguination)
          )
          .then((response) => {
            return GameAdapter.adaptList(response.data);
          }),
    });
  }

  public static getGameDetail(id: string) {
    return useQuery({
      queryKey: ["game-detail", id],
      gcTime: 1000 * 60 * 30, // 30 minutos en cache
      staleTime: 1000 * 60 * 20, // 20 minutos sin refetch
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      queryFn: () =>
        axios
          .get(`${GameClientData.BASE_URL}${endpoints.games.getId(id)}`)
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
      staleTime: 1000 * 60 * 15, // 15 minutos sin refetch
      gcTime: 1000 * 60 * 30, // 30 minutos en cache
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      queryFn: () =>
        axios
          .get(
            `${
              GameClientData.BASE_URL
            }${endpoints.categories.getGamesByCategoryId(id)}`
          )
          .then((response) => {
            console.log("data game", response.data);
            return GameAdapter.adaptList(response.data);
          }),
    });
  }
}
