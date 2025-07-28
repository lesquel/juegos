import type { Pagination } from "@models/pagination";
import type { PaginationCategory } from "@modules/category-game/models/pagination-category";
import type { PaginationGames } from "@modules/games/models/pagination-games";
import type { PaginationMatch } from "@modules/games/models/pagination-match";

export class PaginationCategoryAdapter {
  /**
   * Helper method to build query string from object parameters
   */
  private static buildQueryString(params: Record<string, any>): string {
    const validParams: string[] = [];

    Object.entries(params).forEach(([key, value]) => {
      // Solo incluir parámetros que tengan valores válidos
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== 0
      ) {
        // Para arrays, unirlos con comas
        if (Array.isArray(value) && value.length > 0) {
          validParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
        }
        // Para valores primitivos válidos
        else if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          validParams.push(`${key}=${encodeURIComponent(value.toString())}`);
        }
      }
    });

    return validParams.length > 0 ? `?${validParams.join("&")}` : "";
  }

  /**
   * Adapt pagination for categories with automatic parameter detection
   */
  static adaptPaguinationCategory(pagination: PaginationCategory): string {


    const params: Record<string, any> = {
      page: pagination.page,
      limit: pagination.limit,
      // Parámetros de ordenamiento
      ...(pagination.sort_by && { sort_by: pagination.sort_by }),
      ...(pagination.sort_order && { sort_order: pagination.sort_order }),
      // Parámetros de búsqueda
      ...(pagination.search && { search: pagination.search }),
      ...(pagination.category_name && { category_name: pagination.category_name }),
      ...(pagination.category_description && { category_description: pagination.category_description }),
      ...(pagination.status && { status: pagination.status }),
      // Parámetros de fechas
      ...(pagination.created_before && { created_before: pagination.created_before }),
      ...(pagination.created_after && { created_after: pagination.created_after }),
    };

    return this.buildQueryString(params);
  }

  /**
   * Adapt pagination for games with automatic parameter detection
   */
  static adaptPaginationGames(pagination: PaginationGames): string {
    // Si hay algún filtro específico, no incluir 'search'
    const hasSpecific = pagination.game_name || pagination.game_description || pagination.category_name || pagination.category_id || pagination.game_type;
    const params: Record<string, any> = {
      page: pagination.page,
      limit: pagination.limit,
      sort_by: pagination.sort_by,
      sort_order: pagination.sort_order,
      // Solo incluir search si no hay filtros específicos
      ...(hasSpecific ? {} : { search: pagination.search }),
      game_name: pagination.game_name,
      game_description: pagination.game_description,
      category_name: pagination.category_name,
      category_id: pagination.category_id,
      game_type: pagination.game_type,
      created_before: pagination.created_before,
      created_after: (pagination as any).created_after,
      status: (pagination as any).status,
      user_id: (pagination as any).user_id,
    };
    return this.buildQueryString(params);
  }

  /**
   * Adapt pagination for matches with automatic parameter detection
   */
  static adaptPaginationMatch(pagination: PaginationMatch): string {
    const params: Record<string, any> = {
      page: pagination.page,
      limit: pagination.limit,
      // Parámetros de ordenamiento
      ...(pagination.sort_by && { sort_by: pagination.sort_by }),
      ...(pagination.sort_order && { sort_order: pagination.sort_order }),
      // Parámetros de búsqueda
      ...(pagination.search && { search: pagination.search }),
      ...(pagination.user_email && { user_email: pagination.user_email }),
      // Parámetros de rango de apuesta
      ...(pagination.min_base_bet_amount && { min_base_bet_amount: pagination.min_base_bet_amount }),
      ...(pagination.max_base_bet_amount && { max_base_bet_amount: pagination.max_base_bet_amount }),
      // Parámetros de fechas
      ...(pagination.created_before && { created_before: pagination.created_before }),
      ...(pagination.created_after && { created_after: pagination.created_after }),
    };

    return this.buildQueryString(params);
  }

  /**
   * Adapt general pagination with comprehensive parameter detection
   */
  static adaptPagination(pagination: Pagination): string {
    const params: Record<string, any> = {
      page: pagination.page,
      limit: pagination.limit,
      sort_by: pagination.sort_by,
      sort_order: pagination.sort_order,
      search: pagination.search,
      category_id: pagination.category_id,
      created_before: pagination.created_before,
      // Incluir parámetros adicionales que puedan existir dinámicamente
      ...((pagination as any).created_after && {
        created_after: (pagination as any).created_after,
      }),
      ...((pagination as any).status && {
        status: (pagination as any).status,
      }),
      ...((pagination as any).user_id && {
        user_id: (pagination as any).user_id,
      }),
      ...((pagination as any).tags && { tags: (pagination as any).tags }),
    };

    return this.buildQueryString(params);
  }

  /**
   * Generic method that can handle any pagination-like object
   */
  static adaptGenericPagination<T extends Record<string, any>>(
    paginationObj: T
  ): string {
    return this.buildQueryString(paginationObj);
  }

  /**
   * Method to merge multiple pagination objects and adapt them
   */
  static adaptMergedPagination(
    ...paginationObjects: Record<string, any>[]
  ): string {
    const mergedParams = paginationObjects.reduce(
      (acc, obj) => ({ ...acc, ...obj }),
      {}
    );
    return this.buildQueryString(mergedParams);
  }
}
