import { AuthClientData } from "../services/authClientData";

export const ItemAuthLogout = () => {
  return (
    <button className="text-white" onClick={() => AuthClientData.logout()}>
      Logout
    </button>
  );
};
