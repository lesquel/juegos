import axios from "axios";
import { CategoryGameGameAdapter } from "../adapters/category-game.adapter";
import { useQuery } from "@tanstack/react-query";

export class CategoryGameClientData {
  private static readonly BASE_URL = "/data/";

  public static getCategoryGames() {
    return useQuery({
      queryKey: ["category-games"],
      queryFn: () =>
        axios
          .get(CategoryGameClientData.BASE_URL + "category-games.json")
          .then((response) => {
            return CategoryGameGameAdapter.adaptList(response.data);
          }),
    });
  }

  public static getCategoryGameDetail(id: number) {
    return useQuery({
      queryKey: ["category-games", id],
      queryFn: () =>
        axios
          .get(`${CategoryGameClientData.BASE_URL}category-game${id}.json`)
          .then((response) => {
            return CategoryGameGameAdapter.adaptDetail(response.data);
          }),
    });
  }
}
