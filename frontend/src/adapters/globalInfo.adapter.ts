import type {
  Account,
  GlobalInfo,
  GlobalInfoAccount,
} from "@models/globalInfo";

export class GlobalInfoAdapter {
  public static adapt(globalInfo: any): GlobalInfo {
    return {
      site_name: globalInfo.site_name,
      site_icon: globalInfo.site_icon,
      site_logo: globalInfo.site_logo,
    };
  }

  static adaptAccount(accounts: any): Account {
    return {
      account_id: accounts.account_id,
      account_name: accounts.account_name,
      account_number: accounts.account_number,
      account_owner_name: accounts.account_owner_name,
      account_type: accounts.account_type,
      account_description: accounts.account_description,
    };
  }

  static adaptAccounts(accounts: any): Account[] {
    return accounts.map((account: any) =>
      GlobalInfoAdapter.adaptAccount(account)
    );
  }

  static adaptGlobalInfoAccount(account: any): GlobalInfoAccount {
    return {
      site_name: account.site_name,
      site_icon: account.site_icon,
      site_logo: account.site_logo,
      accounts: GlobalInfoAdapter.adaptAccounts(account.accounts),
    };
  }
}
