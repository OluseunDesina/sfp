export class Order {
  position?: number;
  id: number;
  user: string;
  company: string;
  voider: string;
  vendor_user_id: string;
  vendor_user_id_full: any;
  self_service_device: string;
  food: string | any;
  comment: string;
  quantity: number;
  unit_price: number;
  total: number;
  service_fee: number;
  sub_total: number;
  platform: string;
  place: string;
  status: string;
  company_amount: number;
  verification_type: string;
  date_created: string;
  time_created: string;
  delivery_date: string;
  delivered_time: string;
  delivered_date: string;
  last_modified: Date;
  receipt_no?: number;
  meal_type?: string;
}

export class OrderResponse {
  count: number;
  results: Order[];
}
