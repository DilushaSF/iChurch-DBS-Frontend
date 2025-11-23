import type { AxiosInstance } from "axios"; // ✅ Correct when using verbatimModuleSyntax
import type { Burial, BurialFormData } from '../types/burial.types';
import axios from "axios";
import type { Marriage, MarriageFormData } from "../types/marriage.types";
import type { ParishCommittee, ParishCommitteeFormData } from "../types/parishcCommittee.types";
import type { ZonalLeader, ZonalLeaderFormData } from "../types/zonalLeader.types"
import type { UnitLeader, UnitLeaderFormData } from "../types/unitLeader.types";
import type { Choir, ChoirFormData } from "../types/choir.types";
import type { Youth, YouthFormData } from "../types/youth.types";
import type { SundaySchoolFormData, SundaySchoolTeacher } from "../types/sundaySchool.types";
import type { MemberRegistration, MemberRegistrationFormData } from "../types/memberRegistration.types";

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

export const youthAPI = {
    getAllYouthMembers: () => api.get<Youth[]>('/youth-association'),

    getYouthMemberById: (id: string) => api.get<Youth>(`/youth-association/${id}`),

    addYouthMember: (data: YouthFormData) => api.post<Youth>('/youth-association', data),

    editYouthMember: (id: string, data: Partial<YouthFormData>) =>
        api.patch<Youth>(`/youth-association/${id}`, data),

    deleteYouthMember: (id: string) => api.delete(`/youth-association/${id}`),
};

export const sundaySchoolAPI = {
    getAllTeachers: () => api.get<SundaySchoolTeacher[]>('/sunday-school-teachers'),

    getTeacherById: (id: string) => api.get<SundaySchoolTeacher>(`/sunday-school-teachers/${id}`),

    addTeacher: (data: SundaySchoolFormData) => api.post<SundaySchoolTeacher>('/sunday-school-teachers', data),

    editTeacher: (id: string, data: Partial<SundaySchoolFormData>) =>
        api.patch<SundaySchoolTeacher>(`/sunday-school-teachers/${id}`, data),

    deleteTeacher: (id: string) => api.delete(`/sunday-school-teachers/${id}`),
};

// member registration API
export const memberRegistrationAPI = {
    getAllMembers: () => api.get<MemberRegistration[]>('/member-registrations'),

    getMemberById: (id: string) => api.get<MemberRegistration>(`/member-registrations/${id}`),

    addMemberRegistration: (data: MemberRegistrationFormData) => api.post<MemberRegistration>('/member-registrations', data),

    editMemberRegistration: (id: string, data: Partial<MemberRegistrationFormData>) =>
        api.patch<MemberRegistration>(`/member-registrations/${id}`, data),

    deleteMemberRegistration: (id: string) => api.delete(`/member-registrations/${id}`),
};

export default api;