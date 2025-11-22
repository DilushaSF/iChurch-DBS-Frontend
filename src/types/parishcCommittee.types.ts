export type ZonalNumber = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type UnitNumber = "1" | "2" | "3" | "4" | "5" | "6";

export interface ParishCommittee {
    _id: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber?: string;
    zonalNumber: ZonalNumber;
    unitNumber: UnitNumber;
    position?: string;
    joinedDate: string;
    representingCommittee: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ParishCommitteeFormData {
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber?: string;
    zonalNumber: ZonalNumber;
    unitNumber: UnitNumber;
    position?: string;
    joinedDate: string;
    representingCommittee: string;
}