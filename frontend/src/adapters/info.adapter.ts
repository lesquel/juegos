import type { Info } from "src/models/info.model";

export class InfoAdapter {
  public static adapt(info: any): Info {
    return {
      count: info.count,
      pages: info.pages,
      next: info.next,
      prev: info.prev,
    };
  }
}