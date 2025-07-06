import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
    baseURL: "https://companies-management-api.onrender.com/v1",
});

api.interceptors.request.use(
  async (config) => {
      // Pega o token do armazenamento seguro
    const token = await SecureStore.getItemAsync('user_token');

    // Se o token existir, anexa ele ao cabeçalho de Autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export async function login(payload: any) {
  const response = await api.post("/auth/login", payload)
  return response.data.data
}

export async function getCompanies() {
  try {
    const response = await api.get('/companies')
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar empresas:', error)
    throw error
  }
}