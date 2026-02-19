export interface Customer {
    id: string;
    name: string;
    createdAt: string;
}

export interface Fair {
    id: string;
    customerId: string;
    name: string;
    slug: string;
    date: string;
    createdAt: string;
}

export interface Contact {
    id: string;
    fairId: string;
    name: string;
    surname: string;
    email: string;
    company?: string;
    title?: string;
    consent: boolean;
    date: string;
    surveyAnswers?: {
        q1: string;
        q2: string;
        q3: string;
    };
}

export interface DB {
    customers: Customer[];
    fairs: Fair[];
    contacts: Contact[];
}
