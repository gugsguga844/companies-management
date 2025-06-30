import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { login } from "../services/api";

interface AuthStore {
  token: string | null;
  apiLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const useAuthStore = create<AuthStore>()((set) => ({
  token: null,
  isLoading: false,

  apiLogin: async (email: string, password: string) => {
      set({ isLoading: true });
      try {
        const responseData = await login({ email, password });
        const { access_token } = responseData;

        await SecureStore.setItemAsync('user_token', access_token);

        set({ token: access_token, isLoading: false });
      } catch (error) {
        set({ isLoading: false })
        console.error('Erro ao logar:', error);
        throw new Error('Email ou senha inválidos.');
      }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('user_token');
      set({ token: null, isLoading: false });
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  },

}))
    
export default useAuthStore;