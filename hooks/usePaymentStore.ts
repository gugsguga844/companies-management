import { create } from "zustand";
import { getCompanies, getPayments } from "../services/api";

type Payment = {
  id: number;
  reference_month: string;
  value: string;
  status: 'PENDENTE' | 'PAGO';
  payment_date: string | null;
  due_date: string;
  company_id: number;
  company: {
    name: string;
    is_active: boolean;
  };
};

interface PaymentStore {
  paymentsList: Payment[];
  fetchPayments: () => Promise<void>;
  isLoading: boolean;
}

const usePaymentStore = create<PaymentStore>()((set) => ({
  paymentsList: [],
  isLoading: false,

  fetchPayments: async () => {
    set({ isLoading: true });
    try {
      const responseData = await getPayments();
      set({ paymentsList: responseData, isLoading: false });
    } catch (error) {
      set({ isLoading: false }); 
      throw error;
    }
  }
}))
    
export default usePaymentStore;