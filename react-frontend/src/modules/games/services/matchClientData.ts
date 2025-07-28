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
import type { PaginationMatch } from "../models/pagination-match";
import { PaginationCategoryAdapter } from "@adapters/paginationCategory.adapter";

// Configuración optimizada para datos de partidas
const MATCH_QUERY_CONFIG = {
  gcTime: 1000 * 60 * 30, // 30 minutos en cache
  staleTime: 1000 * 60 * 10, // 10 minutos sin refetch
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: true, // Reconectar al reestablecer conexión
  retry: 2,
  retryDelay: 1000,
};

const MATCH_MUTATION_CONFIG = {
  retry: 1,
  retryDelay: 500,
};

const MATCH_AXIOS_CONFIG = {
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  }
};

export class MatchClientData {
  private static readonly BASE_URL = environment.BASE_URL;

  public static getMatchesByGameId(gameId: string, paguination: PaginationMatch) {
    return useQuery({
      queryKey: ["matches", gameId, paguination],
      ...MATCH_QUERY_CONFIG,
      queryFn: () => {
        return axios
          .get(
            `${MatchClientData.BASE_URL}${endpoints.matches.getMatchesByGameId(
              gameId
            )}${PaginationCategoryAdapter.adaptPaginationMatch(paguination)}`,
            MATCH_AXIOS_CONFIG
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
      ...MATCH_QUERY_CONFIG,
      queryFn: () => {
        return axios
          .get(`${MatchClientData.BASE_URL}${endpoints.matches.getMathes(id)}`,
            MATCH_AXIOS_CONFIG)
          .then((response) => {
            return MatchAdapter.adapt(response.data);
          });
      },
    });
  }

  public static joinMatch(id: string, onSuccess?: (data: Match) => void) {
    return useMutation({
      ...MATCH_MUTATION_CONFIG,
      mutationFn: (data: JoinMatch) => {
        return axios.post(
          `${MatchClientData.BASE_URL}${endpoints.matches.joinMatch(id)}`,
          data,
          {
            ...MATCH_AXIOS_CONFIG,
            headers: {
              ...MATCH_AXIOS_CONFIG.headers,
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
      ...MATCH_QUERY_CONFIG,
      queryFn: () => {
        return axios
          .get(
            `${MatchClientData.BASE_URL}${endpoints.matches.getPartcipants(id)}`,
            MATCH_AXIOS_CONFIG
          )
          .then((response) => {
            return MatchAdapter.adaptParticipants(response.data);
          });
      },
    });
  }

  public static finishMatch(id: string) {
    return useMutation({
      ...MATCH_MUTATION_CONFIG,
      mutationFn: (data: FinishMatch) => {
        return axios.put(
          `${MatchClientData.BASE_URL}${endpoints.matches.finisMatch(id)}`,
          data,
          MATCH_AXIOS_CONFIG
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
      ...MATCH_MUTATION_CONFIG,
      mutationFn: (data: CreateMatch) => {
        return axios.post(
          `${MatchClientData.BASE_URL}${endpoints.matches.createMatch(gameId)}`,
          data,
          {
            ...MATCH_AXIOS_CONFIG,
            headers: {
              ...MATCH_AXIOS_CONFIG.headers,
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
