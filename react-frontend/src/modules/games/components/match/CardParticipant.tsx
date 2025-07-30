import React, { memo, useMemo } from "react";
import { useUser } from "@modules/user/services/userClientData";
import { Clock } from "lucide-react";

interface CardParticipantProps {
  id: string;
}

export const CardParticipant: React.FC<CardParticipantProps> = memo(
  ({ id }) => {
    const { data: participant, isLoading, error } = useUser(id);

    console.log({
      participant,
      isLoading,
      error,
      id
    })

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
        <div className="flex items-center space-x-2 text-sm text-red-400 bg-red-500/10 backdrop-blur-sm border border-red-400/30 px-3 py-2 rounded-xl">
          <Clock className="h-4 w-4" />
          <span>Error al cargar usuario</span>
        </div>
      );
    }, [error]);

    // Memoizar estado de carga
    const loadingState = useMemo(
      () => (
        <div className="flex items-center space-x-3 animate-pulse">
          <div className="w-10 h-10 bg-white/20 rounded-full"></div>
          <div className="h-4 bg-white/20 rounded w-24"></div>
        </div>
      ),
      []
    );

    if (isLoading) return loadingState;
    if (error) return errorMessage;

    return (
      <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/20 hover:scale-[1.02]">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={`Avatar de ${displayName}`}
            className="w-10 h-10 rounded-full border-2 border-cyan-400/50 object-cover shadow-lg"
            loading="lazy"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-sm leading-tight">
            {displayName}
          </span>
          <span className="text-xs text-gray-400">{participant?.email}</span>
        </div>
      </div>
    );
  }
);

CardParticipant.displayName = "CardParticipant";
