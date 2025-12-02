export interface EventSchedule {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
    category?: string;
    color?: string;
    allDay: boolean;
    recurring: boolean;
    recurrence?: string;
    reminder: boolean;
    reminderTime?: string;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface EventScheduleFormData {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
    category?: string;
    color?: string;
    allDay?: boolean;
    recurring?: boolean;
    recurrence?: string;
    reminder?: boolean;
    reminderTime?: string;
    createdBy?: string;
}