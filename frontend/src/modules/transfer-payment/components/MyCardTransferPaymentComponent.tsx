import type { TransferPayment } from "../models/transferPayment.model";

export const MyCardTransferPaymentComponent = ({
  transferPayment,
}: {
  transferPayment: TransferPayment;
}) => {
  return (
    <div>
      <img
        src={transferPayment.transfer_img}
        alt={transferPayment.transfer_img}
      />
      <p>{transferPayment.transfer_amount}</p>
      <p>{transferPayment.transfer_state}</p>
      <span>
        {transferPayment.create_at.toLocaleDateString()}{" "}
      </span>
    </div>
  );
};
