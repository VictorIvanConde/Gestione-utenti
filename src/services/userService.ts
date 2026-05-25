import apiClient from '../api/apiClient';
import { apiHelper } from '../helpers/apiHelper';
import type { User, UserCreateInput } from '../types/user';

export const userService = {
    getAll: async (): Promise<User[]> => {
        return apiHelper.simulateRequest(async () => {
            const response = await apiClient.get<User[]>('/users');
            return response.data;
        });
    },

    getById: async (id: string): Promise<User | undefined> => {
        return apiHelper.simulateRequest(async () => {
            const response = await apiClient.get<User>(`/users/${id}`);
            return response.data;
        });
    },

    create: async (input: UserCreateInput): Promise<User> => {
        return apiHelper.simulateRequest(async () => {
            const payload: any = { ...input, isActive: true };
            if (!payload.middleName || payload.middleName.trim() === '') {
                delete payload.middleName;
            }
            const response = await apiClient.post<User>('/users', payload);
            return response.data;
        });
    },

    update: async (id: string, input: Partial<User>): Promise<User> => {
        return apiHelper.simulateRequest(async () => {
            const { id: _, ...payload } = input as any;
            const response = await apiClient.patch<User>(`/users/${id}`, payload);
            return response.data;
        });
    },

    delete: async (id: string): Promise<void> => {
        return apiHelper.simulateRequest(async () => {
            await apiClient.delete(`/users/${id}`);
        });
    }
};
