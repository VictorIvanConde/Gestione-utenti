import apiClient from '../api/apiClient';
import type { User, UserCreateInput } from '../types/user';

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await apiClient.get<User[]>('/users');
        return response.data;
    },

    getById: async (id: string): Promise<User | undefined> => {
        const response = await apiClient.get<User>(`/users/${id}`);
        return response.data;
    },

    create: async (input: UserCreateInput): Promise<User> => {
        const payload: any = {
            ...input,
            isActive: true 
        };

        if (!payload.middleName || payload.middleName.trim() === '') {
            delete payload.middleName;
        }

        const response = await apiClient.post<User>('/users', payload);
        return response.data;
    },

    update: async (id: string, input: Partial<User>): Promise<User> => {
        const response = await apiClient.patch<User>(`/users/${id}`, input);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/users/${id}`);
    }
};