import type { AxiosInstance } from "axios";
import axios from "axios";
import { api_config } from "../config/api.config";
import { tokenUtils } from "../utils/token";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth.types";

// Importing types
import type { Burial, BurialFormData } from '../types/burial.types';
import type { Marriage, MarriageFormData } from "../types/marriage.types";
import type { ParishCommittee, ParishCommitteeFormData } from "../types/parishcCommittee.types";
import type { ZonalLeader, ZonalLeaderFormData } from "../types/zonalLeader.types"
import type { UnitLeader, UnitLeaderFormData } from "../types/unitLeader.types";
import type { Choir, ChoirFormData } from "../types/choir.types";
import type { Youth, YouthFormData } from "../types/youth.types";
import type { SundaySchoolFormData, SundaySchoolTeacher } from "../types/sundaySchool.types";
import type { MemberRegistration, MemberRegistrationFormData } from "../types/memberRegistration.types";

// Axios instance
const api: AxiosInstance = axios.create({
    baseURL: api_config.base_url,
    timeout: api_config.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Adding token to requests
api.interceptors.request.use(
    (config) => {
        const token = tokenUtils.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response?.status === 401) {
            tokenUtils.clearAuth();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export const authAPI = {
    login: (data: LoginRequest) =>
        api.post<AuthResponse>(api_config.endpoints.auth.login, data),

    register: (data: RegisterRequest) =>
        api.post<AuthResponse>(api_config.endpoints.auth.signup, data),
};

export const burialAPI = {
    getAllBurials: () => api.get<Burial[]>('/api/burials'),
    getBurialById: (id: string) => api.get<Burial>(`/api/burials/${id}`),
    createBurial: (data: BurialFormData) => api.post<Burial>('/api/burials', data),
    updateBurial: (id: string, data: Partial<BurialFormData>) =>
        api.patch<Burial>(`/api/burials/${id}`, data),
    deleteBurial: (id: string) => api.delete(`/api/burials/${id}`),
};

export const marriageAPI = {
    getAllMarriages: () => api.get<Marriage[]>('/api/marriages'),
    getMarriageById: (id: string) => api.get<Marriage>(`/api/marriages/${id}`),
    addMarriage: (data: MarriageFormData) => api.post<Marriage>('/api/marriages', data),
    updateMarriage: (id: string, data: Partial<MarriageFormData>) =>
        api.patch<Marriage>(`/api/marriages/${id}`, data),
    deleteMarriage: (id: string) => api.delete(`/api/marriages/${id}`),
};

export const parishCommitteeAPI = {
    getAllParishCommitteeMembers: () => api.get<ParishCommittee[]>('/api/parish-committee'),
    getParishCommitteeMemberById: (id: string) => api.get<ParishCommittee>(`/api/parish-committee/${id}`),
    addParishCommitteeMember: (data: ParishCommitteeFormData) => api.post<ParishCommittee>('/api/parish-committee', data),
    editParishCommitteeMember: (id: string, data: Partial<ParishCommitteeFormData>) =>
        api.patch<ParishCommittee>(`/api/parish-committee/${id}`, data),
    deleteParishCommitteeMember: (id: string) => api.delete(`/api/parish-committee/${id}`),
};

export const zonalLeaderAPI = {
    getAllZonalLeaders: () => api.get<ZonalLeader[]>('/api/zonal-leaders'),
    getZonalLeaderById: (id: string) => api.get<ZonalLeader>(`/api/zonal-leaders/${id}`),
    addZonalLeader: (data: ZonalLeaderFormData) => api.post<ZonalLeader>('/api/zonal-leaders', data),
    editZonalLeader: (id: string, data: Partial<ZonalLeaderFormData>) =>
        api.patch<ZonalLeader>(`/api/zonal-leaders/${id}`, data),
    deleteZonalLeader: (id: string) => api.delete(`/api/zonal-leaders/${id}`),
};

export const unitLeaderAPI = {
    getAllUnitLeaders: () => api.get<UnitLeader[]>('/api/unit-leaders'),
    getUnitLeaderById: (id: string) => api.get<UnitLeader>(`/api/unit-leaders/${id}`),
    addUnitLeader: (data: UnitLeaderFormData) => api.post<UnitLeader>('/api/unit-leaders', data),
    editUnitLeader: (id: string, data: Partial<UnitLeaderFormData>) =>
        api.patch<UnitLeader>(`/api/unit-leaders/${id}`, data),
    deleteUnitLeader: (id: string) => api.delete(`/api/unit-leaders/${id}`),
};

export const choirAPI = {
    getAllChoiristors: () => api.get<Choir[]>('/api/choiristors'),
    getChoiristorById: (id: string) => api.get<Choir>(`/api/choiristors/${id}`),
    addChoiristor: (data: ChoirFormData) => api.post<Choir>('/api/choiristors', data),
    editChoiristor: (id: string, data: Partial<ChoirFormData>) =>
        api.patch<Choir>(`/api/choiristors/${id}`, data),
    deleteChoiristor: (id: string) => api.delete(`/api/choiristors/${id}`),
};

export const youthAPI = {
    getAllYouthMembers: () => api.get<Youth[]>('/api/youth-association'),
    getYouthMemberById: (id: string) => api.get<Youth>(`/api/youth-association/${id}`),
    addYouthMember: (data: YouthFormData) => api.post<Youth>('/youth-association', data),
    editYouthMember: (id: string, data: Partial<YouthFormData>) =>
        api.patch<Youth>(`/api/youth-association/${id}`, data),
    deleteYouthMember: (id: string) => api.delete(`/api/youth-association/${id}`),
};

export const sundaySchoolAPI = {
    getAllTeachers: () => api.get<SundaySchoolTeacher[]>('/api/sunday-school-teachers'),
    getTeacherById: (id: string) => api.get<SundaySchoolTeacher>(`/api/sunday-school-teachers/${id}`),
    addTeacher: (data: SundaySchoolFormData) => api.post<SundaySchoolTeacher>('/api/sunday-school-teachers', data),
    editTeacher: (id: string, data: Partial<SundaySchoolFormData>) =>
        api.patch<SundaySchoolTeacher>(`/api/sunday-school-teachers/${id}`, data),
    deleteTeacher: (id: string) => api.delete(`/api/sunday-school-teachers/${id}`),
};

export const memberRegistrationAPI = {
    getAllMembers: () => api.get<MemberRegistration[]>('/api/member-registrations'),
    getMemberById: (id: string) => api.get<MemberRegistration>(`/api/member-registrations/${id}`),
    addMemberRegistration: (data: MemberRegistrationFormData) => api.post<MemberRegistration>('/api/member-registrations', data),
    editMemberRegistration: (id: string, data: Partial<MemberRegistrationFormData>) =>
        api.patch<MemberRegistration>(`/api/member-registrations/${id}`, data),
    deleteMemberRegistration: (id: string) => api.delete(`/api/member-registrations/${id}`),
};

export default api;