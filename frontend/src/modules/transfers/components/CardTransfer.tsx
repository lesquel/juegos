import type { Transfer } from "../models/transfer.model";

export const CardTransfer = ({ transfer }: { transfer: Transfer }) => {
  return (
    <a key={transfer.transfer_id} href={`/transfers/${transfer.transfer_id}`}>
      <h1>{transfer.transfer_id}</h1>
      <h1>{transfer.user_id}</h1>
      <img src={transfer.transfer_img} alt="transfer_img" />
      <h1>{transfer.transfer_amount}</h1>
      <h1>{transfer.transfer_state}</h1>
      <h1>{transfer.transfer_description}</h1>
      <h1>{transfer.created_at}</h1>
      <h1>{transfer.updated_at}</h1>
    </a>
  );
};
