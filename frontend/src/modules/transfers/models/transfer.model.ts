import type { Info } from "@models/info.model";

export interface Transfer {
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  transfer_id: string; // UUID
  user_id: string; // UUID
  transfer_img: string; // URL de la imagen del comprobante
  transfer_amount: number; // Monto transferido
  transfer_state: 'pending' | 'completed' | 'failed'; // Puedes ajustar los estados posibles
  transfer_description: string; // Descripción opcional
}

export interface TransferDetail {
  transfer_id: string; // UUID
  user_id: string; // UUID
  transfer_img: string; // URL de la imagen del comprobante
  transfer_amount: number; // Monto transferido
  transfer_state: 'pending' | 'completed' | 'failed'; // Puedes ajustar los estados posibles
  transfer_description: string; // Descripción opcional
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface TransferList {
  info: Info;
  results: Transfer[];
}


export interface TransferInputModel {
  transfer_img: File;
  transfer_amount: number;
  transfer_description?: string;
}
