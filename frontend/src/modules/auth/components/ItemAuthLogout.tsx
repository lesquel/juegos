import { AuthClientData } from "../services/authClientData";

export const ItemAuthLogout = () => {
  return (
    <>
      <button onClick={() => AuthClientData.logout()}>Logout</button>
    </>
  );
};
