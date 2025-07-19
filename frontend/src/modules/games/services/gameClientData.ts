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
      queryFn: () =>
        axios
          .get(`${GameClientData.BASE_URL}${endpoints.games.getId(id)}`)
          .then((response) => {
            return GameAdapter.adaptDetail(response.data);
          }),
    });
  }
}
