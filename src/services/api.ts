import type { AxiosInstance } from "axios"; // ✅ Correct when using verbatimModuleSyntax
import type { Burial, BurialFormData } from '../types/burial.types';
import axios from "axios";

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Burial API calls
export const burialAPI = {
    // Get all burials
    getAllBurials: () => api.get<Burial[]>('/burials'),

    // Get single burial
    getBurialById: (id: string) => api.get<Burial>(`/burials/${id}`),

    // Create burial
    createBurial: (data: BurialFormData) => api.post<Burial>('/burials', data),

    // Update burial
    updateBurial: (id: string, data: Partial<BurialFormData>) =>
        api.patch<Burial>(`/burials/${id}`, data),

    // Delete burial
    deleteBurial: (id: string) => api.delete(`/burials/${id}`),

    // Search burials by name or custodian
    searchBurials: (query: string) =>
        api.get<Burial[]>(`/burials/search`, {
            params: { query },
        }),

};

export default api;