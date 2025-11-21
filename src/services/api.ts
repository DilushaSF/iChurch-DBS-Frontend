import type { AxiosInstance } from "axios"; // ✅ Correct when using verbatimModuleSyntax
import type { Burial, BurialFormData } from '../types/burial.types';
import axios from "axios";
import type { Marriage, MarriageFormData } from "../types/marriage.types";

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

};

export const marriageAPI = {
    getAllMarriages: () => api.get<Marriage[]>('/marriages'),
    getMarriageById: (id: string) => api.get<Marriage>(`/marriages/${id}`),
    addMarriage: (data: MarriageFormData) => api.post<Marriage>('/marriages', data),
    updateMarriage: (id: string, data: Partial<MarriageFormData>) =>
        api.patch<Marriage>(`/marriages/${id}`, data),
    deleteMarriage: (id: string) => api.delete(`/marriages/${id}`),

};

export default api;