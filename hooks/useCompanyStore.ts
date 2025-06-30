import { create } from "zustand";
import { getCompanies } from "../services/api";

type Company = {
  id: number;
  name: string;
  trade_name: string | null;
  cnpj: string;
  activity: string | null;
  accounting_fee: string,
  email: string;
  billing_due_day: number;
  is_active: boolean;
  accounting_firm_id: number;
};

interface CompanyStore {
  companiesList: Company[];
  fetchCompanies: () => Promise<void>;
  isLoading: boolean;
}

const useCompanyStore = create<CompanyStore>()((set) => ({
  companiesList: [],
  isLoading: false,

  fetchCompanies: async () => {
    set({ isLoading: true });
    try {
      const responseData = await getCompanies();
      set({ companiesList: responseData, isLoading: false });
    } catch (error) {
      set({ isLoading: false }); 
      throw error;
    }
  }
}))
    
export default useCompanyStore;