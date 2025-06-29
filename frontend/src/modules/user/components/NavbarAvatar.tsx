import { useAuthStore } from "@modules/auth/store/auth.store";
import { User } from "lucide-react";
import { useStore } from "zustand";
import { userRoutesConfig } from "../config/user.routes.config";
export const NavbarAvatar = () => {
  const user = useStore(useAuthStore, (state) => state.user);
  return (
    <a href={userRoutesConfig.children.me.url}>
      <User />
      {user?.user.email}
    </a>
  );
};
