import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TransferPaymentAdapter } from "../adapters/transferPayment.adapter";

export class TransferPaymentDataClient {
  private static readonly baseUrl = "/data/";

  static getMyTransferPayments() {
    return useQuery({
      queryKey: ["transferPayments"],
      queryFn: () =>
        axios
          .get(TransferPaymentDataClient.baseUrl + "my_transfer_payment.json")
          .then((response) => {
            return TransferPaymentAdapter.adaptMyList(response.data);
          }),
    });
  }
}
