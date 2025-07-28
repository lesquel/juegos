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

const BASE_URL = environment.API_URL;

// Hook exports for proper React Query usage
export const useMatchesByGameId = (gameId: string, pagination: PaginationMatch) => {
  return useQuery({
    queryKey: ["matches", gameId, pagination],
    ...MATCH_QUERY_CONFIG,
    queryFn: () => {
      return axios
        .get(
          `${BASE_URL}${endpoints.matches.getMatchesByGameId(
            gameId
          )}${PaginationCategoryAdapter.adaptPaginationMatch(pagination)}`,
          MATCH_AXIOS_CONFIG
        )
        .then((response) => {
          return MatchAdapter.adaptList(response.data);
        });
    },
  });
};

export const useMatch = (id: string) => {
  return useQuery({
    queryKey: ["matches", id],
    ...MATCH_QUERY_CONFIG,
    queryFn: () => {
      return axios
        .get(`${BASE_URL}${endpoints.matches.getMathes(id)}`, MATCH_AXIOS_CONFIG)
        .then((response) => {
          return MatchAdapter.adapt(response.data);
        });
    },
  });
};

export const useJoinMatch = (id: string, onSuccess?: (data: Match) => void) => {
  return useMutation({
    ...MATCH_MUTATION_CONFIG,
    mutationFn: (data: JoinMatch) => {
      return axios.post(
        `${BASE_URL}${endpoints.matches.joinMatch(id)}`,
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
};

export const useMatchParticipants = (id: string) => {
  return useQuery({
    queryKey: ["matches", id, "participants"],
    ...MATCH_QUERY_CONFIG,
    queryFn: () => {
      return axios
        .get(
          `${BASE_URL}${endpoints.matches.getPartcipants(id)}`,
          MATCH_AXIOS_CONFIG
        )
        .then((response) => {
          return MatchAdapter.adaptParticipants(response.data);
        });
    },
  });
};

export const useFinishMatch = (id: string) => {
  return useMutation({
    ...MATCH_MUTATION_CONFIG,
    mutationFn: (data: FinishMatch) => {
      return axios.put(
        `${BASE_URL}${endpoints.matches.finisMatch(id)}`,
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
};

export const useCreateMatch = (gameId: string, onSuccess?: (data: Match) => void) => {
  return useMutation({
    ...MATCH_MUTATION_CONFIG,
    mutationFn: (data: CreateMatch) => {
      return axios.post(
        `${BASE_URL}${endpoints.matches.createMatch(gameId)}`,
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
};

// Keep class for backward compatibility if needed
export class MatchClientData {
  private static readonly BASE_URL = environment.API_URL;

  // Note: These static methods are deprecated - use the hook exports above
  public static getMatchesByGameId(_gameId: string, _pagination: PaginationMatch) {
    console.warn('MatchClientData.getMatchesByGameId is deprecated. Use useMatchesByGameId hook instead.');
    // Return a placeholder for backward compatibility
    return { data: null, isLoading: false, error: null };
  }

  public static getMatch(_id: string) {
    console.warn('MatchClientData.getMatch is deprecated. Use useMatch hook instead.');
    // Return a placeholder for backward compatibility
    return { data: null, isLoading: false, error: null };
  }

  public static joinMatch(_id: string, _onSuccess?: (data: Match) => void) {
    console.warn('MatchClientData.joinMatch is deprecated. Use useJoinMatch hook instead.');
    // Return a placeholder for backward compatibility
    return { mutate: () => {}, isLoading: false, error: null };
  }

  public static getMatchParticipants(_id: string) {
    console.warn('MatchClientData.getMatchParticipants is deprecated. Use useMatchParticipants hook instead.');
    // Return a placeholder for backward compatibility
    return { data: null, isLoading: false, error: null };
  }

  public static finishMatch(_id: string) {
    console.warn('MatchClientData.finishMatch is deprecated. Use useFinishMatch hook instead.');
    // Return a placeholder for backward compatibility
    return { mutate: () => {}, isLoading: false, error: null };
  }

  public static createMatch(_gameId: string, _onSuccess?: (data: Match) => void) {
    console.warn('MatchClientData.createMatch is deprecated. Use useCreateMatch hook instead.');
    // Return a placeholder for backward compatibility
    return { mutate: () => {}, isLoading: false, error: null };
  }
}
