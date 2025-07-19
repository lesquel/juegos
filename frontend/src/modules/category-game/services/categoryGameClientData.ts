import axios from "axios";
import { CategoryGameGameAdapter } from "../adapters/category-game.adapter";
import { useQuery } from "@tanstack/react-query";
import { environment } from "@config/environment";
import type { PaguinationCategory } from "../models/paguination-category";
import { PaguinationCategoryAdapter } from "@adapters/paguinationCategory.adapter";
import { endpoints } from "@config/endpoints";
import { Cat } from "lucide-react";
import { GameAdapter } from "@modules/games/adapters/game.adapter";

export class CategoryGameClientData {
  private static readonly BASE_URL = environment.BASE_URL;

  public static getCategoryGames(paguination: PaguinationCategory) {
    return useQuery({
      queryKey: ["category-games", paguination],
      queryFn: () =>
        axios
          .get(
            CategoryGameClientData.BASE_URL +
              endpoints.categories.get +
              PaguinationCategoryAdapter.adaptPaguinationCategory(paguination)
          )
          .then((response) => {
            return CategoryGameGameAdapter.adaptList(response.data);
          }),
    });
  }

  public static getCategoryGameDetail(id: string) {
    return useQuery({
      queryKey: ["category-games", id],
      queryFn: () =>
        axios
          .get(
            `${CategoryGameClientData.BASE_URL}${endpoints.categories.getId(
              id
            )}`
          )
          .then((response) => {
            return CategoryGameGameAdapter.adaptDetail(response.data);
          }),
    });
  }

  public static getCategoriesByGameId(id: string) {
    return useQuery({
      queryKey: ["category-games", id],
      queryFn: () =>
        axios
          .get(
            `${
              CategoryGameClientData.BASE_URL
            }${endpoints.games.getCategoriesByGameId(id)}`
          )
          .then((response) => {
            console.log(response.data);
            return CategoryGameGameAdapter.adaptList(response.data);
          }),
    });
  }
}
