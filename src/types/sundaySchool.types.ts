export interface SundaySchoolTeacher {
    _id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    appointedDate: string;
    address: string;
    contactNumber: string;
    className: string;
    remarks?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface SundaySchoolFormData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    appointedDate: string;
    address: string;
    contactNumber: string;
    className: string;
    remarks?: string;
    isActive?: boolean;
}