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

export interface CreateCustomerRequest {
  customer_name: string;
  issue_date: string;
  interest_rate: number;
  tenure_months: number;
  emi_due_amount: number;
  outstanding_balance: number;
}

export interface MakePaymentRequest {
  account_number: string;
  amount: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}


// Use environment variable for API base URL, fallback to localhost for development
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export class ApiService {
  static async getCustomers(): Promise<Customer[]> {
    try {
      const response = await fetch(`${BASE_URL}/customers/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse<Customer[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  static async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    try {
      const response = await fetch(`${BASE_URL}/customers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<Customer> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  static async getPayments(accountNumber: string): Promise<Payment[]> {
    try {
      const response = await fetch(`${BASE_URL}/payments/${accountNumber}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse<Payment[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  static async makePayment(accountNumber: string, amount: number): Promise<{ payment_id: number; new_balance: number }> {
    try {
      const response = await fetch(`${BASE_URL}/payments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_number: accountNumber,
          amount: amount,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<{ payment_id: number; new_balance: number }> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error making payment:', error);
      throw error;
    }
  }
}