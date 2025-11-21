export interface Burial {
    _id: string;
    nameOfDeceased: string;
    dateOfDeath: string;
    dateOfBirth: string;
    dateWillBurry: string;
    baptized: string;
    caouseOfDeath: string;
    custodian: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface BurialFormData {
    nameOfDeceased: string;
    dateOfDeath: string;
    dateOfBirth: string;
    dateWillBurry: string;
    baptized: string;
    caouseOfDeath: string;
    custodian: string;
}