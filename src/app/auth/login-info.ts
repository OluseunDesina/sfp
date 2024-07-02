export class LoginInfo {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  staff_level: string;
  image?: any;
  department: string;
  personal_balance: number;
  daily_limit: number;
}

export interface LoginResponse {
  user: User;
  refresh: string;
  access: string;
  access_duration: number;
  app_id: string;
}

export interface LoginError {
  code: number;
  message: string;
  resolve: string;
}
