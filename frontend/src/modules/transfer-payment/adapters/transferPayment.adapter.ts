import type {
  TransferPayment,
  TransferPaymentList,
  TransferStateEnum,
} from "../models/transferPayment.model";

export class TransferPaymentAdapter {
  static adapt(transferPayment: any): TransferPayment {
    return {
      transfer_id: transferPayment.transfer_id,
      user_id: transferPayment.user_id,
      transfer_img: transferPayment.transfer_img,
      transfer_amount: transferPayment.transfer_amount,
      transfer_state: transferPayment.transfer_state as TransferStateEnum,
      create_at: new Date(transferPayment.create_at),
      update_at: new Date(transferPayment.update_at),
    };
  }
  static adaptMyList(transferPayments: any): TransferPaymentList {
    return {
      info: {
        count: transferPayments.info.count,
        pages: transferPayments.info.pages,
        next: transferPayments.info.next,
        prev: transferPayments.info.prev,
      },
      results: transferPayments.results.map((transferPayment: any) => {
        return TransferPaymentAdapter.adapt(transferPayment);
      }),
    };
  }
}
