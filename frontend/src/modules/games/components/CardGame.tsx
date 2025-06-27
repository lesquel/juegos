import type { Game } from "../models/game.model";

export const CardGame = ({ game }: { game: Game }) => {
  const { game_id, game_name, game_img, game_url, game_description } = game;
  return (
    <div>
      <h2>{game_name}</h2>
      <img src={game_img} alt={game_name} />
      <p>{game_description}</p>
      <a href={game_url}>Ver más</a>
    </div>
  );
};
