import { create } from "zustand";
import { getCompanies, createCompany, updateCompany, deleteCompany } from "../services/api";

type Company = {
  id: number;
  name: string;
  trade_name: string | null;
  cnpj: string;
  activity: string | null;
  accounting_fee: number,
  email: string;
  billing_due_day: number;
  is_active: boolean;
  accounting_firm_id: number;
};

interface CompanyStore {
  companiesList: Company[];
  fetchCompanies: () => Promise<void>;
  createCompany: (data: Partial<Company>) => Promise<void>;
  updateCompany: (id: number, data: Partial<Company>) => Promise<void>;
  deleteCompany: (id: number) => Promise<void>;
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
  },

  createCompany: async (data: Partial<Company>) => {
    set({ isLoading: true });
    try {
      console.log('🏢 Store - Dados recebidos:', JSON.stringify(data, null, 2));
      await createCompany(data);
      // Recarregar a lista após criar
      const responseData = await getCompanies();
      set({ companiesList: responseData, isLoading: false });
    } catch (error) {
      set({ isLoading: false }); 
      throw error;
    }
  },

  updateCompany: async (id: number, data: Partial<Company>) => {
    set({ isLoading: true });
    try {
      await updateCompany(id, data);
      // Recarregar a lista após atualizar
      const responseData = await getCompanies();
      set({ companiesList: responseData, isLoading: false });
    } catch (error) {
      set({ isLoading: false }); 
      throw error;
    }
  },

  deleteCompany: async (id: number) => {
    set({ isLoading: true });
    try {
      await deleteCompany(id);
      // Recarregar a lista após deletar
      const responseData = await getCompanies();
      set({ companiesList: responseData, isLoading: false });
    } catch (error) {
      set({ isLoading: false }); 
      throw error;
    }
  }
}))
    
export default useCompanyStore;