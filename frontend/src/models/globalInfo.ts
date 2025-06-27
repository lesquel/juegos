export interface GlobalInfo {
  site_name: string;
  site_icon: string;
  site_logo: string;
}

export interface Account {
  account_id: number;
  account_name: string;
  account_number: string;
}

export interface GlobalInfoAccount extends GlobalInfo {
  account: Account[];
}
