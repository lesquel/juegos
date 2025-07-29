import React, { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import type { Transfer } from "../models/transfer.model";

interface CardTransferProps {
  transfer: Transfer;
}

export const CardTransfer: React.FC<CardTransferProps> = memo(
  ({ transfer }) => {
    // Memoizar estado de transferencia con estilo
    const statusBadge = useMemo(() => {
      const statusClasses = {
        pending: "bg-yellow-500 text-yellow-900",
        completed: "bg-green-500 text-green-900",
        rejected: "bg-red-500 text-red-900",
      };

      const defaultClass = "bg-gray-500 text-gray-900";
      const className =
        statusClasses[transfer.transfer_state as keyof typeof statusClasses] ||
        defaultClass;

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}
        >
          {transfer.transfer_state}
        </span>
      );
    }, [transfer.transfer_state]);

    // Memoizar fecha formateada
    const formattedDate = useMemo(() => {
      return new Date(transfer.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }, [transfer.created_at]);

    // Memoizar descripción truncada
    const truncatedDescription = useMemo(() => {
      if (!transfer.transfer_description) return "";
      if (transfer.transfer_description.length > 100) {
        return transfer.transfer_description.substring(0, 100) + "...";
      }
      return transfer.transfer_description;
    }, [transfer.transfer_description]);

    return (
      <article className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 shadow-lg backdrop-blur-lg backdrop-filter border border-gray-700 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
        <Link
          to="/transfers/$id"
          params={{ id: transfer.transfer_id }}
          className="block text-decoration-none"
          aria-label={`Ver detalles de transferencia ${transfer.transfer_id}`}
        >
          <header className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">
                Transferencia #{transfer.transfer_id}
              </h2>
              <p className="text-gray-400 text-sm">
                Usuario: {transfer.user_id}
              </p>
            </div>
            {statusBadge}
          </header>

          {transfer.transfer_img && (
            <div className="mb-4">
              <img
                src={transfer.transfer_img}
                alt={`Comprobante de transferencia ${transfer.transfer_id}`}
                className="w-full h-32 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Monto:</span>
              <span className="text-xl font-bold text-green-400">
                ${transfer.transfer_amount}
              </span>
            </div>

            {transfer.transfer_description && (
              <div>
                <span className="text-gray-400 block text-sm">
                  Descripción:
                </span>
                <p className="text-white text-sm mt-1">
                  {truncatedDescription}
                </p>
              </div>
            )}

            <footer className="flex justify-between items-center pt-3 border-t border-gray-600">
              <time
                className="text-gray-400 text-xs"
                dateTime={transfer.created_at}
              >
                {formattedDate}
              </time>
              <span className="text-teal-400 text-sm font-semibold hover:text-teal-300 transition-colors">
                Ver detalles →
              </span>
            </footer>
          </div>
        </Link>
      </article>
    );
  }
);

CardTransfer.displayName = "CardTransfer";
