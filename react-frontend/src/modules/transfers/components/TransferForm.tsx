import React, { memo, useMemo, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import type { TransferInputModel } from "../models/transfer.model";
import { DollarSign, Landmark, Loader, Upload } from "lucide-react";
import { Account } from "./Account";
import { useInfoAccounts, useUploadTransfer } from "../services/transferDataClient";

// Memoizar schema para evitar recreaciones
const transferSchema = z.object({
  transfer_img: z.instanceof(File, {
    message: "Debes subir una imagen del comprobante.",
  }),
  transfer_amount: z.number().positive("El monto debe ser mayor que 0."),
  transfer_description: z
    .string()
    .max(500, "Máximo 500 caracteres.")
    .optional(),
});

export const TransferForm: React.FC = memo(() => (
    <InternalTransferForm />
));

TransferForm.displayName = "TransferForm";

const InternalTransferForm: React.FC = memo(() => {
  const { mutate, error, isPending } = useUploadTransfer();
  const { data: infoAccounts, isLoading: accountsLoading } = useInfoAccounts();

  // Memoizar valores por defecto
  const defaultValues = useMemo(
    (): TransferInputModel => ({
      transfer_img: undefined as unknown as File,
      transfer_amount: 0,
      transfer_description: "",
    }),
    []
  );

  // Memoizar callback de submit
  const handleSubmit = useCallback(
    async ({ value }: { value: TransferInputModel }) => {
      mutate(value);
    },
    [mutate]
  );

  const form = useForm({
    defaultValues,
    validators: { onSubmit: transferSchema },
    onSubmit: handleSubmit,
  });

  // Memoizar handler de archivo
  const handleFileChange = useCallback(
    (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) field.handleChange(file);
    },
    []
  );

  // Memoizar handler de cantidad
  const handleAmountChange = useCallback(
    (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Si está vacío, establecer como 0 pero mostrar vacío en el UI
      if (value === "" || value === "0") {
        field.handleChange(0);
      } else {
        // Convertir a número
        const numValue = parseFloat(value);
        field.handleChange(isNaN(numValue) ? 0 : numValue);
      }
    },
    []
  );

  // Memoizar handler de descripción
  const handleDescriptionChange = useCallback(
    (field: any) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      field.handleChange(e.target.value);
    },
    []
  );

  // Memoizar lista de cuentas
  const accountsList = useMemo(() => {
    if (accountsLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      );
    }

    if (!infoAccounts?.accounts?.length) {
      return (
        <div className="text-center py-4 text-gray-500">
          No hay cuentas disponibles
        </div>
      );
    }

    return (
      <div className="grid gap-4 mb-6">
        {infoAccounts.accounts.map((account) => (
          <Account key={account.account_id} account={account} />
        ))}
      </div>
    );
  }, [infoAccounts, accountsLoading]);

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;

    return (
      <div
        className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-400 p-4 rounded-xl"
        role="alert"
      >
        <strong>Error:</strong>{" "}
        {error.errors?.join(", ") ||
          "Ocurrió un error al subir la transferencia"}
      </div>
    );
  }, [error]);

  // Memoizar iconos
  const uploadIcon = useMemo(() => <Upload className="h-5 w-5" />, []);

  const moneyIcon = useMemo(() => <DollarSign className="h-5 w-5" />, []);

  return (
    <div className="relative max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
      
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Landmark className="h-7 w-7 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Realizar Transferencia
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Sube el comprobante de tu transferencia para acreditar fondos
          </p>
        </div>

        {/* Accounts Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-300 mb-6 flex items-center gap-3">
            <Landmark className="h-6 w-6 text-cyan-400" />
            Cuentas de Destino
          </h2>
          {accountsList}
        </section>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="space-y-6"
        >
          {errorMessage}

          {/* File Upload */}
          <form.Field name="transfer_img">
            {(field) => (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-3">
                  {uploadIcon}
                  Comprobante de Transferencia *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange(field)}
                  disabled={isPending}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-400 text-sm" role="alert">
                    {field.state.meta.errors
                      .map((error: any) => error.message)
                      .join(", ")}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Formatos soportados: JPG, PNG. Tamaño máximo: 5MB
                </p>
              </div>
            )}
          </form.Field>

          {/* Amount */}
          <form.Field name="transfer_amount">
            {(field) => (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-3">
                  {moneyIcon}
                  Monto Transferido *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.state.value === 0 ? "" : field.state.value}
                    onChange={handleAmountChange(field)}
                    disabled={isPending}
                    className="pl-8 block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 p-4 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-400"
                    placeholder="0.00"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-400 text-sm" role="alert">
                    {field.state.meta.errors
                      .map((error: any) => error.message)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Description */}
          <form.Field name="transfer_description">
            {(field) => (
              <div className="space-y-3">
                <label
                  className="block text-sm font-medium text-gray-300"
                  htmlFor="transfer_description"
                >
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={field.state.value}
                  onChange={handleDescriptionChange(field)}
                  disabled={isPending}
                  maxLength={500}
                  className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 p-4 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical text-white placeholder-gray-400"
                  placeholder="Agrega detalles adicionales sobre la transferencia..."
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Máximo 500 caracteres</span>
                  <span>{field.state.value?.length || 0}/500</span>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-400 text-sm" role="alert">
                    {field.state.meta.errors
                      .map((error: any) => error.message)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isPending ? (
              <>
                <Loader />
                Subiendo...
              </>
            ) : (
              <>
                {uploadIcon}
                Subir Transferencia
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
});

InternalTransferForm.displayName = "InternalTransferForm";
