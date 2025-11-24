export interface Child {
    nameOfChild: string;
    dateOfBirthChild: string;
    baptisedDateOfChild?: string;
    baptisedChurchOfChild?: string;
}

export interface MemberRegistration {
    _id: string;
    church: string;

    nameOfFather: string;
    occupationOfFather?: string;
    dateOfBirthFather?: string;
    baptisedDateOfFather?: string;
    baptisedChurchOfFather?: string;

    nameOfMother: string;
    occupationOfMother?: string;
    dateOfBirthOfMother?: string;
    baptisedDateOfMother?: string;
    baptisedChurchOfMother?: string;

    address: string;
    contactNo: string;

    marriedDate?: string;
    marriedChurch?: string;

    capableDonationPerMonth?: number;

    children?: Child[];

    createdAt?: string;
    updatedAt?: string;
}

export interface MemberRegistrationFormData {
    church: string;

    nameOfFather: string;
    occupationOfFather?: string;
    dateOfBirthFather?: string;
    baptisedDateOfFather?: string;
    baptisedChurchOfFather?: string;

    nameOfMother: string;
    occupationOfMother?: string;
    dateOfBirthOfMother?: string;
    baptisedDateOfMother?: string;
    baptisedChurchOfMother?: string;

    address: string;
    contactNo: string;

    marriedDate?: string;
    marriedChurch?: string;

    capableDonationPerMonth?: number;

    children?: Child[];
}