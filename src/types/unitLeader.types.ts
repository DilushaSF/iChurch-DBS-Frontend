export type ZonalNumber = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export interface UnitLeader {
    _id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    contactNumber: string;
    appointedDate: string;
    zonalNumber: ZonalNumber;
    unitNumber: string;
    zonalLeader: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UnitLeaderFormData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    contactNumber: string;
    appointedDate: string;
    zonalNumber: ZonalNumber;
    unitNumber: string;
    zonalLeader?: string;
}