import { environment } from "@config/environment";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import { TransferAdapter } from "../adapters/transfer.adapter";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { ErrorResponseAdapter } from "@adapters/errorResponse.adapter";
import type { ErrorResponseErrorsArray } from "@models/errorResponse";
import type { TransferInputModel } from "../models/transfer.model";
import { endpoints } from "@config/endpoints";
import { GlobalInfoAdapter } from "@adapters/globalInfo.adapter";

// Configuración optimizada para datos de transferencias
const TRANSFER_QUERY_CONFIG = {
  gcTime: 1000 * 60 * 20, // 20 minutos en cache
  staleTime: 1000 * 60 * 5, // 5 minutos sin refetch
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: true,
  retry: 2,
  retryDelay: 1000,
};

const TRANSFER_MUTATION_CONFIG = {
  retry: 1,
  retryDelay: 1000,
};

const TRANSFER_AXIOS_CONFIG = {
  timeout: 10000, // 10 segundos para uploads
  headers: {
    'Content-Type': 'application/json',
  }
};

const BASE_URL = environment.API_URL;

// Hook exports for proper React Query usage
export const useTransfers = () => {
  const user = useAuthStore.getState().user;
  
  return useQuery({
    queryKey: ["transfers"],
    ...TRANSFER_QUERY_CONFIG,
    queryFn: () =>
      axios
        .get(
          `${BASE_URL}${endpoints.transferPayment.get(
            user?.user.user_id as string
          )}`,
          TRANSFER_AXIOS_CONFIG
        )
        .then((response) => {
          return TransferAdapter.adaptTransferList(response.data);
        }),
  });
};

export const useUploadTransfer = () => {
  const router = useRouter();
  
  return useMutation({
    ...TRANSFER_MUTATION_CONFIG,
    mutationFn: async (data: TransferInputModel) => {
      const formData = new FormData();
      formData.append("transfer_img", data.transfer_img);
      formData.append("transfer_amount", data.transfer_amount.toString());
      if (data.transfer_description) {
        formData.append("transfer_description", data.transfer_description);
      }

      try {
        const response = await axios.post(
          `${BASE_URL}${endpoints.transferPayment.post}`,
          formData,
          {
            timeout: 100000, // Timeout mayor para uploads
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${
                useAuthStore.getState().user?.access_token.access_token
              }`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        throw ErrorResponseAdapter.adaptErrorResponseErrorsArray(
          ErrorResponseAdapter.adaptErrorResponse(error)
        );
      }
    },
    onSuccess: (data) => {
      router.navigate({ to: "/user/me" });
      console.log("Transferencia registrada", data);
    },
    onError: (error: ErrorResponseErrorsArray) => {
      console.error("onError:", error);
    },
  });
};

export const useTransferDetail = (id: string) => {
  return useQuery({
    queryKey: ["transfers", id],
    ...TRANSFER_QUERY_CONFIG,
    queryFn: () =>
      axios
        .get(
          `${BASE_URL}${endpoints.transferPayment.getId(id)}`,
          {
            ...TRANSFER_AXIOS_CONFIG,
            headers: {
              ...TRANSFER_AXIOS_CONFIG.headers,
              Authorization: `Bearer ${
                useAuthStore.getState().user?.access_token.access_token
              }`,
            },
          }
        )
        .then((response) => {
          return TransferAdapter.adaptTransferDetail(response.data);
        }),
  });
};

export const useInfoAccounts = () => {
  return useQuery({
    queryKey: ["infoAccounts"],
    ...TRANSFER_QUERY_CONFIG,
    queryFn: () =>
      axios
        .get(`${BASE_URL}${endpoints.appInfo.get}`, TRANSFER_AXIOS_CONFIG)
        .then((response) => {
          return GlobalInfoAdapter.adaptGlobalInfoAccount(response.data);
        }),
  });
};


