export interface Youth {
    _id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    joinedDate: string;
    address: string;
    contactNumber: string;
    position?: string;
    isActiveMember: boolean;
    createdAt?: string;
    updatedAt?: string;
}


export interface YouthFormData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    joinedDate: string;
    address: string;
    contactNumber: string;
    position?: string;
    isActiveMember: boolean;
}