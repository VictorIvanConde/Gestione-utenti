import type { User, UserFilterType } from '../types/user';

export const userHelper = {
    /**
     * Restituisce il nome completo formattando la presenza o meno del middleName
     */
    getFullName: (user: User): string => {
        const { firstName, middleName, lastName } = user;
        return middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
    },

    /**
     * Filtra la lista utenti in base alla regola esplicita selezionata
     */
    filterUsers: (users: User[], filter: UserFilterType): User[] => {
        switch (filter) {
            case 'ACTIVE':
                return users.filter(u => u.isActive);
            case 'INACTIVE':
                return users.filter(u => !u.isActive);
            case 'ALL':
            default:
                return users;
        }
    },

    /**
     * Paginazione della lista utenti
     */
    paginateUsers: (users: User[], page: number, pageSize: number): User[] => {
        const startIndex = (page - 1) * pageSize;
        return users.slice(startIndex, startIndex + pageSize);
    }
};