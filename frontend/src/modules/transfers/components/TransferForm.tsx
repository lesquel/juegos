import React, { memo, useMemo, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { TransferDataClient } from "../services/transferDataClient";
import { QueryProvider } from "@providers/QueryProvider";
import type { TransferInputModel } from "../models/transfer.model";
import { DollarSign, Landmark, Loader, Upload } from "lucide-react";
import { Account } from "./Account";

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
  <QueryProvider>
    <InternalTransferForm />
  </QueryProvider>
));

TransferForm.displayName = "TransferForm";

const InternalTransferForm: React.FC = memo(() => {
  const { mutate, error, isPending } = TransferDataClient.uploadTransfer();
  const { data: infoAccounts, isLoading: accountsLoading } =
    TransferDataClient.getInfoAccounts();

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
      field.handleChange(Number(e.target.value));
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
        className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg"
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Realizar Transferencia
        </h1>
        <p className="text-gray-600">
          Sube el comprobante de tu transferencia para acreditar fondos
        </p>
      </div>

      {/* Accounts Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Landmark className="h-6 w-6 text-indigo-600" />
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                {uploadIcon}
                Comprobante de Transferencia *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(field)}
                disabled={isPending}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm" role="alert">
                  {field.state.meta.errors
                    .map((error: any) => error.message)
                    .join(", ")}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Formatos soportados: JPG, PNG. Tamaño máximo: 5MB
              </p>
            </div>
          )}
        </form.Field>

        {/* Amount */}
        <form.Field name="transfer_amount">
          {(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                {moneyIcon}
                Monto Transferido *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.state.value}
                  onChange={handleAmountChange(field)}
                  disabled={isPending}
                  className="pl-7 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0.00"
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm" role="alert">
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
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
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
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
                placeholder="Agrega detalles adicionales sobre la transferencia..."
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Máximo 500 caracteres</span>
                <span>{field.state.value?.length || 0}/500</span>
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm" role="alert">
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
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
  );
});

InternalTransferForm.displayName = "InternalTransferForm";
