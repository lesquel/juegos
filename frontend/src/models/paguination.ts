export interface Paguination {
  page: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  search?: string;
  category_id?: number;
  created_before?: string;
}