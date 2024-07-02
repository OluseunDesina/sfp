import { FormControl, FormGroup, Validators } from "@angular/forms";

export class User {
  id: number;
  last_login?: any;
  first_name: string;
  last_name: string;
  email: string;
  authorization_code?: any;
  staff_id?: any;
  biometrics_a?: any;
  biometrics_b?: any;
  phone_number?: any;
  balance: number;
  actual_balance: number;
  pending_balance: number;
  image?: any;
  sex?: any;
  date_of_birth?: any;
  time_created: string;
  date_created: string;
  last_modified: Date;
  department?: any;
  staff_level?: any;
  card_id?: any;
  created_by: number;
  comment: string;
  static asFormGroup(user: User): FormGroup {
    const fg = new FormGroup({
      first_name: new FormControl(user.first_name, Validators.required),
      last_name: new FormControl(user.last_name, Validators.required),
      email: new FormControl(user.email, Validators.required),
      // comment: new FormControl('')
    });
    return fg;
  }
}

export interface Vendor {
  user: User;
  bussiness_name: string;
  is_market_space: boolean;
  description: string;
  is_company: boolean;
  bank_code: string;
  account_number: string;
  transfer_recipient?: any;
  cash_hold: boolean;
  time_created: string;
  date_created: string;
  company: number;
}

export interface Rating {
  id: number
  review: string
  rating: number
  created_at: string
  updated_at: string
  company: number
  vendor: Vendor
  transaction: number
  food: Food
  created_by: number
}

export interface Vendor {
  id: number
  name: string
}

export interface Food {
  id: number
  name: string
}

