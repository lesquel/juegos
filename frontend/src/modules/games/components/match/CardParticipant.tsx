import { UserClientData } from "@modules/user/services/userClientData";

export const CardParticipant = ({ id }: { id: string }) => {
  const { data: participant, isLoading, error } = UserClientData.getUser(id);

  if (isLoading) return <div className="text-sm text-gray-400">Cargando...</div>;
  if (error)
    return (
      <span className="text-sm text-red-400">Error: {error.message}</span>
    );
  return (
    <div className="flex items-center space-x-2">
      <img src={`https://i.pravatar.cc/40?u=${id}`} alt={participant?.username} className="w-8 h-8 rounded-full" />
      <span className="font-medium text-white">{participant?.username}</span>
    </div>
  );
};
