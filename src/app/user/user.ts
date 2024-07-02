export interface User {
  first_name: string;
  last_name: string;
  email: string;
  authorization_code?: string;
  staff_id?: string;
  biometrics_a?: string;
  biometrics_b?: string;
  phone_number: string;
  balance?: number;
  actual_balance?: number;
  pending_balance?: number;
  image?: string;
  sex: string;
  date_of_birth: string;
  company?: string;
  department: number;
  staff_level: number;
  card_id: number;
}

export interface Vendor {
  user: User;
  bussiness_name: string;
  is_market_space: boolean;
  description: string;
  is_company: boolean;
  bank_code: string;
  account_number: string;
  transfer_recipient: string;
  cash_hold: boolean;
  company: number;
}
