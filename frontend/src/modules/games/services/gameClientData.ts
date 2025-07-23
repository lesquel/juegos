import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GameAdapter } from "../adapters/game.adapter";
import { environment } from "@config/environment";
import type { Paguination } from "@models/paguination";
import { PaguinationCategoryAdapter } from "@adapters/paguinationCategory.adapter";
import { endpoints } from "@config/endpoints";

export class GameClientData {
  private static readonly BASE_URL = environment.BASE_URL;

  public static getGames(paguination: Paguination) {
    return useQuery({
      queryKey: ["games", paguination],
      gcTime: 1000 * 60 * 10,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
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
      queryKey: ["games", id],
      gcTime: 1000 * 60 * 10,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      queryFn: () =>
        axios
          .get(`${GameClientData.BASE_URL}${endpoints.games.getId(id)}`)
          .then((response) => {
            response.data.game_type = "online";
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
      queryKey: ["games", id],
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
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
