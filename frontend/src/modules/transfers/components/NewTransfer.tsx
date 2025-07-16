import { QueryProvider } from "@providers/QueryProvider";

export const NewTransfer = () => {
  return (
    <QueryProvider>
      <UseNewTransfer />
    </QueryProvider>
  );
};

export const UseNewTransfer = () => {
  return <div></div>;
};
