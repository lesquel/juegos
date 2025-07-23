export const CardParticipant = ({id}: {id: string}) => {
    const {} = UserClientData.getUser(id);
  return (
    <li key={participant.user_id} className="border-b border-gray-700">
      <div>{participant.user_id}</div>
    </li>
  );
};