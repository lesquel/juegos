import { environment } from "@config/environment";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TransferAdapter } from "../adapters/transfer.adapter";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { ErrorResponseAdapter } from "@adapters/errorResponse.adapter";
import type { ErrorResponseErrorsArray } from "@models/errorResponse";
import type { TransferInputModel } from "../models/transfer.model";
import { endpoints } from "@config/endpoints";

export class TransferDataClient {
  private static readonly BASE_URL = environment.BASE_URL;
  private static readonly user = useAuthStore.getState().user;
  static getTransfers() {
    return useQuery({
      queryKey: ["transfers"],
      queryFn: () =>
        axios
          .get(
            `${TransferDataClient.BASE_URL}${endpoints.transferPayment.get(
              TransferDataClient.user?.user.user_id as string
            )}`
          )
          .then((response) => {
            return TransferAdapter.adaptTransferList(response.data);
          }),
    });
  }
  static uploadTransfer() {
    return useMutation({
      mutationFn: async (data: TransferInputModel) => {
        const formData = new FormData();
        formData.append("transfer_img", data.transfer_img);
        formData.append("transfer_amount", data.transfer_amount.toString());
        if (data.transfer_description) {
          formData.append("transfer_description", data.transfer_description);
        }

        try {
          const response = await axios.post(
            `${TransferDataClient.BASE_URL}${endpoints.transferPayment.post}`,
            formData,
            {
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
        console.log("Transferencia registrada", data);
      },
      onError: (error: ErrorResponseErrorsArray) => {
        console.error("onError:", error);
      },
    });
  }
  static getTransferDetail(id: string) {
    return useQuery({
      queryKey: ["transfers", id],
      queryFn: () =>
        axios
          .get(
            `${TransferDataClient.BASE_URL}${endpoints.transferPayment.getId(
              id
            )}`,
            {
              headers: {
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
  }
}
