import React, { memo, useState, useMemo, useCallback } from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Modal } from "@components/Modal";
import type { Game } from "@modules/games/models/game.model";
import type { Match } from "@modules/games/models/match.model";
import { useCreateMatch } from "@modules/games/services/matchClientData";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { DollarSign, Plus } from "lucide-react";
import { LoadingComponent } from "@components/LoadingComponent";

interface CreateMatchProps {
  gameId: string;
  game: Game;
}

interface CreateMatchFormValues {
  base_bet_amount: number;
}

interface BetAmountFieldProps {
  field: any; // Mejorar tipo si quieres
  moneyIcon: React.ReactNode;
}

export const BetAmountField: React.FC<BetAmountFieldProps> = ({
  field,
  moneyIcon,
}) => {
  const fieldErrors =
    field.state.meta.errors.length > 0
      ? field.state.meta.errors.map((err: any) => err.message).join(", ")
      : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.handleChange(Number(e.target.value));
  };

  return (
    <div>
      <label
        htmlFor="bet-amount"
        className="flex items-center gap-3 text-sm font-medium text-gray-300 mb-3"
      >
        {moneyIcon}
        Monto de Apuesta Base
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-bold">
          $
        </span>
        <input
          id="bet-amount"
          type="number"
          min={1}
          step={1}
          value={field.state.value}
          onChange={handleChange}
          className="pl-10 pr-4 py-4 w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl shadow-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 transition-all duration-300 placeholder-gray-400"
          placeholder="Ingresa el monto"
          aria-describedby={fieldErrors ? "bet-amount-error" : undefined}
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
      <p className="text-gray-400 text-sm mt-2">
        Mínimo: $1 - Este será el monto que cada jugador debe apostar
      </p>
    </div>
  );
};

export const CreateMatch: React.FC<CreateMatchProps> = memo(
  ({ gameId, game }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [authRequiredMsg, setAuthRequiredMsg] = useState(false);
    const navigate = useNavigate();

    const onSuccess = useCallback(
      (data: Match) => {
        setIsLoading(false);
        // Usar TanStack Router para la navegación
        navigate({ 
          to: `/${game?.game_url}`,
          search: { match_id: data.match_id }
        });
      },
      [game?.game_url, navigate]
    );

    const { mutate, error } = useCreateMatch(gameId, onSuccess);

    const validators = useMemo(
      () => ({
        onSubmit: z.object({
          base_bet_amount: z.number().min(1, "El valor mínimo es $1."),
        }),
      }),
      []
    );

    const defaultValues = useMemo<CreateMatchFormValues>(
      () => ({
        base_bet_amount: 10,
      }),
      []
    );

    const handleSubmit = useCallback(
      async ({ value }: { value: CreateMatchFormValues }) => {
        const user = useAuthStore.getState().user;

        if (user) {
          mutate(value);
        } else {
          setAuthRequiredMsg(true);
          setTimeout(() => {
            setAuthRequiredMsg(false);
            setIsModalOpen(false);
            // Usar TanStack Router para la navegación a login
            navigate({ to: "/auth/login" });
          }, 2500);
        }
      },
      [mutate, navigate]
    );

    const form = useForm({
      defaultValues,
      validators,
      onSubmit: handleSubmit,
    });

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    const onFormSubmit = useCallback(
      (e: React.FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        void form.handleSubmit();
      },
      [form]
    );

    const errorMessage = useMemo(() => {
      if (!error) return null;
      return (
        <div
          className="text-red-400 bg-red-500/10 backdrop-blur-sm border border-red-400/30 p-4 rounded-xl"
          role="alert"
        >
          <h4 className="font-bold mb-2">Error al crear partida:</h4>
          <p>{error.errors.join(", ")}</p>
        </div>
      );
    }, [error]);

    const matchIcon = useMemo(
      () => <Plus className="h-5 w-5" />,
      []
    );

    const moneyIcon = useMemo(
      () => <DollarSign className="h-5 w-5 text-cyan-400" />,
      []
    );

    return (
      <div>
        <button
          onClick={openModal}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 transform hover:scale-[1.02]"
          aria-label="Crear nueva partida"
        >
          {matchIcon}
          Crear Partida
        </button>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {isLoading && <LoadingComponent />}
          <div className="p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl"></div>
            
            <div className="relative">
              <header className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <Plus className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Crear Nueva Partida
                  </h1>
                </div>
                <p className="text-gray-300 text-lg">
                  Configura tu partida para{" "}
                  <span className="text-cyan-400 font-bold">
                    {game?.game_name}
                  </span>
                </p>
              </header>

              <form onSubmit={onFormSubmit} className="space-y-8">
                {errorMessage}

                <form.Field name="base_bet_amount">
                  {(field) => (
                    <BetAmountField field={field} moneyIcon={moneyIcon} />
                  )}
                </form.Field>

                <footer className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 font-medium rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 transform hover:scale-[1.02]"
                    aria-label="Crear partida"
                  >
                    <Plus className="h-4 w-4" />
                    Crear Partida
                  </button>
                </footer>
                
                {authRequiredMsg && (
                  <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/30 text-yellow-400 px-4 py-3 rounded-xl">
                    Debes iniciar sesión para crear una partida. Redirigiendo...
                  </div>
                )}
              </form>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
);

CreateMatch.displayName = "CreateMatch";
