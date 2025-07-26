import React, { memo, useState, useMemo, useCallback } from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Modal } from "@components/Modal";
import type { Game } from "@modules/games/models/game.model";
import type { Match } from "@modules/games/models/match.model";
import { MatchClientData } from "@modules/games/services/matchClientData";
import { useAuthStore } from "@modules/auth/store/auth.store";

interface CreateMatchProps {
  gameId: string;
  game: Game;
}

interface CreateMatchFormValues {
  base_bet_amount: number;
}

export const CreateMatch: React.FC<CreateMatchProps> = memo(({
  gameId,
  game,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoizar función de éxito
  const onSuccess = useCallback((data: Match) => {
    const newUrl = `${location.protocol}//${location.host}/${game?.game_url}?match_id=${data.match_id}`;
    location.href = newUrl;
  }, [game?.game_url]);

  const { mutate, error } = MatchClientData.createMatch(gameId, onSuccess);

  // Memoizar validadores
  const validators = useMemo(() => ({
    onSubmit: z.object({
      base_bet_amount: z.number().min(1, "El valor mínimo es $1."),
    }),
  }), []);

  // Memoizar valores por defecto
  const defaultValues = useMemo((): CreateMatchFormValues => ({
    base_bet_amount: 10,
  }), []);

  // Memoizar función de submit
  const handleSubmit = useCallback(async ({ value }: { value: CreateMatchFormValues }) => {
    if (useAuthStore.getState().user) {
      mutate(value);
    } else {
      setIsModalOpen(false);
      location.href = `${location.protocol}//${location.host}/login`;
    }
  }, [mutate]);

  const form = useForm({
    defaultValues,
    validators,
    onSubmit: handleSubmit,
  });

  // Memoizar handlers
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Memoizar función de envío del formulario
  const onFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    void form.handleSubmit();
  }, [form]);

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
  const matchIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  ), []);

  // Memoizar icono de dinero
  const moneyIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-green-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  ), []);

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
              Configura tu partida para <span className="text-teal-400 font-semibold">{game?.game_name}</span>
            </p>
          </header>
          
          <form onSubmit={onFormSubmit} className="space-y-6">
            {errorMessage}

            <form.Field
              name="base_bet_amount"
              children={(field) => {
                // Memoizar errores del campo
                const fieldErrors = useMemo(() => 
                  field.state.meta.errors.length > 0 ? field.state.meta.errors.join(", ") : null,
                  [field.state.meta.errors]
                );

                // Memoizar handler de cambio
                const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(Number(e.target.value));
                }, [field]);

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
                        aria-describedby={fieldErrors ? "bet-amount-error" : undefined}
                      />
                    </div>
                    {fieldErrors && (
                      <p id="bet-amount-error" className="text-red-400 text-sm mt-2" role="alert">
                        {fieldErrors}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      Mínimo: $1 - Este será el monto que cada jugador debe apostar
                    </p>
                  </div>
                );
              }}
            />

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Crear Partida
              </button>
            </footer>
          </form>
        </div>
      </Modal>
    </div>
  );
});

CreateMatch.displayName = "CreateMatch";
