import axios from "axios";

const api = axios.create({
    baseURL: "https://companies-management-api.onrender.com/v1",
});

export async function login(payload: any) {
    const response = await api.post("/auth/login", payload)
    return response.data.data
}