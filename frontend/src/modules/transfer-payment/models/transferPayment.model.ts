import type { Info } from "@models/info.model";

export enum TransferStateEnum {
  Rejected = -1,
  Pending = 0,
  Approved = 1,
}

export interface TransferPayment {
  transfer_id: number;
  user_id: number;
  transfer_img: string;
  transfer_amount: number;
  transfer_state: TransferStateEnum;
  create_at: Date;
  update_at: Date;
}

export interface TransferPaymentList {
  info: Info;
  results: TransferPayment[];
}
