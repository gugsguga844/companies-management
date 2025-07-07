import { create } from "zustand";
import { getCompanies, getPayments, changePaymentStatus, getMonthlyRevenue, removePayment } from "../services/api";

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
  monthlyRevenue: number;
  fetchPayments: () => Promise<void>;
  fetchMonthlyRevenue: (year?: number, month?: number) => Promise<void>;
  updatePaymentStatus: (id: number, status: string, payment_date: string) => Promise<void>;
  removePaymentStatus: (id: number) => Promise<void>;
  isLoading: boolean;
}

const usePaymentStore = create<PaymentStore>()((set) => ({
  paymentsList: [],
  monthlyRevenue: 0,
  isLoading: false,

  fetchMonthlyRevenue: async (year?: number, month?: number) => {
    set({ isLoading: true });
    try {
      const responseData = await getMonthlyRevenue(year, month);
      // Verificar se é um objeto e extrair o valor correto
      const revenue = typeof responseData === 'object' && responseData !== null 
        ? (responseData as any).total || responseData.value || responseData.revenue || 0 
        : Number(responseData) || 0;
      set({ monthlyRevenue: revenue, isLoading: false });
    } catch (error) {
      set({ isLoading: false }); 
      throw error;
    }
  },

  fetchPayments: async () => {
    set({ isLoading: true });
    try {
      const responseData = await getPayments();
      set({ paymentsList: responseData, isLoading: false });
    } catch (error) {
      set({ isLoading: false }); 
      throw error;
    }
  },

  updatePaymentStatus: async (id: number, status: string, payment_date: string) => {
    set({ isLoading: true });
    try {
      await changePaymentStatus(id, { status, payment_date });
      // Recarregar a lista após atualizar
      const responseData = await getPayments();
      set({ paymentsList: responseData, isLoading: false });
    } catch (error) {
      set({ isLoading: false }); 
      throw error;
    }
  },

  removePaymentStatus: async (id: number) => {
    set({ isLoading: true });
    try {
      await removePayment(id);
      // Recarregar a lista após remover
      const responseData = await getPayments();
      set({ paymentsList: responseData, isLoading: false });
    } catch (error) {
      set({ isLoading: false }); 
      throw error;
    }
  }
}))
    
export default usePaymentStore;