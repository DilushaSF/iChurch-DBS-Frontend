export type ChoirType = "Senior" | "Junior" | "English";
export type VoicePart = "Soprano" | "Alto" | "Tenor" | "Bass";

export interface Choir {
    _id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    contactNumber: string;
    joinedDate: string;
    voicePart: VoicePart;
    isActiveMember: boolean;
    instrumentsPlayed?: string[];
    choirType: ChoirType;
    createdAt?: string;
    updatedAt?: string;
}


export interface ChoirFormData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    contactNumber: string;
    joinedDate: string;
    voicePart: VoicePart;
    isActiveMember: boolean;
    instrumentsPlayed?: string[];
    choirType: ChoirType;
}