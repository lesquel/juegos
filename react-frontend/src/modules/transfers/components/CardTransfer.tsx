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
        pending: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
        completed: "bg-green-500/20 text-green-400 border-green-400/30",
        rejected: "bg-red-500/20 text-red-400 border-red-400/30",
      };

      const defaultClass = "bg-gray-500/20 text-gray-400 border-gray-400/30";
      const className =
        statusClasses[transfer.transfer_state as keyof typeof statusClasses] ||
        defaultClass;

      return (
        <span
          className={`px-4 py-2 rounded-xl text-sm font-medium border backdrop-blur-sm ${className}`}
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
      <article className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-[1.02]">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
        
        <Link
          to="/transfers/$id"
          params={{ id: transfer.transfer_id }}
          className="relative block text-decoration-none"
          aria-label={`Ver detalles de transferencia ${transfer.transfer_id}`}
        >
          <header className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Transferencia #{transfer.transfer_id}
              </h2>
              <p className="text-gray-300 text-sm">
                Usuario: {transfer.user_id}
              </p>
            </div>
            {statusBadge}
          </header>

          {transfer.transfer_img && (
            <div className="mb-6">
              <img
                src={transfer.transfer_img}
                alt={`Comprobante de transferencia ${transfer.transfer_id}`}
                className="w-full h-40 object-cover rounded-2xl border border-white/20 shadow-lg"
                loading="lazy"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Monto:</span>
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                ${transfer.transfer_amount}
              </span>
            </div>

            {transfer.transfer_description && (
              <div>
                <span className="text-gray-400 block text-sm font-medium mb-2">
                  Descripción:
                </span>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {truncatedDescription}
                </p>
              </div>
            )}

            <footer className="flex justify-between items-center pt-4 border-t border-white/10">
              <time
                className="text-gray-400 text-sm"
                dateTime={transfer.created_at}
              >
                {formattedDate}
              </time>
              <span className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-all duration-200 flex items-center gap-2">
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
