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

export async function createCompany(payload: any) {
  try {
    console.log('🌐 API - Payload sendo enviado:', JSON.stringify(payload, null, 2));
    const response = await api.post('/companies', payload)
    console.log('🌐 API - Resposta recebida:', JSON.stringify(response.data, null, 2));
    return response.data.data
  } catch (error) {
    console.error('Erro ao criar empresa:', error)
    throw error
  }
}

export async function updateCompany(id: number, payload: any) {
  try {
    const response = await api.put(`/companies/${id}`, payload)
    return response.data.data
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error)
    throw error
  }
}

export async function deleteCompany(id: number) {
  try {
    const response = await api.delete(`/companies/${id}`)
    return response.data.data
  } catch (error) {
    console.error('Erro ao deletar empresa:', error)
    throw error
  }
}

export async function getMonthlyRevenue(year?: number, month?: number) {
  try {
    const currentDate = new Date()
    const currentYear = year || currentDate.getFullYear()
    const currentMonth = month || currentDate.getMonth() + 1
    
    const response = await api.get(`/payments/monthly-revenue?year=${currentYear}&month=${currentMonth}`)
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar receita mensal:', error)
    throw error
  }
}

export async function generatePayments(payload: any) {
  try {
    const response = await api.post('/payments/generate', payload)
    return response.data.data
  } catch (error) {
    console.error('Erro ao gerar pagamentos:', error)
    throw error
  }
}

export async function getPayments() {
  try {
    const response = await api.get('/payments')
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error)
    throw error
  }
}

export async function changePaymentStatus(id: number, payload: any) {
  try {
    const response = await api.patch(`/payments/${id}`, payload)
    return response.data.data
  } catch (error) {
    console.error('Erro ao alterar status do pagamento:', error)
    throw error
  }
}

export async function removePayment(id: number) {
  try {
    // Usar PATCH para "remover" o pagamento (voltar para PENDENTE e limpar payment_date)
    const response = await api.patch(`/payments/${id}`, {
      status: 'PENDENTE',
      payment_date: null
    })
    return response.data.data
  } catch (error) {
    console.error('Erro ao remover pagamento:', error)
    throw error
  }
}