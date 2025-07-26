import type { Pagination } from "@models/paguination";
import type { PaguinationCategory } from "@modules/category-game/models/paguination-category";
import type { PaguinationGames } from "@modules/games/adapters/paguination-games";

export class PaguinationCategoryAdapter {
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
  static adaptPaguinationCategory(paguination: PaguinationCategory): string {
    const params: Record<string, any> = {
      page: paguination.page,
      limit: paguination.limit,
      // Incluir otros parámetros específicos de categorías si existen
      ...((paguination as any).search && {
        search: (paguination as any).search,
      }),
      ...((paguination as any).sort_by && {
        sort_by: (paguination as any).sort_by,
      }),
      ...((paguination as any).sort_order && {
        sort_order: (paguination as any).sort_order,
      }),
    };

    return this.buildQueryString(params);
  }

  /**
   * Adapt pagination for games with automatic parameter detection
   */
  static adaptPaguinationGames(paguination: PaguinationGames): string {
    const params: Record<string, any> = {
      page: paguination.page,
      limit: paguination.limit,
      // Parámetros de ordenamiento
      sort_by: paguination.sort_by,
      sort_order: paguination.sort_order,
      // Parámetros de búsqueda general
      search: paguination.search,
      // Parámetros específicos de juegos
      game_name: paguination.game_name,
      game_description: paguination.game_description,
      category_id: paguination.category_id,
      game_type: paguination.game_type,
      // Parámetros adicionales que puedan existir
      created_before: paguination.created_before,
      created_after: (paguination as any).created_after,
      status: (paguination as any).status,
      user_id: (paguination as any).user_id,
    };

    return this.buildQueryString(params);
  }

  /**
   * Adapt general pagination with comprehensive parameter detection
   */
  static adaptPaguination(paguination: Pagination): string {
    const params: Record<string, any> = {
      page: paguination.page,
      limit: paguination.limit,
      sort_by: paguination.sort_by,
      sort_order: paguination.sort_order,
      search: paguination.search,
      category_id: paguination.category_id,
      created_before: paguination.created_before,
      // Incluir parámetros adicionales que puedan existir dinámicamente
      ...((paguination as any).created_after && {
        created_after: (paguination as any).created_after,
      }),
      ...((paguination as any).status && {
        status: (paguination as any).status,
      }),
      ...((paguination as any).user_id && {
        user_id: (paguination as any).user_id,
      }),
      ...((paguination as any).tags && { tags: (paguination as any).tags }),
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
