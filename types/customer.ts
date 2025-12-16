export interface Customer {
  id: number;
  account_number: string;
  customer_name: string;
  issue_date: string;
  interest_rate: string;
  tenure_months: number;
  emi_due_amount: string;
  outstanding_balance: string;
  created_at: string;
}

export interface Payment {
  payment_id: number;
  account_number: string;
  payment_date: string;
  amount_paid: string;
  payment_mode: string | null;
  status: string;
  transaction_ref: string | null;
}