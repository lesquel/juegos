import React, { memo, useState, useMemo, useCallback } from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Modal } from "@components/Modal";
import type { Game } from "@modules/games/models/game.model";
import type { Match } from "@modules/games/models/match.model";
import { MatchClientData } from "@modules/games/services/matchClientData";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { DollarSign, Plus } from "lucide-react";

interface CreateMatchProps {
  gameId: string;
  game: Game;
}

interface CreateMatchFormValues {
  base_bet_amount: number;
}

export const CreateMatch: React.FC<CreateMatchProps> = memo(
  ({ gameId, game }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Memoizar función de éxito
    const onSuccess = useCallback(
      (data: Match) => {
        const newUrl = `${location.protocol}//${location.host}/${game?.game_url}?match_id=${data.match_id}`;
        location.href = newUrl;
      },
      [game?.game_url]
    );

    const { mutate, error } = MatchClientData.createMatch(gameId, onSuccess);

    // Memoizar validadores
    const validators = useMemo(
      () => ({
        onSubmit: z.object({
          base_bet_amount: z.number().min(1, "El valor mínimo es $1."),
        }),
      }),
      []
    );

    // Memoizar valores por defecto
    const defaultValues = useMemo(
      (): CreateMatchFormValues => ({
        base_bet_amount: 10,
      }),
      []
    );

    // Memoizar función de submit
    const handleSubmit = useCallback(
      async ({ value }: { value: CreateMatchFormValues }) => {
        if (useAuthStore.getState().user) {
          mutate(value);
        } else {
          setIsModalOpen(false);
          location.href = `${location.protocol}//${location.host}/login`;
        }
      },
      [mutate]
    );

    const form = useForm({
      defaultValues,
      validators,
      onSubmit: handleSubmit,
    });

    // Memoizar handlers
    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    // Memoizar función de envío del formulario
    const onFormSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        void form.handleSubmit();
      },
      [form]
    );

    // Memoizar mensaje de error
    const errorMessage = useMemo(() => {
      if (!error) return null;
      return (
        <div
          className="text-red-400 bg-red-900 bg-opacity-50 p-4 rounded-lg border border-red-600"
          role="alert"
        >
          <h4 className="font-semibold mb-1">Error al crear partida:</h4>
          <p>{error.errors.join(", ")}</p>
        </div>
      );
    }, [error]);

    // Memoizar icono de partida
    const matchIcon = useMemo(
      () => <Plus className="h-5 w-5 text-teal-400" />,
      []
    );

    // Memoizar icono de dinero
    const moneyIcon = useMemo(
      () => <DollarSign className="h-5 w-5 text-green-400" />,
      []
    );

    return (
      <div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105"
          aria-label="Crear nueva partida"
        >
          {matchIcon}
          Crear Partida
        </button>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="p-6">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                {matchIcon}
                Crear Nueva Partida
              </h1>
              <p className="text-gray-400 mt-2">
                Configura tu partida para{" "}
                <span className="text-teal-400 font-semibold">
                  {game?.game_name}
                </span>
              </p>
            </header>

            <form onSubmit={onFormSubmit} className="space-y-6">
              {errorMessage}

              <form.Field name="base_bet_amount">
                {(field) => {
                  const fieldErrors = useMemo(
                    () =>
                      field.state.meta.errors.length > 0
                        ? field.state.meta.errors.map((error : any) => error.message).join(", ")
                        : null,
                    [field.state.meta.errors]
                  );

                  const handleChange = useCallback(
                    (e: React.ChangeEvent<HTMLInputElement>) => {
                      field.handleChange(Number(e.target.value));
                    },
                    [field]
                  );

                  return (
                    <div>
                      <label
                        htmlFor="bet-amount"
                        className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
                      >
                        {moneyIcon}
                        Monto de Apuesta Base
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                          $
                        </span>
                        <input
                          id="bet-amount"
                          type="number"
                          min="1"
                          step="1"
                          value={field.state.value}
                          onChange={handleChange}
                          className="pl-8 pr-4 py-3 w-full border border-gray-600 bg-gray-700 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          placeholder="Ingresa el monto"
                          aria-describedby={
                            fieldErrors ? "bet-amount-error" : undefined
                          }
                        />
                      </div>
                      {fieldErrors && (
                        <p
                          id="bet-amount-error"
                          className="text-red-400 text-sm mt-2"
                          role="alert"
                        >
                          {fieldErrors}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        Mínimo: $1 - Este será el monto que cada jugador debe
                        apostar
                      </p>
                    </div>
                  );
                }}
              </form.Field>

              <footer className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
                  aria-label="Crear partida"
                >
                  <Plus className="h-4 w-4" />
                  Crear Partida
                </button>
              </footer>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
);

CreateMatch.displayName = "CreateMatch";
