import React, { memo, useMemo, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { TransferDataClient } from "../services/transferDataClient";
import { QueryProvider } from "@providers/QueryProvider";
import type { TransferInputModel } from "../models/transfer.model";

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
  const { data: infoAccounts, isLoading: accountsLoading } = TransferDataClient.getInfoAccounts();

  // Memoizar valores por defecto
  const defaultValues = useMemo((): TransferInputModel => ({
    transfer_img: undefined as unknown as File,
    transfer_amount: 0,
    transfer_description: "",
  }), []);

  // Memoizar callback de submit
  const handleSubmit = useCallback(async ({ value }: { value: TransferInputModel }) => {
    mutate(value);
  }, [mutate]);

  const form = useForm({
    defaultValues,
    validators: { onSubmit: transferSchema },
    onSubmit: handleSubmit,
  });

  // Memoizar handler de archivo
  const handleFileChange = useCallback((field: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) field.handleChange(file);
  }, []);

  // Memoizar handler de cantidad
  const handleAmountChange = useCallback((field: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
    field.handleChange(Number(e.target.value));
  }, []);

  // Memoizar handler de descripción
  const handleDescriptionChange = useCallback((field: any) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.handleChange(e.target.value);
  }, []);

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
          <div 
            key={account.account_id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
          >
            <div className="font-semibold text-gray-800">{account.account_name}</div>
            <div className="text-sm text-gray-600">
              <div><strong>Número:</strong> {account.account_number}</div>
              <div><strong>Titular:</strong> {account.account_owner_name}</div>
              <div><strong>Tipo:</strong> {account.account_type}</div>
              {account.account_description && (
                <div><strong>Descripción:</strong> {account.account_description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }, [infoAccounts, accountsLoading]);

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg" role="alert">
        <strong>Error:</strong> {error.errors?.join(", ") || "Ocurrió un error al subir la transferencia"}
      </div>
    );
  }, [error]);

  // Memoizar iconos
  const uploadIcon = useMemo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ), []);

  const moneyIcon = useMemo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ), []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Realizar Transferencia</h1>
        <p className="text-gray-600">Sube el comprobante de tu transferencia para acreditar fondos</p>
      </div>

      {/* Accounts Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
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
                  {field.state.meta.errors.join(", ")}
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
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Description */}
        <form.Field name="transfer_description">
          {(field) => (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
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
                  {field.state.meta.errors.join(", ")}
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
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
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
