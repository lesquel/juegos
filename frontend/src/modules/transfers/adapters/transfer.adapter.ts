import type { Transfer, TransferList } from "../models/transfer.model";

export class TransferAdapter {
  static adaptTransfer(transfer: any): Transfer {
    return {
      created_at: transfer.created_at,
      updated_at: transfer.updated_at,
      transfer_id: transfer.transfer_id,
      user_id: transfer.user_id,
      transfer_img: transfer.transfer_img,
      transfer_amount: transfer.transfer_amount,
      transfer_state: transfer.transfer_state,
      transfer_description: transfer.transfer_description,
    };
  }

  static adaptTransferDetail(transfer: any): Transfer {
    return {
      transfer_id: transfer.transfer_id,
      user_id: transfer.user_id,
      transfer_img: transfer.transfer_img,
      transfer_amount: transfer.transfer_amount,
      transfer_state: transfer.transfer_state,
      transfer_description: transfer.transfer_description,
      created_at: transfer.created_at,
      updated_at: transfer.updated_at,
    };
  }
  static adaptTransferList(transfer: any): TransferList {
    return {
      info: transfer.info,
      results: transfer.results.map((transfer: any) =>
        this.adaptTransfer(transfer)
      ),
    };
  }
}
