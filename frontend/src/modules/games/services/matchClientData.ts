import { endpoints } from "@config/endpoints";
import { environment } from "@config/environment";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MatchAdapter } from "../adapters/match.adapter";
import type { ErrorResponseErrorsArray } from "@models/errorResponse";
import type {
  CreateMatch,
  FinishMatch,
  JoinMatch,
  Match,
} from "../models/match.model";
import { useAuthStore } from "@modules/auth/store/auth.store";
import type { Paguination } from "@models/paguination";
import { PaguinationCategoryAdapter } from "@adapters/paguinationCategory.adapter";

export class MatchClientData {
  private static readonly BASE_URL = environment.BASE_URL;

  public static getMatchesByGameId(gameId: string, paguination: Paguination) {
    return useQuery({
      queryKey: ["matches", gameId, paguination],
      queryFn: () => {
        return axios
          .get(
            `${MatchClientData.BASE_URL}${endpoints.matches.getMatchesByGameId(
              gameId
            )}${PaguinationCategoryAdapter.adaptPaguination(paguination)}`
          )
          .then((response) => {
            return MatchAdapter.adaptList(response.data);
          });
      },
    });
  }

  public static getMatch(id: string) {
    return useQuery({
      queryKey: ["matches", id],
      queryFn: () => {
        return axios
          .get(`${MatchClientData.BASE_URL}${endpoints.matches.getMathes(id)}`)
          .then((response) => {
            return MatchAdapter.adapt(response.data);
          });
      },
    });
  }

  public static joinMatch(id: string, onSuccess?: (data: Match) => void) {
    return useMutation({
      mutationFn: (data: JoinMatch) => {
        return axios.post(
          `${MatchClientData.BASE_URL}${endpoints.matches.joinMatch(id)}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                useAuthStore.getState().user?.access_token.access_token
              }`,
            },
          }
        );
      },
      onSuccess: (data) => {
        onSuccess?.(MatchAdapter.adapt(data.data));
        console.log("match join", data);
      },
      onError: (error: ErrorResponseErrorsArray) => {
        console.error("onError:", error);
      },
    });
  }

  public static getMatchParticipants(id: string) {
    return useQuery({
      queryKey: ["matches", id, "participants"],
      queryFn: () => {
        return axios
          .get(
            `${MatchClientData.BASE_URL}${endpoints.matches.getPartcipants(id)}`
          )
          .then((response) => {
            return MatchAdapter.adaptParticipants(response.data);
          });
      },
    });
  }

  public static finishMatch(id: string) {
    return useMutation({
      mutationFn: (data: FinishMatch) => {
        return axios.put(
          `${MatchClientData.BASE_URL}${endpoints.matches.finisMatch(id)}`,
          data
        );
      },
      onSuccess: (data) => {
        console.log("match finish", data);
      },
      onError: (error: ErrorResponseErrorsArray) => {
        console.error("onError:", error);
      },
    });
  }

  public static createMatch(gameId: string, onSuccess?: (data: Match) => void) {
    return useMutation({
      mutationFn: (data: CreateMatch) => {
        return axios.post(
          `${MatchClientData.BASE_URL}${endpoints.matches.createMatch(gameId)}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                useAuthStore.getState().user?.access_token.access_token
              }`,
            },
          }
        );
      },
      onSuccess: (data) => {
        onSuccess?.(MatchAdapter.adapt(data.data));

        console.log("match create", data);
      },
      onError: (error: ErrorResponseErrorsArray) => {
        console.error("onError:", error);
      },
    });
  }
}
