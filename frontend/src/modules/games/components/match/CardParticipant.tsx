import { UserClientData } from "@modules/user/services/userClientData";

export const CardParticipant = ({ id }: { id: string }) => {
  const { data: participant, isLoading, error } = UserClientData.getUser(id);

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <span className="text-center text-red-400">Error: {error.message}</span>
    );
  return <div>{participant?.email}</div>;
};
