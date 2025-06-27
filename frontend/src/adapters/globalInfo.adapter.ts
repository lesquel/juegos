import type { GlobalInfo } from "@models/globalInfo";

export class GlobalInfoAdapter {
  public static adapt(globalInfo: any): GlobalInfo {
    return {
      site_name: globalInfo.site_name,
      site_icon: globalInfo.site_icon,
      site_logo: globalInfo.site_logo,
    };
  }
}
