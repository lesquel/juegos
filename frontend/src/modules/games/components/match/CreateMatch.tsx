import { useState } from "react";
import { Modal } from "@components/Modal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition cursor-pointer"
      >
        Crear Partida
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1 className="text-2xl font-bold mb-6 text-white">Crear Nueva Partida</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="space-y-6"
        >
          {error && (
            <p className="text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-lg">
              {error.errors.join(", ")}
            </p>
          )}

          <form.Field
            name="base_bet_amount"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monto de Apuesta Base
                </label>
                <input
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="p-2 mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-400 text-sm mt-2">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Crear Match
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
