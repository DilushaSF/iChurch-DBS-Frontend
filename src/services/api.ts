import type { AxiosInstance } from "axios"; // ✅ Correct when using verbatimModuleSyntax
import type { Burial, BurialFormData } from '../types/burial.types';
import axios from "axios";
import type { Marriage, MarriageFormData } from "../types/marriage.types";
import type { ParishCommittee, ParishCommitteeFormData } from "../types/parishcCommittee.types";
import type { ZonalLeader, ZonalLeaderFormData } from "../types/zonalLeader.types"
import type { UnitLeader, UnitLeaderFormData } from "../types/unitLeader.types";
import type { Choir, ChoirFormData } from "../types/choir.types";

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

export const parishCommitteeAPI = {
    getAllParishCommitteeMembers: () => api.get<ParishCommittee[]>('/parish-committee'),

    getParishCommitteeMemberById: (id: string) => api.get<ParishCommittee>(`/parish-committee/${id}`),

    addParishCommitteeMember: (data: ParishCommitteeFormData) => api.post<ParishCommittee>('/parish-committee', data),

    editParishCommitteeMember: (id: string, data: Partial<ParishCommitteeFormData>) =>
        api.patch<ParishCommittee>(`/parish-committee/${id}`, data),

    deleteParishCommitteeMember: (id: string) => api.delete(`/parish-committee/${id}`),

};

export const zonalLeaderAPI = {
    getAllZonalLeaders: () => api.get<ZonalLeader[]>('/zonal-leaders'),

    getZonalLeaderById: (id: string) => api.get<ZonalLeader>(`/zonal-leaders/${id}`),

    addZonalLeader: (data: ZonalLeaderFormData) => api.post<ZonalLeader>('/zonal-leaders', data),

    editZonalLeader: (id: string, data: Partial<ZonalLeaderFormData>) =>
        api.patch<ZonalLeader>(`/zonal-leaders/${id}`, data),

    deleteZonalLeader: (id: string) => api.delete(`/zonal-leaders/${id}`),

};

export const unitLeaderAPI = {
    getAllUnitLeaders: () => api.get<UnitLeader[]>('/unit-leaders'),

    getUnitLeaderById: (id: string) => api.get<UnitLeader>(`/unit-leaders/${id}`),

    addUnitLeader: (data: UnitLeaderFormData) => api.post<UnitLeader>('/unit-leaders', data),

    editUnitLeader: (id: string, data: Partial<UnitLeaderFormData>) =>
        api.patch<UnitLeader>(`/unit-leaders/${id}`, data),

    deleteUnitLeader: (id: string) => api.delete(`/unit-leaders/${id}`),

};

export const choirAPI = {
    getAllChoiristors: () => api.get<Choir[]>('/choiristors'),

    getChoiristorById: (id: string) => api.get<Choir>(`/choiristors/${id}`),

    addChoiristor: (data: ChoirFormData) => api.post<Choir>('/choiristors', data),

    editChoiristor: (id: string, data: Partial<ChoirFormData>) =>
        api.patch<Choir>(`/choiristors/${id}`, data),

    deleteChoiristor: (id: string) => api.delete(`/choiristors/${id}`),

};

export default api;