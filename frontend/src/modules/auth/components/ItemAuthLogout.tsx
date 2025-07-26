import { AuthClientData } from "../services/authClientData";

type Props = {
  className?: string;
};

export const ItemAuthLogout = ({ className }: Props) => {
  return (
    <button className={`text-white cursor-pointer ${className}`} onClick={() => AuthClientData.logout()}>
      Logout
    </button>
  );
};
