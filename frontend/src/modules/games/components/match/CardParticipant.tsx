import React, { memo, useMemo } from "react";
import { UserClientData } from "@modules/user/services/userClientData";
import { Clock } from "lucide-react";

interface CardParticipantProps {
  id: string;
}

export const CardParticipant: React.FC<CardParticipantProps> = memo(
  ({ id }) => {
    const { data: participant, isLoading, error } = UserClientData.getUser(id);

    // Memoizar avatar URL
    const avatarUrl = useMemo(() => `https://i.pravatar.cc/40?u=${id}`, [id]);

    // Memoizar nombre de usuario formateado
    const displayName = useMemo(() => {
      if (!participant?.email) return "Usuario";

      // Extraer la parte antes del @ del email
      const username = participant.email.split("@")[0];

      // Capitalizar primera letra
      return username.charAt(0).toUpperCase() + username.slice(1);
    }, [participant?.email]);

    // Memoizar mensaje de error
    const errorMessage = useMemo(() => {
      if (!error) return null;
      return (
        <div className="flex items-center space-x-2 text-sm text-red-400 bg-red-900 bg-opacity-30 px-3 py-1 rounded-lg">
          <Clock className="h-4 w-4" />
          <span>Error al cargar usuario</span>
        </div>
      );
    }, [error]);

    // Memoizar estado de carga
    const loadingState = useMemo(
      () => (
        <div className="flex items-center space-x-2 animate-pulse">
          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          <div className="h-4 bg-gray-600 rounded w-20"></div>
        </div>
      ),
      []
    );

    if (isLoading) return loadingState;
    if (error) return errorMessage;

    return (
      <div className="flex items-center space-x-2 bg-gray-700 bg-opacity-50 px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-600 transition-all duration-200 hover:bg-gray-600 hover:bg-opacity-50">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={`Avatar de ${displayName}`}
            className="w-8 h-8 rounded-full border-2 border-gray-500 object-cover"
            loading="lazy"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-700 rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-white text-sm leading-tight">
            {displayName}
          </span>
          <span className="text-xs text-gray-400">{participant?.email}</span>
        </div>
      </div>
    );
  }
);

CardParticipant.displayName = "CardParticipant";
