import { User } from "lucide-react";
import { userRoutesConfig } from "../config/user.routes.config";
import { VirtualCurrency } from "./VirtualCurrency";
export const NavbarAvatar = () => {
  return (
    <a href={userRoutesConfig.children.me.url} className="text-white">
      <User />
      <VirtualCurrency />
    </a>
  );
};
