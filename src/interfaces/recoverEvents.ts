export interface IRecoverEvents {
    _id: string;
    description: string;
    createdBy: CreatedBy;
    associatedEvent: AssociatedEvent;
    createdAt: Date;
    isForEventCancel: boolean;
    hasRecovery: boolean;
    updatedAt: Date;
    __v: number;
}

export interface AssociatedEvent {
    _id: string;
    _creator: string;
    _asignTo: CreatedBy;
    title: string;
    eventStatus: boolean;
    start: Date;
    end: Date;
    patient: Patient;
    reports: string[];
    eventType: string;
    freq: string;
    byweekday: any[];
    __v: number;
}

export interface CreatedBy {
    _id: string;
    email: string;
    name: string;
    lastname: string;
    isActive: boolean;
    role: string;
    speciality: string;
    events: string[];
    asignedPatients: string[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    asignColor: string;
}

export interface Patient {
    _id: string;
    name: string;
    lastname: string;
    dateOfBirth: Date;
    diagnosis: string;
    historyDescription: string;
    reports: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    readySpecialistList: string[];
    desactivatedForSpecialistList: any[];
}
