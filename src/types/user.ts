export interface User {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    middleName?: string;
}

// Tipo per i dati necessari alla creazione (omettiamo id e isActive gestiti dal sistema)
export type UserCreateInput = Omit<User, 'id' | 'isActive'> & {
    middleName?: string;
};

// Stato di caricamento dell'interfaccia utente
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

// Tipo per il filtro utenti (Variante Esercizio 2)
export type UserFilterType = 'ALL' | 'ACTIVE' | 'INACTIVE';