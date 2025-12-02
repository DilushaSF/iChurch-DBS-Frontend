export interface Baptism {
    _id: string;

    childName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    dateOfBaptism: string;
    nameOfMother: string;
    nameOfFather: string;
    nameOfGodFather: string;
    nameOfGodMother: string;
    currentAddress: string;
    contactNumber: string;
    timeOfBaptism: string;
    areParentsMarried?: boolean;
    isFatherCatholic?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface BaptismFormData {
    childName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    dateOfBaptism: string;
    nameOfMother: string;
    nameOfFather: string;
    nameOfGodFather: string;
    nameOfGodMother: string;
    currentAddress: string;
    contactNumber: string;
    timeOfBaptism: string;
    areParentsMarried?: boolean;
    isFatherCatholic?: boolean;
}