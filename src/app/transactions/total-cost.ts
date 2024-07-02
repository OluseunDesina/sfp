export class TotalCost {
  user: number;
  first_name: string;
  last_name: string;
  department: string;
  staff_level: string;
  company_share_per_txn?: number;
  total_sum: number;
  no_of_days: number;
  company_share?: number;
  staff_share?: number;
}

export class TotalCostResponse {
  count: number;
  results: TotalCost[];
}
