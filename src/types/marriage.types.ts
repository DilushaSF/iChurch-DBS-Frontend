export type MassType = "Full" | "Half";
export type YesNo = "Yes" | "No";

export interface Marriage {
    _id: string;
    nameOfBride: string;
    nameOfGroom: string;
    dateOfMarriage: string;
    timeOfMass: string;
    shortenedCoupleName: string;
    massType: MassType;
    needChurchChoir: YesNo;
    useChurchDecos: YesNo;
    createdAt?: string;
    updatedAt?: string;
}

export interface MarriageFormData {
    nameOfBride: string;
    nameOfGroom: string;
    dateOfMarriage: string;
    timeOfMass: string;
    shortenedCoupleName: string;
    massType: MassType;
    needChurchChoir: YesNo;
    useChurchDecos: YesNo;
}