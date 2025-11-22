export type ZoneNumber = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | string;


export interface ZonalLeader {
    _id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    contactNumber: string;
    appointedDate: string;
    zoneNumber: ZoneNumber;
    createdAt?: string;
    updatedAt?: string;
}

export interface ZonalLeaderFormData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    contactNumber: string;
    appointedDate: string;
    zoneNumber: ZoneNumber;
}