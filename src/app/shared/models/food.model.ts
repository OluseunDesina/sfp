export class Category {
  id: number;
  name: string;
  description?: any;
  time_created: string;
  date_created: string;
  last_modified: Date;
  created_by: number;
  category_type: number;
  company: number;
}

export interface Food {
  id: number;
  food?: number;
  meal_type?: number | string;
  average_rating: number;
  comments: any[];
  comment?: string;
  name: string;
  description?: any;
  image: string;
  unit_price: number;
  time_created: string;
  date_created: string;
  last_modified: Date;
  created_by: number;
  category: number;
  company: number;
  quantity?: number;
  total?: number;
  delivery_date?: string;
}
