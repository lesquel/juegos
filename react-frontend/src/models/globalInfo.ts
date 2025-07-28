export interface GlobalInfo {
  site_name: string;
  site_icon: string;
  site_logo: string;
}

export interface Account {
  account_id: number;
  account_name: string;
  account_number: string;
  account_owner_name : string;
  account_type: string;
  account_description: string;
}

export interface GlobalInfoAccount extends GlobalInfo {
  accounts: Account[];
}
