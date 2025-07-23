import type { Game } from "@modules/games/models/game.model";
import type { Match } from "@modules/games/models/match.model";
import { MatchClientData } from "@modules/games/services/matchClientData";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

export const CreateMatch = ({
  gameId,
  game,
}: {
  gameId: string;
  game: Game;
}) => {
  const onSuccess = (data: Match) => {
    location.href =
      location.protocol +
      "//" +
      location.host +
      "/" +
      game?.game_url +
      "?match_id=" +
      data.match_id;
  };
  const { mutate, error } = MatchClientData.createMatch(gameId, onSuccess);

  const form = useForm({
    defaultValues: {
      base_bet_amount: 10,
    },
    validators: {
      onSubmit: z.object({
        base_bet_amount: z.number().min(1, "El valor es requerido."),
      }),
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Crear Partida</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="w-full space-y-4"
      >
        {error && (
          <p className="text-red-500 bg-red-100 p-2 rounded-md">
            {error.errors.join(", ")}
          </p>
        )}

        <form.Field
          name="base_bet_amount"
          children={(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Monto de Apuesta Base
              </label>
              <input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-600 bg-gray-900 text-white rounded-md shadow-sm focus:ring focus:ring-indigo-400"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-400 text-sm mt-1">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        />

        <button
          type="submit"
          className="w-full py-2 px-4 cursor-pointer bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          Crear Match
        </button>
      </form>
    </div>
  );
};
