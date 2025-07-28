import type { Info } from "@models/info.model";

export interface CategoryGameDetail {
  category_id: string;
  category_name: string;
  category_img: string;
  category_description: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryGame extends CategoryGameDetail {}

export interface CategoryGameList {
  info: Info;
  results: CategoryGame[];
}
