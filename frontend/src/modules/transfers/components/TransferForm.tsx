import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { TransferDataClient } from "../services/transferDataClient";
import { QueryProvider } from "@providers/QueryProvider";
import type { TransferInputModel } from "../models/transfer.model";

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

export const TransferForm = () => (
  <QueryProvider>
    <InternalTransferForm />
  </QueryProvider>
);

const InternalTransferForm = () => {
  const { mutate, error } = TransferDataClient.uploadTransfer();

  const form = useForm<
    TransferInputModel,
    any, // Response (unused)
    any, // Context (unused)
    any, // Meta (unused)
    any, // Field Meta
    any, // Field Name
    any, // Field Error
    any, // Field Value
    any, // Field Input
    any
  >({
    defaultValues: {
      transfer_img: undefined as unknown as File,
      transfer_amount: 0,
      transfer_description: "",
    },
    validators: { onSubmit: transferSchema },
    onSubmit: async ({ value }) => mutate(value),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-center mb-4">
        Subir Transferencia
      </h2>

      {error && (
        <p className="text-red-500 bg-red-100 p-2 rounded-md">
          {error.errors.join(", ")}
        </p>
      )}

      <form.Field name="transfer_img">
        {(field) => (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) field.handleChange(file);
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-400 text-sm mt-1">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="transfer_amount">
        {(field) => (
          <div>
            <input
              type="number"
              step="0.01"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-400 text-sm mt-1">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="transfer_description">
        {(field) => (
          <div>
            <textarea
              rows={3}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-red-400 text-sm mt-1">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
      >
        Subir Transferencia
      </button>
    </form>
  );
};
